var temp = ""

$(document).ready(function() {
    temp = document.getElementById("house-detail-img").src;
    console.log(temp)
})

function change_house_img(img) {
    let detail_img = document.getElementById("house-detail-img");
    detail_img.src = img.src;
    img.src = temp
    temp = detail_img.src
    detail_img.parentElement.style.display = "block";
}