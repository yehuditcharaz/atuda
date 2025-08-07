from flask import request, abort


def validate_file():
    file = request.files.get('file')
    if not file:
        abort(400, description="Missing required parameter: file.")
    return file
