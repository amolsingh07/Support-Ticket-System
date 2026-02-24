from django.db.models import Count, Avg, Q
from django.db.models.functions import TruncDate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer
from .llm import classify_ticket


# =============================
# CREATE + LIST
# =============================
@api_view(["GET","POST"])
def tickets_collection(request):

    if request.method == "POST":
        s = TicketSerializer(data=request.data)
        if s.is_valid():
            s.save()
            return Response(s.data, status=201)
        return Response(s.errors, status=400)

    qs = Ticket.objects.all().order_by("-id")

    if request.GET.get("category"):
        qs = qs.filter(category=request.GET["category"])

    if request.GET.get("priority"):
        qs = qs.filter(priority=request.GET["priority"])

    if request.GET.get("status"):
        qs = qs.filter(status=request.GET["status"])

    if request.GET.get("search"):
        s = request.GET["search"]
        qs = qs.filter(Q(title__icontains=s) | Q(description__icontains=s))

    return Response(TicketSerializer(qs, many=True).data)


# =============================
# UPDATE STATUS
# =============================
@api_view(["PATCH"])
def update_ticket(request, pk):
    ticket = Ticket.objects.get(pk=pk)

    new_status = request.data.get("status")

    # if resolved → delete
    if new_status == "resolved":
        ticket.delete()
        return Response({"deleted": True, "message": "resolved"})

    # if closed → save comment then delete
    if new_status == "closed":
        ticket.comment = request.data.get("comment", "")
        ticket.save()
        ticket.delete()
        return Response({"deleted": True, "message": "closed"})

    # otherwise normal update
    s = TicketSerializer(ticket, data=request.data, partial=True)
    if s.is_valid():
        s.save()
        return Response(s.data)

    return Response(s.errors)


# =============================
# DELETE BUTTON
# =============================
@api_view(["DELETE"])
def delete_ticket(request, pk):
    Ticket.objects.get(pk=pk).delete()
    return Response({"deleted": True})


# =============================
# STATS
# =============================
@api_view(["GET"])
def stats(request):
    total = Ticket.objects.count()
    open_count = Ticket.objects.filter(status="open").count()

    per_day = (
        Ticket.objects.annotate(d=TruncDate("created_at"))
        .values("d")
        .annotate(c=Count("id"))
        .aggregate(avg=Avg("c"))["avg"]
    )

    pr = Ticket.objects.values("priority").annotate(c=Count("id"))
    cat = Ticket.objects.values("category").annotate(c=Count("id"))

    return Response({
        "total_tickets": total,
        "open_tickets": open_count,
        "avg_tickets_per_day": per_day or 0,
        "priority_breakdown": {i["priority"]: i["c"] for i in pr},
        "category_breakdown": {i["category"]: i["c"] for i in cat}
    })


# =============================
# AI CLASSIFY
# =============================
@api_view(["POST"])
def classify(request):
    res = classify_ticket(request.data.get("description", ""))
    if not res:
        return Response({"suggested_category": None, "suggested_priority": None})

    return Response({
        "suggested_category": res["category"],
        "suggested_priority": res["priority"]
    })
