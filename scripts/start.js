
var porformaSchema;
var billtype = '';
var userData;
var historyData;

/*********DEFAULT MANAGEMENT ************/

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
    document.getElementById("menudiv").innerHTML += '<li class="nav-item active"><div class="nav-link  text-light" style="cursor: pointer;" onclick="doLogout()">Logout</div></li>';
    getHistoryDataAjax2();
});

function refresh() {
    $.ajax({
        url: url + '/api/xl/load',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            data.products.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            data.customer.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">None Selected</option>')
            for (var i = 0; i < porformaSchema.customer.length; i++) {
                $("#customertype").append($("<option />").val(porformaSchema.customer[i].id).text(porformaSchema.customer[i].buyerName));
            }
            var table = '';
           
            for (var i = 0; i < data.products.length; i++) {
                table += '<tr><th scope="row"><input id="' + data.products[i].id + '" name="' + data.products[i].id + '" type="checkbox"  onclick="productCheckbox()"></th>' +
                    '<th><input id="name' + data.products[i].id + '" name="name' + data.products[i].id + '" type="text" value="' + data.products[i].name + '" onchange="productCheckbox()"></th>' +
                    '<th><input id="price' + data.products[i].id + '" name="price' + data.products[i].id + '" type="number" value="' + data.products[i].price + '"  onchange="productCheckbox()"></th>' +
                    '<th><input id="quan' + data.products[i].id + '" name="quan' + data.products[i].id + '" type="number" value="1"  onchange="productCheckbox()"></th>' +
                    '<th><button onclick="deleteProduct(' + data.products[i].id + ')" class="btn text-danger align-text-top">DELETE</button></th></tr>';
            }
            table += '<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML = table;
            document.getElementById("summary").innerHTML = summaryInfo();
            $("#myprogress").hide();
            $("#maindiv").show();;
        },
        error: function (e) {

        }
    });
}






























/*********STEP 1 MANAGEMENT ************/


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

                    $("#maindiv").hide();;
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
            data.products.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            data.customer.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });
            
            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">None Selected</option>')
            for (var i = 0; i < porformaSchema.customer.length; i++) {
                $("#customertype").append($("<option />").val(porformaSchema.customer[i].id).text(porformaSchema.customer[i].buyerName));
            }
            document.getElementById("summary").innerHTML = summaryInfo();
            $("#myprogress").hide();
            $("#maindiv").show();;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show();;
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
            data.products.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            data.customer.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });
            

            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">None Selected</option>')
            for (var i = 0; i < porformaSchema.customer.length; i++) {
                $("#customertype").append($("<option />").val(porformaSchema.customer[i].id).text(porformaSchema.customer[i].buyerName));
            }
            document.getElementById("summary").innerHTML = summaryInfo();
            $("#myprogress").hide();
            $("#maindiv").show();;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show();;
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
            data.products.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            data.customer.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });
            
            porformaSchema = data;
            $('#customertype').empty().append('<option selected value="">None Selected</option>')
            for (var i = 0; i < porformaSchema.customer.length; i++) {
                $("#customertype").append($("<option />").val(porformaSchema.customer[i].id).text(porformaSchema.customer[i].buyerName));
            }
            document.getElementById("summary").innerHTML = summaryInfo();
            $("#myprogress").hide();
            $("#maindiv").show();;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show();;
        }
    });
}


