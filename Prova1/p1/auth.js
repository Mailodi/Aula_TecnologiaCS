class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

class Auth {
    constructor() {
        this.users = [];
    }

    registerUser(name, email, password) {
        if (this.isEmailRegistered(email)) {
            this.showError("Email já cadastrado.");
            return false;
        }
        this.users.push(new User(name, email, password));
        alert("Usuário cadastrado com sucesso!");
        return true;
    }

    loginUser(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            this.limpar_form_login();
            window.location.href = '/Cinema/index.html';
        } else {
            this.showError("Email ou senha inválidos.");
        }
    }

    isEmailRegistered(email) {
        return this.users.some(user => user.email === email);
    }

    validatePassword(password, confirmPassword) {
        return password === confirmPassword;
    }

    showError(message) {
        document.getElementById("errorMessage").innerText = message;
    }

    limpar_form_login() {
        document.getElementById("loginForm").reset();
    }

    limpar_formulario_regis() {
        document.getElementById("registerForm").reset();
        document.getElementById("registerErrorMessage").innerText = "";
    }
}

const auth = new Auth();

// login formulario
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.loginUser(email, password);
});

// Register Form
document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!auth.validatePassword(password, confirmPassword)) {
        document.getElementById("registerErrorMessage").innerText = "Senhas não coincidem.";
        return;
    }

    const success = auth.registerUser(name, email, password);
    if (success) {
        auth.limpar_formulario_regis();
        $('#registerModal').modal('hide');
    }
});

//Limpar formularios
$('#registerModal').on('hidden.bs.modal', function () {
    auth.limpar_formulario_regis();
});

window.addEventListener('beforeunload', function() {
    auth.limpar_form_login();
});
