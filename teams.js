// =========================================================
// TMLFE - FRANCHISES CONTROLLER
// Pantalla general de franquicias
// =========================================================

"use strict";

const SALARY_CAP = 170000000;
const TEMPORADA_ACTUAL = "2026/27";

let todasLasFranquicias = [];

document.addEventListener("DOMContentLoaded", iniciarPantallaFranquicias);


// =========================================================
// INICIO
// =========================================================

function iniciarPantallaFranquicias() {

    todasLasFranquicias = obtenerFranquiciasBaseDatos();

    console.log(
        "Franquicias cargadas:",
        todasLasFranquicias.length
    );

    console.log(
        "Jugadores cargados:",
        obtenerListaGeneralJugadores().length
    );

    configurarBuscador();
    configurarFiltros();

    renderizarFranquicias(todasLasFranquicias);
    actualizarNumeroFranquicias(todasLasFranquicias.length);
}


// =========================================================
// OBTENER FRANQUICIAS
// =========================================================

function obtenerFranquiciasBaseDatos() {

    if (
        typeof TMLFE !== "undefined" &&
        Array.isArray(TMLFE.teams)
    ) {
        return TMLFE.teams;
    }

    console.error(
        "No se encontró TMLFE.teams. Comprueba que database.js carga antes que teams.js."
    );

    return [];
}


// =========================================================
// OBTENER JUGADORES
// =========================================================

function obtenerListaGeneralJugadores() {

    if (
        typeof TMLFE !== "undefined" &&
        Array.isArray(TMLFE.players)
    ) {
        return TMLFE.players;
    }

    console.error(
        "No se encontró TMLFE.players en database.js."
    );

    return [];
}


// =========================================================
// RENDERIZAR FRANQUICIAS
// =========================================================

function renderizarFranquicias(lista) {

    const contenedor = obtenerContenedorFranquicias();

    if (!contenedor) {

        console.error(
            "No se encontró el contenedor de franquicias."
        );

        return;
    }

    contenedor.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {

        contenedor.innerHTML = `
            <div class="empty-state">
                <strong>No se encontraron franquicias</strong>
                <span>
                    Comprueba que database.js se carga antes que teams.js.
                </span>
            </div>
        `;

        return;
    }

    lista.forEach((franquicia, indice) => {

        const tarjeta = crearTarjetaFranquicia(
            franquicia,
            indice
        );

        contenedor.appendChild(tarjeta);
    });
}


// =========================================================
// CREAR TARJETA
// =========================================================

