$(document).ready(function() { 

  $("#loginform").validate(
{
  rules: 
  {
    username: 
    {
      required: true
    },
    password: 
    {
      required: true,
      rangelength: [16,16]
    },
    signature:
    {
      required: true,
      rangelength: [56,56]
    },
    date:
    {
      required: true
    },
    date2:
    {
      required: true
    }
  },
  messages: 
  {
    username: 
    {
      required: "Please enter username."
    },
    password: 
    {
      required: "Please enter password.",
      rangelength: "Password should have 16 symbols"
    },
    signature:
    {
      required: "Please enter signature.",
      rangelength: "Signature should have 56 symbols"
    },
    date:
    {
      required: "Please enter start date."
    },
    date2:
    {
      required: "Please enter end date."
    }
  }
});   


});