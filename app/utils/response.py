from enum import Enum
from django.http import JsonResponse

from .date import getDateTimeNow


class HttpMethod(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"


def invalid_request_method():
    return error_response("", "Invalid request method", 405)


def success_response(data):
    return JsonResponse(
        {"message": "OK", "status": 200, "timestamp": getDateTimeNow(), "payload": data}
    )


def error_response(error, message="Error", status=500):
    return JsonResponse(
        {
            "message": message,
            "status": status,
            "timestamp": getDateTimeNow(),
            "payload": error,
        }
    )
