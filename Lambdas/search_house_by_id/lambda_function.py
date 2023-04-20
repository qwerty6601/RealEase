import json

def lambda_handler(event, context):
    # Get house data by house id to show houses on favorite page
    # Need to finish implementing search houses by house ids (similar to search_house lambda - search by location)
    # get_favorite_houses lambda is sending a list of user's favorite house ids (ex: ['123256', '5231212']) to this lambda
    # house id = zpid (zillow house id)
    # this lambda gets all the houses from opensearch and return the house information back to get_favorite_houses

    house_ids = json.loads(event["body"])['house_ids']
    
    # find houses by their IDs
    houses = []

    for id in house_ids:
        house = get_house_by_id(id)
        houses.append(house)
    
    # return the found houses
    response = {
        "statusCode": 200,
        "body": json.dumps(houses)
    }
    
    return response
    

# TODO: get house data by house id
def get_house_by_id(house_id):
    return {"BedroomAbvGr": "4.0",
            "BldgType": "1Fam",
            "FullBath": "3.0",
            "GrLivArea": "2215.0",
            "HalfBath": "1.0",
            "ListingPrice": "924900",
            "PredictedPrice": 712134.09375,
            "address.streetAddress": "2329 163rd Pl",
            "address.zipcode": "50014",
            "city": "Ames",
            "hiResImageLink": "https://photos.zillowstatic.com/fp/17839d6b2aea5f4ac2bc1c07d49bd460-p_f.jpg",
            "state": "IA",
            "zpid": house_id
        }