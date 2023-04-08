import { Auth } from 'aws-amplify';

// Sign Out function
export async function signOut() {
    console.log("signOut triggered...")
    try {
        await Auth.userPool.getCurrentUser().signOut()
        window.location = '/index.html'        
    } catch (error) {
        console.log('error signing out: ', error);
    }
}


// Event Listener for Sign Out button
if (document.querySelector("#nav-logout")) {
    document.querySelector("#nav-logout").addEventListener("click", () => {
        signOut();
    })
}