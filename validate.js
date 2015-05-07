/*
* Copyright (c) 2015 Iuliia Potapenko
* Distributed under the GNU GPL v3.
* For full terms see http://www.gnu.org/licenses/gpl or LICENSE.txt file.
*/

$(document).ready(function() { 

  $("#loginform").validate( {
    rules: {
      username: {
        required: true
      },
      password: {
        required: true,
        rangelength: [16,16]
      },
      signature: {
        required: true,
        rangelength: [56,56]
      },
      date: {
        required: true
      },
      date2: {
        required: true
      },
      currency: {
        required: {
          depends: function() {
            return $("#currency2").is(':filled');
          }
        }
      },
      currency2: {
        required: {
          depends: function() {
            return $("#currency").is(':filled');
          }
        }
      }
    },
    messages: {
      username: {
        required: "Please enter username."
      },
      password: {
        required: "Please enter password.",
        rangelength: "Password should have 16 symbols"
      },
      signature: {
        required: "Please enter signature.",
        rangelength: "Signature should have 56 symbols"
      },
      date: {
        required: "Please enter start date."
      },
      date2: {
        required: "Please enter end date."
      },
      currency: {
        required: "Please enter currency full name or delete abbreviation"
      },
      currency2: {
        required: "Please enter abbreviation or delete currency full name"
      }
    }
  });   
});