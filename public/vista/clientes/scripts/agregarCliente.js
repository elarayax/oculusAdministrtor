const formPersona = document.getElementById("formPersona");

formPersona.addEventListener("submit", async (e) => {
  e.preventDefault();
  const clientePersona = {
    tipo: "persona",
    nombre: document.getElementById("nombrePersona").value,
    rut: document.getElementById("rutPersona").value,
    correo: document.getElementById("correoPersona").value,
    telefono: document.getElementById("telefonoPersona").value,
  };
  const resultado = await agregarCliente(clientePersona);
  if (resultado) {
    alert("Cliente persona agregado exitosamente");
    location.reload();
  }
});