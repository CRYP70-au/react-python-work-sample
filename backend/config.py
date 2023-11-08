import os

# Limits room for error when working in different directories 
# TODO - Make this an environment variable
# TODO - Assert db directory exists first
DATABASE_DIR = os.path.join(os.getcwd(), "db/sampleblog.db")
