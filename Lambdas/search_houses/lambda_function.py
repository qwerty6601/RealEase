import re
import boto3
import json
import requests
from requests_aws4auth import AWS4Auth
import urllib.parse

region = 'us-east-1' # For example, us-west-1
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

host = 'https://search-current-listings-search-qddmd55p6pewdvrh6auyqx4p7e.us-east-1.es.amazonaws.com' # The OpenSearch domain endpoint with https:// and without a trailing slash
index = 'listings'
url = host + '/' + index + '/_search'

dynamodb = boto3.resource('dynamodb', region_name=region)
table = dynamodb.Table('current_listings')

headers = { "Content-Type": "application/json" }

# Function for searching by user input
def search_opensearch_index(user_input, sort_field):
    # Check if input is a zip code
    if re.match(r'^\d{5}(-\d{4})?$', user_input):
        query = {
            "query": {
                "bool": {
                    "should": [
                        {"match": {"zip_code": user_input}},
                    ]
                }
            },
        }
    # Check if input is a city and state combination
    elif re.match(r'^[\w\s]+,\s*\w{2}$', user_input):
        city, state = [x.strip() for x in user_input.split(',')]
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"fuzzy": {"city": {"value": city, "fuzziness": 2}}},
                        {"fuzzy": {"state": {"value": state, "fuzziness": 2}}},
                    ],
                },
            },
        }
    else:
        print(f"Invalid input format: ${user_input}. Please enter either a zip code or a city and state combination.")
        return []

    query["sort"] = [
        {
            sort_field: {
                "order": "desc"
            }
        }
    ]
    query["_source"] = ["zpid"]
    query["size"] = 20

    response = requests.post(url, auth=awsauth, headers=headers, data=json.dumps(query))
    response.raise_for_status()
    response_json = response.json()

    # Extract and return the IDs from the response
    ids = [hit["_source"]["zpid"] for hit in response_json["hits"]["hits"]]
    return ids

def lambda_handler(event, context):
    query_params = event.get('queryStringParameters', {})

    user_input = query_params.get('user_input')
    sort_field = query_params.get('sort_field')

    if user_input:
        user_input = urllib.parse.unquote(user_input)
        
    if sort_field:
        sort_field = urllib.parse.unquote(sort_field)

    matching_ids = search_opensearch_index(user_input, sort_field)
    print("Matching IDs:", matching_ids)

    # Retrieve matching DynamoDB items
    items = []
    for record_id in matching_ids:
        item = table.get_item(Key={'zpid': str(record_id)})
        if 'Item' in item:
            items.append(item['Item'])

    response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(items)
    }

    return response
