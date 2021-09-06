

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

            var productDiv = "";
            for(var i =0; i<data.field1.length;i++){
                product = data.field1[i];
                productDiv +=   '<div class="col-md-6 col-lg-4 mb-2">'
                                +'<div class=" mb-12" >'
                                + '<div class="card border-primary h-100">'
                                    + '<div class="view zoom z-depth-2 rounded">'
                                    +'<img class="img-fluid w-100 myImages"  style="width:100%; height: 100%;" id="img'+product.productId+'"  src="../images/about/about1.png"  >'
                                    +'</div>'
                                +'<div class="card-body"><div class="text-center pt-4">'
                                +'<h6 class="text-dark font-weight-light lead fas">'+product.productName+'</h6></div></div>'
                                +'<div class="card-footer bg-white">'
                                +'<h6 class="mb-3"><span>&#8377</span><span class="font-weight-bold">'+product.productPrice+'</span></h6>'
                                +'<div class="row">'+
                                +'<div class="col-6"><button type="button" class="btn btn-primary btn-sm mr-1"><i class="fas fa-shopping-cart pr-2"></i>Add to cart</button>'
                                +'</div>'
                                +'<div class="col-6"><select class="lead"><option value="Select"></option></select>'
                                +'</div></div>'
                                +'</div></div>'
                                +'</div></div>';
            }

            document.getElementById("products").innerHTML=productDiv;

            
        },
        error: function(e){
            alert("something unexpected happened");
        }
    });

 });






 