$("#customertype").on('change', function () {
    // var customer = porformaSchema.customer;
    // var obj = customer.filter(function (n) {
    //     return n.id === $("#customertype").val();
    // });

    // if (obj.length > 0) {
    //     bootbox.dialog({
    //         message: "<small><b>Name :</b> " + obj[0].buyerName + "<br>" +
    //             "<b>ADDRESS :</b> " + obj[0].addressLine1 + "<br>" +
    //             "" + obj[0].addressLine2 + "<br>" +
    //             "<b>STATE :</b> " + obj[0].state + "<br>" +
    //             "<b>MOBILE : </b>" + obj[0].mobile + "<br>" +
    //             "<b>GST NUMBER : </b>" + obj[0].gst + "</small>",
    //         closeButton: false,
    //         backdrop: true
    //     });
    // } else {
    // }

    document.getElementById("summary").innerHTML = summaryInfo();


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
                        $("#maindiv").hide();;
                    }
                },
                noclose: {
                    label: "Delete",
                    className: 'btn-danger',
                    callback: function () {
                        deleteCustomerRequest($("#customertype").val());
                        $("#myprogress").show();
                        $("#maindiv").hide();;
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































/*********STEP 2 MANAGEMENT ************/

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
                    $("#maindiv").hide();;
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
            data.products.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            data.customer.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });
            porformaSchema = data;
            var table = '';
            for (var i = 0; i < data.products.length; i++) {
                table += '<tr><th scope="row"><input id="' + data.products[i].id + '" name="' + data.products[i].id + '" type="checkbox"  onclick="productCheckbox()"></th>' +
                    '<th><input id="name' + data.products[i].id + '" name="name' + data.products[i].id + '" type="text" value="' + data.products[i].name + '"  onchange="productCheckbox()"></th>' +
                    '<th><input id="price' + data.products[i].id + '" name="price' + data.products[i].id + '" type="number" value="' + data.products[i].price + '"  onchange="productCheckbox()"></th>' +
                    '<th><input id="quan' + data.products[i].id + '" name="quan' + data.products[i].id + '" type="number" value="1"  onchange="productCheckbox()"></th>' +
                    '<th><button onclick="deleteProduct(' + data.products[i].id + ')" class="btn text-danger align-text-top">DELETE</button></th></tr>';
            }
            table += '<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML = table;
            document.getElementById("summary").innerHTML = summaryInfo();
            $("#myprogress").hide();
            $("#maindiv").show();;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#maindiv").show();;
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
            data.products.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            data.customer.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });

            porformaSchema = data;
            var table = '';
            for (var i = 0; i < data.products.length; i++) {
                table += '<tr><th scope="row"><input id="' + data.products[i].id + '" name="' + data.products[i].id + '" type="checkbox" onclick="productCheckbox()"></th>' +
                    '<th><input id="name' + data.products[i].id + '" name="name' + data.products[i].id + '" type="text" value="' + data.products[i].name + '"  onchange="productCheckbox()"></th>' +
                    '<th><input id="price' + data.products[i].id + '" name="price' + data.products[i].id + '" type="number" value="' + data.products[i].price + '"  onchange="productCheckbox()"></th>' +
                    '<th><input id="quan' + data.products[i].id + '" name="quan' + data.products[i].id + '" type="number" value="1"  onchange="productCheckbox()"></th>' +
                    '<th><button onclick="deleteProduct(' + data.products[i].id + ')" class="btn text-danger align-text-top">DELETE</button></th></tr>';
            }
            table += '<tr> <th scope="row"><i style="font-size: 30px;" class="bi bi-plus-circle" onclick="addProduct()"></i></th> <td></td> <td></td> <td></td> </tr>';
            document.getElementById("tablebody").innerHTML = table;
            document.getElementById("summary").innerHTML = summaryInfo();
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
    document.getElementById("summary").innerHTML = summaryInfo();
}






























/************* STEP 3 MANAGEMENT ******************/

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

    var lastinvno = localStorage.getItem("lastinvno");
    if(lastinvno !== undefined || lastinvno !== null || lastinvno !== ""){
        if(parseInt(lastinvno)>=count){
         count = parseInt(lastinvno)+1;
        }
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

                    var test = historyData;
                    var existInHistory = false;
                    for(str in test){
                        var invoicenum = test[str].replace("invoice","").replace(".pdf","");
                        if((invoicenum)=== $('#invoicenumber', '.bootbox').val()){
                            existInHistory = true;
                            bootbox.dialog({
                                message: '<label class="text-danger">invoice with this number already exist in history.</label>',
                                closeButton: false,
                                backdrop: true
                            });
                        }
                    }
                
                    if(existInHistory){
                        return false;
                    }

                    if (billtype === "up") {
                        item["upinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                        item["nonupinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                    } else {
                        item["upinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                        item["nonupinvoiceNo"] = $('#invoicenumber', '.bootbox').val();
                    }
                    localStorage.setItem("lastinvno", $('#invoicenumber', '.bootbox').val());
                    porformaSchema1.push(item);
                    
                    if (emailThisPorforma !== undefined) {
                        emailPorforma(porformaSchema1, billtype);
                    } else {

                        porformaInvoiceRequest(porformaSchema1, billtype);
                        $("#myprogress").show();
                        $("#maindiv").hide();;
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
            setTimeout(function(){ getHistoryDataAjax2(); }, 5000);
        },
        error: function (e) {
            document.getElementById("summary").innerHTML = summaryInfo();
            $("#myprogress").hide();
            $("#maindiv").show();;
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
                    localStorage.setItem("lastusedemail", $("#sendTo").val());

                    if ($("#sendTo").val() === null || $("#sendTo").val() === undefined || $("#sendTo").val() === "") {
                        bootbox.dialog({
                            message: "Please provide email address.",
                            closeButton: false,
                            backdrop: true
                        });
                        return false;
                    } else {
                        emailPorformaAjax(porformaSchema1, billtype, $("#sendTo").val(), $("#sendToSubject").val(), $("#sendToMessage").val());
                        $("#myprogress").show();
                        $("#maindiv").hide();;
                    }

                }
            }
        }
    });


    var lastusedemail = localStorage.getItem("lastusedemail");
    if (lastusedemail === null || lastusedemail === undefined) {
        lastusedemail = userData.email;
    }

    $("#sendTo").val(lastusedemail);
    $("#sendToSubject").val("Invoice " + porformaSchema1[0].upinvoiceNo + " from Racekon");
    $("#sendToMessage").val("Please find attached.");
}


