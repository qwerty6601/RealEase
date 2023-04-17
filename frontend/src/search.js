$(document).ready(function() {
    let search_text = location.hash.substring(1); 

    fetchSearchResults(search_text, "ListingPrice")
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

async function fetchSearchResults(location, sortField) {
    const user_input = location;
    const apiUrl = `https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/search/${location}?user_input=${encodeURIComponent(user_input)}&sort_field=${encodeURIComponent(sortField)}`;
    
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        }
    };
    
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();

    console.log(data)

    // Format the output
    const search_results = data.map((item) => {
        return {
        id: item.zpid,
        image: item.hiResImageLink,
        price: Number(item.ListingPrice),
        unit: 1,
        area: Number(item.GrLivArea),
        address: item["address.streetAddress"],
        status: false,
        rating: 3.0,
        estimate: 123,
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
                console.log(value.address)
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
                                            <span class="house-prop">' + value.unit + ' unit(s) | ' + value.area.toLocaleString("en-US") + ' sq ft</span> \
                                            <span class="house-address">' + value.address + '</span> \
                                            <input class="house-fav" type="image" id="fav-' + value.id + '"src="' + favorite_status_src + '"/> \
                                            <div class="house-rating" id="rating-' + value.id + '">' + value.rating + '</div> \
                                            <div class="house-estimate">Estimate: <b>$' + value.estimate.toLocaleString("en-US") + '</b></span></div>')

                $("#rating-" + value.id).css("background-color", get_rating_color(value.rating));

                // change favorite status
                $('#fav-' + value.id).click(function() {
                    // TODO: send http request to backend to update user's like status
                    if ($('#fav-' + value.id).attr("src") == "./img/like.png") {
                        $('#fav-' + value.id).attr("src", "./img/dislike.png");
                    } else {
                        $('#fav-' + value.id).attr("src", "./img/like.png");
                    }
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

