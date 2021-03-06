# upload.py
# Command-line utility to upload specified botfile to Monad servers.

import sys
import getpass
import argparse
import requests

DEV_URL = "http://localhost:3000"
PROD_URL = "https://lit-mountain-10578.herokuapp.com"

# ------------------------------------------------------------------------------
# Main

def main():
    # parse command line arguments 
    args = parse_arguments()

    # hit the production URL by default
    API_BASE_URL = DEV_URL if args.dev else PROD_URL

    # parse user input
    botfile = args.botfile[0]
    username = input("username: ")
    password = getpass.getpass(prompt="password: ") #input("password: ")
    botname = input("bot name: ")

    # POST the auth request
    payload = {"username": username, "password": password}
    r = requests.post(API_BASE_URL + "/users/login", data=payload)

    if r.status_code != 200:
        print("could not authenticate you with those credentials")
        return

    # extract user ID information
    token = r.json()["session"]["token"]

    # POST the upload request
    payload = {"name": botname}
    files = {"code": open(botfile, "rb")}
    auth = {"Authorization": "Bearer " + token}
    r = requests.post(API_BASE_URL + "/bots", data=payload, files=files, headers=auth)

    if r.status_code == 200:
        print("success!")
    else:
        print("failed to upload bot :(")

    return

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
                    help="specify local development mode")

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
