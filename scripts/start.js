
var porformaSchema;
var billtype = '';
var userData;

$(document).ready(function () {
    $("#maindiv").hide();
    $("#historyDiv").hide();
    $("#myprogress").show();

    $("#step3").hide();
    $("#maindiv2").hide();

    if (localStorage.getItem("raceuser") !== null && localStorage.getItem("raceuser") !== undefined) {
        document.getElementById("welcometext").innerHTML = "Welcome, " + localStorage.getItem("raceuser");
    } else {
        document.getElementById("welcometext").innerHTML = "Welcome, ";
    }


    if (currentTokenValue == null) {
        localStorage.removeItem(previousTokenKey);
        window.location.href = "/login.html";
    } else {
        refresh();
    }

    var raceuserinfo = JSON.parse(localStorage.getItem("raceuserinfo"));
    var tempdata;
    for (var i = 0; i < raceuserinfo.length; i++) {
        if (raceuserinfo[i].username === localStorage.getItem("raceuser")) {
            tempdata = raceuserinfo[i];
            userData = tempdata;
        }
    }

    if (tempdata === undefined) {
        doLogout();
    }
    var menu = tempdata.accessList;
    document.getElementById("menudiv").innerHTML = '';
    // for (var i = 0; i < menu.length; i++) {
    //     if(menu[i].pageName === 'Admin Dashboard'){
    //         document.getElementById("menudiv").innerHTML += '<li class="nav-item"> <a class="nav-link  text-light" href="' + homeurl + menu[i].pageLink + '">' + 'Dashboard' + '</a></li>';
    //     }
    // }
    document.getElementById("menudiv").innerHTML += '<li class="nav-item active"><div class="nav-link  text-light" style="cursor: pointer;" onclick="doLogout()">Logout</div></li>';
});

function refresh() {
    $.ajax({
        url: url + '/api/xl/load',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for (var i = 0; i < porformaSchema.customer.length; i++) {
                $("#customertype").append($("<option />").val(porformaSchema.customer[i].id).text(porformaSchema.customer[i].buyerName + "\t" + porformaSchema.customer[i].addressLine1));
            }
            var table = '';
            for (var i = 0; i < data.products.length; i++) {
                table += '<tr><th scope="row"><input id="' + data.products[i].id + '" name="' + data.products[i].id + '" type="checkbox"></th>' +
                    '<th><input id="name' + data.products[i].id + '" name="name' + data.products[i].id + '" type="text" value="' + data.products[i].name + '"></th>' +
                    '<th><input id="price' + data.products[i].id + '" name="price' + data.products[i].id + '" type="number" value="' + data.products[i].price + '"></th>' +
                    '<th><input id="quan' + data.products[i].id + '" name="quan' + data.products[i].id + '" type="number" value="1"></th>' +
                    '<th><button onclick="deleteProduct(' + data.products[i].id + ')" class="btn text-danger align-text-top">DELETE</button></th></tr>';
            }
            table += '<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML = table;
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        },
        error: function (e) {

        }
    });
}



function addNewCustomer() {
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
                    item["buyerName"] = $("#customername").val();
                    item["addressLine1"] = $("#address1").val();
                    item["addressLine2"] = $("#address2").val();
                    item["state"] = $("#state").val();
                    item["gst"] = $("#gst").val();
                    item["mobile"] = $("#mobile").val();
                    item["invoiceNo"] = "";
                    jsonObj.push(item);
                    addNewCustomerRequest(item);

                    $("#maindiv").hide(); ;
                    $("#myprogress").show();
                }
            }
        }
    });

}


function addNewCustomerRequest(customerjson) {
    $.ajax({
        url: url + '/api/xl/customer/add',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(customerjson),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for (var i = 0; i < data.customer.length; i++) {
                $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName + "\t" + data.customer[i].addressLine1));
            }
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        }
    });
}

function editCustomerRequest(customerjson) {
    $.ajax({
        url: url + '/api/xl/customer/edit',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(customerjson),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for (var i = 0; i < data.customer.length; i++) {
                $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName + "\t" + data.customer[i].addressLine1));
            }
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        }
    });
}

function deleteCustomerRequest(id) {
    $.ajax({
        url: url + '/api/xl/customer/delete?id=' + id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
            for (var i = 0; i < data.customer.length; i++) {
                $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName + "\t" + data.customer[i].addressLine1));
            }
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        }
    });
}


