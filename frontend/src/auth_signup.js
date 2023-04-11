import { Auth } from 'aws-amplify';
import '../css/index.css';

// event listeners for sign up
if (document.querySelector("#auth-signup")) {
    document.querySelector("#form-auth-signup").addEventListener("submit", event => {
        event.preventDefault();
    });

    document.querySelector("#sign-up-btn").addEventListener("click", () => {
        const email = document.querySelector("#formSignUpEmail").value
        const password = document.querySelector("#formSignUpPassword").value
        signUp({ email, password });
    });

};

// user sign up
export const signUp = async ({ email, password }) => {  
    const username = email;

    try {
        const { user } = await Auth.signUp({
            username,
            email,
            password,
            attributes: {                
            }
        });
        console.log(user);
        window.location = '/signup_confirm.html#' + username;
    } catch (error) {
        // user already exists
        if (error.name === "UsernameExistsException") {
            $('.error-msg').show()
        }        
    }
}

export const confirmSignUp = async ({username, code}) => {   
    try {
        // after email is verified, user needs to login again
        const {result} = await Auth.confirmSignUp(username, code);
        window.location = '/index.html'
    } catch (error) {
        console.log('error confirming sign up', error);
    }
};

// resend confrimation code
export const resendConfirmationCode = async (username) => {
    try {
        await Auth.resendSignUp(username);
        $('.good-msg').show()
    } catch (error) {
        console.log('error resending code: ', error);        
    }
};

// event listeners for confirmation
if (document.querySelector("#auth-signup-confirm")) {

    // populate the email address value
    let username_value = location.hash.substring(1);      
    document.querySelector("#signup-confirm-email").setAttribute("value", username_value);

    document.querySelector("#form-auth-signup-confirm").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#confirm-btn").addEventListener("click", () => {
        let username = document.querySelector("#signup-confirm-email").value
        const code = document.querySelector("#signup-confirm-code").value
        console.log({username, code});
        confirmSignUp({username, code});
    });

    document.querySelector("#btnResend").addEventListener("click", () => {
        let username = document.querySelector("#signup-confirm-email").value
        resendConfirmationCode(username);
    });
}