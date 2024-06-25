import requests
import json
import pytest
import os

@pytest.mark.timeout(10)  # Set the timeout to 10 seconds
def test_login_api():
    url = 'http://localhost:3000/api/register'  # Replace this with your API endpoint URL
    headers = {'Content-Type': 'application/json'}

     # Construct the path to the JSON file
    file_path = os.path.join(os.getcwd(), 'testcases', 'testData', 'registerData.json')

    try:
        # Read JSON data from file
        with open(file_path, 'r') as file:
            data = json.load(file)

        for idx, item in enumerate(data, start=1):
            print("Executing test case", idx)

            # Send POST request to the login endpoint
            response = requests.post(url, headers=headers, json=item)

            # Check if the request was successful
            if response.status_code == 200:
                # Parse the response JSON
                response_data = response.json()
            
            
            else:
                # print(f"Login attempt failed for test case {idx}: Status code {response.status_code}")
                response_data = response.json()
                msg=response_data.get('errors')
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

# Call the test function
test_login_api()
