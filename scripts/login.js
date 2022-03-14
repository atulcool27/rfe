
var url='http://localhost:8080';

$(document).ready(function(){
    $(".main-item").hide();

    $.ajax({
        url: url+'/test/wakeup',
        type:'GET',
        success: function(data){},
        error: function(e){}
    });

    if(localStorage.getItem("token")!==null || localStorage.getItem("token")!==undefined){
        //check if expired
        $.ajax({

        });
    }

});





function login(){

    if($("#useremail").val() === '' || $("#userpass").val()===''){
        bootbox.dialog({ 
            message: '<label class="lead text-danger">Please provide both username and password.</label>', 
            closeButton: false,
            backdrop: true
        });
        return false;
    }
    
    $("#maindiv").hide();
    $(".main-item").show();
    var data={"username": $("#useremail").val(), "password": $("#userpass").val()};

    $.ajax({
        url: url+'/login',
        type:'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data){
            $("#maindiv").show();
            $(".main-item").hide();
            localStorage.setItem("token",data.token);
            window.location.href=data.nextPage;
        },
        error: function(e){
            $("#maindiv").show();
            $(".main-item").hide();
            bootbox.dialog({ 
                message: '<label class="lead text-danger">'+JSON.stringify(e.responseJSON.message)+'</label>', 
                closeButton: false,
                backdrop: true
            });
        }
    });

}