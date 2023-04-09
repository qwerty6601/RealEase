$(document).ready(function() {
    let search_text = location.hash.substring(1); 
    console.log(search_text)
    
    search_results = [
        {
            "id": 1,
            "image": "./img/house-1.png",
            "price": "$275,000",
            "address": "347 East 4th Street, NYC, NY 10009"
        },
        {
            "id": 2,
            "image": "./img/house-2.png",
            "price": "$459,900",
            "address": "627 East 6th Street, NYC, NY 10009",
        },
        {
            "id": 3,
            "image": "./img/house-3.png",
            "price": "$489,900",
            "address": "512 East 11th Street, 5D, NYC, NY 10075"
        }
    ]
    display_search_items(search_results, search_text)
})

// display search items
function display_search_items(search_results, search_text) {
    $.each(search_results, function(index, value) {
        $("#search-title").text('Search Results for "' + search_text + '"')

        if (value.id == 0) {
            $("#search-houses").append("<div>" + value.title + "</div>")
        }
        else {
            $("#search-houses").append('<div class="col-md-4 house"> \
                                        <img class="house-img" src="./img/house-1.png"> \
                                        <span class="house-price">$275,000</span> \
                                        <span class="house-prop">1 unit(s) | 1,164 sq ft</span> \
                                        <span class="house-address">347 East 4th Street, NYC, NY 10009</span> \
                                        <img class="house-fav" src="./img/like.png"> \
                                        <div class="house-rating">8.4</div> \
                                        <div class="house-estimate">Estimate: <b>$250,500</b></span></div>')

            
            // $("#search-houses").append("<div class='col-4 house'>\
            //                            <a href='/house/" + value.id + "' class='search-links'>\
            //                            <img src=" + value.image + " class='search-imgs'></a><br>\
            //                            <div class='search-prices'>" + value.price + "</div>\
            //                            <p>" + value.address + "</p></div>")
        }  
	});
}