$("#customertype").on('change', function () {
    var customer = porformaSchema.customer;
    var obj = customer.filter(function (n) {
        return n.id === $("#customertype").val();
    });

    if (obj.length > 0) {
        bootbox.dialog({
            message: "<small><b>Name :</b> " + obj[0].buyerName + "<br>" +
                "<b>ADDRESS :</b> " + obj[0].addressLine1 + "<br>" +
                "" + obj[0].addressLine2 + "<br>" +
                "<b>STATE :</b> " + obj[0].state + "<br>" +
                "<b>MOBILE : </b>" + obj[0].mobile + "<br>" +
                "<b>GST NUMBER : </b>" + obj[0].gst + "</small>",
            closeButton: false,
            backdrop: true
        });
    } else {
    }


});



function editCustomer() {

    var customer = porformaSchema.customer;
    var obj = customer.filter(function (n) {
        return n.id === $("#customertype").val();
    });

    if (obj.length > 0) {

        bootbox.dialog({
            title: "Edit or Delete Customer",
            message: $('#add-template').html(),
            buttons: {
                cancel: {
                    label: "Edit",
                    className: 'btn-success',
                    callback: function () {
                        jsonObj = [];
                        item = {};
                        item["id"] = $("#customertype").val();
                        item["buyerName"] = $("#customername").val();
                        item["addressLine1"] = $("#address1").val();
                        item["addressLine2"] = $("#address2").val();
                        item["state"] = $("#state").val();
                        item["gst"] = $("#gst").val();
                        item["mobile"] = $("#mobile").val();
                        item["invoiceNo"] = "";
                        jsonObj.push(item);
                        editCustomerRequest(item);

                        $("#myprogress").show();
                        $("#maindiv").hide(); ;
                    }
                },
                noclose: {
                    label: "Delete",
                    className: 'btn-danger',
                    callback: function () {
                        deleteCustomerRequest($("#customertype").val());
                        $("#myprogress").show();
                        $("#maindiv").hide(); ;
                    }
                },
                ok: {
                    label: "Cancel",
                    className: 'btn-info',
                    callback: function () {
                    }
                }
            }
        });

        $('#customername', '.bootbox').val(obj[0].buyerName);
        $('#state', '.bootbox').val(obj[0].state);
        $('#address1', '.bootbox').val(obj[0].addressLine1);
        $('#address2', '.bootbox').val(obj[0].addressLine2);
        $('#gst', '.bootbox').val(obj[0].gst);
        $('#mobile', '.bootbox').val(obj[0].mobile);
    }
}



function addProduct() {
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
                    item["name"] = $("#prodname").val();
                    item["price"] = $("#prodprice").val();
                    addNewProductRequest(item);

                    $("#myprogress").show();
                    $("#maindiv").hide(); ;
                }
            }
        }
    });
}


function addNewProductRequest(json) {
    $.ajax({
        url: url + '/api/xl/product/add',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(json),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            porformaSchema = data;
            var table = '';
            for (var i = 0; i < data.products.length; i++) {
                table += '<tr><th scope="row"><input id="' + data.products[i].id + '" name="' + data.products[i].id + '" type="checkbox"></th>' +
                    '<th><input id="name' + data.products[i].id + '" name="name' + data.products[i].id + '" type="text" value="' + data.products[i].name + '"></th>' +
                    '<th><input id="price' + data.products[i].id + '" name="price' + data.products[i].id + '" type="number" value="' + data.products[i].price + '"></th>' +
                    '<th><input id="quan' + data.products[i].id + '" name="quan' + data.products[i].id + '" type="number" value="1"></th>' +
                    '<th><button onclick="deleteProduct(' + data.products[i].id + ')" class="btn text-danger align-text-top">DELETE</button></th></tr>';
            }
            table += '<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML = table;

            $("#myprogress").hide();
            $("#maindiv").show(); ;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        }
    });
}



function deleteProduct(id) {
    bootbox.dialog({
        title: "Delete " + $("#name" + id).val(),
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
                    ;
                    $("#myprogress").show();
                    deleteProductRequest(id);
                }
            }
        }
    });
}

