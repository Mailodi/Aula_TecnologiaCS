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

    async loginUser(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            this.limpar_form_login();
            this.sendZabbixAlert(user.name, user.email); // Chama a função para enviar alerta
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

    async sendZabbixAlert(userName, userEmail) {
        try {
            const response = await fetch('http://172.27.77.140/zabbix/api_jsonrpc.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "item.create",
                    "params": {
                        "hostid": "172.27.77.140", // substitua pelo ID do host no Zabbix
                        "key_": "login.attempt",
                        "type": 2,  // Tipo Trapper
                        "value_type": 1,  // Tipo numérico (ou text se preferir)
                        "history": "7d",
                        "name": `Login attempt by ${userName} (${userEmail})`
                    },
                    "auth": "1a81cf860a78ba05a515a20a1402cb0e3600a712339ac00096707da7e81e8c31", // substitua pelo token de autenticação do Zabbix
                    "id": 1
                })
            });

            const data = await response.json();
            console.log("Login alert sent to Zabbix:", data);
        } catch (error) {
            console.error("Error sending alert to Zabbix:", error);
        }
    }
}
