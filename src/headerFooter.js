// Automatically inject HTML into all files
function includeHTML(callback) {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) elmnt.innerHTML = this.responseText;
                    if (this.status == 404) elmnt.innerHTML = "Page not found.";
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML(callback); // recursive
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }

    // Run callback after header/footer is loaded
    if (callback) callback();
}

document.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        const signOutBtn = document.getElementById("signOutBtn");

        if (signOutBtn) {
            signOutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                document.querySelector('.popup-container')?.remove();

                const popup = document.createElement("div");
                popup.className = "popup-container";
                popup.innerHTML = `
                    <h2>Are you sure you want to sign out?</h2>
                    <p>You’ll be returned to the login page.</p>
                    <div class="popup-buttons">
                        <button id="confirmSignOut">Yes</button>
                        <button id="cancelSignOut">No</button>
                    </div>`;
                document.body.appendChild(popup);

                document.getElementById("confirmSignOut").onclick = () => {
                    window.location.href = "adminHomepageSignIn.html";
                };
                document.getElementById("cancelSignOut").onclick = () => {
                    popup.remove();
                };
            });
        }
    });
});
