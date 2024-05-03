import logging

logging.basicConfig(level=logging.INFO)


def GetLogger(name):
    Logger = logging.getLogger(name)
    Logger.setLevel(logging.INFO)
    return Logger
