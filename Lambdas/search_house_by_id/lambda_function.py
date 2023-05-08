import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('current_listings')  

def get_house_by_id(house_id):
    result = table.get_item(
        Key={
            'zpid': str(house_id)
        }
    )
    print('get_house_by_id result------------')
    print(result)
    
    if 'Item' in result:
        item = result['Item']
        house = {
            "BedroomAbvGr": str(item["BedroomAbvGr"]),
            "BldgType": item["BldgType"],
            "FullBath": str(item["FullBath"]),
            "GrLivArea": str(item["GrLivArea"]),
            "HalfBath": str(item["HalfBath"]),
            "ListingPrice": str(item["ListingPrice"]),
            "PredictedPrice": float(item["PredictedPrice"]),
            "address.streetAddress": item["address.streetAddress"],
            "address.zipcode": item["address.zipcode"],
            "city": item["city"],
            "hiResImageLink": item["hiResImageLink"],
            "state": item["state"],
            "zpid": house_id,
            "score": float(item["score"]),
        }
        return house
    else:
        return None

def lambda_handler(event, context):
    house_ids = json.loads(event["body"])['house_ids']
    print('event--------------')
    print(event)
    # find houses by their IDs
    houses = []
    for id in house_ids:
        print('id--------------')
        print(id)
        house = get_house_by_id(id)
        print('house in loop--------------')
        print(house)
        houses.append(house)
    print('house after append-------------')
    print(houses)
    # return the found houses
    response = {
        "statusCode": 200,
        "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
        },
        "body": json.dumps(houses)
    }
    
    return response