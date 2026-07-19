// ========================================
// TMLFE - DASHBOARD CONTROLLER
// Trade Machine Liga Franquicia Extraditables
// ========================================


// ========================================
// LOGOS REALES DE LAS 30 FRANQUICIAS
// ========================================

const LOGOS_NBA = {

    "Atlanta Hawks":
        "https://a.espncdn.com/i/teamlogos/nba/500/atl.png",

    "Boston Celtics":
        "https://a.espncdn.com/i/teamlogos/nba/500/bos.png",

    "Brooklyn Nets":
        "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png",

    "Charlotte Hornets":
        "https://a.espncdn.com/i/teamlogos/nba/500/cha.png",

    "Chicago Bulls":
        "https://a.espncdn.com/i/teamlogos/nba/500/chi.png",

    "Cleveland Cavaliers":
        "https://a.espncdn.com/i/teamlogos/nba/500/cle.png",

    "Dallas Mavericks":
        "https://a.espncdn.com/i/teamlogos/nba/500/dal.png",

    "Denver Nuggets":
        "https://a.espncdn.com/i/teamlogos/nba/500/den.png",

    "Detroit Pistons":
        "https://a.espncdn.com/i/teamlogos/nba/500/det.png",

    "Golden State Warriors":
        "https://a.espncdn.com/i/teamlogos/nba/500/gs.png",

    "Houston Rockets":
        "https://a.espncdn.com/i/teamlogos/nba/500/hou.png",

    "Indiana Pacers":
        "https://a.espncdn.com/i/teamlogos/nba/500/ind.png",

    "Los Angeles Clippers":
        "https://a.espncdn.com/i/teamlogos/nba/500/lac.png",

    "LA Clippers":
        "https://a.espncdn.com/i/teamlogos/nba/500/lac.png",

    "Los Angeles Lakers":
        "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",

    "Memphis Grizzlies":
        "https://a.espncdn.com/i/teamlogos/nba/500/mem.png",

    "Miami Heat":
        "https://a.espncdn.com/i/teamlogos/nba/500/mia.png",

    "Milwaukee Bucks":
        "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",

    "Minnesota Timberwolves":
        "https://a.espncdn.com/i/teamlogos/nba/500/min.png",

    "New Orleans Pelicans":
        "https://a.espncdn.com/i/teamlogos/nba/500/no.png",

    "New York Knicks":
        "https://a.espncdn.com/i/teamlogos/nba/500/ny.png",

    "Oklahoma City Thunder":
        "https://a.espncdn.com/i/teamlogos/nba/500/okc.png",

    "Orlando Magic":
        "https://a.espncdn.com/i/teamlogos/nba/500/orl.png",

    "Philadelphia 76ers":
        "https://a.espncdn.com/i/teamlogos/nba/500/phi.png",

    "Phoenix Suns":
        "https://a.espncdn.com/i/teamlogos/nba/500/phx.png",

    "Portland Trail Blazers":
        "https://a.espncdn.com/i/teamlogos/nba/500/por.png",

    "Sacramento Kings":
        "https://a.espncdn.com/i/teamlogos/nba/500/sac.png",

    "San Antonio Spurs":
        "https://a.espncdn.com/i/teamlogos/nba/500/sa.png",

    "Toronto Raptors":
        "https://a.espncdn.com/i/teamlogos/nba/500/tor.png",

    "Utah Jazz":
        "https://a.espncdn.com/i/teamlogos/nba/500/utah.png",

    "Washington Wizards":
        "https://a.espncdn.com/i/teamlogos/nba/500/wsh.png"
};


// ========================================
// INICIO DE LA APLICACIÓN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


