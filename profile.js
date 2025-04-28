// Быстрый доступ
const regSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const profileSection = document.getElementById("profile-section");
const authToggle = document.getElementById("auth-toggle");

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

const regError = document.getElementById("reg-error");
const loginError = document.getElementById("login-error");

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");
const profileAddress = document.getElementById("profile-address");

const editBtn = document.getElementById("edit-btn");
const editForm = document.getElementById("edit-form");
const saveChanges = document.getElementById("save-changes");

const avatarInput = document.getElementById("avatar-input");
const profileAvatar = document.getElementById("profile-avatar");

document.getElementById("to-login").onclick = () => toggleSection("login");
document.getElementById("to-register").onclick = () => toggleSection("register");

// Переключение секций
function toggleSection(section) {
    regSection.classList.add("hidden");
    loginSection.classList.add("hidden");
    profileSection.classList.add("hidden");

    if (section === "register") regSection.classList.remove("hidden");
    if (section === "login") loginSection.classList.remove("hidden");
    if (section === "profile") profileSection.classList.remove("hidden");
}

// Проверка входа
function checkLogin() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.loggedIn) {
        showProfile(user);
        authToggle.textContent = "Выйти";
        authToggle.onclick = () => {
            if (confirm("Вы действительно хотите выйти?")) {
                user.loggedIn = false;
                localStorage.setItem("user", JSON.stringify(user));
                location.reload();
            }
        };
    } else {
        toggleSection("register");
        authToggle.textContent = "Вход";
        authToggle.onclick = () => toggleSection("login");
    }
}

// Регистрация
registerForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const phone = document.getElementById("reg-phone").value;
    const address = document.getElementById("reg-address").value;

    const existing = JSON.parse(localStorage.getItem("user"));
    if (existing && existing.email === email) {
        regError.textContent = "Этот email уже зарегистрирован.";
        return;
    }

    const user = { name, email, password, phone, address, loggedIn: true };
    localStorage.setItem("user", JSON.stringify(user));
    showProfile(user);
};

// Вход
loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.email !== email || user.password !== password) {
        loginError.textContent = "Неверный email или пароль.";
        return;
    }

    user.loggedIn = true;
    localStorage.setItem("user", JSON.stringify(user));
    showProfile(user);
};

// Отображение профиля
function showProfile(user) {
    toggleSection("profile");
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    profilePhone.textContent = user.phone;
    profileAddress.textContent = user.address;
}

// Редактирование
editBtn.onclick = () => {
    editForm.classList.toggle("hidden");
    document.getElementById("edit-name").value = profileName.textContent;
    document.getElementById("edit-phone").value = profilePhone.textContent;
    document.getElementById("edit-address").value = profileAddress.textContent;
};

saveChanges.onclick = () => {
    const name = document.getElementById("edit-name").value;
    const phone = document.getElementById("edit-phone").value;
    const address = document.getElementById("edit-address").value;

    const user = JSON.parse(localStorage.getItem("user"));
    user.name = name;
    user.phone = phone;
    user.address = address;
    localStorage.setItem("user", JSON.stringify(user));
    showProfile(user);
    editForm.classList.add("hidden");
};

// Аватар
avatarInput.onchange = function () {
    const reader = new FileReader();
    reader.onload = function (e) {
        profileAvatar.src = e.target.result;
        localStorage.setItem("avatar", e.target.result);
    };
    reader.readAsDataURL(this.files[0]);
};

// Загрузка аватара
window.onload = () => {
    const avatar = localStorage.getItem("avatar");
    if (avatar) profileAvatar.src = avatar;
    checkLogin();
};
