
var porformaSchema;
var billtype='';


$(document).ready(function(){
     $("#maindiv").hide(); $("#maindiv2").hide();
     $("#maindiv2").hide();
     $("#loading").show();

     if(localStorage.getItem("raceuser")!==null && localStorage.getItem("raceuser")!==undefined){
        document.getElementById("welcometext").innerHTML="Welcome, "+localStorage.getItem("raceuser");
     }else{
        document.getElementById("welcometext").innerHTML="Welcome, ";
     }
     
   
    if(currentTokenValue == null){
        localStorage.removeItem(previousTokenKey);
        window.location.href="/login.html";
    }else{
        refresh();
    }
    
    var raceuserinfo = JSON.parse(localStorage.getItem("raceuserinfo"));
    var tempdata;
    for (var i = 0; i < raceuserinfo.length; i++) {
        if (raceuserinfo[i].username === localStorage.getItem("raceuser")) {
            tempdata = raceuserinfo[i];
        }
    }

    if(tempdata===undefined){
        doLogout();
    }
    var menu = tempdata.accessList;
    document.getElementById("menudiv").innerHTML = '';
    for (var i = 0; i < menu.length; i++) {
        document.getElementById("menudiv").innerHTML += '<li class="nav-item"> <a class="nav-link  text-light" href="' + homeurl + menu[i].pageLink + '">' + menu[i].pageName + '</a></li>';
    }
    
});

function refresh(){
    $.ajax({
        url: url+'/api/xl/load',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            porformaSchema=data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for(var i=0;i<porformaSchema.customer.length;i++){
                $("#customertype").append($("<option />").val(porformaSchema.customer[i].id).text(porformaSchema.customer[i].buyerName+"\t"+porformaSchema.customer[i].addressLine1));
            }  
            var table='';
            for(var i=0;i<data.products.length;i++){
                                    table+='<tr><th scope="row"><input id="'+data.products[i].id+'" name="'+data.products[i].id+'" type="checkbox"></th>'+
                                                                '<th><input id="name'+data.products[i].id+'" name="name'+data.products[i].id+'" type="text" value="'+data.products[i].name+'"></th>'+
                                                                '<th><input id="price'+data.products[i].id+'" name="price'+data.products[i].id+'" type="number" value="'+data.products[i].price+'"></th>'+
                                                                '<th><input id="quan'+data.products[i].id+'" name="quan'+data.products[i].id+'" type="number" value="1"></th>'+
                                                                '<th><i style="cursor:pointer" onclick="deleteProduct('+data.products[i].id+')" class="bi bi-trash3-fill text-danger">DELETE</i></th></tr>';
            }
            table+='<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML=table;
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
        },
        error: function(e){

        }
    });
}



function addNewCustomer(){
    bootbox.dialog({
        title: "Create New Customer",
        message: $('#add-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Create",
                className: "btn btn-success text-white",
                callback: function () {
                    jsonObj = [];
                    item = {};
                    item ["buyerName"] = $("#customername").val();
                    item ["addressLine1"] = $("#address1").val();
                    item ["addressLine2"] = $("#address2").val();
                    item ["state"] = $("#state").val();
                    item ["gst"] = $("#gst").val();
                    item ["mobile"] = $("#mobile").val();
                    item ["invoiceNo"] = "";
                    jsonObj.push(item);
                    addNewCustomerRequest(item);

                    $("#maindiv").hide(); $("#maindiv2").hide();
                    $("#loading").show();
                }
            }
        }
    });
      
}


function addNewCustomerRequest(customerjson){
    $.ajax({
        url: url+'/api/xl/customer/add',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(customerjson),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            porformaSchema=data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for(var i=0;i<data.customer.length;i++){
                $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName+"\t"+data.customer[i].addressLine1));
            }
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
            },
        error:function(e){
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
        }
    });   
}

function editCustomerRequest(customerjson){
    $.ajax({
        url: url+'/api/xl/customer/edit',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(customerjson),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            porformaSchema=data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for(var i=0;i<data.customer.length;i++){
                $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName+"\t"+data.customer[i].addressLine1));
            }
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
            },
        error:function(e){
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
        }
    }); 
}

function deleteCustomerRequest(id){
    $.ajax({
        url: url+'/api/xl/customer/delete?id='+id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            porformaSchema=data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for(var i=0;i<data.customer.length;i++){
                $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName+"\t"+data.customer[i].addressLine1));
            }
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
            },
        error:function(e){
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
        }
    }); 
}


