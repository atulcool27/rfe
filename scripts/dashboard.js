var selectedUser1;
var newUserMenuList=[];
var password;



$(document).ready(function(){
    if(localStorage.getItem("raceuser")!==null && localStorage.getItem("raceuser")!==undefined){
        document.getElementById("welcometext").innerHTML="Welcome, "+localStorage.getItem("raceuser");
     }else{
        document.getElementById("welcometext").innerHTML="Welcome, ";
     }
   if(currentTokenValue == null){
       localStorage.removeItem(previousTokenKey);
       window.location.href="/login.html";
   }else{
       
   }

   var menuList = JSON.parse(localStorage.getItem("menuList"));
    var raceuserinfo = JSON.parse(localStorage.getItem("raceuserinfo"));
    document.getElementById("manageuserbody").innerHTML += '<tr><td class="text-white">Total</td><td class="text-white"><b>'+raceuserinfo.length+'</b></td></tr>';
    document.getElementById("manageuserbody").innerHTML += '<tr><td class="text-white"><button class="btn bg-secondary text-light" onclick="viewUsersTable()">View All</button></td></tr>';
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
    document.getElementById("menudiv").innerHTML +='<li class="nav-item active"><div class="nav-link  text-light" style="cursor: pointer;" onclick="doLogout()">Logout</div></li>';
});



function viewUsersTable(){
    var raceuserinfo = JSON.parse(localStorage.getItem("raceuserinfo"));

    bootbox.dialog({
        title: "Select User",
        message: $('#manageuser-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Select",
                className: "btn btn-success text-white",
                callback: function () {

                    if($("#selectusernamebody").val() === ''){
                        return false;
                    }

                    var selectedUser = raceuserinfo[$("#selectusernamebody").val()];
                    manageSelectedUser(selectedUser);
                }
            }
        }
    });

    $('#selectusernamebody').empty().append('<option selected value="" hidden>List</option>');
    for(var i=0;i<raceuserinfo.length;i++){
        var active ='';
        var role=raceuserinfo[i].role;
        if(raceuserinfo[i].isActive){
            active='Active';
        }else{
            active='Disabled';
        }
        $("#selectusernamebody").append($("<option />").val(i).text(role+' '+raceuserinfo[i].username+' ('+active+')'));
    }
}



function manageSelectedUser(selectedUser){
    selectedUser1 = selectedUser;
    var menuList = JSON.parse(localStorage.getItem("menuList"));

    bootbox.dialog({
        title: "Update User",
        message: $('#manageuser2-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark"
            },
            success: {
                label: "Edit",
                className: "btn btn-primary text-white",
                callback: function () {

                        item = {};
                        var accessList=[];
                        item ["id"] = selectedUser.id;
                        item ["username"] = $("#tempname").val();
                        password = $("#temppass").val();
                        item ["email"] = $("#tempemail").val();
                        item ["phone"] = $("#tempmobile").val();
                        if($("#tempstatus").val()==="true"){
                            item ["isActive"] = true;
                        }else{
                            item ["isActive"] = false;
                        }
                        item ["role"] = $("#temprole").val();
                        if(newUserMenuList.length===0){
                           // accessList = selectedUser.accessList;
                        }else{
                            for(var i=0;i<newUserMenuList.length;i++){
                                accessList.push(menuList[newUserMenuList[i]]);
                            }
                        }
                        item ["accessList"] = accessList;
                        updateManageUserAjax(item);
                }
            }
        }
    });


    $("#tempname").val(selectedUser.username);
    $("#tempemail").val(selectedUser.email);
    $("#tempmobile").val(selectedUser.phone);
    $("#tempstatus").val(""+selectedUser.isActive+"").change();
    $("#temprole").val(""+selectedUser.role+"").change();
    
}



function editMenuBarList(){
    bootbox.dialog({
        title: "Update Menu Bar List",
        message: $('#manageuser3-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark",
                callback:function(){
                    newUserMenuList=[];
                    $("#tempaccess2 option").each(function()
                    {
                        newUserMenuList.push($(this).val());
                    });
                }
            },
            success: {
                label: "Set List",
                className: "btn btn-info text-white",
                callback: function () {
                    newUserMenuList=[];
                    $("#tempaccess2 option").each(function()
                    {
                        newUserMenuList.push($(this).val());
                    });
                }
            }
        }
    });

    $('#tempaccess').empty();
    var menuList = JSON.parse(localStorage.getItem("menuList"));
    for(var i=0;i<menuList.length;i++){
            $("#tempaccess").append($("<option />").val(i).text(menuList[i].pageName));
    }

    $('#tempaccess2').empty();
    // for(var i=0;i<menuList.length;i++){
    //     if(selectedUser1.accessList.includes(menuList[i])){
    //         $("#tempaccess2").append($("<option selected></option>").val(i).text(menuList[i].pageName));
    //     }
    // }
    for(var i=0;i<menuList.length;i++){
        for(var j=0;j<selectedUser1.accessList.length;j++){
                if(menuList[i].pageName === selectedUser1.accessList[j].pageName){
                    $("#tempaccess2").append($("<option selected></option>").val(i).text(menuList[i].pageName));
                }
        }
    }

    document.getElementById("labellist").innerHTML='';
    var k=1;
    $("#tempaccess2 option").each(function () {
        document.getElementById("labellist").innerHTML +='<b>#'+(k++)+'. '+$(this).text()+'</b><br>';
    });
}


function addToAccessList(){
    var k=1;
    $("#tempaccess2 option[value='"+$("#tempaccess").val()+"']").remove();
    $("#tempaccess2").append($("<option selected></option>").val($("#tempaccess").val()).text($("#tempaccess  option:selected").text()));
    document.getElementById("labellist").innerHTML='';
    $("#tempaccess2 option").each(function () {
        document.getElementById("labellist").innerHTML+='<b>#'+(k++)+'. '+$(this).text()+'</b><br>';
    });
}

function removeFromAccessList(){
    var k=1;
    $("#tempaccess2 option[value='"+$("#tempaccess").val()+"']").remove();
    document.getElementById("labellist").innerHTML='';
    $("#tempaccess2 option").each(function () {
        document.getElementById("labellist").innerHTML+='<b>#'+(k++)+'. '+$(this).text()+'</b><br>';
    });
}



function updateManageUserAjax(item){
    $.ajax({
        url: url+'/user/manage?pass='+password,
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(item),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem(new Date().toLocaleDateString("en-US")));
        },
        success:function(data){
             localStorage.setItem("raceuserinfo", JSON.stringify(data));
             
            var tempdata;
            for (var i = 0; i < data.length; i++) {
                if (data[i].username === localStorage.getItem("raceuser")) {
                    tempdata = data[i];
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
            document.getElementById("menudiv").innerHTML +='<li class="nav-item active"><div class="nav-link  text-light" style="cursor: pointer;" onclick="doLogout()">Logout</div></li>';

            },
        error:function(e){
            alert(JSON.stringify(e));
        }
    });   
}


function doLogout(){
    localStorage.removeItem(currentTokenKey);
    localStorage.removeItem(previousTokenKey);
    localStorage.removeItem("raceuser");
    localStorage.removeItem("menuList");
    localStorage.removeItem("raceuserinfo");
    window.location.href="/login.html";
}


