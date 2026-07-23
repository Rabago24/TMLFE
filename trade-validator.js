"use strict";

// =======================================
// TMLFE - Interfaz principal Trade Machine
// =======================================

document.addEventListener("DOMContentLoaded", iniciarTradeMachine);

function iniciarTradeMachine() {

    if (!window.TMLFETradeManager) {
        mostrarErrorInicial(
            "No se ha cargado correctamente trade-manager.js."
        );
        return;
    }

    prepararSelectores();
    conectarBotones();
    renderizarTrade();

    window.addEventListener(
        "tmlfe-trade-updated",
        renderizarTrade
    );
}


// =======================================
// BASE DE DATOS
// =======================================

function obtenerEquipos() {

    if (
        window.TMLFE &&
        Array.isArray(window.TMLFE.teams)
    ) {
        return window.TMLFE.teams;
    }

    if (
        window.TMLFE &&
        Array.isArray(window.TMLFE.equipos)
    ) {
        return window.TMLFE.equipos;
    }

    if (
        window.TMLFE_DATABASE &&
        Array.isArray(window.TMLFE_DATABASE.equipos)
    ) {
        return window.TMLFE_DATABASE.equipos;
    }

    return [];
}


function obtenerJugadores() {

    if (
        window.TMLFE &&
        Array.isArray(window.TMLFE.players)
    ) {
        return window.TMLFE.players;
    }

    if (
        window.TMLFE &&
        Array.isArray(window.TMLFE.jugadores)
    ) {
        return window.TMLFE.jugadores;
    }

    if (
        window.TMLFE_DATABASE &&
        Array.isArray(window.TMLFE_DATABASE.jugadores)
    ) {
        return window.TMLFE_DATABASE.jugadores;
    }

    return [];
}


function obtenerCodigoEquipo(equipo) {

    return String(
        equipo.short ||
        equipo.code ||
        equipo.abbreviation ||
        equipo.id ||
        equipo.codigo ||
        equipo.abreviatura ||
        equipo.nombre ||
        equipo.name ||
        ""
    ).trim();
}


function obtenerNombreEquipo(equipo) {

    return String(
        equipo.name ||
        equipo.nombre ||
        equipo.fullName ||
        equipo.franchise ||
        obtenerCodigoEquipo(equipo) ||
        "Franquicia"
    ).trim();
}


function obtenerCodigoJugador(jugador) {

    return String(
        jugador.teamShort ||
        jugador.teamCode ||
        jugador.team ||
        jugador.equipo ||
        jugador.franchiseShort ||
        ""
    ).trim();
}


function obtenerNombreJugador(jugador) {

    return String(
        jugador.name ||
        jugador.nombre ||
        jugador.playerName ||
        jugador.fullName ||
        "Jugador sin nombre"
    ).trim();
}


function obtenerIdJugador(jugador) {

    return String(
        jugador.id ||
        jugador.playerId ||
        jugador.name ||
        jugador.nombre ||
        jugador.playerName ||
        jugador.fullName ||
        ""
    ).trim();
}


function obtenerMediaJugador(jugador) {

    return (
        jugador.overall ||
        jugador.ovr ||
        jugador.rating ||
        jugador.media ||
        "-"
    );
}


function obtenerPosicionJugador(jugador) {

    return String(
        jugador.position ||
        jugador.pos ||
        jugador.posicion ||
        "-"
    ).trim();
}


// =======================================
// CONVERSIÓN Y FORMATO
// =======================================

function convertirNumero(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {
        return 0;
    }

    if (typeof valor === "number") {
        return Number.isFinite(valor)
            ? valor
            : 0;
    }

    const textoOriginal = String(valor).trim();

    let texto = textoOriginal
        .replace(/\s/g, "")
        .replace(/[€$]/g, "");

    if (
        texto.includes(",") &&
        texto.includes(".")
    ) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    } else {

        texto = texto.replace(",", ".");
    }

    const coincidencia =
        texto.match(/-?\d+(\.\d+)?/);

    let numero = coincidencia
        ? Number(coincidencia[0]) || 0
        : 0;

    if (
        /m(illones?)?$/i.test(textoOriginal) &&
        Math.abs(numero) < 1000000
    ) {
        numero *= 1000000;
    }

    return numero;
}


