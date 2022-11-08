/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout, signUp } from "./login";
import { updateSettings } from "./updateSettings";
import { forgotPassword } from "./forgotpassword";
import { resetPassword } from "./resetpassword";
import { bookTour } from "./stripe";
import { showAlert } from "./alerts";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signUpForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");
const forgotPasswordFrom = document.querySelector(".form--forgotpassword");
const resetPasswordForm = document.querySelector(".form--resetpassword");

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
if (signUpForm)
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    console.log(name, email, password);
    signUp(name, email, password, passwordConfirm);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);

// FORGOT PASSWORD
if (forgotPasswordFrom) {
  forgotPasswordFrom.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Change button text while sending email
    document.querySelector(".btn-forgot-password").innerText = "Sending...";

    const email = document.getElementById("emailForgotPassword").value;
    await forgotPassword(email);

    // Change button text after sending email
    document.querySelector(".btn-forgot-password").innerText = "Submit";
  });
}

// RESET PASSWORD
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Change button text while resetting password
    document.querySelector(".btn--reset").innerText = "Resetting...";

    const password = document.getElementById("passwordResetPassword").value;
    const passwordConfirm = document.getElementById(
      "passwordConfirmResetPassword"
    ).value;
    const resetToken = document.getElementById("resetToken").value;

    await resetPassword(password, passwordConfirm, resetToken);

    // Change button text after resetting password
    document.querySelector(".btn--reset").innerText = "Reset";
  });
}
