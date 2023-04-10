import { userAuthState } from './auth_user';
import '../css/index.css';

export function checkAuthContent() {
    if (document.querySelector("#authenticated-content")) {
        userAuthState()
            .then(data => {
                console.log('user is authenticated: ', data);
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
            })
            .catch(error => {
                console.log('user is not authenticated: ', error);
            });
    }
}