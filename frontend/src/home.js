$("#search").submit(function(event) {        
    event.preventDefault();
    search_text = $("input").val()

    if ($.trim(search_text)) {
        window.location = "/search_results.html#" + search_text
    }
});

$('#chatbot').click(function(event) {        
    console.log("yes")
    window.location = '/chatbot.html';
});