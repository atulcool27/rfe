var selectedUser1;
var newUserMenuList=[];
var password;
var menuAccessList;
var menuOriginalAccessList;

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
    document.getElementById("toplinks").innerHTML = '';
    for (var i = 0; i < menu.length; i++) {
        //document.getElementById("menudiv").innerHTML += '<li class="nav-item"> <a class="nav-link  text-light" href="' + homeurl + menu[i].pageLink + '">' + menu[i].pageName + '</a></li>';
        if(menu[i].pageName !== 'Admin Dashboard'){
            document.getElementById("toplinks").innerHTML += '<tr><td> <a class="nav-link  text-dark" href="' + homeurl + menu[i].pageLink + '">' + menu[i].pageName + '</a></td></tr>';
        } 
    }
    document.getElementById("menudiv").innerHTML +='<li class="nav-item active"><div class="nav-link  text-light" style="cursor: pointer;" onclick="doLogout()">Logout</div></li>';
   
    document.getElementById("userlist").innerHTML='';

    for(var i=0;i<raceuserinfo.length;i++){
        document.getElementById("userlist").innerHTML+='<tr onclick="editUserPanel('+i+')"><td><div class="d-flex py-1 align-items-center"><span class="avatar me-2" style="background-image: url(/images/10.jpg)"></span><div class="flex-fill"><div class="font-weight-medium">'+raceuserinfo[i].username+'</div><div class="text-muted"><a href="#" class="text-reset">'+raceuserinfo[i].email+'</a></div></div></div></td>'+
                                                    '<td class="text-muted" >ADMIN</td>'+
                                                    '</tr>';
    }
   
});


function editUserPanel(index){
    var raceuserinfo = JSON.parse(localStorage.getItem("raceuserinfo"));
    manageSelectedUser(raceuserinfo[index]);
}


function manageSelectedUser(selectedUser){
    selectedUser1 = selectedUser;
    menuAccessList = selectedUser1.accessList;
    menuOriginalAccessList= selectedUser1.accessList;

    var menuList = JSON.parse(localStorage.getItem("menuList"));

    bootbox.dialog({
        title: "Update User",
        message: $('#manageuser2-template').html(),
        buttons: {
            danger: {
                label: "Cancel",
                className: "btn btn-white text-dark",
                callback: function(){
                    newUserMenuList=menuOriginalAccessList;
                    menuAccessList=menuOriginalAccessList;
                }
            },
            success: {
                label: "Edit",
                className: "btn btn-primary text-white",
                callback: function () {

                        item = {};
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
                        item ["accessList"] = newUserMenuList;
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
                    newUserMenuList=menuOriginalAccessList;
                    menuAccessList=menuOriginalAccessList;
                }
            },
            success: {
                label: "Update Menu",
                className: "btn btn-light text-success",
                callback: function () {
                    newUserMenuList=[];
                    for(var i=0;i<menuList.length;i++){
                        if(menuList[i].pageName === 'Admin Dashboard'){
                            continue;
                        }
                        if(document.getElementById('menuitem'+i).checked){
                            newUserMenuList.push(menuList[i]);
                        }
                    }
                    menuAccessList=newUserMenuList;
                }
            }
        }
    });

    var menuList = JSON.parse(localStorage.getItem("menuList"));
    document.getElementById("menupick").innerHTML='';
    for(var i=0;i<menuList.length;i++){
          var checked='';
          if(JSON.stringify(menuAccessList).includes(menuList[i].pageName)){
            checked="checked";
          }
          if(menuList[i].pageName === 'Admin Dashboard'){
              continue;
          }
          document.getElementById("menupick").innerHTML+='<label class="form-selectgroup-item flex-fill">'+
                                                        '<input type="checkbox" id="menuitem'+i+'" name="menuitem'+i+'"  value="'+i+'" class="form-selectgroup-input" '+checked+'>'+
                                                        '<div class="form-selectgroup-label d-flex align-items-center p-3">'+
                                                        '<div class="me-3"><span class="form-selectgroup-check"></span></div>'+
                                                        '<div class="form-selectgroup-label-content d-flex align-items-center"><span class="avatar me-3" style="background-image: url(/images/favicon.ico)"></span></div>'+
                                                        '<div><div class="font-weight-medium">'+menuList[i].pageName+'</div>'+
                                                        '<div class="text-muted">'+menuList[i].pageLink+'</div></div>'+
                                                        '</div></div></label>';
    }

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
            document.getElementById("toplinks").innerHTML = '';
            for (var i = 0; i < menu.length; i++) {
                if(menu[i].pageName !== 'Admin Dashboard'){
                    document.getElementById("toplinks").innerHTML += '<tr><td> <a class="nav-link  text-dark" href="' + homeurl + menu[i].pageLink + '">' + menu[i].pageName + '</a></td></tr>';
                } 
            }

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


