import boto3
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('favorite_houses')

def lambda_handler(event, context):
    # Extract zpid and user email from the event
    body = json.loads(event['body'])
    zpid = body.get('zpid')
    user_id = body.get('user_id')
    action = "favorited"

    # Get the existing item for the user
    try:
        response = table.get_item(
            Key={'user_id': user_id}
        )
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error getting item from favorite_houses: {str(e)}')
        }

    # Check if the item exists and update the "favorite" attribute, or create a new item
    try:
        if 'Item' in response:
            # Update the "favorite" attribute
            favorite = response['Item'].get('favorite', [])
            if zpid in favorite:
                favorite.remove(zpid)  # Remove zpid if it exists in the favorite list
                action = "unfavorited"
            else:
                favorite.append(zpid)  # Add zpid if it doesn't exist in the favorite list
                
            table.update_item(
                Key={'user_id': user_id},
                UpdateExpression="SET favorite = :new_favorite",
                ExpressionAttributeValues={
                    ':new_favorite': favorite
                }
            )
        else:
            # Create a new item with the "favorite" attribute containing the zpid
            table.put_item(
                Item={
                    'user_id': user_id,
                    'favorite': [zpid]
                }
            )
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            "body": json.dumps({"message": action})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error adding/updating zpid in favorite_houses: {str(e)}')
        }
