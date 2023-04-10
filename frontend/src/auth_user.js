import { Auth } from 'aws-amplify';

// Check if a user is logged or not.
// It will throw an error if there is no user logged in.
export async function userAuthState() {
    return await Auth.currentAuthenticatedUser({
            bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        });
};