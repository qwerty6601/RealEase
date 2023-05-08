import json
import boto3
import requests
from botocore.exceptions import ClientError


def lambda_handler(event, context):
    user_id = event['pathParameters']['userId']

    # get users' favorite houses ids
    house_ids = get_favorite_houses({'user_id': user_id})['favorite']
    print(house_ids)

    # call "get_house_data" lambda to get houses by house ids
    get_house_data_url = 'https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/search'
    payload = {'house_ids': house_ids}
    response = requests.post(get_house_data_url, json=payload)

    # process the response
    house_data = json.loads(response.text)

    print(house_data)

    return {'statusCode': 200,
            "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(house_data)}


# get user's favorite houses
def get_favorite_houses(key, db=None, table='favorite_houses'):
    if not db:
        db = boto3.resource('dynamodb')
        
    table = db.Table(table)
    
    try:
        response = table.get_item(Key=key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        return response['Item']