function crearTarjetaFranquicia(franquicia, indice) {

    const nombre = franquicia.name || "Franquicia TMLFE";
    const abreviatura = franquicia.short || "";
    const conferencia = franquicia.conference || "";
    const division = franquicia.division || "";
    const manager = franquicia.manager || "Sin asignar";

    const jugadores = obtenerJugadoresFranquicia(franquicia);
    const salario = calcularSalarioPlantilla(jugadores);
    const espacio = SALARY_CAP - salario;

    const porcentaje = SALARY_CAP > 0
        ? (salario / SALARY_CAP) * 100
        : 0;

    const porcentajeBarra = Math.min(
        Math.max(porcentaje, 0),
        100
    );

    const logo = obtenerLogoFranquicia(abreviatura);

    const tarjeta = document.createElement("article");

    tarjeta.className = "franchise-card";
    tarjeta.style.animationDelay = `${indice * 0.025}s`;

    tarjeta.innerHTML = `

        <div class="franchise-card-glow"></div>

        <div class="franchise-header">

            <div class="franchise-logo-box">

                <img
                    class="franchise-logo"
                    src="${escaparHTML(logo)}"
                    alt="Escudo de ${escaparHTML(nombre)}"
                >

            </div>

            <div class="franchise-identity">

                <span>
                    ${escaparHTML(
                        construirUbicacion(
                            conferencia,
                            division
                        )
                    )}
                </span>

                <h3>
                    ${escaparHTML(nombre)}
                </h3>

                <p>
                    ${escaparHTML(abreviatura)}
                </p>

            </div>

        </div>

        <div class="franchise-manager">

            <span>
                General Manager
            </span>

            <strong>
                ${escaparHTML(manager)}
            </strong>

        </div>

        <div class="franchise-numbers">

            <div>

                <span>
                    Plantilla
                </span>

                <strong>
                    ${jugadores.length}
                </strong>

                <small>
                    jugadores
                </small>

            </div>

            <div>

                <span>
                    Salario
                </span>

                <strong>
                    ${formatearMillones(salario)}
                </strong>

                <small>
                    comprometido
                </small>

            </div>

        </div>

        <div class="salary-progress">

            <div class="salary-progress-header">

                <span>
                    Salary Cap
                </span>

                <strong class="${obtenerClaseSalarial(espacio)}">
                    ${formatearEspacioSalarial(espacio)}
                </strong>

            </div>

            <div class="salary-track">

                <span
                    style="width: ${porcentajeBarra}%"
                ></span>

            </div>

            <div class="salary-progress-footer">

                <span>
                    ${formatearMillones(salario)}
                </span>

                <span>
                    170,0 M
                </span>

            </div>

        </div>

        <div class="franchise-footer">

            <a
                class="franchise-open-button"
                href="players.html?team=${encodeURIComponent(abreviatura)}"
            >

                <span>
                    Ver plantilla
                </span>

                <span>
                    →
                </span>

            </a>

        </div>
    `;

    const imagen = tarjeta.querySelector(".franchise-logo");

    if (imagen) {

        imagen.addEventListener("error", function () {
            this.style.visibility = "hidden";
        });
    }

    return tarjeta;
}


// =========================================================
// OBTENER JUGADORES DE LA FRANQUICIA
// =========================================================

function obtenerJugadoresFranquicia(franquicia) {

    const jugadores = obtenerListaGeneralJugadores();

    const nombreEquipo = normalizarTexto(
        franquicia.name
    );

    const codigoEquipo = normalizarTexto(
        franquicia.short
    );

    return jugadores.filter(jugador => {

        const equipoNombre = normalizarTexto(
            jugador.team
        );

        const equipoCodigo = normalizarTexto(
            jugador.teamShort
        );

        return (
            equipoNombre === nombreEquipo ||
            equipoCodigo === codigoEquipo
        );
    });
}


// =========================================================
// CALCULAR SALARIO
// =========================================================

function calcularSalarioPlantilla(jugadores) {

    return jugadores.reduce((total, jugador) => {

        return total + obtenerSalarioJugador(jugador);

    }, 0);
}


function obtenerSalarioJugador(jugador) {

    if (
        jugador.salaries &&
        jugador.salaries[TEMPORADA_ACTUAL] !== undefined
    ) {
        return convertirSalarioANumero(
            jugador.salaries[TEMPORADA_ACTUAL]
        );
    }

    if (jugador.salary !== undefined) {
        return convertirSalarioANumero(jugador.salary);
    }

    if (jugador.salario !== undefined) {
        return convertirSalarioANumero(jugador.salario);
    }

    return 0;
}


function convertirSalarioANumero(salario) {

    if (typeof salario === "number") {
        return Number.isFinite(salario) ? salario : 0;
    }

    if (typeof salario !== "string") {
        return 0;
    }

    /*
        Admite valores como:

        "10183200 TO"
        "16438275 PO"
        "7,2 M"
        "$7200000"
    */

    let texto = salario
        .trim()
        .toUpperCase()
        .replace("TO", "")
        .replace("PO", "")
        .replace("RFA", "")
        .replace("UFA", "")
        .replace(/\$/g, "")
        .replace(/€/g, "")
        .trim();

    const expresadoEnMillones = texto.includes("M");

    texto = texto
        .replace(/M/g, "")
        .replace(/\s/g, "");

    if (texto.includes(".") && texto.includes(",")) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    } else {

        texto = texto.replace(",", ".");
    }

    const numero = Number(texto);

    if (!Number.isFinite(numero)) {
        return 0;
    }

    if (expresadoEnMillones) {
        return numero * 1000000;
    }

    return numero;
}


