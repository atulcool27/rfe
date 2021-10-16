var API_URL = "https://racekon.online";


function validateForm(){

   var name =  $("#name").val();
   var phone = $("#phone").val();
   var email = $("#email").val();
   var subject = $("#subject").val();

   if(name === "" || phone === "" || email === "" || subject === ""){
    bootbox.dialog({
        message: "Please fill all fields.",
        size: 'small',
        closeButton: false,
        backdrop: true
    });
    return false;
   }

   if(phone.length < 10){
    bootbox.dialog({
        message: "Phone number must be 10 digits.",
        size: 'small',
        closeButton: false,
        backdrop: true
    });
    return false;
   }

   if(!email.includes("@")){
    bootbox.dialog({
        message: "Enter valid Email Address.",
        size: 'small',
        closeButton: false,
        backdrop: true
    });
    return false;
   }


   var postJson = {
    name: name,
    phone: phone,
    subject: subject,
    email: email,
    body: "",
    env: true
  };


  $("#sendBtn").prop("disabled",true);
  document.getElementById("sendBtn").innerHTML="Sending..";


  $.ajax({
    url: API_URL+'/api/mail/contact',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(postJson),
    success: function(data){
        $("#name").val("");
        $("#phone").val("");
        $("#email").val("");
        $("#subject").val("");

        $("#sendBtn").prop("disabled",false);
        document.getElementById("sendBtn").innerHTML="Send Message";

        bootbox.dialog({
            message: "Message Recieved! We will contact you soon.",
            size: 'small',
            closeButton: false,
            backdrop: true
        });
      
    },
    error: function(e){

        $("#sendBtn").prop("disabled",false);
        document.getElementById("sendBtn").innerHTML="Send Message";
 
        bootbox.dialog({
            message: "Message Recieved! We will contact you soon.",
            size: 'small',
            closeButton: false,
            backdrop: true
        });
    }
  });

}