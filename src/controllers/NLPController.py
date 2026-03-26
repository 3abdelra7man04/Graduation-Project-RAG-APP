from .BaseController import BaseController
from helpers.config import get_settings
from models.db_schemes import Project
from models.db_schemes import DataChunk
from stores.llm.llm_enums import DocumentTypeEnum

class NLPController(BaseController):
    def __init__(self, generation_client, embedding_client, vectordb_client, template_parser):
        super().__init__()

        self.generation_client = generation_client

        self.embedding_client = embedding_client

        self.vectordb_client = vectordb_client

        self.template_parser = template_parser

    # function to create collection name
    def create_collection_name(self, project_id: str):
        return f"collection_{project_id}".strip()
    
    # reset vectordb collection
    def reset_vectordb_collection(self, Project: Project):
        collection_name = self.create_collection_name(project_id=Project.project_id)
        return self.vectordb_client.delete_collection(collection_name=collection_name)
    
    # vectordb collection info
    def get_vector_db_collection_info(self, Project: Project):
        collection_name = self.create_collection_name(project_id=Project.project_id)
        return self.vectordb_client.get_collection_info(collection_name=collection_name)
    
    # vectordb indexing
    def index_into_vectordb(self, Project: Project, chunks: list[DataChunk], do_reset: bool = False):
        
        # get collcetion name
        collection_name = self.create_collection_name(project_id=Project.project_id)

        # create collection
        _ = self.vectordb_client.create_collection(collection_name = collection_name, 
                                                   embedding_size = self.embedding_client.embedding_size, do_reset = do_reset)

        # index vextors
        texts = [chunk.chunk_text for chunk in chunks]
        metadatas = [chunk.chunk_metadata for chunk in chunks]

        vectors = [self.embedding_client.embed_text(text = text, document_type = DocumentTypeEnum.DOCUMENT.value)
                   for text in texts] 

        is_inserted = self.vectordb_client.insert_vectors(collection_name = collection_name, embedding_texts = texts, 
                                                embedding_vectors = vectors, metadatas = metadatas)

        return is_inserted
    
    def search_in_vectordb(self, Project: Project, query: str, limit: int):

        # get collection name
        collection_name = self.create_collection_name(project_id=Project.project_id)

        # embed query
        query_vector = self.embedding_client.embed_text(text = query, document_type = DocumentTypeEnum.QUERY.value)

        # search in vectordb
        response = self.vectordb_client.search_vectors(collection_name = collection_name, query_vector = query_vector, limit = limit)

        return response
    
    def answer_rag_questions(self, Project: Project, query: str, limit: int):

        # retrieve documents
        retrieved_documents = self.search_in_vectordb(Project=Project, query=query, limit=limit)

        if not retrieved_documents:
            return None
        
        # construct llm prompt
        system_prompt = self.template_parser.get("rag", "system_prompt")

        document_prompts = "\n".join([
            self.template_parser.get("rag", "document_prompt", {
                "doc_num": i+1,
                "chunk_text": docuemnt.text
            })
            for i, docuemnt in enumerate(retrieved_documents)
        ])

        footer_prompt = self.template_parser.get("rag", "footer_prompt")

        chat_history = [
            self.generation_client.construct_prompt(
                prompt = system_prompt,
                role = self.generation_client.enums.SYSTEM.value 
            )
        ]

        full_prompt = "".join([document_prompts, footer_prompt])

        answer = self.generation_client.generate_text(
            prompt = full_prompt, chat_history = chat_history, 
        )

        return answer, full_prompt, chat_history
