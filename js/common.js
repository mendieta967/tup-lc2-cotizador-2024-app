const opinionContainer = document.getElementById("contenedor_reseña");
const ultimaActualizacion = document.getElementById("ultima-actualizacion");
const errorConteiner = document.getElementById("error-container");
const cotizacionesConteiner = document.getElementById("cotizacionesContainer");
const filtroCotizacion = document.getElementById("filtroCotizacion");
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
const botonFiltrar = document.getElementById("botonFiltrar");

botonFiltrar.addEventListener("click", filtrarCotizacion);

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

//Actualizamos la fecha cada vez que entramos
function actualizarFecha() {
  const fecha = new Date();
  ultimaActualizacion.textContent = fecha.toLocaleString();
}
actualizarFecha(); // Llamada a la funcion

//creamos los errores para cuando algo falle en la api
function mostrarError() {
  errorConteiner.style.display = "flex";
}
function ocultarError() {
  errorConteiner.style.display = "none";
}
//cuando hacemos click el error desaparece
window.onclick = function (event) {
  if (event.target == errorConteiner) {
    ocultarError();
  }
};

//llamamos a la api
async function fetchApi(url) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error("Error al llamar la API");
    }
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.log(error);
    mostrarError();
  }
}

async function cargarCotizacionesHoy() {
  const cotizaciones = await fetchApi("https://dolarapi.com/v1/cotizaciones");
  mostrarCotizaciones(cotizaciones);
}
cargarCotizacionesHoy();

//creamos la funcion para mostrar lo que nos trae nuestra API

let cotizacionesActual;
const fecha = new Date();
const dia = fecha.getDate();
const mes = fecha.getMonth() + 1; // Los meses empiezan desde 0, por lo tanto sumamos 1
const año = fecha.getFullYear();

const fechaFormateada = `${dia}/${mes}/${año}`;

function mostrarCotizaciones(cotizaciones) {
  console.log(cotizaciones);
  cotizacionesActual = cotizaciones;
  cotizacionesConteiner.innerHTML = "";

  cotizaciones.forEach((cotizacion) => {
    if (cotizacion.nombre == "Dólar") cotizacion.nombre = "Oficial";
    const esFavorito = favoritos.find(
      (favorito) =>
        favorito.fecha == fechaFormateada &&
        favorito.nombre == cotizacion.nombre
    );
    console.log(esFavorito);
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="cotizacion" id="${cotizacion.nombre}">
            <div class="titulo_cotizacion">
                <h3>${cotizacion.nombre}</h3>
            </div>
            <div class="precio">
                <div class="compra_precio">
                    <li>Compra</li>
                    <li>$${cotizacion.compra}</li>
                </div>
                <div class="venta_precio">
                    <li>Venta</li>
                    <li>$${cotizacion.venta}</li>
                </div>
            </div>
            <div class="buuton_favorito">
            ${
              esFavorito
                ? `<button class="action-btn favorito" onclick="manejarFavorito('${cotizacion.nombre}', ${cotizacion.compra}, ${cotizacion.venta})">&#9733</button>`
                : `<button class="action-btn" onclick="manejarFavorito('${cotizacion.nombre}', ${cotizacion.compra}, ${cotizacion.venta})">&#9733</button>`
            }
            </div>
        </div>`;
    cotizacionesConteiner.appendChild(div);
  });
}
function manejarFavorito(nombre, compra, venta) {
  const index = favoritos.findIndex(
    (favorito) =>
      favorito.nombre === nombre && favorito.fecha === fechaFormateada
  );
  if (index == -1) {
    const moneda = { nombre, fecha: fechaFormateada, compra, venta };
    favoritos.push(moneda);
  } else {
    favoritos.splice(index, 1);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarCotizaciones(cotizacionesActual);
}

async function filtrarCotizacion() {
  if (filtroCotizacion.value === "todas") return cargarCotizacionesHoy();

  let url = "https://dolarapi.com/v1/";
  if (
    filtroCotizacion.value === "eur" ||
    filtroCotizacion.value === "brl" ||
    filtroCotizacion.value === "clp" ||
    filtroCotizacion.value === "uyu"
  ) {
    url = url + "cotizaciones/";
  } else {
    url = url + "dolares/";
  }

  const cotizacion = await fetchApi(url + filtroCotizacion.value);
  mostrarCotizaciones([cotizacion]);
}
