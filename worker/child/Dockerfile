# Docker container to run user programmed bots
FROM python:3-alpine

# All we have to do is launch bot.py. All the user code has already
# been placed in the /bot directory. Eventually, this could easily by
# changed to be a startup script that reads a config file and does
# whatever is needed per language
CMD ["python", "/bot/bot.py"]
