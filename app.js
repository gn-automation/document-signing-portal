document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const token = params.get("t");

    const verifyButton =
        document.getElementById("verifyButton");

    const errorBox =
        document.getElementById("errorBox");

    const documentName =
        document.getElementById("documentName");


    // --------------------------------
    // Check signing token exists
    // --------------------------------

    if (!token) {

        documentName.textContent =
            "Signing request unavailable";

        errorBox.textContent =
            "This signing link is invalid or incomplete.";

        errorBox.classList.remove("hidden");

        verifyButton.disabled = true;

        return;
    }


    // --------------------------------
    // Temporary Step 3A behavior
    // --------------------------------

    console.log(
        "Signing token detected:",
        token
    );


    documentName.textContent =
        "Test Agreement.pdf";


    // --------------------------------
    // Temporary verification button
    // --------------------------------

    verifyButton.addEventListener(
        "click",
        function () {

            alert(
                "Token received successfully.\n\n" +
                "OTP verification will be added in the next step."
            );

        }
    );

});