import requests
import pandas as pd
import random
import json
import time

url = "https://zillow56.p.rapidapi.com/property"

querystring = {"zpid":""}

headers = {
	"X-RapidAPI-Key": "21053b51bamsh6be9c834d278a43p1d78d1jsn91b67573ad0b",
	"X-RapidAPI-Host": "zillow56.p.rapidapi.com"
}

zpids_df = pd.read_csv("Data/ames_iowa_zpids.csv")
random_zpids = zpids_df["zpid"].sample(20).tolist()
property_data_list = []

for zpid in random_zpids:
    querystring = {"zpid": zpid}
    response = requests.request("GET", url, headers=headers, params=querystring)
    if response.status_code == 200:
        data = response.json()
        property_data_list.append(data)
    else:
        print(f"Error for zpid {zpid}: {response.status_code}")
        print(response.text)
    
    time.sleep(1)

# Save the property data list as a JSON file
with open("Data/random_property_data.json", "w") as outfile:
    json.dump(property_data_list, outfile, indent=4)

print("Property data saved to 'Data/random_property_data.json'")