import logging
import os
from logging.handlers import TimedRotatingFileHandler
from src.constants_utils.const import LogsConfig


def create_logger(logger_name):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    os.makedirs(LogsConfig.LOGS_PATH, exist_ok=True)
    handler = get_handler()
    formatter = logging.Formatter(fmt=LogsConfig.FORMAT, datefmt="%Y-%m-%d %H:%M:%S")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    return logger


def get_handler():
    handler = TimedRotatingFileHandler(
        os.path.join(LogsConfig.LOGS_PATH, LogsConfig.FILE_NAME),
        when=LogsConfig.WHEN,
        atTime=LogsConfig.AT_TIME,
        interval=LogsConfig.INTERVAL,
        backupCount=LogsConfig.BACKUPCOUNT,
        encoding=LogsConfig.ENCODING,
        utc=False,
    )
    return handler


logger = create_logger(__name__)
