(function() {
    // get all data in form and return object
    function getFormData(form) {
      var elements = form.elements;
      var honeypot;
  
      var fields = Object.keys(elements).filter(function(k) {
        if (elements[k].name === "honeypot") {
          honeypot = elements[k].value;
          return false;
        }
        return true;
      }).map(function(k) {
        if(elements[k].name !== undefined) {
          return elements[k].name;
        // special case for Edge's html collection
        }else if(elements[k].length > 0){
          return elements[k].item(0).name;
        }
      }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
      });
  
      var formData = {};
      fields.forEach(function(name){
        var element = elements[name];
        
        // singular form elements just have one value
        formData[name] = element.value;
  
        // when our element has multiple items, get their values
        if (element.length) {
          var data = [];
          for (var i = 0; i < element.length; i++) {
            var item = element.item(i);
            if (item.checked || item.selected) {
              data.push(item.value);
            }
          }
          formData[name] = data.join(', ');
        }
      });
  
      // add form-specific values into the data
      formData.formDataNameOrder = JSON.stringify(fields);
      formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
      formData.formGoogleSendEmail
        = form.dataset.email || ""; // no email by default
  
      return {data: formData, honeypot: honeypot};
    }
  
    function handleFormSubmit(event) {  // handles form submit without any jquery
      event.preventDefault();           // we are submitting via xhr below
      var form = event.target;
      var formData = getFormData(form);
      var data = formData.data;
  
      // If a honeypot field is filled, assume it was done so by a spam bot.
      if (formData.honeypot) {
        return false;
      }

      if (data.name === ""){
        form.querySelector("#name").style = "border-bottom: 2px solid red";
        form.querySelector("#email").style = "border-bottom: 1px solid gray";
        form.querySelector("textarea").style = "black; background-color: white;font-size: 16px;resize: none !important;flex-grow: 1;flex-shrink: 1;order: 1;border: 1px solid white;border-bottom: 1px solid gray;height: 176px;";
        form.querySelector(".error").style = "color: red; visibility: visible; margin-top: 5px;";
        form.querySelector(".error").innerHTML = "*This field is required.";
        return;
      } else {
        form.querySelector("#name").style = "border-bottom: 1px solid gray";
      }

      if (data.email === ""){
        form.querySelector("#email").style = "border-bottom: 2px solid red";
        form.querySelector("#name").style = "border-bottom: 1px solid gray";
        form.querySelector("textarea").style = "black; background-color: white;font-size: 16px;resize: none !important;flex-grow: 1;flex-shrink: 1;order: 1;border: 1px solid white;border-bottom: 1px solid gray;height: 176px;";
        form.querySelector(".error").style = "color: red; visibility: visible; margin-top: 5px;";
        form.querySelector(".error").innerHTML = "*This field is required.";
        return;
      } else {
        form.querySelector("#email").style = "border-bottom: 1px solid gray";
      }

      const containsUrl = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");

      if (data.message === ""){
        form.querySelector("textarea").style = "background-color: white;font-size: 16px;resize: none !important;flex-grow: 1;flex-shrink: 1;order: 1;border: 1px solid white;border-bottom: 2px solid red;height: 176px;";
        form.querySelector("#name").style = "border-bottom: 1px solid gray";
        form.querySelector("#email").style = "border-bottom: 1px solid gray";
        form.querySelector(".error").style = "color: red; visibility: visible; margin-top: 5px;";
        form.querySelector(".error").innerHTML = "*This field is required.";
        return;
      } else if (containsUrl.test(data.message)) {
        form.querySelector("textarea").style = "background-color: white;font-size: 16px;resize: none !important;flex-grow: 1;flex-shrink: 1;order: 1;border: 1px solid white;border-bottom: 2px solid red;height: 176px;";
        form.querySelector("#name").style = "border-bottom: 1px solid gray";
        form.querySelector("#email").style = "border-bottom: 1px solid gray";
        form.querySelector(".error").style = "color: red; visibility: visible; margin-top: 5px;";
        form.querySelector(".error").innerHTML = "*No links please!";
        return;
      } else {
        form.querySelector("textarea").style = "black; background-color: white;font-size: 16px;resize: none !important;flex-grow: 1;flex-shrink: 1;order: 1;border: 1px solid white;border-bottom: 1px solid gray;height: 176px;";
      }
  
      disableAllButtons(form);
      var url = form.action;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            form.reset();
            var formElements = form.querySelector(".form-elements")
            if (formElements) {
              formElements.style.enabled = "none"; // hide form
            }
            var thankYouParagraph = document.querySelector("#contact-para");
            if (thankYouParagraph) {
                thankYouParagraph.innerHTML = "Thanks for reaching out! I'll get back to you as soon as I can.";
                form.querySelector(".error").style = "color: red; visibility: hidden; margin: 0 0;";
            }
          }
      };
      xhr.send(JSON.stringify(data));
    }
    
    function loaded() {
      // bind to the submit event of our form
      var forms = document.querySelectorAll("form.gform");
      for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener("submit", handleFormSubmit, false);
      }
    };
    document.addEventListener("DOMContentLoaded", loaded, false);
  
    function disableAllButtons(form) {
      var buttons = form.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  })();