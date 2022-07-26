//Selecionar elementos
const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighbornhoodInput = document.querySelector("#neighbornhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

const fadeElement = document.querySelector("#fade");

// Validate expresion regular cep input
cepInput.addEventListener("keypress", (e) => {
    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    //Permitir apenas números
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

//pegar o endereço com keyUp

cepInput.addEventListener("keyup", (e) => {

    const inputValue = e.target.value
        //chegar se está correto o tamanho do valor do input
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});
//buscar o endereço na API

const getAddress = async(cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    // mostrar erros e resetar formulário
    if (data.erro === "true") {
        if (!addressInput.hasAttribute("disabled")) {
            toggleDisabled();
        }

        addressForm.reset();
        toggleLoader();
        toggleMessage("cep invalido tente novamente");
        return;
    }


    if (addressInput.value === "") {
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighbornhoodInput.value = data.bairro;
    regionInput.value = data.uf;
    toggleLoader();
};
//Adicinar ou remover atributos desabilitados 

const toggleDisabled = () => {

    if (regionInput.hasAttribute("disabled")) {
        formInputs.forEach((input) => {
            input.removeAttribute("disabled");
        });

    } else {

        formInputs.forEach((input) => {

            input.setAttribute("disabled", "disabled");
        });

    }
};

//exibir ou ocultar o loading
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};
// Mostrar ou esconder a mensagem 
const toggleMessage = (msg) => {

    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;

    fadeElement.classList.toggle("hide");

    messageElement.classList.toggle("hide");

};

//Fechar modal
closeButton.addEventListener("click", () => toggleMessage());

//Salvar fake
addressForm.addEventListener("submit", (e) => {

    e.preventDefault();

    toggleLoader();

    setTimeout(() => {

        toggleLoader();

        toggleMessage("Endereço salvo com sucesso!");

        addressForm.reset();

        toggleDisabled();

    }, 1500);
});