import { Auth } from 'aws-amplify';

export const signIn = async ({username, password}) => {
    try {
        const { user } = await Auth.signIn(username, password);
        console.log(user)
        window.location = '/home.html'
    } catch (error) {
        $('.error-msg').show()
    }
}

// login into the application
if (document.querySelector("#auth-login")) {
    document.querySelector("#form-auth-login").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#login-btn").addEventListener("click", () => {
        const username = document.querySelector("#login-email").value
        const password = document.querySelector("#login-password").value
        console.log({username, password});
        signIn({username, password});
    });
};