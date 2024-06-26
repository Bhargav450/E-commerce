import requests
import json
import pytest
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def authenticate():
    """Authenticate user and obtain token."""
    url = os.getenv("LOGIN")
    headers = {'Content-Type': 'application/json'}
    file_path = os.path.join(os.getcwd(), 'testcases', 'testData', 'logintestData.json')

    try:
        with open(file_path, 'r') as file:
            data = json.load(file)[1]  # Load the JSON data and access the second element
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # Raise exception for HTTP errors (status codes >= 400)
        token = response.json().get('token')
        if token:
            return token
        else:
            logger.error("Token not found in response")
            return None
    except (requests.exceptions.RequestException, IOError) as e:
        logger.error(f"Authentication failed: {e}")
        return None

def create_orders(auth_token):
    """Create orders using the provided authentication token."""
    url = os.getenv("ORDER")
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }
    file_path = os.path.join(os.getcwd(), 'testcases', 'testData', 'orderData.json')

    try:
        with open(file_path, 'r') as file:
            order_data = json.load(file)
            for idx, item in enumerate(order_data, start=1):
                print("Executing test case", idx)

                # Send POST request to the login endpoint
                response = requests.post(url, headers=headers, json=item)

                # Check if the request was successful
                if response.status_code == 200:
                    # Parse the response JSON
                    response_data = response.json()
                else:
                    print("Request failed with status code:", response.status_code)
                    response_data = response.json()
                    msg = response_data.get('errors')
                    if msg is not None:
                        print(msg)
                    else:
                        print(response_data.get('message'))

    except requests.exceptions.Timeout:
        # Handle timeout error
        pytest.fail("Request timed out")
    except Exception as e:
        # Handle other errors
        pytest.fail(f"Test failed: {str(e)}")


if __name__ == "__main__":
    # Authenticate and obtain token
    auth_token = authenticate()
    if auth_token:
        # Create orders with the obtained token
        create_orders(auth_token)