function emailPorformaAjax(porformaSchema1, billtype, sendTo, sendToSubject, sendToMessage) {
    var myschema = {};
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
            setTimeout(function(){ getHistoryDataAjax2(); }, 5000);
        },
        error: function (e) {
            document.getElementById("summary").innerHTML = summaryInfo();
            bootbox.dialog({
                message: "Failed to send Email.",
                closeButton: false,
                backdrop: true
            });
            $("#myprogress").hide();
            $("#maindiv").show();;
        }
    });
}


function goToStep(step) {

    if (step === 1) {
        $("#step1").show();
        $("#maindiv2").hide();
        $("#step3").hide();
        document.getElementById("step1sign").innerHTML = '<i class="bi bi-circle-fill" style="font-size: 20px;"></i>';
        document.getElementById("step2sign").innerHTML = '<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("step3sign").innerHTML = '<i class="bi bi-circle" style="font-size: 20px;"></i>';
        $("#step2sign").removeClass('border-dark');
        $("#step3sign").removeClass('border-dark');
        $("#step1sign").addClass('border-dark');
        document.getElementById("summary").innerHTML = summaryInfo();
    } else if (step === 2) {
        $("#step1").hide();
        $("#maindiv2").show();
        $("#step3").hide();
        document.getElementById("step2sign").innerHTML = '<i class="bi bi-circle-fill" style="font-size: 20px;"></i>';
        document.getElementById("step1sign").innerHTML = '<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("step3sign").innerHTML = '<i class="bi bi-circle" style="font-size: 20px;"></i>';
        $("#step1sign").removeClass('border-dark');
        $("#step3sign").removeClass('border-dark');
        $("#step2sign").addClass('border-dark');
        document.getElementById("summary").innerHTML = summaryInfo();
    } else if (step === 3) {
        $("#step1").hide();
        $("#maindiv2").hide();
        $("#step3").show();
        $("#step2sign").removeClass('border-dark');
        $("#step1sign").removeClass('border-dark');
        $("#step3sign").addClass('border-dark');
        document.getElementById("step3sign").innerHTML = '<i class="bi bi-circle-fill" style="font-size: 20px;"></i>';
        document.getElementById("step2sign").innerHTML = '<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("step1sign").innerHTML = '<i class="bi bi-circle" style="font-size: 20px;"></i>';
        document.getElementById("summary").innerHTML = summaryInfo();
    }

}



function productCheckbox(){
    document.getElementById("summary").innerHTML = summaryInfo();
}

function summaryInfo() {
  
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
        var productStr = '<table class="table table-responsive table-hover ">';
        productStr += "<thead class='table-info table-bordered'><th>#</th><th>Name</th><th>Price</th><th>Quantity</th></thead><tbody>";
        for (var i = 0; i < products.length; i++) {
            productStr += "<tr><th>" + (i + 1) + "</th><th>" + products[i].name + "</th><th>" + products[i].price + "</th><th>" + products[i].quan + "</th></tr>";
        }
        productStr += '</tbody></table>';
        
        var customer = porformaSchema.customer;
        var customerStr = '';
        
    var obj = customer.filter(function (n) {
        return n.id === $("#customertype").val();
    });

    if($("#customertype").val() !== ""){
       customerStr += "<small><b>Name :</b> " + obj[0].buyerName + "<br>" +
                "<b>ADDRESS :</b> " + obj[0].addressLine1 + "<br>" +
                "" + obj[0].addressLine2 + "<br>" +
                "<b>STATE :</b> " + obj[0].state + "<br>" +
                "<b>MOBILE : </b>" + obj[0].mobile + "<br>" +
                "<b>GST NUMBER : </b>" + obj[0].gst + "</small><br>";
    }

    if(customerStr.length === 0){
        customerStr='';
    }
    if(productStr.length === 177){
        productStr='';
    }

    if((customerStr.length+productStr.length) === 0){
        return 'No Customer or Product Selected.';
    }

    return customerStr + productStr;

}



