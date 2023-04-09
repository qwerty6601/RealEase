import { userAuthState } from './auth_user';
import '../css/index.css';

export function checkAuthContent() {
// If not authenticated, pages with containing the id of 'authenticated-content' will redirect to login.html.
    if (document.querySelector("#authenticated-content")) {
        userAuthState()
            .then(data => {
                console.log('user is authenticated: ', data);
            })
            .catch(error => {
                console.log('user is not authenticated: ', error);
                // Since this is the secret page and the user is not authenticated, redirect to the login page.
                //alert("This user is not authenticated and will be redirected");
                window.location = '/index.html';
            });
    } else {
        // Merely putting this here so that the authentication state of other pages can be seen in Developer Tools
        userAuthState()
            .then(data => {
                console.log('user is authenticated: ', data);
            })
            .catch(error => {
                console.log('user is not authenticated: ', error);
            });
    }
}