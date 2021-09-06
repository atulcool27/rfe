
$(document).ready(function() {

    if(localStorage.getItem("page1") === null){
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
                        var price = product.productPrice.toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                            currency: 'INR'
                        });
                        productDiv +=   '<div class="col-md-6 col-lg-4 mb-2"> <div class="card border-primary h-100"> <div class="view zoom z-depth-2 rounded"> <img class="img-fluid w-100 myImages" style="width:100%; height: 100%;" id="img'+product.productId+'" src="../images/products/default.jpg"> </div>  <div class="card-body"> <div class="text-center pt-4">  <h6 class="text-dark font-weight-light lead fas">'+product.productName+'</h6>  </div> </div> <div class="card-footer bg-white"> <h6 class="mb-3"><span>₹</span><span class="font-weight-bold">'+price+'</span></h6>  <div class="row"><div class="col-6"><button type="button" class="btn btn-primary btn-sm mr-1"><i class="fas fa-shopping-cart pr-2"></i>Add to cart</button></div> <div class="col-6"> <select class="lead"> <option value="Select"></option></select> </div> </div> </div> </div> </div>';
                    }
                    productDiv += '</div>';

                    localStorage.setItem("page1",productDiv);
                    document.getElementById("products").innerHTML=productDiv;

                    
                },
                error: function(e){
                    alert("something unexpected happened");
                }
            });
    } else{
        document.getElementById("products").innerHTML=localStorage.getItem("page1");
    }
    
 });






 