function obtenerSalarioJugador(jugador) {

    if (
        jugador.salaries &&
        jugador.salaries["2026/27"] !== undefined
    ) {
        return convertirNumero(
            jugador.salaries["2026/27"]
        );
    }

    if (
        jugador.salary &&
        typeof jugador.salary === "object" &&
        jugador.salary["2026/27"] !== undefined
    ) {
        return convertirNumero(
            jugador.salary["2026/27"]
        );
    }

    return convertirNumero(
        jugador.salary ||
        jugador.salario ||
        jugador.currentSalary ||
        jugador["26/27"] ||
        0
    );
}


function formatearMillones(valor) {

    const numero = convertirNumero(valor);

    return (
        numero / 1000000
    ).toLocaleString(
        "es-ES",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }
    ) + " M";
}


function normalizar(valor) {

    return String(valor || "")
        .trim()
        .toLowerCase();
}


// =======================================
// SELECTORES
// =======================================

function prepararSelectores() {

    crearSelectorEquipo("A");
    crearSelectorEquipo("B");
}


function crearSelectorEquipo(lado) {

    const contenedor =
        document.getElementById(
            lado === "A"
                ? "jugadores-equipo-a"
                : "jugadores-equipo-b"
        );

    if (!contenedor) {
        return;
    }

    const bloque = document.createElement("div");

    bloque.className = "trade-selector-box";

    bloque.innerHTML = `
        <label class="trade-selector-label">
            Seleccionar franquicia
        </label>

        <select
            id="selector-equipo-${lado.toLowerCase()}"
            class="trade-team-select"
        >
            <option value="">
                Selecciona un equipo
            </option>
        </select>

        <label class="trade-selector-label">
            Añadir jugador
        </label>

        <div class="trade-add-player-row">

            <select
                id="selector-jugador-${lado.toLowerCase()}"
                class="trade-player-select"
                disabled
            >
                <option value="">
                    Selecciona primero una franquicia
                </option>
            </select>

            <button
                id="añadir-jugador-${lado.toLowerCase()}"
                class="primary-button trade-add-button"
                type="button"
                disabled
            >
                Añadir
            </button>

        </div>

        <div
            id="lista-trade-${lado.toLowerCase()}"
            class="trade-selected-players"
        >
        </div>
    `;

    contenedor.innerHTML = "";
    contenedor.appendChild(bloque);

    rellenarEquipos(lado);
    conectarSelectorEquipo(lado);
    conectarBotonAñadir(lado);
}


function rellenarEquipos(lado) {

    const selector =
        document.getElementById(
            `selector-equipo-${lado.toLowerCase()}`
        );

    if (!selector) {
        return;
    }

    const equipos = obtenerEquipos();

    equipos
        .slice()
        .sort(
            (a, b) =>
                obtenerNombreEquipo(a).localeCompare(
                    obtenerNombreEquipo(b),
                    "es"
                )
        )
        .forEach(function (equipo) {

            const opcion =
                document.createElement("option");

            opcion.value =
                obtenerCodigoEquipo(equipo);

            opcion.textContent =
                obtenerNombreEquipo(equipo);

            selector.appendChild(opcion);
        });
}


function conectarSelectorEquipo(lado) {

    const selector =
        document.getElementById(
            `selector-equipo-${lado.toLowerCase()}`
        );

    if (!selector) {
        return;
    }

    selector.addEventListener(
        "change",
        function () {

            const otroLado =
                lado === "A"
                    ? "B"
                    : "A";

            const otroSelector =
                document.getElementById(
                    `selector-equipo-${otroLado.toLowerCase()}`
                );

            if (
                selector.value &&
                otroSelector &&
                selector.value === otroSelector.value
            ) {

                selector.value = "";

                mostrarToast(
                    "Debes seleccionar dos franquicias diferentes.",
                    "error"
                );

                rellenarJugadoresSelector(lado);
                return;
            }

            window.TMLFETradeManager.clear();

            rellenarJugadoresSelector("A");
            rellenarJugadoresSelector("B");
            actualizarCabecerasDesdeSelectores();
            renderizarTrade();
        }
    );
}


