import logging
from datetime import datetime
from pytz import timezone
from utils.config import UtilsConfig


class CustomFormatter(logging.Formatter):
    def formatTime(self, record: logging.LogRecord):
        time_zone = timezone(UtilsConfig.TIME_ZONE)
        record.asctime = datetime.now(time_zone).strftime("%Y-%m-%d %H:%M:%S")
        return record.asctime