// =========================================================
// LOGOS
// =========================================================

function obtenerLogoFranquicia(abreviatura) {

    const codigo = String(abreviatura || "")
        .trim()
        .toLowerCase();

    return `assets/logos/${codigo}.png`;
}


// =========================================================
// CONTENEDOR
// =========================================================

function obtenerContenedorFranquicias() {

    return (
        document.getElementById("franchisesGrid") ||
        document.getElementById("teamsGrid") ||
        document.getElementById("franquiciasGrid") ||
        document.querySelector(".franchises-grid")
    );
}


// =========================================================
// BUSCADOR
// =========================================================

function configurarBuscador() {

    const buscador =
        document.getElementById("teamSearch") ||
        document.getElementById("franchiseSearch") ||
        document.querySelector(
            '.teams-toolbar input[type="search"]'
        );

    if (!buscador) {
        return;
    }

    buscador.addEventListener(
        "input",
        aplicarFiltros
    );
}


// =========================================================
// FILTROS
// =========================================================

function configurarFiltros() {

    const filtros = document.querySelectorAll(
        ".teams-toolbar select"
    );

    filtros.forEach(filtro => {

        filtro.addEventListener(
            "change",
            aplicarFiltros
        );
    });
}


function aplicarFiltros() {

    const buscador =
        document.getElementById("teamSearch") ||
        document.getElementById("franchiseSearch") ||
        document.querySelector(
            '.teams-toolbar input[type="search"]'
        );

    const selects = Array.from(
        document.querySelectorAll(
            ".teams-toolbar select"
        )
    );

    const termino = normalizarTexto(
        buscador ? buscador.value : ""
    );

    const valoresSelect = selects
        .map(select => normalizarTexto(select.value))
        .filter(valor =>
            valor &&
            valor !== "todos" &&
            valor !== "todas" &&
            valor !== "all"
        );

    const resultados = todasLasFranquicias.filter(
        franquicia => {

            const textoFranquicia = normalizarTexto(
                [
                    franquicia.name,
                    franquicia.short,
                    franquicia.conference,
                    franquicia.division,
                    franquicia.manager
                ].join(" ")
            );

            const coincideBusqueda =
                !termino ||
                textoFranquicia.includes(termino);

            const coincideSelects =
                valoresSelect.every(valor =>
                    textoFranquicia.includes(valor)
                );

            return coincideBusqueda && coincideSelects;
        }
    );

    renderizarFranquicias(resultados);
    actualizarNumeroFranquicias(resultados.length);
}


// =========================================================
// FORMATOS
// =========================================================

function construirUbicacion(conferencia, division) {

    if (conferencia && division) {
        return `${conferencia} · ${division}`;
    }

    return conferencia || division || "FRANQUICIA TMLFE";
}


function formatearMillones(cantidad) {

    const numero = Number(cantidad) || 0;

    return (
        numero / 1000000
    ).toLocaleString(
        "es-ES",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    ) + " M";
}


function formatearEspacioSalarial(cantidad) {

    const simbolo = cantidad >= 0 ? "+" : "-";

    return (
        simbolo +
        formatearMillones(Math.abs(cantidad)) +
        (
            cantidad >= 0
                ? " libres"
                : " excedido"
        )
    );
}


function obtenerClaseSalarial(espacio) {

    if (espacio < 0) {
        return "salary-negative";
    }

    if (espacio < 15000000) {
        return "salary-warning";
    }

    return "salary-positive";
}


// =========================================================
// UTILIDADES
// =========================================================

function normalizarTexto(valor) {

    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function actualizarNumeroFranquicias(numero) {

    const elementos = [
        document.getElementById("teamsCount"),
        document.getElementById("franchiseCount"),
        document.getElementById("totalTeams"),
        document.querySelector(".teams-hero-number strong")
    ];

    elementos.forEach(elemento => {

        if (elemento) {
            elemento.textContent = numero;
        }
    });
}
