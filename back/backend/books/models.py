from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    rating = models.FloatField(null=True, blank=True)
    description = models.TextField()
    author = models.CharField(max_length=255, default="Unknown Author")
    url = models.TextField()
    image_url = models.URLField(null=True, blank=True)
    def __str__(self):
        return self.title