function iniciarDashboard() {

    console.log(
        "🏀 Iniciando Dashboard TMLFE"
    );

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
// OBTENER BASE DE DATOS
// ========================================

function obtenerDatosTMLFE() {

    const base =
        window.TMLFE ||
        window.TMLFE_DATABASE;

    if (!base) {

        console.error(
            "❌ No se ha cargado database.js"
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
// ESTADÍSTICAS DEL DASHBOARD
// ========================================

function actualizarEstadisticas(datos) {

    const totalEquipos =
        document.getElementById(
            "total-equipos"
        );

    const totalJugadores =
        document.getElementById(
            "total-jugadores"
        );

    const ratingMedio =
        document.getElementById(
            "rating-medio"
        );

    const totalTrades =
        document.getElementById(
            "total-trades"
        );

    const estadoDatabase =
        document.getElementById(
            "estado-database"
        );


    if (totalEquipos) {

        totalEquipos.textContent =
            datos.equipos.length;
    }


    if (totalJugadores) {

        totalJugadores.textContent =
            datos.jugadores.length;
    }


    if (ratingMedio) {

        ratingMedio.textContent =
            calcularRatingMedio(
                datos.jugadores
            );
    }


    if (totalTrades) {

        totalTrades.textContent =
            obtenerTotalTrades();
    }


    if (estadoDatabase) {

        estadoDatabase.textContent =
            `${datos.equipos.length} equipos y ` +
            `${datos.jugadores.length} jugadores`;
    }
}


// ========================================
// CALCULAR RATING MEDIO
// ========================================

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
                jugador.ovr ??
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


// ========================================
// TOTAL DE TRASPASOS
// ========================================

function obtenerTotalTrades() {

    if (
        window.TradesDB &&
        Array.isArray(
            window.TradesDB.trades
        )
    ) {

        return window.TradesDB.trades.length;
    }

    const guardados =
        localStorage.getItem(
            "TMLFE_TRADES"
        );

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

        console.error(
            "Error leyendo los trades:",
            error
        );

        return 0;
    }
}


// ========================================
// RENDERIZAR FRANQUICIAS DESTACADAS
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
                    obtenerNombreEquipo(
                        equipo
                    );

                const manager =
                    equipo.manager ||
                    equipo.generalManager ||
                    equipo.gm ||
                    "Sin manager";

                const division =
                    equipo.division ||
                    equipo.conference ||
                    "Liga Franquicia Extraditables";

                const cantidadJugadores =
                    contarJugadoresEquipo(
                        equipo,
                        datos.jugadores
                    );

                const logo =
                    obtenerLogoEquipo(
                        equipo
                    );

                const idEquipo =
                    obtenerIdEquipo(
                        equipo
                    );

                const logoHTML = logo
                    ? `
                        <img
                            class="team-logo"
                            src="${escaparHTML(logo)}"
                            alt="Escudo de ${escaparHTML(nombre)}"
                            loading="lazy"
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='grid';
                            "
                        >

                        <span
                            class="team-logo-fallback"
                            style="display:none;"
                        >
                            ${obtenerIniciales(nombre)}
                        </span>
                    `
                    : `
                        <span
                            class="team-logo-fallback"
                            style="display:grid;"
                        >
                            ${obtenerIniciales(nombre)}
                        </span>
                    `;

                return `
                    <a
                        class="team-preview"
                        href="./teams.html?team=${encodeURIComponent(idEquipo)}"
                    >

                        <div class="team-badge">
                            ${logoHTML}
                        </div>

                        <div class="team-preview-info">

                            <h4>
                                ${escaparHTML(nombre)}
                            </h4>

                            <p>
                                ${escaparHTML(division)}
                            </p>

                            <small>
                                GM: ${escaparHTML(manager)}
                            </small>

                        </div>

                        <span class="team-player-count">

                            ${cantidadJugadores}
                            jugadores

                        </span>

                    </a>
                `;
            }
        ).join("");
}


// ========================================
// DATOS DE CADA EQUIPO
// ========================================

function obtenerNombreEquipo(equipo) {

    return (
        equipo.name ||
        equipo.nombre ||
        equipo.teamName ||
        equipo.fullName ||
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


function obtenerLogoEquipo(equipo) {

    const nombre =
        obtenerNombreEquipo(equipo)
            .trim();

    if (equipo.logo) {

        return equipo.logo;
    }

    if (equipo.logoUrl) {

        return equipo.logoUrl;
    }

    if (equipo.logoURL) {

        return equipo.logoURL;
    }

    if (LOGOS_NBA[nombre]) {

        return LOGOS_NBA[nombre];
    }

    return "";
}


// ========================================
// CONTAR JUGADORES DE CADA EQUIPO
// ========================================

function contarJugadoresEquipo(
    equipo,
    jugadores
) {

    const idEquipo =
        String(
            obtenerIdEquipo(equipo)
        ).toLowerCase();

    const nombreEquipo =
        obtenerNombreEquipo(equipo)
            .toLowerCase()
            .trim();

    return jugadores.filter(
        function(jugador) {

            const jugadorEquipoId =
                String(
                    jugador.teamId ??
                    jugador.equipoId ??
                    jugador.team_id ??
                    jugador.franchiseId ??
                    ""
                ).toLowerCase();

            const jugadorEquipoNombre =
                String(
                    jugador.team ??
                    jugador.equipo ??
                    jugador.teamName ??
                    jugador.franchise ??
                    ""
                )
                .toLowerCase()
                .trim();

            return (
                jugadorEquipoId === idEquipo ||
                jugadorEquipoNombre === nombreEquipo
            );
        }
    ).length;
}


// ========================================
// INICIALES DEL EQUIPO
// ========================================

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
            function(palabra) {

                return palabra.charAt(0);
            }
        )
        .join("")
        .toUpperCase();
}


// ========================================
// BOTONES DEL DASHBOARD
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

                actualizarEstadisticas(
                    datos
                );

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

                guardarLiga(
                    datos.base
                );
            }
        );
    }
}


// ========================================
// GUARDAR LIGA
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
            "💾 Liga guardada"
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

                Abre la consola del navegador
                para ver el error.

            </div>
        `;
    }

    mostrarToast(
        "Error al cargar la base de datos"
    );
}


// ========================================
// MENSAJE EMERGENTE
// ========================================

function mostrarToast(mensaje) {

    const toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {

        return;
    }

    toast.textContent =
        mensaje;

    toast.classList.add(
        "visible"
    );

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


// ========================================
// CONFIRMACIÓN DE CARGA
// ========================================

console.log(
    "⚙️ app.js cargado correctamente"
);
