const modal = document.getElementById("atendimentoModal");
const btn = document.getElementById("atendimentoBtn");
const span = document.getElementsByClassName("close")[0];
const textarea = document.getElementById("pergunta");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const chatContainer = document.getElementById("chatContainer");

// modal
btn.onclick = function() {
    modal.style.display = "block";
    chatContainer.innerHTML = '';
    textarea.value = '';
}
// sair modal
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let isRequestInProgress = false;

sendMessageBtn.onclick = async function() {
    const pergunta = textarea.value;

    if (pergunta.trim() !== "") {
        if (isRequestInProgress) {
            addMessageToChat('Atendente: Por favor, aguarde antes de enviar outra pergunta.', 'bot');
            return; // Não permite enviar outra pergunta enquanto a requisição está em andamento
        }
        // envia a pergunta ao chat
        addMessageToChat('Você: ' + pergunta, 'user');
        console.log("Pergunta enviada:", pergunta);

        isRequestInProgress = true;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ''
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: pergunta }]
                })
            });

            const data = await response.json();
            console.log("Resposta da API:", data);

            if (response.status === 429) {
                addMessageToChat('Atendente: Estamos tendo muitas requisições. Por favor, tente novamente mais tarde.', 'bot');
            } else if (data.choices && data.choices.length > 0) {
                const resposta = data.choices[0].message.content;
                // resposta
                addMessageToChat('Atendente: ' + resposta, 'bot');
            } else {
                addMessageToChat('Atendente: Não consegui entender sua pergunta.', 'bot');
            }
        } catch (error) {
            console.error('Erro:', error);
            addMessageToChat('Atendente: Não foi possível obter a resposta.', 'bot');
        } finally {
            isRequestInProgress = false;
        }

        textarea.value = '';
    } else {
        addMessageToChat('Atendente: Por favor, escreva uma pergunta.', 'bot');
    }
};

// Função para adicionar mensagens ao chat
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
