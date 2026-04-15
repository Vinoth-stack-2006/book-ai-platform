from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .scraper import scrape_books
from .rag import index_books, query_books, generate_summary, classify_genre
from .llm import ask_llm
from fuzzywuzzy import process


# 📚 GET ALL BOOKS
@api_view(['GET'])
def get_books(request):
    books = Book.objects.all().values()
    return Response(books)


# 📖 BOOK DETAIL
@api_view(['GET'])
def get_book_detail(request, id):
    try:
        book = Book.objects.get(id=id)
        return Response({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "description": book.description,
            "image": book.image_url,
            "rating": book.rating
        })
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)


# 📚 RECOMMENDATION API
@api_view(['GET'])
def recommend_books(request):
    books = Book.objects.all()[:5]
    return Response([
        {
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "image": b.image_url,
            "rating": b.rating
        }
        for b in books
    ])


# ⬆️ SCRAPE + INDEX
@api_view(['POST'])
def upload_books(request):
    scrape_books(10)
    books = Book.objects.all()
    index_books(books)

    return Response({"message": "Books uploaded & indexed successfully"})


# 🤖 ASK AI
@api_view(['POST'])
def ask_question(request):
    question = request.data.get("question")

    if not question:
        return Response({"error": "Question is required"}, status=400)

    question = question.lower().strip()

    def add_sources(answer, books):
        if not books:
            return answer
        sources = "\n".join([f"- {b['title']}" for b in books[:3]])
        return f"{answer}\n\n📚 Sources:\n{sources}"

    # EXACT MATCH
    exact_book = Book.objects.filter(title__icontains=question).first()

    if exact_book:
        summary = generate_summary(exact_book.description)
        genre = classify_genre(exact_book.description)

        prompt = f"""
User asked: {question}

Book: {exact_book.title}
Author: {exact_book.author}
Summary: {summary}
Genre: {genre}

Explain why this book is good.
"""

        ai_answer = ask_llm(prompt)

        final_answer = add_sources(ai_answer, [{"title": exact_book.title}])

        return Response({
            "answer": final_answer,
            "books": [{
                "id": exact_book.id,
                "title": exact_book.title,
                "author": exact_book.author,
                "image": exact_book.image_url,
                "rating": exact_book.rating,
                "summary": summary,
                "genre": genre
            }]
        })

    # RAG SEARCH
    results = query_books(question)
    final_books = []

    for title in results:
        book = Book.objects.filter(title=title).first()

        if book:
            summary = generate_summary(book.description)
            genre = classify_genre(book.description)

            final_books.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "image": book.image_url,
                "rating": book.rating,
                "summary": summary,
                "genre": genre
            })

    if final_books:
        context = "\n\n".join([
            f"{b['title']} - {b['summary']}"
            for b in final_books[:5]
        ])

        prompt = f"""
User Question: {question}

Context:
{context}

Recommend books clearly.
"""

        ai_answer = ask_llm(prompt)

        final_answer = add_sources(ai_answer, final_books)

        return Response({
            "answer": final_answer,
            "books": final_books
        })

    # FALLBACK
    ai_answer = ask_llm(question)

    return Response({
        "answer": ai_answer,
        "books": []
    })