function deleteProductRequest(id) {
    $.ajax({
        url: url + '/api/xl/product/delete?id=' + id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            porformaSchema = data;
            var table = '';
            for (var i = 0; i < data.products.length; i++) {
                table += '<tr><th scope="row"><input id="' + data.products[i].id + '" name="' + data.products[i].id + '" type="checkbox"></th>' +
                    '<th><input id="name' + data.products[i].id + '" name="name' + data.products[i].id + '" type="text" value="' + data.products[i].name + '"></th>' +
                    '<th><input id="price' + data.products[i].id + '" name="price' + data.products[i].id + '" type="number" value="' + data.products[i].price + '"></th>' +
                    '<th><input id="quan' + data.products[i].id + '" name="quan' + data.products[i].id + '" type="number" value="1"></th>' +
                    '<th><button onclick="deleteProduct(' + data.products[i].id + ')" class="btn text-danger align-text-top">DELETE</button></th></tr>';
            }
            table += '<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML = table;
            $("#myprogress").hide();
            $("#maindiv").show();
            ;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show();
            ;
        }
    });
}


var count;

function downloadPorforma(emailThisPorforma) {

    var billtype = $("#billtype").val();
    if (billtype === "") {
        bootbox.dialog({
            message: "Please Select Bill Type (UP or Other State).",
            closeButton: false,
            backdrop: true
        });

        return false;
    }



    if (porformaSchema.upinvoiceNo === null || porformaSchema.upinvoiceNo === undefined) {
        porformaSchema.upinvoiceNo = 0;
    }
    if (porformaSchema.nonupinvoiceNo === null || porformaSchema.nonupinvoiceNo === undefined) {
        porformaSchema.nonupinvoiceNo = 0;
    }

    if (porformaSchema.upinvoiceNo >= porformaSchema.nonupinvoiceNo) {
        count = parseInt(porformaSchema.upinvoiceNo) + 1;
    } else {
        count = parseInt(porformaSchema.nonupinvoiceNo) + 1;
    }

    var lastinvno =  localStorage.getItem("lastinvno");
    if(count === lastinvno){
        count = lastinvno+1;
    }

    var products = []
    for (var i = 0; i < porformaSchema.products.length; i++) {
        var id = porformaSchema.products[i].id;
        if (document.getElementById("" + id).checked) {
            var item = {};
            item["id"] = id;
            item["name"] = $("#name" + id).val();
            item["price"] = $("#price" + id).val();
            item["quan"] = $("#quan" + id).val();
            products.push(item);
        }
    }

    if (products.length == 0) {
        bootbox.dialog({
            message: "Please include some products.",
            closeButton: false,
            backdrop: true
        });

        return false;
    }



    var customer = porformaSchema.customer;
    var obj = customer.filter(function (n) {
        return n.id === $("#customertype").val();
    });

    if (obj.length === 0) {
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

                    var porformaSchema1 = [];
                    var item = {};
                    item["customer"] = obj;
                    item["products"] = products;
                    item["billDate"] = document.getElementById("invoicedate").value;



                    if (billtype === "up") {
                        item["upinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                        item["nonupinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                    } else {
                        item["upinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                        item["nonupinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                    }
                    localStorage.setItem("lastinvno",$('#invoicenumber', '.bootbox').val());
                    porformaSchema1.push(item);

                    if (emailThisPorforma !== undefined) {
                        emailPorforma(porformaSchema1, billtype);
                    } else {

                        porformaInvoiceRequest(porformaSchema1, billtype);
                        $("#myprogress").show();
                        $("#maindiv").hide(); ;
                    }
                }
            }
        }
    });


    $('#invoicenumber', '.bootbox').val(count);
    document.getElementById('invoicedate').valueAsDate = new Date();
}



function porformaInvoiceRequest(billjson, billtype) {
    $.ajax({
        url: url + '/api/xl/bill/download?billtype=' + billtype,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(billjson),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            window.location.href = data.token;
            refresh();
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        }
    });
}




