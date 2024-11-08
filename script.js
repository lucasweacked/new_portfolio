// Script de envio do formulário para o email 
class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(settings.form);
        this.formButton = document.querySelector(settings.button);
        if (this.form) {
            this.url = this.form.getAttribute("action");
        }
        this.sendForm = this.sendForm.bind(this);
        this.animationInterval = null;
    }

    displaySuccess() {
        this.formButton.innerText = "Enviado com sucesso!";
        this.formButton.disabled = false;

        // Retorna para o texto original "Enviar" após 3 segundos
        setTimeout(() => {
            this.formButton.innerText = "Enviar";
        }, 3000);
    }

    displayError() {
        this.formButton.innerText = "Erro, tente novamente";
        this.formButton.disabled = false;

        // Retorna para o texto original "Enviar" após 3 segundos
        setTimeout(() => {
            this.formButton.innerText = "Enviar";
        }, 3000);
    }

    getFormObject() {
        const formObject = {};
        const fields = this.form.querySelectorAll("[name]");
        fields.forEach((field) => {
            formObject[field.getAttribute("name")] = field.value;
        });
        return formObject;
    }

    onSubmission(event) {
        event.preventDefault();
        this.formButton.disabled = true;
        
        // Inicia a animação do botão "Enviando..."
        let dots = 0;
        this.formButton.innerText = "Enviando";
        this.animationInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            this.formButton.innerText = "Enviando" + ".".repeat(dots);
        }, 500);
    }

    async sendForm(event) {
        try {
            this.onSubmission(event);
            await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(this.getFormObject()),
            });
            clearInterval(this.animationInterval); // Para a animação
            this.displaySuccess();
        } catch (error) {
            clearInterval(this.animationInterval); // Para a animação em caso de erro
            this.displayError();
            throw new Error(error);
        }
    }

    init() {
        if (this.form) this.formButton.addEventListener("click", this.sendForm);
        return this;
    }
}

// Inicialização do FormSubmit
const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
});
formSubmit.init();