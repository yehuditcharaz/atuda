import logging
import os

from logging.handlers import TimedRotatingFileHandler

from utils.config import LogsParams, Paths
from utils.helpers import ensure_directory_exist


def create_logger(logger_name):
    logger = configure_logger(logger_name)
    ensure_directory_exist(Paths.LOGS_PATH)
    handler = get_handler()
    add_file_handler(logger, handler)
    add_stream_handler(logger)
    return logger


def configure_logger(logger_name):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    return logger


def get_handler():
    handler = TimedRotatingFileHandler(
        os.path.join(Paths.LOGS_PATH, LogsParams.FILE_NAME),
        when=LogsParams.WHEN,
        atTime=LogsParams.AT_TIME,
        interval=LogsParams.INTERVAL,
        backupCount=LogsParams.BACKUPCOUNT,
        encoding=LogsParams.ENCODING,
        utc=False,
    )
    return handler


def add_file_handler(logger, handler):
    formatter = logging.Formatter(fmt=LogsParams.FORMAT, datefmt=LogsParams.TIME_FORMAT)
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def add_stream_handler(logger):
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    logger.addHandler(stream_handler)


logger = create_logger(__name__)
