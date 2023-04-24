import boto3 # AWS SDK for python
import json # to make dicitonary more readable
import pprint

# Define the client to interact with Lex
client = boto3.client('lexv2-runtime')

def lambda_handler(event, context):
    print("Event: ")
    print(event)
    body = json.loads(event['body'])
    msg_from_user = body['messages'][0]['unstructured']['text']
                    
    print("Message from frontend: ")
    print(msg_from_user) 

    # Initiate conversation with Lex
    # Hooking to Lex thru the botId, botAliasId (so for now no need to hook via the Lex Console)
    response = client.recognize_text( botId='1FMCRUV1ZZ',
            botAliasId='9DOUTTUIGS',
            localeId='en_US',
            sessionId='testuser',
            text=msg_from_user)
            
    print("Response: ")
    print(response)
    msg_from_lex = response.get('messages', []) # if no key 'message' found then it returns []
    response_data = {"messages": [{"type": 'unstructured', 
                                   "unstructured": {"text": msg['content']}
                                  } for msg in msg_from_lex]}
                    
    if msg_from_lex: # if response not null
        return {
            'statusCode': 200,
            "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(response_data)
        }