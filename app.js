// ========================================
// TMLFE - DASHBOARD CONTROLLER
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


// ========================================
// INICIO
// ========================================

function iniciarDashboard() {

    console.log("🏀 Iniciando Dashboard TMLFE");

    const datos = obtenerDatosTMLFE();

    if (!datos) {

        mostrarErrorDatabase();

        return;
    }

    actualizarEstadisticas(datos);

    renderizarEquiposDestacados(datos);

    configurarBotones(datos);

    console.log(
        `✅ ${datos.equipos.length} equipos cargados`
    );

    console.log(
        `✅ ${datos.jugadores.length} jugadores cargados`
    );
}


// ========================================
// OBTENER DATOS
// Compatible con ambas estructuras
// ========================================

function obtenerDatosTMLFE() {

    const base =
        window.TMLFE ||
        window.TMLFE_DATABASE;

    if (!base) {

        console.error(
            "❌ No existe TMLFE ni TMLFE_DATABASE"
        );

        return null;
    }

    const equipos =
        base.teams ||
        base.equipos ||
        [];

    const jugadores =
        base.players ||
        base.jugadores ||
        [];

    if (!Array.isArray(equipos)) {

        console.error(
            "❌ La lista de equipos no es válida"
        );

        return null;
    }

    if (!Array.isArray(jugadores)) {

        console.error(
            "❌ La lista de jugadores no es válida"
        );

        return null;
    }

    return {
        base,
        equipos,
        jugadores
    };
}


// ========================================
// ESTADÍSTICAS
// ========================================

function actualizarEstadisticas(datos) {

    const totalEquipos =
        document.getElementById("total-equipos");

    const totalJugadores =
        document.getElementById("total-jugadores");

    const ratingMedio =
        document.getElementById("rating-medio");

    const totalTrades =
        document.getElementById("total-trades");

    const estadoDatabase =
        document.getElementById("estado-database");


    totalEquipos.textContent =
        datos.equipos.length;

    totalJugadores.textContent =
        datos.jugadores.length;

    ratingMedio.textContent =
        calcularRatingMedio(datos.jugadores);

    totalTrades.textContent =
        obtenerTotalTrades();

    estadoDatabase.textContent =
        `${datos.equipos.length} equipos y ` +
        `${datos.jugadores.length} jugadores`;
}


function calcularRatingMedio(jugadores) {

    if (jugadores.length === 0) {
        return "0.0";
    }

    const suma = jugadores.reduce(
        function(total, jugador) {

            const rating = Number(
                jugador.rating ??
                jugador.overall ??
                jugador.media ??
                0
            );

            return total + rating;
        },
        0
    );

    return (
        suma / jugadores.length
    ).toFixed(1);
}


function obtenerTotalTrades() {

    if (
        window.TradesDB &&
        Array.isArray(window.TradesDB.trades)
    ) {
        return window.TradesDB.trades.length;
    }

    const guardados =
        localStorage.getItem("TMLFE_TRADES");

    if (!guardados) {
        return 0;
    }

    try {

        const trades =
            JSON.parse(guardados);

        return Array.isArray(trades)
            ? trades.length
            : 0;

    } catch (error) {

        return 0;
    }
}


// ========================================
// EQUIPOS DESTACADOS
// ========================================

function renderizarEquiposDestacados(datos) {

    const contenedor =
        document.getElementById(
            "equipos-destacados"
        );

    if (!contenedor) {
        return;
    }

    if (datos.equipos.length === 0) {

        contenedor.innerHTML = `
            <div class="error-message">
                No hay franquicias registradas.
            </div>
        `;

        return;
    }

    const equiposMostrar =
        datos.equipos.slice(0, 6);

    contenedor.innerHTML =
        equiposMostrar.map(
            function(equipo) {

                const nombre =
                    obtenerNombreEquipo(equipo);

                const manager =
                    equipo.manager ||
                    equipo.generalManager ||
                    "Sin manager";

                const division =
                    equipo.division ||
                    "Sin división";

                const cantidadJugadores =
                    contarJugadoresEquipo(
                        equipo,
                        datos.jugadores
                    );

                return `
                    <a
                        class="team-preview"
                        href="./teams.html"
                    >

                        <div class="team-badge">
                            ${obtenerIniciales(nombre)}
                        </div>

                        <div>
                            <h4>${escaparHTML(nombre)}</h4>

                            <p>
                                ${escaparHTML(division)}
                                ·
                                ${escaparHTML(manager)}
                            </p>
                        </div>

                        <span class="team-player-count">
                            ${cantidadJugadores} jugadores
                        </span>

                    </a>
                `;
            }
        ).join("");
}


