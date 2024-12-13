const opinionContainer = document.getElementById("contenedor_reseña");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const name = document.getElementById("nombre-contactos");
  const email = document.getElementById("email-contactos");
  const message = document.getElementById("mensaje");
  const buttonLimpiar = document.getElementById("boton-limpiar");

  buttonLimpiar.addEventListener("click", function () {
    form.reset();
  });

  emailjs.init("OqFgS19XfBN2RRupf");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    if (name.value.trim() === "") {
      alert("Por favor ingrese su nombre!");
      name.focus();
      isValid = false;
    } else if (!validateEmail(email.value)) {
      alert("Por favor ingrese un email valido!");
      email.focus();
      isValid = false;
    } else if (message.value.trim() === "") {
      alert("Por favor ingrese un comentario!");
      message.focus();
      isValid = false;
    }

    if (!isValid) return;

    emailjs
      .send("service_0ajh0vu", "template_pa6sr8q", {
        from_name: name.value,
        message: message.value,
        reply_to: email.value,
      })
      .then(
        function () {
          alert("¡Formulario enviado con éxito!");
          form.reset();
        },
        function (error) {
          alert(
            "Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo más tarde."
          );
          console.error("Error al enviar el email:", error);
        }
      );
  });
});

//funcion para validar el email

function validateEmail(email) {
  const emailValido =
    /^[a-zA-Z0-9]+([._%+-]*[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  return emailValido.test(email);
}

//funcion para cambiar opiniiones

const opinionesNuevas = [
  {
    nombre: "Pedro Olortegui Mendieta",
    comentario: "La mejor página de laboratorio 2",
  },
  {
    nombre: "Pedro Olortegui Mendieta",
    comentario: "Muy útil y fácil de usar.",
  },
  {
    nombre: "Pedro Olortegui Mendieta",
    comentario: "Siempre confiable para las cotizaciones.",
  },
];

let index = 0;

function cambiarOpinion() {
  // sirve para actualizar el contenido con una nueva opinion
  opinionContainer.innerHTML = `
        <div class="nombre-perfil">
            <h1>${opinionesNuevas[index].nombre}</h1>
        </div>
        <div class="texto_reseña">
            <p>${opinionesNuevas[index].comentario}</p>
        </div>
    `;
  // va ir incrementando es decir cambiando las opiciones cuando no haya mas vuelve desde el principio
  index = (index + 1) % opinionesNuevas.length;
}
// llamamos a la funcion
cambiarOpinion();
// sirve para que cambie las opiniones cada 5 segundos
setInterval(cambiarOpinion, 5000);
