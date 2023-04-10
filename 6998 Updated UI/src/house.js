var temp = ""

$(document).ready(function() {
    temp = document.getElementById("house-detail-img").src;
})

// change favorite status
$('#fav-3').click(function() {
    // TODO: send http request to backend to update user's like status
    if ($('#fav-3').attr("src") == "./img/like.png") {
        $('#fav-3').attr("src", "./img/dislike.png");
    } else {
        $('#fav-3').attr("src", "./img/like.png");
    }
});

function change_house_img(img) {
    let detail_img = document.getElementById("house-detail-img");
    detail_img.src = img.src;
    img.src = temp
    temp = detail_img.src
    detail_img.parentElement.style.display = "block";
}