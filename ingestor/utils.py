import requests


def GetData(url):
    response = requests.get(url)
    return response.content


def SaveData(data, filename):
    with open(filename, 'wb') as file:
        file.write(data)
