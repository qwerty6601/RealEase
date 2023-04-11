import { Auth } from 'aws-amplify';

// check if a user is logged or not.
export async function userAuthState() {
    return await Auth.currentAuthenticatedUser({
        bypassCache: false
    });
};