function rellenarJugadoresSelector(lado) {

    const equipoSelector =
        document.getElementById(
            `selector-equipo-${lado.toLowerCase()}`
        );

    const jugadorSelector =
        document.getElementById(
            `selector-jugador-${lado.toLowerCase()}`
        );

    const boton =
        document.getElementById(
            `añadir-jugador-${lado.toLowerCase()}`
        );

    if (
        !equipoSelector ||
        !jugadorSelector ||
        !boton
    ) {
        return;
    }

    const codigoEquipo =
        equipoSelector.value;

    jugadorSelector.innerHTML = "";

    if (!codigoEquipo) {

        jugadorSelector.disabled = true;
        boton.disabled = true;

        jugadorSelector.innerHTML = `
            <option value="">
                Selecciona primero una franquicia
            </option>
        `;

        return;
    }

    jugadorSelector.disabled = false;
    boton.disabled = false;

    jugadorSelector.innerHTML = `
        <option value="">
            Selecciona un jugador
        </option>
    `;

    const jugadoresEquipo =
        obtenerJugadores()
            .filter(function (jugador) {

                return (
                    normalizar(
                        obtenerCodigoJugador(jugador)
                    ) ===
                    normalizar(codigoEquipo)
                );
            })
            .sort(
                (a, b) =>
                    obtenerNombreJugador(a).localeCompare(
                        obtenerNombreJugador(b),
                        "es"
                    )
            );

    jugadoresEquipo.forEach(function (jugador) {

        const opcion =
            document.createElement("option");

        opcion.value =
            obtenerIdJugador(jugador);

        opcion.textContent =
            `${obtenerNombreJugador(jugador)} · ` +
            `${obtenerPosicionJugador(jugador)} · ` +
            `${obtenerMediaJugador(jugador)} OVR · ` +
            `${formatearMillones(obtenerSalarioJugador(jugador))}`;

        jugadorSelector.appendChild(opcion);
    });

    if (jugadoresEquipo.length === 0) {

        jugadorSelector.innerHTML = `
            <option value="">
                No se encontraron jugadores
            </option>
        `;

        jugadorSelector.disabled = true;
        boton.disabled = true;
    }
}


function conectarBotonAñadir(lado) {

    const boton =
        document.getElementById(
            `añadir-jugador-${lado.toLowerCase()}`
        );

    if (!boton) {
        return;
    }

    boton.addEventListener(
        "click",
        function () {

            añadirJugadorSeleccionado(lado);
        }
    );
}


function añadirJugadorSeleccionado(lado) {

    const selectorEquipo =
        document.getElementById(
            `selector-equipo-${lado.toLowerCase()}`
        );

    const selectorJugador =
        document.getElementById(
            `selector-jugador-${lado.toLowerCase()}`
        );

    if (
        !selectorEquipo ||
        !selectorJugador
    ) {
        return;
    }

    const codigoEquipo =
        selectorEquipo.value;

    const idJugador =
        selectorJugador.value;

    if (!codigoEquipo) {

        mostrarToast(
            "Selecciona primero una franquicia.",
            "error"
        );

        return;
    }

    if (!idJugador) {

        mostrarToast(
            "Selecciona un jugador.",
            "error"
        );

        return;
    }

    const jugador =
        obtenerJugadores().find(
            function (item) {

                return (
                    obtenerIdJugador(item) === idJugador
                );
            }
        );

    if (!jugador) {

        mostrarToast(
            "No se ha encontrado el jugador.",
            "error"
        );

        return;
    }

    /*
     * El gestor asigna el primer equipo añadido al lado A.
     * Para mantener correctamente A y B, añadimos primero
     * jugadores del selector A.
     */

    const estado =
        window.TMLFETradeManager.getState();

    if (
        lado === "B" &&
        estado.playersA.length === 0
    ) {

        mostrarToast(
            "Añade primero al menos un jugador del equipo A.",
            "error"
        );

        return;
    }

    const resultado =
        window.TMLFETradeManager.addPlayer(jugador);

    if (!resultado.ok) {

        mostrarToast(
            resultado.message,
            "error"
        );

        return;
    }

    selectorJugador.value = "";

    mostrarToast(
        resultado.message,
        "success"
    );

    renderizarTrade();
}


