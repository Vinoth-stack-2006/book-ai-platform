import requests
from bs4 import BeautifulSoup
from .models import Book

BASE_URL = "http://books.toscrape.com/catalogue/page-{}.html"


# 🔥 GET AUTHOR + DESCRIPTION + IMAGE
def get_book_details(title):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={title}"
        res = requests.get(url, timeout=5)
        data = res.json()

        if "items" in data:
            info = data["items"][0]["volumeInfo"]

            author = info.get("authors", ["Unknown Author"])[0]

            description = info.get(
                "description",
                f"{title} is a book about story and life."
            )

            image = info.get("imageLinks", {}).get("thumbnail", None)

            return author, description, image

    except Exception as e:
        print("Google API error:", e)

    return "Unknown Author", f"{title} book", None


def scrape_books(pages=2):
    for page in range(1, pages + 1):
        print(f"Scraping page {page}...")

        try:
            res = requests.get(BASE_URL.format(page), timeout=5)
            soup = BeautifulSoup(res.text, "html.parser")
        except Exception as e:
            print(f"❌ Skipping page {page}:", e)
            continue   # 🔥 skip error page

        books = soup.select(".product_pod")

        for book in books:
            try:
                title = book.h3.a["title"]
                url = "http://books.toscrape.com/catalogue/" + book.h3.a["href"]

                # ⭐ rating
                rating_class = book.p["class"][1]
                rating_map = {
                    "One": 1,
                    "Two": 2,
                    "Three": 3,
                    "Four": 4,
                    "Five": 5
                }
                rating = rating_map.get(rating_class, 0)

                # 🔥 GET DATA
                author, description, image_url = get_book_details(title)

                if not description or len(description) < 20:
                    description = f"{title} is an interesting book about life and storytelling."

                description = description[:300]

                Book.objects.get_or_create(
                    title=title,
                    defaults={
                        "author": author,
                        "description": description,
                        "url": url,
                        "image_url": image_url,
                        "rating": rating
                    }
                )

            except Exception as e:
                print("❌ Error in book:", e)
                continue

    print("✅ Scraping completed successfully!")