import logging
from utils.logger import create_logger, get_handler
from .stub import LogsTest


def test_logger(mock_get_handler):
    logger_name = LogsTest.LOGGER_NAME
    logger = create_logger(logger_name)
    assert logger.name == logger_name
    assert len(logger.handlers) == LogsTest.LEN
    assert isinstance(logger.handlers[0], logging.StreamHandler)
    assert isinstance(logger.handlers[1], logging.StreamHandler)


def test_log_formatting(mock_get_handler, caplog):
    logger_name = LogsTest.LOGGER_NAME
    logger = create_logger(logger_name)
    logger.debug(LogsTest.DEBUG_MESSAGE)
    assert LogsTest.DEBUG_MESSAGE in caplog.text


def test_get_handler_parameters():
    handler = get_handler()
    assert handler.when == LogsTest.WHEN
    assert handler.interval == LogsTest.INTERVAL
    assert handler.backupCount == LogsTest.BACKUPCOUNT
