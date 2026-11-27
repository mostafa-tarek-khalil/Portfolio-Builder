const tabSignin = document.getElementById("tab-signin");
const tabSignup = document.getElementById("tab-signup");
const nameField = document.getElementById("name-field");
const submitBtn = document.getElementById("submit-btn");
const forgotLink = document.getElementById("forgot");
const password = document.getElementById("password");
const eyeBtn = document.getElementById("toggle-eye");
const form = document.getElementById("auth-form");
const API_URL = "http://localhost:3000";
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

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

if (mode === "signup") {
  tabSignup.click();
}

eyeBtn.addEventListener("click", function () {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});
// ================= Remember-me handler =================
function handleRemember(email) {
  localStorage.setItem("currentUser", email);

  if (rememberBox && rememberBox.checked) {
    localStorage.setItem("rememberedUser", email);
  } else {
    localStorage.removeItem("rememberedUser");
    sessionStorage.setItem("sessionActive", "1");
  }
}

// ================= Reliable navigation helper =================
// Some browsers/extensions block location changes inside event handlers;
// this tries several methods and falls back until one works.
function goTo(path) {
  try { window.location.assign(path); } catch (e) { }
  setTimeout(() => {
    if (!document.hidden) {
      try { window.location.href = path; } catch (e) { }
    }
  }, 80);
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = password.value;
  const isSignup = tabSignup.classList.contains("active");

  const users = JSON.parse(localStorage.getItem("users")) || [];


  if (isSignup) {
    const name = document.getElementById("name").value.trim();

    if (!name) {
      showToast("Please enter your full name.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating Account...";

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: pass
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message);
        return;
      }

      showToast(data.message, true);

      tabSignin.click();
      document.getElementById("email").value = email;
      password.value = "";

    } catch (error) {
      console.error(error);
      showToast("Unable to connect to server.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Account";
    }
  } else {
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Signing In...";

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pass
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Login failed.");
        return;
      }

      // Save the user's email using the existing mechanism
      handleRemember(data.user.email);

      // Remove any old token
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // Save JWT according to Remember Me
      if (rememberBox.checked) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      showToast(data.message, true);

      // Navigate according to whether the user has a saved portfolio
      const hasPortfolio = Boolean(
        localStorage.getItem("portfolio_" + data.user.email)
      );

      goTo(
        hasPortfolio
          ? "personalInfo.html"
          : "createportfolio.html"
      );

    } catch (error) {
      console.error(error);
      showToast("Unable to connect to server.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
    }
  }
});

// Small inline toast (nicer than alert, doesn't block the page)
function showToast(msg, ok = false) {
  let t = document.getElementById("sign-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "sign-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = "sign-toast show" + (ok ? " ok" : "");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3200);
}

// ================= Social login (Google / GitHub) — account picker =================
const socialBtns = document.querySelectorAll(".social-btn");

// Known demo accounts per provider
const DEMO_ACCOUNTS = {
  Google: [
    { name: "Ahmed Hassan", email: "ahmed.hassan@gmail.com", avatar: "AH", color: "#4285f4" },
    { name: "Mariam Adel", email: "mariam.adel@gmail.com", avatar: "MA", color: "#ea4335" },
  ],
  GitHub: [
    { name: "Omar Khaled", email: "omar.khaled@github.com", avatar: "OK", color: "#24292f" },
    { name: "Nour Ibrahim", email: "nour.ibrahim@github.com", avatar: "NI", color: "#6e5494" },
  ],
};

socialBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const provider = btn.textContent.trim().toLowerCase().includes("google")
      ? "Google"
      : "GitHub";
    openAccountPicker(provider);
  });
});

function ensureDemoUsers(provider) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let changed = false;

  DEMO_ACCOUNTS[provider].forEach((acc) => {
    if (!users.some((u) => u.email === acc.email)) {
      users.push({
        name: acc.name,
        email: acc.email,
        password: provider + "@2026",
        provider: provider,
      });
      changed = true;
    }
  });

  if (changed) localStorage.setItem("users", JSON.stringify(users));
  return users;
}

function openAccountPicker(provider) {
  const users = ensureDemoUsers(provider);

  const modal = document.createElement("div");
  modal.className = "picker-modal";
  modal.innerHTML = `
    <div class="picker-box">
      <div class="picker-head">
        <i class="fa-brands ${provider === "Google" ? "fa-google" : "fa-github"} ${provider.toLowerCase()}-icon"></i>
        <div>
          <h3>Choose an account</h3>
          <p>to continue to <b>FolioCraft</b></p>
        </div>
      </div>
      <div class="picker-list">
        ${DEMO_ACCOUNTS[provider].map((acc) => {
    const hasPortfolio = Boolean(localStorage.getItem("portfolio_" + acc.email));
    return `<button class="picker-item" data-email="${acc.email}">
            <span class="picker-avatar" style="background:${acc.color}">${acc.avatar}</span>
            <span class="picker-info">
              <b>${acc.name}</b>
              <small>${acc.email}</small>
            </span>
            <span class="picker-state">${hasPortfolio ? "Existing portfolio" : "New here"}</span>
          </button>`;
  }).join("")}
        <button class="picker-item picker-other">
          <span class="picker-avatar other"><i class="fa-solid fa-user-plus"></i></span>
          <span class="picker-info">
            <b>Use another account</b>
            <small>Continue with email instead</small>
          </span>
        </button>
      </div>
      <p class="picker-foot">This is a demo — accounts are stored locally on your device.</p>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("open"));

  // Bind handlers directly to each item
  modal.querySelectorAll(".picker-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      if (item.classList.contains("picker-other")) {
        modal.classList.remove("open");
        setTimeout(() => modal.remove(), 250);
        document.getElementById("email").focus();
        return;
      }

      const email = item.dataset.email;
      const user = users.find((u) => u.email === email);
      if (!user) return;

      localStorage.setItem("currentUser", email);
      sessionStorage.setItem("sessionActive", "1");

      modal.classList.remove("open");
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Signing in...`;

      const hasPortfolio = Boolean(localStorage.getItem("portfolio_" + email));
      goTo(hasPortfolio ? "personalInfo.html" : "createportfolio.html");
    });
  });

  // Click on the backdrop closes the picker
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
      setTimeout(() => modal.remove(), 250);
    }
  });
}

// ================= Remember me =================
// Prefill email if the user was remembered
const rememberedEmail = localStorage.getItem("rememberedUser");
const rememberBox = document.querySelector(".remember input");

if (rememberedEmail) {
  document.getElementById("email").value = rememberedEmail;
  rememberBox.checked = true;
}

// If the user did NOT check remember me, the session dies when the tab closes
// NOTE: this cleanup runs only when the Sign page loads with a stale session —
// it must not run right after a social/picker login in the same tab (handled via sessionActive flag).
if (localStorage.getItem("currentUser") && !rememberedEmail &&
  !sessionStorage.getItem("sessionActive") && !params.get("social")) {
  // Give pending social/picker logins (which set sessionActive in the same tick) a chance
  // — only clear when there is truly no active session.
  setTimeout(() => {
    if (localStorage.getItem("currentUser") && !localStorage.getItem("rememberedUser") &&
      !sessionStorage.getItem("sessionActive")) {
      localStorage.removeItem("currentUser");
    }
  }, 0);
}

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
