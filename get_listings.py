import requests
import pandas as pd

url = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch"

querystring = {
    "location":"Ames, IA",
    "status_type":"ForSale",
    "page": 1,
}

headers = {
	"X-RapidAPI-Key": "21053b51bamsh6be9c834d278a43p1d78d1jsn91b67573ad0b",
	"X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
}

page = 1
max_pages = 20
total_pages = 1

# Create an empty DataFrame to store all property data
all_properties = pd.DataFrame()

while page <= max_pages and page <= total_pages:
    querystring["page"] = page
    response = requests.request("GET", url, headers=headers, params=querystring)

    if response.status_code == 200:
        data = response.json()
        total_pages = data.get("totalPages", 1)
        property_data = data.get("props", [])
        
        df = pd.DataFrame(property_data)
        all_properties = all_properties.append(df, ignore_index=True)

        page += 1
    
    else:
        print(f"Error on page {page}: {response.status_code}")
        print(response.text)
        break

all_properties.to_csv("Data/ames_iowa_listings.csv", index=False)
print("Data saved to 'Data/ames_iowa_listings.csv'")