$("#customertype").on('change',function(){
    var customer = porformaSchema.customer;
    var obj= customer.filter(function (n){
            return n.id===$("#customertype").val();
        });
        
        if(obj.length>0){
            bootbox.dialog({
                message: "<small><b>Name :</b> "+obj[0].buyerName+"<br>"+
                "<b>ADDRESS :</b> "+obj[0].addressLine1+"<br>"+
                ""+obj[0].addressLine2+"<br>"+
                "<b>STATE :</b> "+obj[0].state+"<br>"+
                "<b>MOBILE : </b>"+obj[0].mobile+"<br>"+
                "<b>GST NUMBER : </b>"+obj[0].gst+"</small>",
                closeButton: false,
                backdrop: true
            });
        }else{
        }
    
                                        
});



function editCustomer(){

    var customer = porformaSchema.customer;
    var obj= customer.filter(function (n){
            return n.id===$("#customertype").val();
        });

    if(obj.length>0){
        
        bootbox.dialog({
            title: "Edit or Delete Customer",
            message: $('#add-template').html(),
            buttons: {
                cancel: {
                    label: "Edit",
                    className: 'btn-success',
                    callback: function(){
                        jsonObj = [];
                        item = {};
                        item ["id"] = $("#customertype").val();
                        item ["buyerName"] = $("#customername").val();
                        item ["addressLine1"] = $("#address1").val();
                        item ["addressLine2"] = $("#address2").val();
                        item ["state"] = $("#state").val();
                        item ["gst"] = $("#gst").val();
                        item ["mobile"] = $("#mobile").val();
                        item ["invoiceNo"] = "";
                        jsonObj.push(item);
                        editCustomerRequest(item);

                        $("#loading").show();
                        $("#maindiv").hide(); $("#maindiv2").hide();
                    }
                },
                noclose: {
                    label: "Delete",
                    className: 'btn-danger',
                    callback: function(){
                        deleteCustomerRequest($("#customertype").val());
                        $("#loading").show();
                        $("#maindiv").hide(); $("#maindiv2").hide();
                    }
                },
                ok: {
                    label: "Cancel",
                    className: 'btn-info',
                    callback: function(){
                    }
                }
            }
        });

        $('#customername','.bootbox').val(obj[0].buyerName);
        $('#state','.bootbox').val(obj[0].state);
        $('#address1','.bootbox').val(obj[0].addressLine1);
        $('#address2','.bootbox').val(obj[0].addressLine2);
        $('#gst','.bootbox').val(obj[0].gst);
        $('#mobile','.bootbox').val(obj[0].mobile);
    }  
}



function addProduct(){
    bootbox.dialog({
        title: "New Product",
        message: $('#prod-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Create",
                className: "btn btn-success text-white",
                callback: function () {
                    item = {};
                    item ["name"] = $("#prodname").val();
                    item ["price"] = $("#prodprice").val();
                    addNewProductRequest(item);

                    $("#loading").show();
                    $("#maindiv").hide(); $("#maindiv2").hide();
                }
            }
        }
    });
}


function addNewProductRequest(json){
    $.ajax({
        url: url+'/api/xl/product/add',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            porformaSchema=data;
            var table='';
            for(var i=0;i<data.products.length;i++){
                                    table+='<tr><th scope="row"><input id="'+data.products[i].id+'" name="'+data.products[i].id+'" type="checkbox"></th>'+
                                                                '<th><input id="name'+data.products[i].id+'" name="name'+data.products[i].id+'" type="text" value="'+data.products[i].name+'"></th>'+
                                                                '<th><input id="price'+data.products[i].id+'" name="price'+data.products[i].id+'" type="number" value="'+data.products[i].price+'"></th>'+
                                                                '<th><input id="quan'+data.products[i].id+'" name="quan'+data.products[i].id+'" type="number" value="1"></th>'+
                                                                '<th><i style="cursor:pointer" onclick="deleteProduct('+data.products[i].id+')" class="bi bi-trash3-fill text-danger">DELETE</i></th></tr>';
            }
            table+='<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML=table;

            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
            },
        error:function(e){
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
        }
    });
}



function deleteProduct(id){
    bootbox.dialog({
        title: "Delete "+$("#name"+id).val(),
        message: 'Are you sure you want to delete this product?',
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Yes! Delete.",
                className: "btn btn-danger text-white",
                callback: function () {
                    $("#maindiv").hide();
                    $("#maindiv2").hide();
                    $("#loading").show();
                    deleteProductRequest(id);
                }
            }
        }
    }); 
}

