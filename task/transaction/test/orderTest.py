# Import necessary modules for unit testing and making HTTP requests
import unittest
import requests
import json

# Base URL for the Order API
BASE_URL = "http://localhost:3000/orders"

# Define a class for testing the Order API
class TestOrderAPI(unittest.TestCase):
    
    # Test case for retrieving all orders
    def test_get_all_orders(self):
        """
        Test case to retrieve all orders from the API.
        """
        # Make a GET request to the orders endpoint
        response = requests.get(BASE_URL)
        try:
            # Check if the response status code is 200 (OK)
            self.assertEqual(response.status_code, 200)
            # Check if the response is a list
            self.assertIsInstance(response.json(), list)
            # Print the response in a formatted JSON
            print("Response:", json.dumps(response.json(), indent=4))
        except AssertionError as e:
            # Print an error message if the test fails
            print(f"test_get_all_orders failed: {e}")
            # Print the response in a formatted JSON
           

if __name__ == "__main__":
    unittest.main()