function emailPorforma(porformaSchema1, billtype) {
    var box = bootbox.dialog({
        title: "Email",
        message: $('#sendEmail-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Confirm",
                className: "btn btn-success text-white",
                callback: function () {
                    // var mailinglist = [];
                    // if (localStorage.getItem("mailinglist") !== undefined && localStorage.getItem("mailinglist") !== null && localStorage.getItem("mailinglist") !== '') {
                    //     mailinglist = JSON.parse("["+JSON.stringify(localStorage.getItem("mailinglist"))+"]");
                    // } 

                    // if($("#sendTo").val() === null || $("#sendTo").val() === undefined){
                    //     alert("provide an email address.");
                    //     return false;
                    // }
                    // var finallist = mailinglist.concat(JSON.parse($("#sendTo").val()));
                    // function onlyUnique(value, index, self) {
                    //     return self.indexOf(value) === index;
                    // }
                    // localStorage.setItem("mailinglist", finallist.filter(onlyUnique));
                    localStorage.setItem("lastusedemail", $("#sendTo").val());

                    if($("#sendTo").val() === null || $("#sendTo").val() === undefined ||  $("#sendTo").val()==="" ){
                        bootbox.dialog({
                            message: "Please provide email address.",
                            closeButton: false,
                            backdrop: true
                        });
                        return false;
                    }else{
                        emailPorformaAjax(porformaSchema1,billtype,$("#sendTo").val(), $("#sendToSubject").val(),$("#sendToMessage").val());
                        $("#myprogress").show();
                        $("#maindiv").hide(); ;
                    }
                    
                }
            }
        }
    });


    var lastusedemail = localStorage.getItem("lastusedemail");
    if(lastusedemail===null || lastusedemail===undefined){
        lastusedemail=userData.email;
    }

    $("#sendTo").val(lastusedemail);
    $("#sendToSubject").val("Invoice " + porformaSchema1[0].upinvoiceNo + " from Racekon");
    $("#sendToMessage").val("Please find attached.");
}


function emailPorformaAjax(porformaSchema1,billtype,sendTo,sendToSubject,sendToMessage){
    var myschema={};
    myschema["sendTo"] = sendTo;
    myschema["sendToSubject"] = sendToSubject;
    myschema["sendToMessage"] = sendToMessage;
    myschema["schema"] = porformaSchema1[0];
    
    $.ajax({
        url: url + '/api/mail/bill?billtype=' + billtype,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(myschema),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            goToStep(1);
            refresh();
        },
        error: function (e) {
            bootbox.dialog({
                message: "Failed to send Email.",
                closeButton: false,
                backdrop: true
            });
            $("#myprogress").hide();
            $("#maindiv").show(); ;
        }
    });
}


function goToStep(step){
    
    if(step === 1){
        $("#step1").show();
        $("#maindiv2").hide();
        $("#step3").hide();
        document.getElementById("step1sign").innerHTML='<i class="bi bi-circle-fill" style="font-size: 20px;"></i>';
        document.getElementById("step2sign").innerHTML='<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("step3sign").innerHTML='<i class="bi bi-circle" style="font-size: 20px;"></i>';
        $("#step2sign").removeClass('border-dark');
        $("#step3sign").removeClass('border-dark');
        $("#step1sign").addClass('border-dark');
    }else if(step === 2){
        $("#step1").hide();
        $("#maindiv2").show();
        $("#step3").hide();
        document.getElementById("step2sign").innerHTML='<i class="bi bi-circle-fill" style="font-size: 20px;"></i>';
        document.getElementById("step1sign").innerHTML='<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("step3sign").innerHTML='<i class="bi bi-circle" style="font-size: 20px;"></i>';
        $("#step1sign").removeClass('border-dark');
        $("#step3sign").removeClass('border-dark');
        $("#step2sign").addClass('border-dark');
    }else if(step === 3){
        $("#step1").hide();
        $("#maindiv2").hide();
        $("#step3").show();
        $("#step2sign").removeClass('border-dark');
        $("#step1sign").removeClass('border-dark');
        $("#step3sign").addClass('border-dark');
        document.getElementById("step3sign").innerHTML='<i class="bi bi-circle-fill" style="font-size: 20px;"></i>';
        document.getElementById("step2sign").innerHTML='<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("step1sign").innerHTML='<i class="bi bi-circle" style="font-size: 20px;"></i>';
    }

}





function doLogout() {
    localStorage.removeItem(currentTokenKey);
    localStorage.removeItem(previousTokenKey);
    window.location.href = "/login.html";
}

var toggle = false;

function showHistory(tabname) {
    var history = porformaSchema.history;
    $("#dbillnavtext").toggleClass('active');
    $("#billnavtext").toggleClass('active');
    $("#dbillnavtext").toggleClass('border-dark');
    $("#billnavtext").toggleClass('border-dark');
    document.getElementById("historyCountLabel").innerHTML='&nbsp;of '+history.length+' records';
    document.getElementById("historyBody").innerHTML = "";
    if (!toggle) {
        $("#maindiv").hide();
        $("#historyDiv").show();
        var count = 0;
        for (var i = porformaSchema.history.length - 1; i >= 0 && count < 5; i--) {
            count++;
            var customer = history[i].customer[0];
            document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ondblclick="historyInfo(' + i + ')" onclick="historyInfo(' + i + ')"><td>' + history[i].invoiceNumber + '</td><td>' + customer.buyerName + '</td><td>' + new Date(history[i].billDate).toUTCString().substring(0, 17) + '</td></tr>';
        }
        toggle = true;
    } else {
        $("#maindiv").show();
        $("#historyDiv").hide();
        toggle = false;
    }

}


