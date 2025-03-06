import logging
import os
from datetime import date
from logging.handlers import RotatingFileHandler
from models.custom_formatter import CustomFormatter
from utils.config import LogsConfig


def create_logger(logger_name):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    os.makedirs(LogsConfig.LOGS_PATH, exist_ok=True)
    handler=get_handler()
    formatter = CustomFormatter(fmt=LogsConfig.FORMAT)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    return logger


def get_handler():
    handler = RotatingFileHandler(
        os.path.join(LogsConfig.LOGS_PATH, f"{date.today()}.log"),
        maxBytes=LogsConfig.MAX_BYTES,
        backupCount=LogsConfig.BACKUP_COUNT,
    )
    return handler


logger = create_logger(__name__)