// =======================================
// RENDERIZADO
// =======================================

function renderizarTrade() {

    const estado =
        window.TMLFETradeManager.getState();

    const resumen =
        window.TMLFETradeManager.getSummary();

    renderizarLista("A", estado.playersA);
    renderizarLista("B", estado.playersB);

    actualizarCabeceras(
        estado.teamA,
        estado.teamB
    );

    actualizarResumen(resumen);
}


function renderizarLista(lado, jugadores) {

    const lista =
        document.getElementById(
            `lista-trade-${lado.toLowerCase()}`
        );

    if (!lista) {
        return;
    }

    if (!Array.isArray(jugadores) || jugadores.length === 0) {

        lista.innerHTML = `
            <div class="trade-empty-state">
                No hay jugadores añadidos.
            </div>
        `;

        return;
    }

    lista.innerHTML = jugadores
        .map(function (jugador) {

            return `
                <article class="trade-selected-player">

                    <div class="trade-selected-player-info">

                        <strong>
                            ${escaparHTML(jugador.name)}
                        </strong>

                        <span>
                            ${escaparHTML(jugador.position || "-")}
                            ·
                            ${escaparHTML(String(jugador.overall || "-"))} OVR
                        </span>

                    </div>

                    <div class="trade-selected-player-actions">

                        <strong>
                            ${formatearMillones(jugador.salary)}
                        </strong>

                        <button
                            type="button"
                            class="trade-remove-player"
                            data-player-id="${escaparHTML(jugador.id)}"
                            aria-label="Quitar jugador"
                        >
                            ×
                        </button>

                    </div>

                </article>
            `;
        })
        .join("");

    lista
        .querySelectorAll(".trade-remove-player")
        .forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const id =
                        boton.dataset.playerId;

                    window.TMLFETradeManager.removePlayer(id);
                }
            );
        });
}


function actualizarCabeceras(teamA, teamB) {

    actualizarCabeceraEquipo(
        "A",
        teamA
    );

    actualizarCabeceraEquipo(
        "B",
        teamB
    );
}


function actualizarCabecerasDesdeSelectores() {

    const selectorA =
        document.getElementById("selector-equipo-a");

    const selectorB =
        document.getElementById("selector-equipo-b");

    actualizarCabeceraEquipo(
        "A",
        selectorA ? selectorA.value : ""
    );

    actualizarCabeceraEquipo(
        "B",
        selectorB ? selectorB.value : ""
    );
}


function actualizarCabeceraEquipo(lado, codigo) {

    const selector =
        document.getElementById(
            `selector-equipo-${lado.toLowerCase()}`
        );

    const codigoFinal =
        codigo ||
        (
            selector
                ? selector.value
                : ""
        );

    const equipo =
        obtenerEquipos().find(
            function (item) {

                return (
                    normalizar(
                        obtenerCodigoEquipo(item)
                    ) ===
                    normalizar(codigoFinal)
                );
            }
        );

    const nombre =
        document.getElementById(
            lado === "A"
                ? "nombre-equipo-a"
                : "nombre-equipo-b"
        );

    const logo =
        document.getElementById(
            lado === "A"
                ? "logo-equipo-a"
                : "logo-equipo-b"
        );

    if (nombre) {

        nombre.textContent =
            equipo
                ? obtenerNombreEquipo(equipo)
                : "Sin seleccionar";
    }

    if (logo) {

        if (!codigoFinal) {

            logo.style.backgroundImage = "";
            logo.textContent = lado;
            return;
        }

        const archivoLogo =
            codigoFinal.toLowerCase() + ".png";

        logo.textContent = "";

        logo.style.backgroundImage =
            `url("./${archivoLogo}")`;

        logo.style.backgroundSize = "contain";
        logo.style.backgroundPosition = "center";
        logo.style.backgroundRepeat = "no-repeat";
    }
}


