

$(document).ready(function() {

    //getProductList
    $.ajax({
        url: 'https://racekonindustries.in/common/productlist',
        type: 'GET',
        dataType: 'json',
        //crossDomain: true,
        // headers: {
        //     'Accept':'application/json',
        //     'Content-Type':'application/json',
        //     'Access-Control-Allow-Origin': "*"
        // },
        success: function(data){

            var productDiv = '<div class="row">';
            
            for(var i =0; i<data.field1.length;i++){
                product = data.field1[i];
                productDiv +=   '<div class="col-md-6 col-lg-4 mb-2"> <div class="card border-primary h-100"> <div class="view zoom z-depth-2 rounded"> <img class="img-fluid w-100 myImages" style="width:100%; height: 100%;" id="img4" src="../images/about/about1.png"> </div> <div class="card-body"> <div class="text-center pt-4"> <h6 class="text-dark font-weight-light lead fas">10Kg Ac Synchronous motor</h6> </div> </div> <div class="card-footer bg-white"> <h6 class="mb-3"><span>₹</span><span class="font-weight-bold">1200</span></h6> <div class="row">NaN <div class="col-6"> <select class="lead"> <option value="Select"></option></select> </div> </div> </div> </div> </div> </div>';
            }
            productDiv = '</div>';

            document.getElementById("products").innerHTML=productDiv;

            
        },
        error: function(e){
            alert("something unexpected happened");
        }
    });

 });






 