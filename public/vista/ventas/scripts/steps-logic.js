function goToStep(id){
    event.preventDefault();

    const steps = document.querySelectorAll(".step");
    steps.forEach((el) => el.classList.remove("actual-step"));

    if(id == ""){
        generarMensaje("red", "Recargue el sitio, no se puso ningún paso a seguir");
        return;
    }

    if(id == "addClient"){
        cargarClientes();
        clearInputCliente();
        document.getElementById("addClient").classList.add("actual-step");
        document.getElementById("nombreCliente").focus();
    }

    if(id == "createClient"){
        newClient = false;
        clearInputClienteNuevo();
        document.getElementById(id).classList.add("actual-step");
        document.getElementById("nombreClienteNew").focus();
    }

    if(id == "origin"){
        document.getElementById(id).classList.add("actual-step");
        checkData();
    }

    if(id == "chooseTypeProduct"){
        document.getElementById(id).classList.add("actual-step");
    }

    if(id == "productRandom"){
        document.getElementById(id).classList.add("actual-step");
        document.getElementById("nameRandomProduct").focus();
    }

    if(id == "addMarco"){
        document.getElementById(id).classList.add("actual-step");
        cargarMarcos();
    }

    if(id == "addCristal"){
        document.getElementById(id).classList.add("actual-step");
        cleanCristal();
        cargarCristales();
        cargarTiposDeLente();
    }

    if(id == "addLente"){
        document.getElementById(id).classList.add("actual-step");
        cleanCristalL();
        cargarCristalesL();
        cargarTiposDeLenteL();
    }

    if(id == "addMarcoL"){
        document.getElementById(id).classList.add("actual-step");
        cargarMarcosL();
    }

    if(id == "metodosPago"){
        document.getElementById(id).classList.add("actual-step");
        getMetodosPago();
    }

    if(id == "final"){
        document.getElementById(id).classList.add("actual-step");
        final();
    }
}