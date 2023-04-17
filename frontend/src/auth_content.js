import { userAuthState } from './auth_user';
import '../css/index.css';

export function checkAuthContent() {
    if (document.querySelector("#authenticated-content")) {
        userAuthState()
            .then(data => {
                console.log('user is authenticated: ', data);

                const accessToken = data.signInUserSession.accessToken.jwtToken;
                // console.log(accessToken);
                sessionStorage.setItem('accessToken', accessToken);
            })
            // if not authenticated, pages will redirect to home page (before login)
            .catch(error => {
                console.log('user is not authenticated: ', error);
                window.location = '/index.html';
            });
    } else {
        userAuthState()
            .then(data => {
                console.log('user is authenticated: ', data);

                const accessToken = data.signInUserSession.accessToken.jwtToken;
                // console.log(accessToken);
                sessionStorage.setItem('accessToken', accessToken);

                // if user already authenticated, redirect to home page (after login)
                if (window.location.pathname == "/" || window.location.pathname == "/index.html") {
                    window.location = '/home.html';
                }
            })
            .catch(error => {
                console.log('user is not authenticated: ', error);
            });
    }
}