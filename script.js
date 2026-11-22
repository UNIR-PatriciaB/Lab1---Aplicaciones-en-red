// Blog Dolomitas: navegación, detalles y planificador.
// Se utiliza JavaScript puro para practicar DOM, eventos y handlers.

"use strict";

// 1. Navegación: resaltar el enlace seleccionado.
const enlacesNavegacion = document.querySelectorAll('nav a');

function actualizarNavegacion() {
  const seccion = window.location.hash || "#inicio";
  enlacesNavegacion.forEach(function (enlace) {
    if (enlace.getAttribute("href") === seccion) {
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.removeAttribute("aria-current");
    }
  });
}
window.addEventListener("hashchange", actualizarNavegacion);
actualizarNavegacion();

// 2. Detalles desplegables de las rutas.
const botonesDetalles = document.querySelectorAll(".boton-detalles");

function alternarDetalles(evento) {
  const boton = evento.currentTarget;
  const panel = document.getElementById(boton.getAttribute("aria-controls"));
  const abierto = boton.getAttribute("aria-expanded") === "true";

  panel.hidden = abierto;
  boton.setAttribute("aria-expanded", String(!abierto));
  boton.innerHTML = abierto
    ? 'Ver detalles <span aria-hidden="true">+</span>'
    : 'Ocultar detalles <span aria-hidden="true">−</span>';
}

botonesDetalles.forEach(function (boton) {
  boton.addEventListener("click", alternarDetalles);
});

// 3. Si falta alguna fotografía, mostrar un aviso elegante sin imagen rota.
document.querySelectorAll(".foto img").forEach(function (imagen) {
  function gestionarErrorImagen() {
    imagen.closest(".foto").classList.add("sin-imagen");
  }
  imagen.addEventListener("error", gestionarErrorImagen);
  if (imagen.complete && imagen.naturalWidth === 0) {
    gestionarErrorImagen();
  }
});

// 4. Planificador: recomendaciones según noches y preferencias.
const formularioRuta = document.getElementById("formularioRuta");
const campoNoches = document.getElementById("noches");
const campoRitmo = document.getElementById("ritmo");
const resultadoRuta = document.getElementById("resultadoRuta");
const panelInicial = document.getElementById("panelInicial");

const lugares = {
  funes: {
    nombre: "Miradores de Val di Funes",
    descripcion: "Visita tranquila para disfrutar del valle y las montañas Odle."
  },
  cime: {
    nombre: "Tre Cime di Lavaredo",
    descripcion: "Jornada de senderismo entre paisajes de montaña."
  },
  sorapis: {
    nombre: "Lago di Sorapis",
    descripcion: "Senderismo más exigente; comprueba la dificultad y las condiciones."
  }
};

function elegirLugares(noches, ritmo) {
  // Las noches sirven como orientación, no como días completos garantizados.
  if (ritmo === "tranquilo") {
    return ["funes"];
  }
  if (ritmo === "senderismo") {
    if (noches === 1) return ["cime"];
    if (noches === 2) return ["cime", "sorapis"];
    return ["cime", "sorapis", "funes"];
  }
  if (noches === 1) return ["funes"];
  if (noches === 2) return ["cime", "funes"];
  return ["cime", "sorapis", "funes"];
}

function generarItinerario(evento) {
  evento.preventDefault(); // Evita que el formulario recargue la página.
  const noches = Number(campoNoches.value);
  const ritmo = campoRitmo.value;

  resultadoRuta.replaceChildren();
  panelInicial.hidden = true;

  if (!Number.isSafeInteger(noches) || noches < 1 || noches > 14) {
    const error = document.createElement("p");
    error.className = "error-formulario";
    error.textContent = "Introduce un número entero de noches entre 1 y 14.";
    resultadoRuta.appendChild(error);
    return;
  }

  const seleccion = elegirLugares(noches, ritmo);
  const titulo = document.createElement("h3");
  titulo.textContent = "Tu propuesta de viaje";

  const resumen = document.createElement("p");
  resumen.className = "resumen";
  resumen.textContent = noches + (noches === 1 ? " noche" : " noches") +
    " · " + seleccion.length + (seleccion.length === 1 ? " lugar sugerido" : " lugares sugeridos");

  const lista = document.createElement("ol");
  lista.className = "itinerario";

  seleccion.forEach(function (clave) {
    const lugar = lugares[clave];
    const item = document.createElement("li");
    const nombre = document.createElement("strong");
    const descripcion = document.createElement("span");
    nombre.textContent = lugar.nombre;
    descripcion.textContent = lugar.descripcion;
    item.append(nombre, descripcion);
    lista.appendChild(item);
  });

  const consejo = document.createElement("p");
  consejo.className = "resumen";
  consejo.textContent = noches > 3
    ? "Con más noches puedes repartir las visitas, descansar y dedicar tiempo a otros lugares de la región."
    : "Reserva tiempo para los desplazamientos y adapta el plan a tus horarios de llegada y salida.";

  resultadoRuta.append(titulo, resumen, lista, consejo);
}

// Listener: al enviar el formulario se ejecuta el handler generarItinerario.
formularioRuta.addEventListener("submit", generarItinerario);

// Listener adicional: si se cambia un campo, se limpia el resultado anterior.
function limpiarResultado() {
  resultadoRuta.replaceChildren();
  panelInicial.hidden = false;
}
campoNoches.addEventListener("input", limpiarResultado);
campoRitmo.addEventListener("change", limpiarResultado);
