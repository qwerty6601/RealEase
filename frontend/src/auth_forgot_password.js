import { Auth } from 'aws-amplify';
import '../css/index.css';

export const forgotPass = async ({username}) => {    
    try {
        const { user } = await Auth.forgotPassword(username);
        console.log(user)
        window.location = '/forgot_confirm.html#' + username;
    } catch (error) {
        console.log('error signing in', error);
        window.location = '/login.html'
    }
}

// forgot password - user can create new password
if (document.querySelector("#auth-forgot-password")) {

    document.querySelector("#form-auth-forgot-password").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#btnForgot").addEventListener("click", () => {
        const username = document.querySelector("#formForgotEmail").value                
        forgotPass( {username});
    });

}

// Confirm New Password function
export const confirmForgotPass = async (username, code, new_password) => {    
    try {
        await Auth.forgotPasswordSubmit(username, code, new_password);        
        window.location = '/index.html'     
    } catch (error) {
        console.log('error confirming new password', error);
    }
}

// Event Listeners on the Confirm New Password page (after Forgot Password page)
if (document.querySelector("#auth-forgot-password-confirm")) {

    // Populate the email address value
    let username_value = location.hash.substring(1);        
    document.querySelector("#formForgotConfirmEmail").setAttribute("value", username_value);


    document.querySelector("#form-auth-forgot-password-confirm").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#btnConfirmForgot").addEventListener("click", () => {
        const username = document.querySelector("#formForgotConfirmEmail").value
        let code = document.querySelector("#formForgotConfirmCode").value
        let password = document.querySelector("#formForgotConfirmPassword").value
        confirmForgotPass( username, code, password );        
    });

}