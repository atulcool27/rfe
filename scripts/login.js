

$(document).ready(function(){
    $(".main-item").hide();

    $.ajax({
        url: url+'/test/wakeup',
        type:'GET',
        success: function(data){},
        error: function(e){}
    });

    var d = new Date();
    var previousToken= new Date(d.setDate(d.getDate()-1)).toLocaleDateString("en-US");
    if(localStorage.getItem(new Date().toLocaleDateString("en-US")) == null){
        localStorage.removeItem(previousToken);
    }else{
        window.location.href=dashboard;
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
            localStorage.setItem(new Date().toLocaleDateString("en-US"),data.message);
            window.location.href=data.nextPage;
        },
        error: function(e){
            $("#maindiv").show();
            $(".main-item").hide();
            bootbox.dialog({ 
                message: '<small class="text-danger">'+e.responseJSON.message+'</small>', 
                closeButton: false,
                backdrop: true
            });
        }
    });

}