function doLogout() {
    localStorage.removeItem(currentTokenKey);
    localStorage.removeItem(previousTokenKey);
    window.location.href = "/login.html";
}
































/************* HISTORY MANAGEMENT ******************/

var toggle = false;

function showHistory(tabname) {
    var history = porformaSchema.history;
    $("#dbillnavtext").toggleClass('active');
    $("#billnavtext").toggleClass('active');
    $("#dbillnavtext").toggleClass('border-dark');
    $("#billnavtext").toggleClass('border-dark');
    document.getElementById("historyBody").innerHTML = "";
    if (!toggle) {
        toggle = true;
        $("#maindiv").hide();
        $("#historyDiv").show();
       // $("#myprogress").show();
        //getHistoryDataAjax();
        var data=historyData;
        if(historyData === null || historyData === undefined){
            data = [];
        }
        document.getElementById("historyCountLabel").innerHTML = '&nbsp;of ' + data.length + ' records';
            var count = 0;
            for (var i = data.length - 1; i >= 0 && count < 5; i--) {
                count++;
                document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ><td><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + data[i] + '</td><td>' + ' <div class="dropdown"> <button class="btn btn-white text-dark" type="button"  onclick="viewHistoryItem(\'' + data[i] + '\')" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> View </button> </div></td></tr>';
            }
    } else {
        $("#maindiv").show();
        $("#historyDiv").hide();
        toggle = false;
    }

}


function getHistoryDataAjax() {

    $.ajax({
        url: url + '/api/xl/history',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            historyData = data;
            document.getElementById("historyCountLabel").innerHTML = '&nbsp;of ' + data.length + ' records';
            var count = 0;
            for (var i = data.length - 1; i >= 0 && count < 5; i--) {
                count++;
                document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ><td><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + data[i] + '</td><td>' + ' <div class="dropdown"> <button class="btn btn-white text-dark" type="button"  onclick="viewHistoryItem(\'' + data[i] + '\')" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> View </button> </div></td></tr>';
            }
            $("#myprogress").hide();
            $("#historyDiv").show();;
        },
        error: function (e) {
            $("#myprogress").hide();
            $("#historyDiv").show();;
        }
    });

}


function getHistoryDataAjax2() {

    $.ajax({
        url: url + '/api/xl/history',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            historyData = data;
            document.getElementById("historyCountLabel").innerHTML = '&nbsp;of ' + data.length + ' records';
            document.getElementById("historyBody").innerHTML='';
            var count = 0;
            for (var i = data.length - 1; i >= 0 && count < 5; i--) {
                count++;
                document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ><td><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + data[i] + '</td><td>' + ' <div class="dropdown"> <button class="btn btn-white text-dark" type="button"  onclick="viewHistoryItem(\'' + data[i] + '\')" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> View </button> </div></td></tr>';
            }
        },
        error: function (e) {
        }
    });

}



$("#showCountSelect").change(function () {
    var showCount = $("#showCountSelect").val();

    document.getElementById("historyBody").innerHTML = "";
    var data = historyData;
    var count = 0;
    for (var i = data.length - 1; i >= 0 && count < showCount; i--) {
        count++;
        document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ><td><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + data[i] + '</td><td>' + ' <div class="dropdown"> <button class="btn btn-white text-dark" type="button"  onclick="viewHistoryItem(\'' + data[i] + '\')" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> View </button> </div></td></tr>';
    }

});


function deleteHistoryItem(item) {
    bootbox.dialog({
        title: "Delete " + item,
        message: 'Are you sure you want to delete this History Item?',
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Yes! Delete.",
                className: "btn btn-danger text-white",
                callback: function () {
                    deleteHistoryItemAjax(item);
                }
            }
        }
    });
}


