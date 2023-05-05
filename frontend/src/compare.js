$(document).ready(function() {
    // get compared house ids
    let houses = location.hash.substring(1).split("&");
    const house_ids = [parseInt(houses[0]), parseInt(houses[1])]
    console.log(house_ids);

    fetchHouseInfo(house_ids)
        .then((house_info) => {
            show_compare_houses(house_info)
        })
        .catch((error) => {
            console.error('Error fetching search results:', error);
        });
})

$('#logo-after').click(function() {
    window.location = './home.html';
});

// find house info
async function fetchHouseInfo(house_ids) {
    const apiUrl = "https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/search";

    const payload = {'house_ids': house_ids};

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };
    
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();

    // Format the output
    const house_info = data.map((item) => {
        return {
        id: item.zpid,
        image: item.hiResImageLink,
        price: Number(item.ListingPrice),
        area: Number(item.GrLivArea),
        address: item["address.streetAddress"],
        city: item["city"],
        state: item["state"],
        zip: item["address.zipcode"],
        status: true,
        rating: 3.0,
        estimate: Number(item["PredictedPrice"].toFixed(0)),
        };
    });

    return house_info;
}

// show houses based on house info
function show_compare_houses(house_info) {
    console.log(house_info)

    $("#compare-table").append('<tr><th></th><td> \
                                <a href="https://www.zillow.com/homedetails/' + house_info[0].id + '_zpid/" target="_blank"> \
                                <img class="compare-img" src="' + house_info[0].image + '"></a></td> \
                                <td><a href="https://www.zillow.com/homedetails/' + house_info[1].id + '_zpid/" target="_blank"> \
                                <img class="compare-img" src="' + house_info[1].image + '"></a></td></tr> \
                                <tr><th>List Price</th> \
                                <td>$' + house_info[0].price.toLocaleString("en-US") + '</td> \
                                <td>$' + house_info[1].price.toLocaleString("en-US") + '</td>></tr> \
                                <tr><th>Estimate</th> \
                                <td>$' + house_info[0].estimate.toLocaleString("en-US") + '</td> \
                                <td>$' + house_info[1].estimate.toLocaleString("en-US") + '</td>></tr> \
                                <tr><th>Address</th> \
                                <td>' + house_info[0].address + ", " + house_info[0].city + ", " + house_info[0].state + " " + house_info[0].zip + '</td> \
                                <td>' + house_info[1].address + ", " + house_info[1].city + ", " + house_info[1].state + " " + house_info[1].zip + '</td>></tr> \
                                <tr><th>Land Size</th> \
                                <td>' + house_info[0].area.toLocaleString("en-US") + '</td> \
                                <td>' + house_info[1].area.toLocaleString("en-US") + '</td>></tr> \
                                <tr><th>Price/sq ft</th> \
                                <td>$' + (house_info[0].price / house_info[0].area).toLocaleString("en-US") + '</td> \
                                <td>$' + (house_info[1].price / house_info[1].area).toLocaleString("en-US") + '</td>></tr>')
}