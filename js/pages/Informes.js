const opinionContainer = document.getElementById("contenedor_reseña");
const filtroMoneda = document.getElementById("filtroMoneda");
const buttonFiltroMoneda = document.getElementById("buttonFiltroMoneda");

const ctx = document.getElementById("miGrafica").getContext("2d");
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const etiquetas = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "junio"];
const datos = [100, 150, 120, 200, 0, 20];
const datosLinea1 = [100, 150, 120, 200, 10, 20, 100];
const datosLinea2 = [80, 120, 140, 180, 0, 50, 56];
const datosLinea3 = [88, 100, 14, 200, 20, 0, 80];

buttonFiltroMoneda.addEventListener("click", filtrarInforme);

function cargarInformes(datos = favoritos) {
  informesContainer.innerHTML = "";
  const datosEstructurados = {};

  datos.map((cotizacion) => {
    const { fecha, nombre, compra, venta } = cotizacion;
    if (!datosEstructurados[nombre]) {
      datosEstructurados[nombre] = [];
    }
    datosEstructurados[nombre].push({ fecha, compra, venta });
    datosEstructurados[nombre].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );
  });

  Object.keys(datosEstructurados).forEach((nombre) => {
    const div = document.createElement("div");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <tr class="tr_fecha">
            <td>${nombre}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        `;
    tr.classList.add("tr_fecha");
    div.appendChild(tr);
    informesContainer.appendChild(div);
    let fecha = datosEstructurados[nombre][0].fecha;
    let ventaAnterior =
      datosEstructurados[nombre].length > 1
        ? datosEstructurados[nombre][datosEstructurados[nombre].length - 1]
            .venta
        : null;
    datosEstructurados[nombre].forEach((cotizacion) => {
      let aumento = false;
      if (cotizacion.venta > ventaAnterior) {
        aumento = true;
      }
      ventaAnterior = cotizacion.venta;
      const tr2 = document.createElement("tr");
      tr2.innerHTML = `
            <tr >
                <td></td>
                <td class="td_border">${cotizacion.fecha}</td>
                <td class="td_border">$${cotizacion.compra}</td>
                <td class="td_border">$${cotizacion.venta}</td>
                ${
                  aumento
                    ? `<td><button class="action-btn"><i class="fas fa-arrow-up"></i></button></td>`
                    : `<td><button class="action-btnn"><i class="fas fa-arrow-down"></i></button></td>`
                }
                      
            </tr>
            `;
      div.appendChild(tr2);
    });
  });
}

cargarInformes();

function filtrarInforme() {
  if (filtroMoneda.value == "todas") {
    cargarInformes(favoritos);
  } else {
    const filtrado = favoritos.filter(
      (favorito) => favorito.nombre == filtroMoneda.value
    );
    cargarInformes(filtrado);
  }
}

//mi grafica
new Chart(ctx, {
  type: "line",
  data: {
    labels: etiquetas,
    datasets: [
      {
        label: "Ventas por mes",
        data: datos,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Dolar Oficial",
        data: datosLinea2,
        borderColor: "green",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Euro",
        data: datosLinea3,
        borderColor: "red",
        fill: false,
      },
    ],
  },
});

emailjs.init("OqFgS19XfBN2RRupf");
//funcion para compartir la informacion

document.addEventListener("DOMContentLoaded", (event) => {
  const shareButton = document.getElementById("shareButton");
  const popup = document.getElementById("popup");
  const closeButton = document.getElementById("closeButton");
  const sendButton = document.getElementById("sendButton");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  shareButton.addEventListener("click", () => {
    popup.style.display = "flex";
  });

  closeButton.addEventListener("click", () => {
    popup.style.display = "none";
  });

  sendButton.addEventListener("click", function (event) {
    event.preventDefault();
    let isValid = true;
    if (nameInput.value.trim() === "") {
      alert("Por favor ingrese su nombre!");
      nameInput.focus();
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      alert("Por favor ingrese un email valido!");
      emailInput.focus();
      isValid = false;
    }

    if (!isValid) return;

    emailjs
      .send("service_0ajh0vu", "template_pa6sr8q", {
        from_name: nameInput.value,
        reply_to: emailInput.value,
      })
      .then(
        function () {
          alert("¡Formulario enviado con éxito!");
          nameInput.value = "";
          emailInput.value = "";
          popup.style.display = "none";
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
  const emailValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
