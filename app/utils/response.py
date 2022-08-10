from enum import Enum
from django.http import JsonResponse


class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"


def invalid_request_method():
    return JsonResponse({"error": "Invalid request method"})
