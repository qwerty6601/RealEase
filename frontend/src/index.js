import { Amplify } from 'aws-amplify'
import { Auth } from 'aws-amplify';
import aws_exports from "./aws-exports.js";
import { userAuthState } from './auth_user';
import { checkAuthContent } from './auth_content';
import { signUp, confirmSignUp, resendConfirmationCode } from './auth_signup';
import { signIn } from './auth_login';
import { forgotPass, confirmForgotPass } from './auth_forgot_password';
import { signOut } from './auth_logout';
import '../css/index.css';

Amplify.configure(aws_exports);

// if not authenticated, pages with containing the id of 'authenticated-content' will redirect to home page (before login).
checkAuthContent();

$('.error-msg').hide()
$('.good-msg').hide()
$('#auth-signup').hide()

$('#logo').click(function() {
    window.location = './home.html';
});

// show login container
$('#go-to-login').click(function() {
    $('#auth-login').show()
    $('#auth-signup').hide()
    $('.error-msg').hide()
});

// show sign up container
$('#go-to-signup').click(function() {
    $('#auth-signup').show()
    $('#auth-login').hide()
    $('.error-msg').hide()
});

// redirect to forgot password page
$('#go-to-reset-password').click(function() {
    window.location = './forgot.html';
});

// create dark overlay behind the authentication container
$("#loginBtn").click(function() {
    document.getElementById("overlay").style.display = "block";
});