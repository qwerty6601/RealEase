var compare_count = 0;
var compare_houses = []

$(document).ready(function() {
    $('#compare').hide();

    let email = sessionStorage.getItem('userEmail')

    fetchFavoriteHouses(email)
        .then((favorite_houses) => {
            console.log('Formatted Favorite Results:', favorite_houses);
            show_favorite_houses(favorite_houses)
        })
        .catch((error) => {
            console.error('Error fetching search results:', error);
        });
})

$('#logo-after').click(function() {
    window.location = './home.html';
});

// find user's favorite houses
async function fetchFavoriteHouses(email) {
    const apiUrl = "https://7td214zyq5.execute-api.us-east-1.amazonaws.com/cp2/" + email + "/favorite";
    
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
    const favorite_houses = data.map((item) => {
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

    return favorite_houses;
}

// show houses based on search query
function show_favorite_houses(favorite_houses) {
    $.each(favorite_houses, function(index, value) {
        // get favorite status image source
        favorite_status_src = ""
        if (value.status) {
            favorite_status_src = "./img/like.png"
        } else {
            favorite_status_src = "./img/dislike.png"
        }

        $("#fav-houses").append('<div class="col-4 house"> \
                                    <a href="https://www.zillow.com/homedetails/' + value.id + '_zpid/" target="_blank"> \
                                    <img class="house-imgs" src="' + value.image + '"></a> \
                                    <span class="house-price">$' + value.price.toLocaleString("en-US") + '</span> \
                                    <span class="house-prop">' + value.area.toLocaleString("en-US") + ' sq ft</span> \
                                    <span class="house-address">' + value.address + ", " + value.city + ", " + value.state + " " + value.zip + '</span> \
                                    <input class="house-fav" type="image" id="fav-' + value.id + '"src="' + favorite_status_src + '"/> \
                                    <input class="house-add" type="image" id="add-' + value.id + '"src="./img/add.png"/> \
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

        // change add status
        $('#add-' + value.id).click(function() {
            if ($('#add-' + value.id).attr("src") == "./img/add.png") {
                if (compare_count < 2) {
                    $('#add-' + value.id).attr("src", "./img/added.png");
                    compare_houses.push(value.id);
                    compare_count++
                }

                if (compare_count == 2) {
                    $('#compare').show();
                }
            } else {
                $('#add-' + value.id).attr("src", "./img/add.png");

                // remove house from compare list
                const index = compare_houses.indexOf(value.id);
                if (index > -1) {
                    compare_houses.splice(index, 1);
                }

                compare_count--
                if (compare_count < 2) {
                    $('#compare').hide();
                }
            }
        });
	});
}

$('#compare-btn').click(function() {
    window.location = '/compare.html#' + compare_houses[0] + "&" + compare_houses[1];
});

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

