$(document).ready(function() {
    let search_text = location.hash.substring(1); 
    search_results = [
        {
            "id": 1,
            "image": "./img/house-1.png",
            "price": "$275,000",
            "unit": 1,
            "area": "1,164",
            "address": "347 East 4th Street, NYC, NY 10009",
            "status": "./img/like.png", 
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
            "status": "./img/dislike.png", 
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
            "status": "./img/like.png", 
            "rating": 5.3,
            "estimate": "$520,000"
        }
    ]
    show_house_results(search_results, search_text)
})

// show houses based on search query
function show_house_results(search_results, search_text) {
    $.each(search_results, function(index, value) {
        $("#search-title").text('Search Results for "' + search_text + '"')
        if (value.id == 0) {
            $("#search-houses").append("<div>" + value.title + "</div>")
        }
        else {
            $("#search-houses").append('<div class="col-md-4 house"> \
                                        <a href="/house/' + value.id + '" class="search-links"> \
                                        <img class="house-img" src="' + value.image + '" class="search-imgs"></a><br> \
                                        <span class="house-price">' + value.price + '</span> \
                                        <span class="house-prop">' + value.unit + ' unit(s) | ' + value.area + ' sq ft</span> \
                                        <span class="house-address">' + value.address + '</span> \
                                        <input class="house-fav" type="image" src="' + value.status + '"/> \
                                        <div class="house-rating" id="rating-' + value.id + '">' + value.rating + '</div> \
                                        <div class="house-estimate">Estimate: <b>' + value.estimate + '</b></span></div>')
            $("#rating-" + value.id).css("background-color", get_rating_color(value.rating));
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