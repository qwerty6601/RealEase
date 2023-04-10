$(document).ready(function() {
    let search_text = location.hash.substring(1); 
    // TODO: get search results from backend
    search_results = [
        {
            "id": 1,
            "image": "./img/house-1.png",
            "price": 275000,
            "unit": 1,
            "area": 1164,
            "address": "347 East 4th Street, NYC, NY 10009",
            "status": true, 
            "rating": 8.4,
            "estimate": 250500
        },
        {
            "id": 2,
            "image": "./img/house-2.png",
            "price": 459900,
            "unit": 3,
            "area": 2101,
            "address": "627 East 6th Street, NYC, NY 10009",
            "status": false, 
            "rating": 3.1,
            "estimate": 460000
        },
        {
            "id": 3,
            "image": "./img/house-3.png",
            "price": 489900,
            "unit": 4,
            "area": "2005",
            "address": "512 East 11th Street, 5D, NYC, NY 10075",
            "status": true, 
            "rating": 5.3,
            "estimate": 520000
        },
        {
            "id": 4,
            "image": "./img/house-4.png",
            "price": 421000,
            "unit": 3,
            "area": 1235,
            "address": "2412 Hans Street, NYC, NY 10071",
            "status": true, 
            "rating": 5.3,
            "estimate": 520000
        },
        {
            "id": 5,
            "image": "./img/house-5.png",
            "price": 301020,
            "unit": 2,
            "area": 1532,
            "address": "634 Ander Street, NYC, NY 10172",
            "status": true, 
            "rating": 6.5,
            "estimate": 520000
        },
        {
            "id": 6,
            "image": "./img/house-6.png",
            "price": 889900,
            "unit": 5,
            "area": 3008,
            "address": "4312 Jinsa Street, NYC, NY 10231",
            "status": false, 
            "rating": 1.3,
            "estimate": 720000
        }
    ]
    show_house_results(search_results, search_text)
})

$('#logo-after').click(function() {
    window.location = './home.html';
});

// show houses based on search query
function show_house_results(search_results, search_text) {
    $.each(search_results, function(index, value) {
        $("#search-title").text('Search Results for "' + search_text + '"')
        if (value.id == 0) {
            $("#search-houses").append("<div>" + value.title + "</div>")
        }
        else {
            // get favorite status image source
            favorite_status_src = ""
            if (value.status) {
                favorite_status_src = "./img/like.png"
            } else {
                favorite_status_src = "./img/dislike.png"
            }

            $("#search-houses").append('<div class="col-4 house"> \
                                        <a href="/house.html#' + value.id + '"> \
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

