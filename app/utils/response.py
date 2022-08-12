from enum import Enum
from django.http import JsonResponse

from .date import getDateTimeNow


class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"


def invalid_request_method():
    return JsonResponse({"error": "Invalid request method"})


def success_response(data):
    return JsonResponse(
        {"message": "OK", "statis": 200, "timestamp": getDateTimeNow(), "payload": data}
    )


def error_response(error):
    return JsonResponse(
        {
            "message": "Error",
            "statis": 500,
            "timestamp": getDateTimeNow(),
            "payload": error,
        }
    )
