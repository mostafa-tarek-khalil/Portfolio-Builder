const tabSignin = document.getElementById("tab-signin");
const tabSignup = document.getElementById("tab-signup");
const nameField = document.getElementById("name-field");
const submitBtn = document.getElementById("submit-btn");
const forgotLink = document.getElementById("forgot");
const password = document.getElementById("password");
const eyeBtn = document.getElementById("toggle-eye");
const form = document.getElementById("auth-form");

//Sign In / Create Account
tabSignup.addEventListener("click", function () {
  tabSignup.classList.add("active");
  tabSignin.classList.remove("active");
  nameField.classList.remove("hidden");
  forgotLink.style.display = "none";
  submitBtn.textContent = "Create Account";
  password.value = "";
});

tabSignin.addEventListener("click", function () {
  tabSignin.classList.add("active");
  tabSignup.classList.remove("active");
  nameField.classList.add("hidden");
  forgotLink.style.display = "block";
  submitBtn.textContent = "Sign In";
});

eyeBtn.addEventListener("click", function () {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = password.value;
  const isSignup = tabSignup.classList.contains("active");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (isSignup) {
    const name = document.getElementById("name").value.trim();

    const exists = users.some(function (u) {
      return u.email === email;
    });
    if (exists) {
      alert("This email is already registered. Please sign in.");
      return;
    }

    users.push({ name: name, email: email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", email);

    window.location.href = "createportfolio.html";
  } else {
    const user = users.find(function (u) {
      return u.email === email && u.password === pass;
    });

    if (user) {
      localStorage.setItem("currentUser", email);
      // has a saved portfolio → edit it, otherwise → build it
      if (localStorage.getItem("portfolio_" + email)) {
        window.location.href = "personalInfo.html";
      } else {
        window.location.href = "createportfolio.html";
      }
    } else {
      alert("Wrong email or password.");
    }
  }
});

// Forget Password
const forgotModal = document.getElementById("forgot-modal");
const forgotForm = document.getElementById("forgot-form");

function openModal() {
  forgotModal.classList.add("open");
}

function closeModal() {
  forgotModal.classList.remove("open");
  forgotForm.reset();
}

forgotLink.addEventListener("click", function (e) {
  e.preventDefault();
  openModal();
});

document.getElementById("modal-close").addEventListener("click", closeModal);
forgotModal.addEventListener("click", function (e) {
  if (e.target === forgotModal) closeModal();
});

forgotForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("reset-email").value.trim();
  const newPass = document.getElementById("new-password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(function (u) {
    return u.email === email;
  });

  if (!user) {
    alert("This email is not registered.");
    return;
  }

  user.password = newPass;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Password changed successfully!");
  closeModal();
});
