const formPersona = document.getElementById("formPersona");

formPersona.addEventListener("submit", async (e) => {
  e.preventDefault();
  const clientePersona = {
    tipo: "persona",
    nombre: document.getElementById("nombrePersona").value,
    rut: document.getElementById("rutPersona").value,
    correo: document.getElementById("correoPersona").value,
    telefono: document.getElementById("telefonoPersona").value,
    direccion: document.getElementById("direccionPersona").value,
  };
  const resultado = await agregarCliente(clientePersona);
  if (resultado) {
    generarMensaje("green", "Cliente agregado exitosamente");
    cleanForm();
  }else{
    generarMensaje("red", "No se pudo agregar el cliente");
  }
});

function cleanForm(){
  document.getElementById("nombrePersona").value = "";
  document.getElementById("rutPersona").value = ""
  document.getElementById("correoPersona").value = "";
  document.getElementById("telefonoPersona").value = "";
  document.getElementById("direccionPersona").value = "";
  document.getElementById("nombrePersona").focus();
}

document.getElementById("nombrePersona").focus();