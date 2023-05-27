import subprocess


def run():
    cmd = ["poetry", "run", "python", "manage.py", "runserver", "localhost:8000"]
    subprocess.run(cmd)


def collectstatic():
    cmd = ["poetry", "run", "python", "manage.py", "collectstatic"]
    subprocess.run(cmd)
