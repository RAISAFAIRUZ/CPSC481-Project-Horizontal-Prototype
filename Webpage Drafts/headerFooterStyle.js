function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /* Search for elements with the w3-include-html attribute */
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;  // Insert the content into the element
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";  // Handle the case where the file is not found
          }
          /* Remove the attribute and call this function again to include the next element */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);  // Perform the request
      xhttp.send();
      /* Exit the function */
      return;
    }
  }
}
