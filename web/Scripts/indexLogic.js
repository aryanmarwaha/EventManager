// Index.html - Muscles 💪 :
    function showOverlay_ (){
        document.getElementById('overlay').style.display = "flex";
    }
    function hideOverlay_ (){
        document.getElementById('overlay').style.display = "none";
    }
    function showSigningContainer_ (){
        document.getElementById('signingContainer').style.display = "flex";
    }
    function hideSigningContainer_ (){
        document.getElementById('signingContainer').style.display = "none";
    }
    function showSigningBox_ (){
        document.getElementById('signingBox').style.display = "flex";
    }
    function hideSigningBox_ (){
        document.getElementById('signingBox').style.display = "none";
    }
    function showSignIn_ (){
        document.getElementById('signIn').style.display = "flex";
    }
    function hideSignIn_ (){
        document.getElementById('signIn').style.display = "none";
    }
    function showSignUp_ (){
        document.getElementById('signUp').style.display = "flex";
    }
    function hideSignUp_ (){
        document.getElementById('signUp').style.display = "none";
    }
    function showTermsAndConditions_ (){
        document.getElementById('termsAndConditions').style.display = "flex";
    }
    function hideTermsAndConditions_ (){
        document.getElementById('termsAndConditions').style.display = "none";
    }
    function resetScreen (){
        hideSignIn_();
        hideSignUp_();
        hideTermsAndConditions_();
        hideSigningBox_();
        hideSigningContainer_();
        hideOverlay_();
    }
    function openSignIn (){
        resetScreen();
        showOverlay_();
        showSigningContainer_();
        showSigningBox_();
        showSignIn_();
    }

    function openSignUp (){
        resetScreen();
        showOverlay_();
        showSigningContainer_();
        showSigningBox_();
        showSignUp_();
    }

    function openTermsAndConditions (){
        resetScreen();
        showOverlay_();
        showSigningContainer_();
        showTermsAndConditions_();
    }

    document.addEventListener('keydown', (event)=> {
        if(event.key === "Escape") resetScreen();
    });
    window.addEventListener("DOMContentLoaded", resetScreen);

// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------



// Index.html - Neurons⚡
    
    document.getElementById("signin").addEventListener("click", (event)=> {

        let useremail = document.getElementById("signin-useremail").value;
        let password = document.getElementById("signin-password").value;

        eel.signin(useremail, password);
    });

    document.getElementById("signup").addEventListener("click", (event)=> {

        let useremail = document.getElementById("signup-useremail").value;
        let username = document.getElementById("signup-username").value;
        let password = document.getElementById("signup-password").value;

        eel.signup(username,useremail,password);
    });




    
    function signingSuccess(res) {
        generatePopupMessage({
            title: "Success",
            mood: true,
            body: "Signed-in Successfully.",
        });
        window.close();
    };

    function signingFailed(res) {
        if(res.message == "user-exists") {
            generatePopupMessage({
                title: "Sign-up failed",
                mood: false,
                body: "User already exists.",
            });
        }
        else if(res.message == "invalid-cred") {
            generatePopupMessage({
                title: "Sign-in failed",
                mood: false,
                body: "Wrong user-credentials used.",
            });
        }
        else if(res.message == "user-notfound") {
            generatePopupMessage({
                title: "Sign-in failed",
                mood: false,
                body: "User does not exists.",
            });
        }
        else {
            generatePopupMessage({
                title: "Warning",
                mood: false,
                body: "Some error occured.",
            });
        }
    };

    
    eel.expose(signingSuccess);
    eel.expose(signingFailed);

    eel.expose(closeIndexHelper)
    function closeIndexHelper() {
        window.close()
    }