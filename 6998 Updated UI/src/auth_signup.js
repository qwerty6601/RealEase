import { Auth } from 'aws-amplify';
import '../css/index.css';

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


// event Listeners if user is on the Sign Up page
if (document.querySelector("#auth-signup")) {

    document.querySelector("#form-auth-signup").addEventListener("submit", event => {
        event.preventDefault(); // Prevent the browser from reloading on submit event.
    });

    document.querySelector("#btnSignUp").addEventListener("click", () => {
        const email = document.querySelector("#formSignUpEmail").value
        const password = document.querySelector("#formSignUpPassword").value
        signUp({ email, password });
    });

};

// account confirmation function
export const confirmSignUp = async ({username, code}) => {   
    try {
      const {result} = await Auth.confirmSignUp(username, code);
      console.log(result);
      window.location = '/index.html'
    } catch (error) {
        console.log('error confirming sign up', error);
        alert(error.message);
    }
};

// Resend confrimation code function
export const resendConfirmationCode = async (username) => {
    try {
        await Auth.resendSignUp(username);
        $('.good-msg').show()
        console.log('code resent successfully');
    } catch (error) {
        console.log('error resending code: ', error);        
    }
};

// Event Listeners if user is on Account confirmation page
if (document.querySelector("#auth-signup-confirm")) {

    // Populate the email address value
    let username_value = location.hash.substring(1);      
    document.querySelector("#formSignUpConfirmEmail").setAttribute("value", username_value);

    document.querySelector("#form-auth-signup-confirm").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#btnConfirm").addEventListener("click", () => {
        let username = document.querySelector("#formSignUpConfirmEmail").value
        const code = document.querySelector("#formSignUpConfirmCode").value
        console.log({username, code});
        confirmSignUp({username, code});
    });

    document.querySelector("#btnResend").addEventListener("click", () => {
        let username = document.querySelector("#formSignUpConfirmEmail").value
        resendConfirmationCode(username);
    });
}