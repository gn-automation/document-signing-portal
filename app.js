document.addEventListener("DOMContentLoaded", async function () {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("t");

    const verifyButton =
        document.getElementById("verifyButton");

    const errorBox =
        document.getElementById("errorBox");

    const documentName =
        document.getElementById("documentName");

    const signerEmail =
        document.getElementById("signerEmail");


    // --------------------------------------------------
    // Power Automate lookup endpoint
    // --------------------------------------------------

    const LOOKUP_API = "https://default2aff9a6f941d427ebc3e6b8404db8d.2d.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/09/workflows/f7768c76be35444b8d6fc50c9756552c/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qIal2Z5iIRrUbNLCDPDwr48xJosQe1HXJfx9J9QtB3Q";


    // --------------------------------------------------
    // No token supplied
    // --------------------------------------------------

    if (!token) {

        showError(
            "This signing link is invalid or incomplete."
        );

        return;
    }


    // --------------------------------------------------
    // Initial loading state
    // --------------------------------------------------

    documentName.textContent =
        "Validating signing request...";

    signerEmail.textContent =
        "Please wait...";

    verifyButton.disabled = true;


    // --------------------------------------------------
    // Validate token
    // --------------------------------------------------

    try {

        const response = await fetch(
            LOOKUP_API,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    token: token
                })
            }
        );


        // ----------------------------------------------
        // Invalid / expired request
        // ----------------------------------------------

        if (!response.ok) {

            let message =
                "This signing request is invalid or no longer available.";

            try {

                const errorData =
                    await response.json();

                if (errorData.message) {
                    message = errorData.message;
                }

            } catch {
                // Keep default message
            }


            showError(message);

            return;
        }


        // ----------------------------------------------
        // Parse successful response
        // ----------------------------------------------

        const data =
            await response.json();


        if (!data.valid) {

            showError(
                data.message ||
                "This signing request is invalid."
            );

            return;
        }


        // ----------------------------------------------
        // Populate real document information
        // ----------------------------------------------

        documentName.textContent =
            data.documentName ||
            "Document";

        signerEmail.textContent =
            "Identity verification required";


        // ----------------------------------------------
        // Enable verification
        // ----------------------------------------------

        verifyButton.disabled = false;


        // ----------------------------------------------
        // Store safe request information in memory
        // ----------------------------------------------

        window.signingRequest = {
            requestId: data.requestId,
            documentName: data.documentName,
            expires: data.expires
        };


        console.log(
            "Signing request validated:",
            window.signingRequest
        );

    }

    catch (error) {

        console.error(
            "Signing request lookup failed:",
            error
        );


        showError(
            "We could not validate this signing request. Please try again later."
        );

        return;
    }


    // --------------------------------------------------
    // Verification button
    // --------------------------------------------------

    verifyButton.addEventListener(
        "click",
        function () {

            alert(
                "Signing request validated successfully.\n\n" +
                "OTP verification will be added next."
            );

        }
    );


    // --------------------------------------------------
    // Error helper
    // --------------------------------------------------

    function showError(message) {

        documentName.textContent =
            "Signing request unavailable";

        signerEmail.textContent =
            "Unable to verify request";

        errorBox.textContent =
            message;

        errorBox.classList.remove("hidden");

        verifyButton.disabled = true;
    }

});
