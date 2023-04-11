import { Auth } from 'aws-amplify';

export async function signOut() {
    console.log("signOut triggered...")
    try {
        await Auth.userPool.getCurrentUser().signOut()
        window.location = '/index.html'        
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

// log out of website
if (document.querySelector("#logout-btn")) {
    document.querySelector("#logout-btn").addEventListener("click", () => {
        signOut();
    })
}