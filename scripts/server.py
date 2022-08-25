import subprocess


def run():
    cmd = ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
    subprocess.run(cmd)
