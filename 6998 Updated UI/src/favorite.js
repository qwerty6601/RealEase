var compare_count = 0;
var compare_houses = []

$(document).ready(function() {
    $('#compare').hide();

    favorite_houses = [
        {
            "id": 1,
            "image": "./img/house-1.png",
            "price": "$275,000",
            "unit": 1,
            "area": "1,164",
            "address": "347 East 4th Street, NYC, NY 10009",
            "status": true, 
            "rating": 8.4,
            "estimate": "$250,500"
        },
        {
            "id": 2,
            "image": "./img/house-2.png",
            "price": "$459,900",
            "unit": 3,
            "area": "2,101",
            "address": "627 East 6th Street, NYC, NY 10009",
            "status": true, 
            "rating": 3.1,
            "estimate": "$460,000"
        },
        {
            "id": 3,
            "image": "./img/house-3.png",
            "price": "$489,900",
            "unit": 4,
            "area": "2,005",
            "address": "512 East 11th Street, 5D, NYC, NY 10075",
            "status": true, 
            "rating": 5.3,
            "estimate": "$520,000"
        }
    ]
    show_favorite_houses(favorite_houses)
})

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
                                    <a href="/house.html#' + value.id + '"> \
                                    <img class="house-imgs" src="' + value.image + '"></a> \
                                    <span class="house-price">' + value.price + '</span> \
                                    <span class="house-prop">' + value.unit + ' unit(s) | ' + value.area + ' sq ft</span> \
                                    <span class="house-address">' + value.address + '</span> \
                                    <input class="house-fav" type="image" id="fav-' + value.id + '"src="' + favorite_status_src + '"/> \
                                    <input class="house-add" type="image" id="add-' + value.id + '"src="./img/add.png"/> \
                                    <div class="house-rating" id="rating-' + value.id + '">' + value.rating + '</div> \
                                    <div class="house-estimate">Estimate: <b>' + value.estimate + '</b></span></div>')

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
                const index = array.indexOf(value.id);
                if (index > -1) {
                    array.splice(index, 1);
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

