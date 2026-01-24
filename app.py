import streamlit as st
from PyPDF2 import PdfReader
import os
from dotenv import load_dotenv

load_dotenv()
st.set_page_config("PDF Text Extractor")
st.header("Ask Your PDF")

# upload file
pdf = st.file_uploader("Upload Your PDF", type="pdf", accept_multiple_files=True)


# Extract the text
if pdf is not None:
    text = ""
    for i in pdf:
        pdf_reader = PdfReader(i)
        
        for page in pdf_reader.pages:
            text+= page.extract_text()
    
    st.write(text)