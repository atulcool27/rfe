var domainName = 'https://racekonindustries.in';
var imgWidth;
var imgHeight;

$(document).ready(function(){
   $.ajax({
       url: domainName+'/json/images.json',
       type: 'GET',
       success: function(data){
        var obj;
        for(var i=0;i<(data.page).length;i++){
            if((data.page)[i].url === location.pathname || (data.page)[i].url === location.pathname+".html"){
                obj = (data.page)[i];
                break;
            }
        }

        resizer(obj);
    
       },
       error: function(e){
         
       }
   });
});

function resizer(obj){
    var url = domainName+'/images/qualitypolicy/qualitypolicy.jpg';
    getMeta(url,obj);
   
}


function getMeta(url,obj) {   
    var img = new Image();
    img.onload = function() {
        imgWidth = parseInt(this.width);
        imgHeight = parseInt(this.height);
        var imgRatio = imgWidth/imgHeight;
        var calcval = (parseInt(window.screen.height) - parseInt(window.screen.width)/imgRatio);
        document.getElementById("heroCreator").innerHTML='<section id="hero" class="d-flex align-items-center" style="background-image: url(\''+obj.imageurl+'\');'+
        ' height: calc(100vh - '+calcval+'px);"></section>';
    };
    img.src = url;
}


