import { Auth } from 'aws-amplify';

// sign In function
export const signIn = async ({username, password}) => {
    try {
        const { user } = await Auth.signIn(username, password);
        console.log(user)
        window.location = '/home.html'
    } catch (error) {
        $('.error-msg').show()
    }
}

// event listeners if user is on Login page
if (document.querySelector("#auth-login")) {
    document.querySelector("#form-auth-login").addEventListener("click", event => {
        event.preventDefault();
    });

    document.querySelector("#btnLogin").addEventListener("click", () => {
        const username = document.querySelector("#formLoginEmail").value
        const password = document.querySelector("#formLoginPassword").value
        console.log({username, password});
        signIn({username, password});
    });
};