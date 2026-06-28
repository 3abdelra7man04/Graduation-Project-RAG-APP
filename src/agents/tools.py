from pydantic_ai import RunContext
from agents.dependencies import AgentDeps
from datetime import datetime

async def semantic_search(ctx: RunContext[AgentDeps], query: str) -> str:
    """
    Search the vector database for documents related to the query.
    
    Notes on Language and Data Shape:
    1. The underlying vector database and documents are primarily written in Arabic. 
    2. If the user asks their question in English, translate the search terms into 
       Arabic keywords before passing them to this tool to maximize semantic matching.
    3. Keep the query parameter strict and concise. Strip away conversational filler, 
       greetings, or full questions (e.g., convert "Can you please tell me who the dean is?" 
       into "عميد الكلية"). Pass only the core informational keywords.

    Args:
        ctx: The runtime context containing agent dependencies.
        query: A clean, keyword-dense search phrase (optimized for Arabic document retrieval).
    """

    if not ctx.deps.nlp_controller:
        return "Error: NLP Controller is not initialized in dependencies."
    if not ctx.deps.project:
        return "Error: Project is not initialized in dependencies."
        
    try:
        # search_in_vectordb returns (reranked_documents, HyDE_prompt_tokens, HyDE_completion_tokens)
        retrieved_documents, _, _ = ctx.deps.nlp_controller.search_in_vectordb(
            Project=ctx.deps.project,
            query=query,
            limit=ctx.deps.limit
        )
        
        if not retrieved_documents:
            return "No matching documents found."
            
        # Format the retrieved documents
        document_prompts = "\n".join([
            ctx.deps.template_parser.get("rag", "document_prompt", {
                "doc_num": i+1,
                "chunk_text": document["text"]
            })
            for i, document in enumerate(retrieved_documents)
        ])
                
        return document_prompts
    except Exception as e:
        return f"Error during semantic search: {str(e)}"


