import requests


def DownloadandGetFile(url, filename):
    response = requests.get(url)
    with open(filename, 'wb') as file:
        file.write(response.content)
    return response.content