var toggle2 = false;

function historyInfo(index) {
    var json = porformaSchema.history[index];
    if (!toggle2) {
        var customer = json.customer;
        var products = json.products;
        var productStr = '<table class="table table-responsive table-hover ">';
        productStr += "<thead class='table-info table-bordered'><th>#</th><th>Name</th><th>Price</th><th>Quantity</th></thead><tbody>";
        for (var i = 0; i < products.length; i++) {
            productStr += "<tr><th>" + (i + 1) + "</th><th>" + products[i].name + "</th><th>" + products[i].price + "</th><th>" + products[i].quan + "</th></tr>";
        }
        productStr += '</tbody></table>';
        if (customer.length > 0) {
            bootbox.dialog({
                message: "<small><b>Name :</b> " + customer[0].buyerName + "<br>" +
                    "<b>ADDRESS :</b> " + customer[0].addressLine1 + "<br>" +
                    "" + customer[0].addressLine2 + "<br>" +
                    "<b>STATE :</b> " + customer[0].state + "<br>" +
                    "<b>MOBILE : </b>" + customer[0].mobile + "<br>" +
                    "<b>GST NUMBER : </b>" + customer[0].gst + "</small><br>" +
                    productStr,
                    //'<button class="btn bg-info text-light" onclick="sendAsEmail(' + index + ')">Send As Email</button>',
                closeButton: false,
                backdrop: true
            });
        } else {
        }
        toggle2 = true;
    } else {
        toggle2 = false;
    }

}



function makeSelection() {
    if (document.getElementById("selectAll").checked) {
        for (var i = 0; i < porformaSchema.products.length; i++) {
            var id = porformaSchema.products[i].id;
            document.getElementById("" + id).checked = true;
        }
    } else {
        for (var i = 0; i < porformaSchema.products.length; i++) {
            var id = porformaSchema.products[i].id;
            document.getElementById("" + id).checked = false;
        }
    }
}


$("#showCountSelect").change(function () {
    var showCount = $("#showCountSelect").val();

    var history = porformaSchema.history;
    document.getElementById("historyBody").innerHTML = "";
    var count = 0;
    for (var i = porformaSchema.history.length - 1; i >= 0 && count < showCount; i--) {
        count++;
        var customer = history[i].customer[0];
        document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ondblclick="historyInfo(' + i + ')" onclick="historyInfo(' + i + ')"><td>' + history[i].invoiceNumber + '</td><td>' + customer.buyerName + '</td><td>' + new Date(history[i].billDate).toUTCString().substring(0, 17) + '</td></tr>';
    }

});


// function clearHistory(){
//     bootbox.dialog({
//         title: "Delete " + JSON.stringify(porformaSchema.history.length)+" History Items",
//         message: 'These items can not be recovered after deleting.',
//         buttons: {
//             danger: {
//                 label: "Cancel",
//                 className: "btn btn-white text-dark"
//             },
//             success: {
//                 label: "Yes! Clear.",
//                 className: "btn btn-danger text-white",
//                 callback: function () {
//                     $("#maindiv").hide();
//                     $("#myprogress").show();
//                     clearHistoryAjax();
//                 }
//             }
//         }
//     });
// }


// function clearHistoryAjax(){
//     $.ajax({
//         url: url + '/api/xl/customer/delete?id=' + id,
//         type: 'DELETE',
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
//         },
//         success: function (data) {
//             porformaSchema = data;
//             $('#customertype').empty().append('<option selected value="">Select Customer and Address</option>')
//             for (var i = 0; i < data.customer.length; i++) {
//                 $("#customertype").append($("<option />").val(data.customer[i].id).text(data.customer[i].buyerName + "\t" + data.customer[i].addressLine1));
//             }
//             $("#myprogress").hide();
//             $("#maindiv").show(); ;
//         },
//         error: function (e) {
//             $("#myprogress").hide();
//             $("#maindiv").show(); ;
//         }
//     });
// }


