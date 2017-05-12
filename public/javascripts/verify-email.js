// @ts-nocheck

$(document).ready(function(){
  var email;
 

  var register = function() {
   email = $("#email").val()
    var pw = $("#password").val(),
        pwr = $("#passwordRepeat").val(),
        name= $("#name").val();
    $.ajax({
      url: '/signup',
      type: 'POST',
      data: {email: email, password: pw, passwordRepeat: pwr, name:name, type: 'register'}
    }).then(function(data) {
      if(data.userExists) {
        $('#signup-form').html(`
        <div  class="jumbotron">
          Email already exists, please check your inbox for email verification message.
          <br>
          <span id="msg-reg"></span>
          <br>
          <a id="resend" href="#">Resend verification email</a></div>`);
      } else {
        $('#signup-form').html(`
          <div class="jumbotron">
          Confirmation email has been sent, to your email address. 
          Please log in to your inbox and click the verification link
          <br>
          <span id="msg-reg"></span>
          <br>
          <a id="resend" href="#">Resend verification email</a></div>`);
      }
      $("#resend").click(resend)
    }).fail(function(data){
    
      $("#msg-reg").text(data.responseJSON.message);
    });
  };
  var resend = function() {
    
    console.log('email: ', email);
    
    $.ajax({
      url: '/signup',
      type: 'POST',
      data: {email: email, type: 'resend'}
    }).then(function(data) {
 
      $("#msg-reg").text(data.message);
      
    });
  };

   $("#button-register").click(register);
});
