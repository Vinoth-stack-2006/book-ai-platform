from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("🚀 Book AI Backend Running")

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🔥 ROOT URL
    path('', home),

    # 🔥 API URLS
    path('api/', include('books.urls')),
]