

$(document).ready(function() {

    //getProductList
    $.ajax({
        url: 'https://racekonindustries.in/common/download/imageid?imageId=img2&_=1630846375473',
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