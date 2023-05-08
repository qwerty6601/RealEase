import os
import boto3
from boto3.dynamodb.conditions import Key
import math
from decimal import Decimal
import requests
from requests_aws4auth import AWS4Auth
import json

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
region = 'us-east-1'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

host = 'https://search-current-listings-search-qddmd55p6pewdvrh6auyqx4p7e.us-east-1.es.amazonaws.com'
index = 'listings'

def calculate_score(predicted_price, listing_price):
    if predicted_price == 0 or listing_price == 0:
        return 0

    predicted_price = Decimal(predicted_price)
    listing_price = Decimal(listing_price)
    difference = predicted_price - listing_price
    percentage_difference = difference / listing_price
    hyperbolic_difference = percentage_difference.copy_abs()**(Decimal("1.5"))

    if percentage_difference >= 0:
        score = (hyperbolic_difference * Decimal("3")) + Decimal("7")
    else:
        score = (-hyperbolic_difference * Decimal("6")) + Decimal("7")

    clamped_score = max(min(score, 10), 1)

    return round(clamped_score,1)

def update_dynamodb_score(table, zpid, score):
    table.update_item(
        Key={"zpid": zpid},
        UpdateExpression="SET score = :score",
        ExpressionAttributeValues={":score": score}
    )

def update_opensearch_score(zpid, score):
    update_url = f"{host}/{index}/_doc/{zpid}/_update"
    payload = {
        "doc": {
            "score": float(score)
        }
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(update_url, auth=awsauth, headers=headers, data=json.dumps(payload))
    if response.status_code != 200:
        print(f"Error: {response.content}")
    response.raise_for_status()

def lambda_handler(event, context):
    table_name = "current_listings"
    table = dynamodb.Table(table_name)

    response = table.scan()
    for item in response["Items"]:
        zpid = item["zpid"]
        predicted_price = Decimal(item["PredictedPrice"])
        listing_price = Decimal(item["ListingPrice"])
        
        score = calculate_score(predicted_price, listing_price)
        
        update_dynamodb_score(table, zpid, score)
        update_opensearch_score(zpid, score)

    return {"statusCode": 200, "body": "Scores updated successfully!"}