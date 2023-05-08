import json
import os
import pprint

import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
from boto3.dynamodb.conditions import Key

REGION = 'us-east-1'
HOST = 'search-current-listings-search-qddmd55p6pewdvrh6auyqx4p7e.us-east-1.es.amazonaws.com'
INDEX = 'listings'  # ES index


# Give access to ElasticSearch & DynamoDb


def lambda_handler(event, context):
    print('event: ')
    print(event)

    # print(response)

    # dataChunkStr = event['Records'][0]['body']
    # print('dataChunkStr type: ')
    # print(type(dataChunkStr))

    # #converts str dataChunkStr -> dict dataChunkDict
    # dataChunkStrJsonForm = event.replace('\'','"')
    # dataChunkDict = json.loads(dataChunkStrJsonForm)

    data = event['Records'][0]['messageAttributes']

    # print('data: ')
    # print(data)
    # city = data['location']['stringValue']
    city = data['city']['stringValue']
    state = data['state']['stringValue']
    num_bedrooms = data['num_bedrooms']['stringValue']
    num_br_full = data['num_br_full']['stringValue']
    num_br_half = data['num_br_half']['stringValue']
    lot_size = data['lot_size']['stringValue']
    living_area_size = data['living_area_size']['stringValue']
    email = data['email']['stringValue']

    print('#bedrooms:')
    print(num_bedrooms)

    # Should be unique
    zpids = query(city, state, num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size)
    
    if len(zpids) != 0:
        print('zpids: ')
        print(zpids)
        predicted_price = getPriceFromDynamoDb(zpids[0])
        msgToSend = f"For city: {city}, state: {state}, # bedrooms: {num_bedrooms}, # full br: {num_br_full}, \
num half br: {num_br_half}, lot_size: {lot_size}, living_area_size: {living_area_size}, \n \
the predicted price is:{round(predicted_price, 2)} USD"
    else: 
        msgToSend = f"For city: {city}, state: {state}, # bedrooms: {num_bedrooms}, # full br: {num_br_full}, \
num half br: {num_br_half}, lot_size: {lot_size}, living_area_size: {living_area_size}, \n \
a predicted price is not available. Sorry"
        

    ses = boto3.client('ses')

    destination = {
        'ToAddresses': [email], 'CcAddresses': [], 'BccAddresses': []
    }

    validMsgToSend = {
        'Subject': {'Data': 'subject1'},
        'Body': {'Text':
                     {'Data':
                          msgToSend}
                 }
    }
    send_args = {
        'Source': 'sk4541@columbia.edu',
        'Destination': destination,
        'Message': validMsgToSend
    }
    response = ses.send_email(**send_args)
    print('Response from sending email: ')
    print(response)


def getPriceFromDynamoDb(houseId):
    dynamodb = boto3.resource('dynamodb', region_name="us-east-1")
    table = dynamodb.Table('current_listings')


    data = table.query(KeyConditionExpression=Key('zpid').eq(str(houseId)))  # TODO: replace w/ id! sTu5z5HUcIYykg97HHj8xA
    print('Info retrieved from dynamoDb: ')
    # print(data)
    # if len(data['Items']) == 0:
    #     continue

    predicted_price = data['Items'][0]['PredictedPrice']

    # if 'location' not in data['Items'][0]:
    #     print('no location present')
    #     continue

    print(predicted_price)
    return predicted_price


# Retrieves the restaurant ID via Elastic Search
# the parameter (term) to find the restaurants should be the desired *cuisine* rite?

def query(city, state, num_bedrooms, num_br_full, num_br_half, lot_size, living_area_size):
    query = {'size': 50, 'query': {
        #                 "multi_match": {
        #                     "query": "chinese",
        #                     "fields": []
        #                 }
        #             }
        # }
        # 'multi_match': {"city": city, "state": state, 'num_bedrooms' : num_bedrooms, 'num_br_full': num_br_full,
        #     'num_br_half': num_br_half}
        # }
        
        #'match' : {'city' : city}
        
        "bool": {
            "must": [
                {"match": {"city": city}}
                # {"match": {"state": state}},
                #{"match": {"num_bedrooms": int(num_bedrooms)}},
            ]
        }
        }
    }

    es = OpenSearch(hosts=[{
        'host': HOST,
        'port': 443
    }],
        http_auth=get_awsauth(REGION, 'es'),
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection)

    data = es.search(index=INDEX, body=query)

    print(data)

    hits = data['hits']['hits']
    print(hits)
    relevant_results = []
    for hit in hits:
        relevant_results.append(hit['_source'])
    print('query results: ')
    print(relevant_results)
    ids = []
    for result in relevant_results:
        id = result['zpid']
        ids.append(id)
    # print(ids)
    return ids


def get_awsauth(region, service):
    cred = boto3.Session().get_credentials()
    return AWS4Auth(cred.access_key,
                    cred.secret_key,
                    region,
                    service,
                    session_token=cred.token)
