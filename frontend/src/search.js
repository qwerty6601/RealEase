$(document).ready(function() {
    let search_text = location.hash.substring(1);
    
    let searchParams = new URLSearchParams(window.location.search);

    // Retrieve the values of the 'sort_field' and 'direction' parameters
    let sortField = searchParams.get('sort_field') || "PredictedPrice"; // Use a default value if 'sort_field' is not present
    let direction = searchParams.get('direction') || "desc"; // Use a default value if 'direction' is not present

    fetchSearchResults(search_text, sortField, direction)
        .then((search_results) => {
            console.log('Formatted Search Results:', search_results);
            show_house_results(search_results, search_text)
        })
        .catch((error) => {
            console.error('Error fetching search results:', error);
        });
})

$('#logo-after').click(function() {
    window.location = './home.html';
});

async function getFavorites(userId) {
    const url = `https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/${userId}/favorite`;
    const response = await fetch(url);

    if (!response.ok) {
        console.error(`HTTP error in getFavorites: ${response.status}`);
        return [];
    }

    const data = await response.json();
    console.log('API response data:', data); // Add this line to print the response data

    try {
        const zpids = data.map(item => item.zpid);
        return zpids
    } catch (error) {
        console.error("Error getting favorites:", error);
        return [];
    }
}


async function fetchSearchResults(location, sortField, direction) {
    const user_input = location;
    const apiUrl = `https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/search/${location}?user_input=${encodeURIComponent(user_input)}&sort_field=${encodeURIComponent(sortField)}&sort_direction=${encodeURIComponent(direction)}`;

    const requestOptions = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    };

    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    const favorites = await getFavorites(sessionStorage.getItem('userEmail'));
    console.log(favorites)
    // Format the output
    const search_results = data.map((item) => {
        const zpid = item.zpid;
        const status = favorites.includes(zpid);

        return {
        id: zpid,
        image: item.hiResImageLink,
        price: Number(item.ListingPrice),
        area: Number(item.GrLivArea),
        address: item['address.streetAddress'],
        city: item['city'],
        state: item['state'],
        zip: item['address.zipcode'],
        status: status,
        rating: item.score,
        estimate: Number(item['PredictedPrice'].toFixed(0)),
        };
    });

    return search_results;
}

// show houses based on search query
function show_house_results(search_results, search_text) {
    if (search_results.length === 0) {
        $("#search-title").text('Search Results for "' + decodeURIComponent(search_text) + '"');
        $("#search-houses").append("<div>No results found.</div>");
    } else {
        $.each(search_results, function(index, value) {
            $("#search-title").text('Search Results for "' + decodeURIComponent(search_text) + '"')
            if (value.id == 0) {
                $("#search-houses").append("<div>" + value.title + "</div>")
            }
            else {
                // get favorite status image source
                var favorite_status_src = ""
                if (value.status) {
                    favorite_status_src = "./img/like.png"
                } else {
                    favorite_status_src = "./img/dislike.png"
                }
                $("#search-houses").append('<div class="col-4 house"> \
                                            <a href="https://www.zillow.com/homedetails/' + value.id + '_zpid/" target="_blank"> \
                                            <img class="house-imgs" src="' + value.image + '"></a> \
                                            <span class="house-price">$' + value.price.toLocaleString("en-US") + '</span> \
                                            <span class="house-prop">' + value.area.toLocaleString("en-US") + ' sq ft</span> \
                                            <span class="house-address">' + value.address + ", " + value.city + ", " + value.state + " " + value.zip + '</span> \
                                            <input class="house-fav" type="image" id="fav-' + value.id + '"src="' + favorite_status_src + '"/> \
                                            <div class="house-rating" id="rating-' + value.id + '">' + value.rating + '</div> \
                                            <div class="house-estimate">Estimate: <b>$' + value.estimate.toLocaleString("en-US") + '</b></span></div>')

                $("#rating-" + value.id).css("background-color", get_rating_color(value.rating));

                // change favorite status
                $('#fav-' + value.id).click(function() {
                    var user_id = sessionStorage.getItem('userEmail');
                    var zpid = value.id;

                    // Set the event object with the zpid and user_id
                    const event = {
                        zpid: zpid,
                        user_id: user_id
                    };
                    // Send HTTP request to backend to update user's like status
                    $.ajax({
                        type: 'POST',
                        url: `https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/${user_id}/favHouseStatus/houseId`,
                        data: JSON.stringify(event),
                        dataType: 'json',
                        success: function(response) {
                            // Update the favorite button image based on the response
                            if (response.message == "favorited"){
                                $('#fav-' + zpid).attr("src", "./img/like.png");
                            } else {
                                $('#fav-' + zpid).attr("src", "./img/dislike.png");
                            }
                        },
                        error: function(xhr, status, error) {
                            console.log("Error updating favorites:", error);
                        },
                        contentType: "application/json",
                        dataType: 'json'
                    });
                });
            }  
        });
    }
}

// get rating color based on ratings score
function get_rating_color(rating) {
    if (rating >= 8.0) {
        return "#0b8c1c";
    } 
    else if (rating >= 6.0) {
        return "#37ad2f";
    }
    else if (rating >= 4.0) {
        return "#7bb541";
    }
    else if (rating >= 2.0) {
        return "#ccc845"
    }
    else {
        return "#c75046"
    }
}

