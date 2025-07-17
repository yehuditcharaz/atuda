#!/bin/bash
chmod 666 /app/build/index.html

echo "-------------" > /abc.txt

random_value=$RANDOM

sed -i "s|</body>|<script type=\"module\" src="/assets/navigationElements.js?${random_value}"></script></body>|g" /app/build/index.html
