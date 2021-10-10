var API_URL = "https://racekon.online";

$(document).ready(function () {


     var cart = localStorage.getItem("racecart");
     if(cart === null){
         cart = "";
     }else{
         localStorage.removeItem("racecart");
     }
     localStorage.setItem("racecart","");

       
        var imageList = [];
        $.ajax({
            url: 'https://racekonindustries.in/json/productlist.json',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var optionList = "";
                for (var i = 1; i < 101; i++) {
                    optionList += '<option value="' + i + '">' + i + '</option>';
                }

                var productDiv = '<div class="row">';
                
                for (var i = 0; i < data.length; i++) {
                    product = data[i];
                    var imgName = product.productImageName + ".jpg";
                    var price = product.productPrice.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        currency: 'INR'
                    });

                    productDiv += '<div class="col-md-6 col-lg-4 mb-2"> <div class="card border-primary h-100"> <div class="view zoom z-depth-2 rounded"> <img class="img-fluid w-100 myImages" onerror="javascript:this.src=\'../images/products/default.jpg\'" style="width:100%; height: 100%;" id="img' + product.productId + '" src="../images/products/'+imgName+'"> </div>  <div class="card-body"> <div class="text-center pt-4">  <h6 class="text-dark font-weight-light lead fas" id="name'+product.productId+'">' + product.productName + '</h6>  </div> </div> <div class="card-footer bg-white"> <h6 class="mb-3"><span class="text-danger">₹</span><span class="text-danger font-weight-bold" id="price'+product.productId+'">' + price + '</span></h6>  <div class="row"><div class="col-6"><button type="button" id="cartBtn' + product.productId + '" onclick="addToCart(' + product.productId + ')" class="btn btn-primary btn-sm mr-1">Add to cart</button></div> <div class="col-6"> <select id="select' + product.productId + '" onchange="myCartQuan('+product.productId+')"> <option selected value="1" hidden>1</option>' + optionList + '</select> </div> </div> </div> </div> </div>';
                }
                productDiv += '</div>';

                document.getElementById("products").innerHTML = productDiv;


            },
            error: function (e) {
                bootbox.dialog({
                    message: "Porforma Invoice is not available Currently. Please try after some time.",
                    size: 'small',
                    closeButton: false,
                    backdrop: true
                });
            }
        });

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
 
 if($("#organizationState").val() === ""){
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

// var formData = $("#perForm").serialize();

bootbox.dialog({
    message: "Generating Proforma Invoice ...",
    size: 'small',
    closeButton: false,
    backdrop: true
}); 

// localStorage.setItem("proformaForm",formData);

// postForm(API_URL+'/public/performa/download', {
// 							  formData: formData,
// 							  racecart: localStorage.getItem("racecart")
// 		});

downloadPDF($("#organizationName").val(),$("#organizationAddress").val(),$("#organizationGST").val(),
$("#organizationPhone").val(),$("#organizationState").val());

}







const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

async function downloadPDF(name,address,gst,phone,state) {
  // Fetch an existing PDF document
  const url = 'https://racekonindustries.in/pdfperforma.pdf'
      const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize()

  var test = localStorage.getItem("racecart");
  //var cartitems = localStorage.getItem("racecart").split(",");
  var cartitems = test.substring(0,test.length-1).split(",");
  var productData = "";
  for(var index=0;index<cartitems.length;index++) {
      var item = cartitems[index];
    productData += item.split("-")[1]+",";
  }


  var productList = productData.substring(0,productData.length-1).split(",");


  //Date 
  firstPage.drawText(""+dateToYMD(new Date()), {
    x: 345,
    y: 691,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })

   //Company Name
   firstPage.drawText(""+name.toUpperCase(), {
    x: 40,
    y: 585,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })

   //Company Address
   firstPage.drawText(""+address.toUpperCase(), {
    x: 40,
    y: 570,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })

   //Phone Number
   firstPage.drawText("MOBILE : "+phone, {
    x: 40,
    y: 555,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })

   //GST Number
   firstPage.drawText("GSTIN : "+gst.toUpperCase(), {
    x: 40,
    y: 540,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })


   //GST Number
   firstPage.drawText("STATE : "+state.toUpperCase+"      CODE : "+gst.substring(0,2).toUpperCase(), {
    x: 40,
    y: 525,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
   })


   //Print products 10 times
  for(var i =0; i<productList.length;i=i+1){

      //Serial Number
        firstPage.drawText(""+(i+1), {
            x: 45,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

          //ProductName
        firstPage.drawText(""+productList[i].split("XXX")[0].toUpperCase(), {
            x: 85,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

           //HSN
        firstPage.drawText("85011020", {
            x: 255,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

             //Quantity
        firstPage.drawText(""+productList[i].split("XXX")[1], {
            x: 330,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

               //Rate
        var temp = parseFloat(productList[i].split("XXX")[2])/parseFloat(productList[i].split("XXX")[1])
        firstPage.drawText(""+parseInt(temp), {
            x: 372,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })

                //NOS
        firstPage.drawText("NOS", {
            x: 430,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })


                  //Amount
        firstPage.drawText(""+Math.round(parseFloat(productList[i].split("XXX")[2])), {
            x: 520,
            y: 460-15*i,
            size: 9,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          })
  }

 
  //Discount
  firstPage.drawText("1,20,000", {
    x: 520,
    y: 280,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


  //Total
  firstPage.drawText("1,20,000", {
    x: 520,
    y: 242,
    size: 9,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })

  

 //Total IN ENGLISH
 firstPage.drawText("EIGHTEEN LAKH THIRTEEN THOUSAND NINE HUNDRED FORTY TWO RUPEES ONLY", {
    x: 40,
    y: 229,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


  //Total IN ENGLISH AFTER GST
 firstPage.drawText("EIGHTEEN LAKH THIRTEEN THOUSAND NINE HUNDRED FORTY TWO RUPEES ONLY", {
    x: 145,
    y: 164,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


   //Total IN ENGLISH AFTER GST
 firstPage.drawText("EIGHTEEN LAKH THIRTEEN THOUSAND NINE HUNDRED FORTY TWO RUPEES ONLY", {
    x: 145,
    y: 164,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Taxable Value
 firstPage.drawText("1,85,000", {
    x: 372,
    y: 190,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Taxable Value
 firstPage.drawText("1,75,000", {
    x: 372,
    y: 176,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Total Taxable Value
 firstPage.drawText("1,85,000", {
    x: 470,
    y: 190,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Total Taxable value
 firstPage.drawText("1,75,000", {
    x: 470,
    y: 176,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Total Taxable Value
 firstPage.drawText("1,85,000", {
    x: 520,
    y: 190,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })


    //Total Taxable value
 firstPage.drawText("1,75,000", {
    x: 520,
    y: 176,
    size: 8,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })



  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()

        // Trigger the browser to download the PDF document
  download(pdfBytes, "porformainvoice.pdf", "application/pdf");
}





function dateToYMD(date) {
    var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
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










//"18.210.2.199"




