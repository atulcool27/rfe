
//var API_URL = "http://18.210.2.199";
var API_URL = "https://racekonindustries.in";

$(document).ready(function () {



     var cart = localStorage.getItem("racecart");
     if(cart === null){
         cart = "";
     }else{
         localStorage.removeItem("racecart");
     }
     localStorage.setItem("racecart","");

    if (localStorage.getItem("page1") === null) {
        //getProductList
        $.ajax({
            url: API_URL+'/api/productlist',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var optionList = "";
                for (var i = 1; i < 101; i++) {
                    optionList += '<option value="' + i + '">' + i + '</option>';
                }

                var productDiv = '<div class="row">';
                var imgName = "default.jpg";
                for (var i = 0; i < data.field1.length; i++) {
                    product = data.field1[i];
                    var price = product.productPrice.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        currency: 'INR'
                    });

                    imgName = product.productName.replace(/[^0-9]+/ig,"");
                    imgName += ".jpg";

                    productDiv += '<div class="col-md-6 col-lg-4 mb-2"> <div class="card border-primary h-100"> <div class="view zoom z-depth-2 rounded"> <img class="img-fluid w-100 myImages" style="width:100%; height: 100%;" id="img' + product.productId + '" src="../images/products/'+imgName+'"> </div>  <div class="card-body"> <div class="text-center pt-4">  <h6 class="text-dark font-weight-light lead fas" id="name'+product.productId+'">' + product.productName + '</h6>  </div> </div> <div class="card-footer bg-white"> <h6 class="mb-3"><span>₹</span><span class="font-weight-bold" id="price'+product.productId+'">' + price + '</span></h6>  <div class="row"><div class="col-6"><button type="button" id="cartBtn' + product.productId + '" onclick="addToCart(' + product.productId + ')" class="btn btn-primary btn-sm mr-1">Add to cart</button></div> <div class="col-6"> <select id="select' + product.productId + '" onchange="myCartQuan('+product.productId+')"> <option selected value="1" hidden>1</option>' + optionList + '</select> </div> </div> </div> </div> </div>';
                }
                productDiv += '</div>';

                localStorage.setItem("page1", productDiv);
                document.getElementById("products").innerHTML = productDiv;


            },
            error: function (e) {
                bootbox.dialog({
                    message: "Error loading products",
                    size: 'small',
                    closeButton: false,
                    backdrop: true
                });
            }
        });
    } else {
        document.getElementById("products").innerHTML = localStorage.getItem("page1");
    }

});



function myCartQuan(id) {

    var name = $("#name"+id).text();
    var price = $("#price"+id).text().replace(",","");

    var items = localStorage.getItem("racecart");

    if (items.includes(id + "-")) {
        var newItem = "";
        var arr = items.split(",");
        for (var i = 0; i < items.split(",").length; i++) {

            var row = arr[i];
            if (row.includes(id + "-") || row === "") {
            } else {
                newItem += row + ",";
            }
        }

        localStorage.setItem("racecart", newItem);

        items = newItem;

        var x = parseInt(price);
        var y = parseInt($("#select" + id).val());
        var z = x * y;

        items += id + "-" + name + "XXX" + $("#select" + id).val() + "XXX" + z + ",";
        localStorage.setItem("racecart", items);
    }
}



function addToCart(id) {

    var name = $("#name"+id).text();
    var price = $("#price"+id).text().replace(",","");

    var items = localStorage.getItem("racecart");

    if (items.includes(id + "-")) {
        var newItem = "";
        var arr = items.split(",");
        for (var i = 0; i < items.split(",").length; i++) {

            var row = arr[i];
            if (row.includes(id + "-") || row === "") {
            } else {
                newItem += row + ",";
            }
        }


        localStorage.setItem("racecart", newItem);
        $("#cartBtn" + id).removeClass("btn-success");
        $("#cartBtn" + id).addClass("btn-primary");
        document.getElementById("cartBtn" + id).innerHTML = '<i class="fas fa-shopping-cart pr-2"></i>Add To Cart';
        document.getElementById("checkoutCount").innerHTML = newItem.split(',').length - 1;
    } else {

        var x = parseInt(price);
        var y = parseInt($("#select" + id).val());
        var z = x * y;

        items += id + "-" + name + "XXX" + $("#select" + id).val() + "XXX" + z + ",";
        localStorage.setItem("racecart", items);
        $("#cartBtn" + id).removeClass("btn-primary");
        $("#cartBtn" + id).addClass("btn-success");
        document.getElementById("cartBtn" + id).innerHTML = '<i class="fas fa-shopping-cart pr-2"></i>Added';
        document.getElementById("checkoutCount").innerHTML = items.split(',').length - 1;
    }
}


function startDownload() {

    if(localStorage.getItem("proformaForm") !== null){
        var data = localStorage.getItem("proformaForm");
        var data = data.split("&");
        $("#organizationName").val(data[0].split("=")[1]);
        $("#organizationAddress").val(data[1].split("=")[1]);
        $("#organizationState").val(data[2].split("=")[1]);
        $("#organizationGST").val(data[3].split("=")[1]);
        $("#organizationPhone").val(data[4].split("=")[1]);
    }

    $("#downlodModal").trigger("click");
}


function downloadProforma(){
    var test = 1;

if($("#organizationName").val() === ""){
 $("#organizationName").toggleClass("border-danger");
 test=0;
}

if($("#organizationAddress").val() === ""){
$("#organizationAddress").toggleClass("border-danger");
 test=0;
}
if($("#organizationGST").val() === ""){
$("#organizationGST").toggleClass("border-danger");
 test=0;
 }
if($("#organizationPhone").val() === ""){
$("#organizationPhone").toggleClass("border-danger");
 test=0;
 }
 
 if($("#organizationPhone").val() === ""){
$("#organizationState").toggleClass("border-danger");
 test=0;
 }
 
 
 if(test==0){
 bootbox.dialog({
    message: "Please fill all fields.",
    size: 'small',
    closeButton: false,
    backdrop: true
});
return false;
}
 
 
 
 
if( $("#organizationPhone").val().length <10 || $("#organizationPhone").val().length >10){
bootbox.dialog({
    message: "Phone number must be 10 digits.",
    size: 'small',
    closeButton: false,
    backdrop: true
});
return false;
}

if($("#organizationGST").val().length < 15){
bootbox.dialog({
    message: "GST is a 15 digit number.",
    size: 'small',
    closeButton: false,
    backdrop: true
}); 
return false;
}
 

var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([a-zA-Z0-9]){1}?$/;
if(!reggst.test($("#organizationGST").val()) && $("#organizationGST").val()!=''){
bootbox.dialog({
    message: "Please enter valid Indian GST number.",
    size: 'small',
    closeButton: false,
    backdrop: true
}); 
return false; 
}


if(localStorage.getItem("racecart") === null || localStorage.getItem("racecart") === ""){
    bootbox.dialog({
        message: "Cart is empty.",
        size: 'small',
        closeButton: false,
        backdrop: true
    }); 
    return false; 
}

  
$('#performaModal').modal('toggle');

var formData = $("#perForm").serialize();

bootbox.dialog({
    message: "Generating Proforma Invoice ...",
    size: 'small',
    closeButton: false,
    backdrop: true
}); 

localStorage.setItem("proformaForm",formData);

postForm(API_URL+'/public/performa/download', {
							  formData: formData,
							  racecart: localStorage.getItem("racecart")
		});

}


function postForm(path, params, method) {
    method = method || 'post';

    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}











