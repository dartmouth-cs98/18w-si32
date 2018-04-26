# upload.py
# Command-line utility to uploads specified botfile.

import sys
import argparse
import requests

DEV_URL = "http://localhost:3000"
PROD_URL = "https://lit-mountain-10578.herokuapp.com"

# ------------------------------------------------------------------------------
# Main

def main():
    args = parse_arguments()

    API_BASE_URL = DEV_URL if args.dev else PROD_URL

    botfile = args.botfile[0]
    username = input("username: ")
    password = input("password: ")
    botname = input("bot name: ")

    # make the auth request
    payload = {"username": username, "password": password}
    r = requests.post(API_BASE_URL + "/users/login", data=payload).json()

    # extract user ID information
    token = r["session"]["token"]

    files = {"code": open(botfile, "rb")}
    payload = {"name": botname}
    auth = {"Authorization": "Bearer " + token}
    r = requests.post(API_BASE_URL + "/bots", data=payload, files=files, headers=auth)

    print(r.status_code)

# ------------------------------------------------------------------------------
# Helpers

# parse command line arguments
def parse_arguments():
    parser = argparse.ArgumentParser(description="Upload a botfile.")
    parser.add_argument("botfile",
                    type=str,
                    nargs=1,
                    help="path to botfile")
    parser.add_argument("-d", "--development",
                    dest="dev",
                    action="store_const",
                    const=True,
                    default=False,
                    help="specify development mode")

    try:
        args = parser.parse_args()
    except argparse.ArgumentTypeError as error:
        print(error)
        sys.exit()

    return args

# ------------------------------------------------------------------------------
# Script

if __name__ == "__main__":
    main()
