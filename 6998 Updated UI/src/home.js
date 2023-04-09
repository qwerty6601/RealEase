// $('#search').keypress(function (e) {
//     if (e.which == 13) {
//         search_text = $("input").val()
//         if ($.trim(search_text)) {
//             window.location = "/search_results?text=" + search_text
//         }
//         return false;
//     }
// });


$("#search").submit(function(event) {        
    event.preventDefault();
    search_text = $("input").val()

    if ($.trim(search_text)) {
        window.location = "/search_results.html#" + search_text
    }
});