function deleteHistoryItemAjax(item) {
    $('.btn').addClass('disabled');
    $("#myprogress").show();
    $.ajax({
        url: url + '/api/xl/history/delete?invoicename=' + item,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            $('.btn').removeClass('disabled');
            historyData = data;
            document.getElementById("historyCountLabel").innerHTML = '&nbsp;of ' + data.length + ' records';
            var count = 0;
            document.getElementById("historyBody").innerHTML = '';
            for (var i = data.length - 1; i >= 0 && count < 5; i--) {
                count++;
                document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ><td><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + data[i] + '</td><td>' + ' <div class="dropdown"> <button class="btn btn-white text-dark" type="button"  onclick="viewHistoryItem(\'' + data[i] + '\')" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> View </button> </div></td></tr>';
            }
            $("#myprogress").hide();
        },
        error: function (e) {
            $('.btn').removeClass('disabled');
            $("#myprogress").hide();
        }
    });
}

function emailHistoryItem(item) {
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
                    localStorage.setItem("lastusedemail", $("#sendTo").val());

                    if ($("#sendTo").val() === null || $("#sendTo").val() === undefined || $("#sendTo").val() === "") {
                        bootbox.dialog({
                            message: "Please provide email address.",
                            closeButton: false,
                            backdrop: true
                        });
                        return false;
                    } else {
                        $("#myprogress").show();
                        emailHistoryAjax(item, $("#sendTo").val(), $("#sendToSubject").val(), $("#sendToMessage").val());
                       
                    }

                }
            }
        }
    });


    var lastusedemail = localStorage.getItem("lastusedemail");
    if (lastusedemail === null || lastusedemail === undefined) {
        lastusedemail = userData.email;
    }

    $("#sendTo").val(lastusedemail);
    $("#sendToSubject").val(item + " from Racekon");
    $("#sendToMessage").val("Please find attached.");
}

function viewHistoryItem(item) {
    $(".btn").prop("disabled",true);
    $("#myprogress").show();
    $.ajax({
        url: url + '/api/xl/history/view?invoicename=' + item,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            historyInfo(data, item);
            $("#myprogress").hide();
            $(".btn").prop("disabled",false);
        },
        error: function (e) {
            $("#myprogress").hide();
            $(".btn").prop("disabled",false);
        }
    });
}


function emailHistoryAjax(item, sendTo, sendToSubject, sendToMessage) {
    var myschema = {};
    myschema["sendTo"] = sendTo;
    myschema["sendToSubject"] = sendToSubject;
    myschema["sendToMessage"] = sendToMessage;
    $('.btn').addClass('disabled');
    $.ajax({
        url: url + '/api/xl/history/email?invoicename=' + item,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(myschema),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            $('.btn').removeClass('disabled');
            $("#myprogress").hide();
        },
        error: function (e) {
            $('.btn').removeClass('disabled');
            bootbox.dialog({
                message: "Failed to send Email.",
                closeButton: false,
                backdrop: true
            });
            $("#myprogress").hide();
        }
    });
}


function downloadHistoryItem(item) {
    $('.btn').addClass('disabled');
    $("#myprogress").show();
    $.ajax({
        url: url + '/api/xl/history/download?invoicename=' + item,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            $('.btn').removeClass('disabled');
            var arrrayBuffer = base64ToArrayBuffer(data);

            var blob = new Blob([arrrayBuffer], { type: "application/pdf" });
            var link = window.URL.createObjectURL(blob);
            window.open(link, '', 'height=650,width=840');

            $("#myprogress").hide();
        },
        error: function (e) {
            $('.btn').removeClass('disabled');
            bootbox.dialog({
                message: "<b>ERROR</b><br>" + JSON.stringify(e),
                //'<button class="btn bg-info text-light" onclick="sendAsEmail(' + index + ')">Send As Email</button>',
                closeButton: false,
                backdrop: true
            });
            $("#myprogress").hide();
        }
    });
}


//data is the base64 encoded string
function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}


