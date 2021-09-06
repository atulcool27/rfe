

$(document).ready(function() {

    //getProductList
    $.ajax({
        url: 'https://racekonindustries.in/common/productlist',
        type: 'GET',
        dataType: 'json',
        crossDomain: true,
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': "*"
        },
        success: function(data){
            alert(JSON.stringify(data));
        },
        error: function(e){
            alert(JSON.stringify(e));
        }
    });

 });