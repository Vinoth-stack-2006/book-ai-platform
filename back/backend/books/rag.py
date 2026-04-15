from sentence_transformers import SentenceTransformer
import chromadb
from .models import Book
import random

# 🔥 Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# 🔥 ChromaDB client
client = chromadb.Client()
collection = client.get_or_create_collection(name="books")


# 🔥 INDEX BOOKS (WITH CHUNKING 🔥)
def index_books(books):
    docs = []
    ids = []
    metadatas = []

    for book in books:
        if book.description:

            # 🔥 CHUNKING (IMPORTANT)
            chunks = [
                book.description[i:i+300]
                for i in range(0, len(book.description), 300)
            ]

            for idx, chunk in enumerate(chunks):
                docs.append(chunk)
                ids.append(f"{book.id}_{idx}")
                metadatas.append({
                    "title": book.title,
                    "author": book.author
                })

    if not docs:
        print("❌ No data to index")
        return

    embeddings = model.encode(docs).tolist()

    try:
        collection.delete(where={})
    except:
        pass

    collection.add(
        documents=docs,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )

    print("INDEXING DONE 🚀")


# 🔥 QUERY BOOKS (IMPROVED 🔥)
def query_books(question):
    if not question:
        return []

    q_embed = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[q_embed],
        n_results=5   # 🔥 BETTER QUALITY
    )

    metadatas = results.get("metadatas", [])

    titles = []

    for sublist in metadatas:
        for item in sublist:
            if item and "title" in item:
                titles.append(item["title"])

    # 🔥 remove duplicates
    return list(dict.fromkeys(titles))


# 🔥 SUMMARY
def generate_summary(text):
    if not text:
        return "No summary available"
    return text[:120] + "..."


# 🔥 GENRE CLASSIFICATION
def classify_genre(text):
    if not text:
        return "General 📚"

    text = text.lower()

    if "love" in text or "emotion" in text:
        return "Romance ❤️"
    elif "mystery" in text or "crime" in text:
        return "Mystery 🕵️"
    elif "adventure" in text:
        return "Adventure 🌍"
    elif "fantasy" in text:
        return "Fantasy 🧙"
    else:
        return "General 📚"