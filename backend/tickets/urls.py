from django.urls import path
from . import views

urlpatterns = [
    path("", views.tickets_collection),
    path("<int:pk>/", views.update_ticket),
    path("<int:pk>/delete/", views.delete_ticket),
    path("stats/", views.stats),
    path("classify/", views.classify),
]