function deleteProductRequest(id){
    $.ajax({
        url: url+'/api/xl/product/delete?id='+id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            porformaSchema=data;
            var table='';
            for(var i=0;i<data.products.length;i++){
                                    table+='<tr><th scope="row"><input id="'+data.products[i].id+'" name="'+data.products[i].id+'" type="checkbox"></th>'+
                                                                '<th><input id="name'+data.products[i].id+'" name="name'+data.products[i].id+'" type="text" value="'+data.products[i].name+'"></th>'+
                                                                '<th><input id="price'+data.products[i].id+'" name="price'+data.products[i].id+'" type="number" value="'+data.products[i].price+'"></th>'+
                                                                '<th><input id="quan'+data.products[i].id+'" name="quan'+data.products[i].id+'" type="number" value="1"></th>'+
                                                                '<th><i style="cursor:pointer" onclick="deleteProduct('+data.products[i].id+')" class="bi bi-trash3-fill text-danger">DELETE</i></th></tr>';
            }
            table+='<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML=table;
            $("#loading").hide();
            $("#maindiv").show();
            $("#maindiv2").show();
            },
        error:function(e){
            $("#loading").hide();
            $("#maindiv").show();
            $("#maindiv2").show();
        }
    });
}


var count;

function downloadPorforma(){

    var billtype=$("#billtype").val();
    if(billtype===""){
        bootbox.dialog({
            message: "Please Select Bill Type (UP or Other State).",
            closeButton: false,
            backdrop: true
        });

        return false;
    }

    

    if(porformaSchema.upinvoiceNo===null || porformaSchema.upinvoiceNo===undefined){
        porformaSchema.upinvoiceNo=0;
    }

    count=parseInt(porformaSchema.upinvoiceNo)+1;


    // if(billtype==="up"){
        
    // }else{
    //     count=parseInt(porformaSchema.nonupinvoiceNo)+1;
    // }


    var products=[]
    for(var i=0;i<porformaSchema.products.length;i++){
        var id=porformaSchema.products[i].id;
        if(document.getElementById(""+id).checked){
            var item = {};
            item ["id"] = id;
            item ["name"] = $("#name"+id).val();
            item ["price"] = $("#price"+id).val();
            item ["quan"] = $("#quan"+id).val();
            products.push(item);
        }
    }

    if(products.length==0){
        bootbox.dialog({
            message: "Please include some products.",
            closeButton: false,
            backdrop: true
        });

        return false;
    }

    

    var customer = porformaSchema.customer;
    var obj= customer.filter(function (n){
            return n.id===$("#customertype").val();
        });
    
        if(obj.length===0){
            bootbox.dialog({
                message: "Please select customer first.",
                closeButton: false,
                backdrop: true
            });
    
            return false;
        }


        bootbox.dialog({
            title: "Invoice Number",
            message: $('#invoice-template').html(),
            buttons: {
                danger: {
                    label: "Cancel",
                    className: "btn btn-white text-dark"
                },
                success: {
                    label: "Confirm",
                    className: "btn btn-success text-white",
                    callback: function () {

                        var porformaSchema1=[];
                        var item={};
                        item["customer"]=obj;
                        item["products"]=products;
                        item["billDate"]=document.getElementById("invoicedate").value;
                        if(billtype==="up"){
                            item["upinvoiceNo"]=count;
                            item["nonupinvoiceNo"]=count;
                        }else{
                            item["upinvoiceNo"]=count;
                        item["nonupinvoiceNo"]=count;
                        }
                        

                        porformaSchema1.push(item);
                        porformaInvoiceRequest(porformaSchema1,billtype);
                        $("#loading").show();
                        $("#maindiv").hide(); $("#maindiv2").hide();
                    }
                }
            }
        });
    
        
        $('#invoicenumber','.bootbox').val(count);
        document.getElementById('invoicedate').valueAsDate = new Date();
}



function porformaInvoiceRequest(billjson,billtype){
    $.ajax({
        url: url+'/api/xl/bill/download?billtype='+billtype,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(billjson),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
            window.location.href=data.token;
            refresh();
            },
        error:function(e){
            alert(JSON.stringify(e));
            $("#loading").hide();
            $("#maindiv").show(); $("#maindiv2").show();
        }
    });   
}




function doLogout(){
        localStorage.removeItem(currentTokenKey);
        localStorage.removeItem(previousTokenKey);
        window.location.href="/login.html";
}