function obtenerNombreEquipo(equipo) {

    return (
        equipo.name ||
        equipo.nombre ||
        equipo.teamName ||
        "Franquicia"
    );
}


function obtenerIdEquipo(equipo) {

    return (
        equipo.id ||
        equipo.teamId ||
        equipo.equipoId ||
        equipo.slug ||
        obtenerNombreEquipo(equipo)
    );
}


function contarJugadoresEquipo(
    equipo,
    jugadores
) {

    const idEquipo =
        String(obtenerIdEquipo(equipo));

    const nombreEquipo =
        obtenerNombreEquipo(equipo)
            .toLowerCase();

    return jugadores.filter(
        function(jugador) {

            const jugadorEquipoId =
                String(
                    jugador.teamId ??
                    jugador.equipoId ??
                    jugador.team_id ??
                    ""
                );

            const jugadorEquipoNombre =
                String(
                    jugador.team ??
                    jugador.equipo ??
                    jugador.teamName ??
                    ""
                ).toLowerCase();

            return (
                jugadorEquipoId === idEquipo ||
                jugadorEquipoNombre === nombreEquipo
            );
        }
    ).length;
}


function obtenerIniciales(nombre) {

    const palabras =
        nombre
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (palabras.length === 1) {

        return palabras[0]
            .slice(0, 3)
            .toUpperCase();
    }

    return palabras
        .slice(-2)
        .map(
            palabra =>
                palabra.charAt(0)
        )
        .join("")
        .toUpperCase();
}


// ========================================
// BOTONES
// ========================================

function configurarBotones(datos) {

    const botonActualizar =
        document.getElementById(
            "actualizar-dashboard"
        );

    const botonGuardar =
        document.getElementById(
            "guardar-datos"
        );


    if (botonActualizar) {

        botonActualizar.addEventListener(
            "click",
            function() {

                actualizarEstadisticas(datos);

                renderizarEquiposDestacados(
                    datos
                );

                mostrarToast(
                    "Dashboard actualizado"
                );
            }
        );
    }


    if (botonGuardar) {

        botonGuardar.addEventListener(
            "click",
            function() {

                guardarLiga(datos.base);
            }
        );
    }
}


// ========================================
// GUARDADO LOCAL
// ========================================

function guardarLiga(baseDatos) {

    try {

        localStorage.setItem(
            "TMLFE_DATA",
            JSON.stringify(baseDatos)
        );

        mostrarToast(
            "Liga guardada correctamente"
        );

        console.log(
            "💾 Liga guardada en localStorage"
        );

    } catch (error) {

        console.error(
            "❌ Error al guardar:",
            error
        );

        mostrarToast(
            "No se ha podido guardar la liga"
        );
    }
}


// ========================================
// ERROR DE BASE DE DATOS
// ========================================

function mostrarErrorDatabase() {

    const estado =
        document.getElementById(
            "estado-database"
        );

    const equipos =
        document.getElementById(
            "equipos-destacados"
        );

    if (estado) {

        estado.textContent =
            "Error al cargar database.js";
    }

    if (equipos) {

        equipos.innerHTML = `
            <div class="error-message">
                No se ha cargado database.js.
                Revisa la consola del navegador.
            </div>
        `;
    }

    mostrarToast(
        "Error al cargar la base de datos"
    );
}


// ========================================
// TOAST
// ========================================

function mostrarToast(mensaje) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = mensaje;

    toast.classList.add("visible");

    window.clearTimeout(
        mostrarToast.timeout
    );

    mostrarToast.timeout =
        window.setTimeout(
            function() {

                toast.classList.remove(
                    "visible"
                );
            },
            2500
        );
}


// ========================================
// SEGURIDAD HTML
// ========================================

function escaparHTML(valor) {

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


console.log(
    "⚙️ app.js cargado correctamente"
);
