// =======================================
// TMLFE - CONTROLADOR PRINCIPAL
// Trade Machine Liga Franquicia Extraditables
// =======================================

document.addEventListener("DOMContentLoaded", iniciarAplicacion);


// =======================================
// INICIAR APLICACIÓN
// =======================================

function iniciarAplicacion() {

    console.log("🏀 TMLFE iniciada correctamente");

    if (!window.TMLFE) {
        console.error("❌ No se ha cargado database.js");
        mostrarErrorBaseDatos();
        return;
    }

    if (!Array.isArray(window.TMLFE.teams)) {
        console.error("❌ TMLFE.teams no existe o no es un array");
        mostrarErrorBaseDatos();
        return;
    }

    if (!Array.isArray(window.TMLFE.players)) {
        console.error("❌ TMLFE.players no existe o no es un array");
        mostrarErrorBaseDatos();
        return;
    }

    console.log(
        `✅ Equipos cargados: ${window.TMLFE.teams.length}`
    );

    console.log(
        `✅ Jugadores cargados: ${window.TMLFE.players.length}`
    );

    actualizarDashboardPrincipal();
}


// =======================================
// ACTUALIZAR DASHBOARD
// =======================================

function actualizarDashboardPrincipal() {

    const totalEquipos = document.getElementById("total-equipos");
    const totalJugadores = document.getElementById("total-jugadores");
    const totalTrades = document.getElementById("total-trades");

    if (totalEquipos) {
        totalEquipos.textContent =
            `${window.TMLFE.teams.length} franquicias cargadas`;
    }

    if (totalJugadores) {
        totalJugadores.textContent =
            `${window.TMLFE.players.length} jugadores registrados`;
    }

    if (totalTrades) {

        let cantidadTrades = 0;

        if (
            window.TradesDB &&
            Array.isArray(window.TradesDB.trades)
        ) {
            cantidadTrades = window.TradesDB.trades.length;
        }

        totalTrades.textContent =
            `${cantidadTrades} trades realizados`;
    }

    mostrarResumenDashboard();
}


// =======================================
// MOSTRAR RESUMEN EN EL DASHBOARD
// =======================================

function mostrarResumenDashboard() {

    const app = document.getElementById("app");

    if (!app) {
        return;
    }

    const equipos = window.TMLFE.teams;
    const jugadores = window.TMLFE.players;

    const ratingMedio = jugadores.length
        ? (
            jugadores.reduce(
                (total, jugador) =>
                    total + Number(jugador.rating || 0),
                0
            ) / jugadores.length
        ).toFixed(1)
        : "0.0";

    app.innerHTML = `
        <section class="dashboard">

            <div class="dashboard-header">
                <p class="dashboard-kicker">
                    LEAGUE COMMAND CENTER
                </p>

                <h2>
                    Trade Machine Liga Franquicia Extraditables
                </h2>

                <p>
                    Base de datos oficial de la temporada 2026/27.
                </p>
            </div>

            <div class="dashboard-grid">

                <article class="dashboard-card">
                    <span class="dashboard-card-label">
                        Franquicias
                    </span>

                    <strong id="total-equipos">
                        ${equipos.length}
                    </strong>

                    <small>
                        Equipos registrados
                    </small>
                </article>

                <article class="dashboard-card">
                    <span class="dashboard-card-label">
                        Jugadores
                    </span>

                    <strong id="total-jugadores">
                        ${jugadores.length}
                    </strong>

                    <small>
                        Jugadores registrados
                    </small>
                </article>

                <article class="dashboard-card">
                    <span class="dashboard-card-label">
                        Rating medio
                    </span>

                    <strong>
                        ${ratingMedio}
                    </strong>

                    <small>
                        Media general de la liga
                    </small>
                </article>

                <article class="dashboard-card">
                    <span class="dashboard-card-label">
                        Traspasos
                    </span>

                    <strong id="total-trades">
                        0
                    </strong>

                    <small>
                        Operaciones registradas
                    </small>
                </article>

            </div>

            <div class="dashboard-actions">

                <button
                    type="button"
                    onclick="location.href='teams.html'"
                >
                    Ver las 30 franquicias
                </button>

                <button
                    type="button"
                    onclick="location.href='players.html'"
                >
                    Consultar jugadores
                </button>

                <button
                    type="button"
                    onclick="location.href='trade.html'"
                >
                    Abrir Trade Machine
                </button>

            </div>

        </section>
    `;
}


// =======================================
// ERROR DE BASE DE DATOS
// =======================================

function mostrarErrorBaseDatos() {

    const app = document.getElementById("app");

    if (!app) {
        return;
    }

    app.innerHTML = `
        <section class="database-error">

            <h2>
                No se ha podido cargar la base de datos
            </h2>

            <p>
                Comprueba que database.js está cargado antes que app.js.
            </p>

            <p>
                Abre la consola del navegador para ver más información.
            </p>

        </section>
    `;
}


// =======================================
// NAVEGACIÓN
// =======================================

function abrirModulo(modulo) {

    const rutas = {
        dashboard: "index.html",
        jugadores: "players.html",
        equipos: "teams.html",
        traspasos: "trade.html"
    };

    if (rutas[modulo]) {
        window.location.href = rutas[modulo];
        return;
    }

    console.warn("⚠️ Módulo desconocido:", modulo);
}


// =======================================
// GUARDADO LOCAL
// =======================================

function guardarEstado() {

    if (!window.TMLFE) {
        console.error(
            "❌ No se puede guardar: TMLFE no está disponible"
        );
        return;
    }

    try {

        localStorage.setItem(
            "TMLFE_DATA",
            JSON.stringify(window.TMLFE)
        );

        console.log("💾 Datos guardados correctamente");

    } catch (error) {

        console.error(
            "❌ Error al guardar los datos:",
            error
        );
    }
}


// =======================================
// CARGAR DATOS GUARDADOS
// =======================================

function cargarEstado() {

    const datosGuardados =
        localStorage.getItem("TMLFE_DATA");

    if (!datosGuardados) {
        console.log("ℹ️ No hay datos guardados");
        return false;
    }

    try {

        const datos = JSON.parse(datosGuardados);

        if (
            !Array.isArray(datos.teams) ||
            !Array.isArray(datos.players)
        ) {
            console.error(
                "❌ Los datos guardados no tienen el formato correcto"
            );

            return false;
        }

        window.TMLFE = datos;

        console.log("📂 Datos recuperados correctamente");

        actualizarDashboardPrincipal();

        return true;

    } catch (error) {

        console.error(
            "❌ Error al recuperar los datos:",
            error
        );

        return false;
    }
}


// =======================================
// RESTABLECER DATOS GUARDADOS
// =======================================

function borrarEstadoGuardado() {

    localStorage.removeItem("TMLFE_DATA");

    console.log("🗑️ Datos locales eliminados");
}


// =======================================
// HACER FUNCIONES ACCESIBLES
// =======================================

window.abrirModulo = abrirModulo;
window.guardarEstado = guardarEstado;
window.cargarEstado = cargarEstado;
window.borrarEstadoGuardado = borrarEstadoGuardado;


console.log("⚙️ app.js cargado correctamente");