function historyInfo(data, item) {
    if (data === null || data === undefined || data === "") {
        bootbox.dialog({
            message: "Sorry! No data to show. <br> <b>Please DOWNLOAD or EMAIL to view it.</b>"+
            '<div class="row" style="cursor: pointer;" ><div class="col"><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + item + '</div></div>   <div class="row">  <div class="col">' + '<a class=" bg-success text-light btn" href="#" onclick="downloadHistoryItem(\'' + item + '\')">Download</a></div> <div class="col"> <a class=" bg-primary text-light btn" href="#" onclick="emailHistoryItem(\'' + item + '\')">Email</a></div>  <div class="col"> <a class="bg-danger text-light btn" href="#" onclick="deleteHistoryItem(\'' + item + '\')">Delete</a> </div> </div>'
            ,
            //'<button class="btn bg-info text-light" onclick="sendAsEmail(' + index + ')">Send As Email</button>',
            closeButton: false,
            backdrop: true
        });
    } else {
        var json = data;

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
                    productStr+
                    '<div class="row" style="cursor: pointer;" ><div class="col"><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + item + '</div></div>   <div class="row">  <div class="col">' + '<a class=" bg-success text-light btn" href="#" onclick="downloadHistoryItem(\'' + item + '\')">Download</a></div> <div class="col"> <a class=" bg-primary text-light btn" href="#" onclick="emailHistoryItem(\'' + item + '\')">Email</a></div>  <div class="col"> <a class="bg-danger text-light btn" href="#" onclick="deleteHistoryItem(\'' + item + '\')">Delete</a> </div> </div>'
                    ,
                //'<button class="btn bg-info text-light" onclick="sendAsEmail(' + index + ')">Send As Email</button>',
                closeButton: false,
                backdrop: true
            });
        } else {
        }

    }
}



function refreshHistory(){
    $(".nav-link").addClass("disabled");
    document.getElementById("historyBody").innerHTML ='';
    document.getElementById("historyCountLabel").innerHTML ='';
    getHistoryDataAjax2();
    $(".nav-link").removeClass("disabled");
}


function clearHistory(){
    bootbox.dialog({
        title: "Delete Selected History Items",
        message: $('#managehistory-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark",
                callback:function(){
                }
            },
            success: {
                label: "Delete",
                className: "btn btn-light text-danger",
                callback: function () {
                    var deleteHistoryList=[];
                    for(var i=0;i<historyData.length;i++){
                        if(document.getElementById('historyitem'+i).checked){
                            deleteHistoryList.push(historyData[i]);
                        }
                    }
                    
                    if(deleteHistoryList.length === 0){
                        bootbox.dialog({
                            message: "No Item Selected.",
                            closeButton: false,
                            backdrop: true
                        });
                        return false;
                    }
                    deleteHistoryListAjax(deleteHistoryList);
                    
                }
            }
        }
    });

    document.getElementById("historypick").innerHTML='';
    for(var i=historyData.length-1;i>=0;i--){
          var checked='';
          document.getElementById("historypick").innerHTML+='<div class="col"><label class="form-selectgroup-item flex-fill">'+
                                                        '<input type="checkbox" id="historyitem'+i+'" name="historyitem'+i+'"  value="'+i+'" class="form-selectgroup-input" '+checked+'>'+
                                                        '<div class="form-selectgroup-label d-flex align-items-center p-3">'+
                                                        '<div class="me-3"><span class="form-selectgroup-check"></span></div>'+
                                                        //'<div class="form-selectgroup-label-content d-flex align-items-center"><span class="avatar me-3" style="background-image: url(/images/favicon.ico)"></span></div>'+
                                                        '<div>'+//+'<div class="font-weight-medium">'+historyData[i]+'</div>'+
                                                        '<div class="text-muted">'+historyData[i]+'</div></div>'+
                                                        '</div></div></label></div>';
    }
}


function deleteHistoryListAjax(deleteHistoryList){
    $('.btn').addClass('disabled');
    $("#myprogress").show();
    $.ajax({
        url: url + '/api/xl/history/deletelist',
        type: 'DELETE',
        data: JSON.stringify(deleteHistoryList),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success: function (data) {
            $('.btn').removeClass('disabled');
            historyData = data;
            document.getElementById("historyCountLabel").innerHTML = '&nbsp;of ' + data.length + ' records';
            var count = 0;
            document.getElementById("historyBody").innerHTML = '';
            for (var i = data.length - 1; i >= 0 && count < 5; i--) {
                count++;
                document.getElementById("historyBody").innerHTML += '<tr style="cursor: pointer;" ><td><i class="bi bi-file-earmark-fill" style="font-size: 20px;"></i>' + data[i] + '</td><td>' + ' <div class="dropdown"> <button class="btn btn-white text-dark" type="button"  onclick="viewHistoryItem(\'' + data[i] + '\')" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> View </button> </div></td></tr>';
            }
            $("#myprogress").hide();
        },
        error: function (e) {
            $('.btn').removeClass('disabled');
            $("#myprogress").hide();
        }
    });
}