function actualizarResumen(resumen) {

    ponerTexto(
        "cantidad-jugadores-a",
        resumen.playersA
    );

    ponerTexto(
        "cantidad-jugadores-b",
        resumen.playersB
    );

    ponerTexto(
        "salario-equipo-a",
        formatearMillones(resumen.salaryA)
    );

    ponerTexto(
        "salario-equipo-b",
        formatearMillones(resumen.salaryB)
    );

    ponerTexto(
        "diferencia-salarial",
        formatearDiferencia(resumen.difference)
    );

    const estadoTrade =
        document.getElementById("estado-trade");

    if (!estadoTrade) {
        return;
    }

    if (
        resumen.playersA === 0 ||
        resumen.playersB === 0
    ) {

        estadoTrade.className =
            "trade-status pending";

        estadoTrade.textContent =
            "Añade jugadores de dos franquicias para analizar el traspaso.";

    } else {

        estadoTrade.className =
            "trade-status pending";

        estadoTrade.textContent =
            "Traspaso preparado. Pulsa Validar Trade para comprobar las reglas salariales.";
    }
}


function formatearDiferencia(valor) {

    const numero =
        convertirNumero(valor);

    if (numero === 0) {
        return "0,0 M";
    }

    const signo =
        numero > 0
            ? "+"
            : "-";

    return (
        signo +
        formatearMillones(Math.abs(numero))
    );
}


// =======================================
// VALIDACIÓN
// =======================================

function conectarBotones() {

    const botonValidar =
        document.getElementById("validar-trade");

    const botonVaciar =
        document.getElementById("vaciar-trade");

    if (botonValidar) {

        botonValidar.addEventListener(
            "click",
            validarTradeActual
        );
    }

    if (botonVaciar) {

        botonVaciar.addEventListener(
            "click",
            vaciarTradeCompleto
        );
    }
}


function validarTradeActual() {

    const estadoTrade =
        document.getElementById("estado-trade");

    if (!window.TMLFETradeValidator) {

        if (estadoTrade) {

            estadoTrade.className =
                "trade-status invalid";

            estadoTrade.textContent =
                "No se ha cargado el validador de traspasos.";
        }

        return;
    }

    const resultado =
        window.TMLFETradeValidator.validate();

    if (!estadoTrade) {
        return;
    }

    if (!resultado.valid) {

        estadoTrade.className =
            "trade-status invalid";

        let detalle = resultado.message;

        if (resultado.teamA || resultado.teamB) {

            detalle = [
                resultado.message,
                resultado.teamA
                    ? resultado.teamA.message
                    : "",
                resultado.teamB
                    ? resultado.teamB.message
                    : ""
            ]
                .filter(Boolean)
                .join(" ");
        }

        estadoTrade.textContent =
            `❌ Traspaso inválido. ${detalle}`;

        mostrarToast(
            "El traspaso no cumple las reglas salariales.",
            "error"
        );

        return;
    }

    estadoTrade.className =
        "trade-status valid";

    estadoTrade.textContent =
        "✅ Traspaso válido. Ambos equipos cumplen la regla salarial implementada.";

    mostrarToast(
        "Traspaso válido.",
        "success"
    );
}


function vaciarTradeCompleto() {

    window.TMLFETradeManager.clear();

    const selectorA =
        document.getElementById("selector-equipo-a");

    const selectorB =
        document.getElementById("selector-equipo-b");

    if (selectorA) {
        selectorA.value = "";
    }

    if (selectorB) {
        selectorB.value = "";
    }

    rellenarJugadoresSelector("A");
    rellenarJugadoresSelector("B");

    actualizarCabeceras("", "");
    renderizarTrade();

    mostrarToast(
        "Traspaso vaciado.",
        "success"
    );
}


// =======================================
// UTILIDADES
// =======================================

function ponerTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}


function mostrarToast(mensaje, tipo) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = mensaje;
    toast.className =
        `toast show ${tipo || ""}`;

    clearTimeout(
        mostrarToast.temporizador
    );

    mostrarToast.temporizador =
        setTimeout(
            function () {

                toast.className = "toast";
            },
            2800
        );
}


function mostrarErrorInicial(mensaje) {

    const estado =
        document.getElementById("estado-trade");

    if (estado) {

        estado.className =
            "trade-status invalid";

        estado.textContent = mensaje;
    }
}


function escaparHTML(valor) {

    return String(valor || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
