// ========================================
// TMLFE - PANTALLA DE FRANQUICIAS
// ========================================

const SALARY_CAP = 155000000;


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


let datosLiga = null;


// ========================================
// INICIO
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarPantallaFranquicias
);


function iniciarPantallaFranquicias() {

    datosLiga = obtenerDatosLiga();

    if (!datosLiga) {

        mostrarError(
            "No se ha podido cargar database.js."
        );

        return;
    }

    const contador =
        document.getElementById(
            "numero-franquicias"
        );

    if (contador) {

        contador.textContent =
            datosLiga.equipos.length;
    }

    configurarFiltros();

    actualizarListado();

    console.log(
        `✅ Franquicias cargadas: ${datosLiga.equipos.length}`
    );
}


// ========================================
// OBTENER DATOS
// ========================================

function obtenerDatosLiga() {

    const base =
        window.TMLFE ||
        window.TMLFE_DATABASE;

    if (!base) {

        console.error(
            "❌ No existe la base de datos TMLFE"
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

    if (
        !Array.isArray(equipos) ||
        !Array.isArray(jugadores)
    ) {

        return null;
    }

    return {
        base,
        equipos,
        jugadores
    };
}


// ========================================
// FILTROS
// ========================================

function configurarFiltros() {

    const buscador =
        document.getElementById(
            "buscar-equipo"
        );

    const conferencia =
        document.getElementById(
            "filtro-conferencia"
        );

    const orden =
        document.getElementById(
            "orden-equipos"
        );

    buscador.addEventListener(
        "input",
        actualizarListado
    );

    conferencia.addEventListener(
        "change",
        actualizarListado
    );

    orden.addEventListener(
        "change",
        actualizarListado
    );
}


function actualizarListado() {

    const texto =
        document
            .getElementById("buscar-equipo")
            .value
            .toLowerCase()
            .trim();

    const conferenciaSeleccionada =
        document
            .getElementById("filtro-conferencia")
            .value;

    const orden =
        document
            .getElementById("orden-equipos")
            .value;

    let equipos =
        datosLiga.equipos.map(
            function(equipo) {

                const jugadores =
                    obtenerJugadoresEquipo(
                        equipo,
                        datosLiga.jugadores
                    );

                return {
                    equipo,
                    jugadores,
                    salario: calcularSalarioEquipo(
                        jugadores
                    )
                };
            }
        );


    equipos = equipos.filter(
        function(registro) {

            const nombre =
                obtenerNombreEquipo(
                    registro.equipo
                ).toLowerCase();

            const manager =
                obtenerManager(
                    registro.equipo
                ).toLowerCase();

            const coincideTexto =
                nombre.includes(texto) ||
                manager.includes(texto);

            const conferencia =
                obtenerConferencia(
                    registro.equipo
                );

            const coincideConferencia =
                !conferenciaSeleccionada ||
                conferencia ===
                    conferenciaSeleccionada;

            return (
                coincideTexto &&
                coincideConferencia
            );
        }
    );


    equipos.sort(
        function(a, b) {

            if (orden === "salario-desc") {

                return b.salario - a.salario;
            }

            if (orden === "salario-asc") {

                return a.salario - b.salario;
            }

            if (orden === "jugadores-desc") {

                return (
                    b.jugadores.length -
                    a.jugadores.length
                );
            }

            return obtenerNombreEquipo(a.equipo)
                .localeCompare(
                    obtenerNombreEquipo(b.equipo),
                    "es"
                );
        }
    );


    renderizarFranquicias(equipos);
}


// ========================================
// RENDERIZADO
// ========================================

function renderizarFranquicias(registros) {

    const contenedor =
        document.getElementById(
            "lista-franquicias"
        );

    if (registros.length === 0) {

        contenedor.innerHTML = `
            <div class="empty-state">
                <strong>No se encontraron franquicias</strong>
                <span>Prueba con otra búsqueda.</span>
            </div>
        `;

        return;
    }

    contenedor.innerHTML =
        registros.map(
            function(registro) {

                return crearTarjetaFranquicia(
                    registro.equipo,
                    registro.jugadores,
                    registro.salario
                );
            }
        ).join("");
}


function crearTarjetaFranquicia(
    equipo,
    jugadores,
    salario
) {

    const nombre =
        obtenerNombreEquipo(equipo);

    const id =
        obtenerIdEquipo(equipo);

    const manager =
        obtenerManager(equipo);

    const conferencia =
        obtenerConferencia(equipo);

    const division =
        equipo.division ||
        "Liga Franquicia Extraditables";

    const logo =
        obtenerLogoEquipo(equipo);

    const espacio =
        SALARY_CAP - salario;

    const porcentaje =
        Math.min(
            100,
            Math.max(
                0,
                salario / SALARY_CAP * 100
            )
        );

    const estado =
        obtenerEstadoSalarial(espacio);

    return `
        <article class="franchise-card">

            <div class="franchise-card-glow"></div>

            <header class="franchise-header">

                <div class="franchise-logo-box">

                    <img
                        class="franchise-logo"
                        src="${escaparHTML(logo)}"
                        alt="${escaparHTML(nombre)}"
                        loading="lazy"
                    >

                </div>

                <div class="franchise-identity">

                    <span>
                        ${escaparHTML(conferencia)}
                    </span>

                    <h3>
                        ${escaparHTML(nombre)}
                    </h3>

                    <p>
                        ${escaparHTML(division)}
                    </p>

                </div>

            </header>


            <div class="franchise-manager">

                <span>General Manager</span>

                <strong>
                    ${escaparHTML(manager)}
                </strong>

            </div>


            <div class="franchise-numbers">

                <div>

                    <span>Plantilla</span>

                    <strong>
                        ${jugadores.length}
                    </strong>

                    <small>
                        jugadores
                    </small>

                </div>

                <div>

                    <span>Salario</span>

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

                    <strong class="${estado.clase}">
                        ${estado.texto}
                    </strong>

                </div>

                <div class="salary-track">

                    <span
                        style="width:${porcentaje}%"
                    ></span>

                </div>

                <div class="salary-progress-footer">

                    <span>
                        ${formatearMillones(salario)}
                    </span>

                    <span>
                        ${formatearMillones(SALARY_CAP)}
                    </span>

                </div>

            </div>


            <div class="franchise-footer">

                <a
                    class="franchise-open-button"
                    href="roster.html?team=${encodeURIComponent(id)}"
                >
                    Abrir franquicia
                    <span>→</span>
                </a>

            </div>

        </article>
    `;
}


// ========================================
// JUGADORES DE UN EQUIPO
// ========================================

function obtenerJugadoresEquipo(
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

            const idJugadorEquipo =
                String(
                    jugador.teamId ??
                    jugador.equipoId ??
                    jugador.team_id ??
                    jugador.franchiseId ??
                    ""
                ).toLowerCase();

            const nombreJugadorEquipo =
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
                idJugadorEquipo === idEquipo ||
                nombreJugadorEquipo === nombreEquipo
            );
        }
    );
}


// ========================================
// SALARIOS
// ========================================

function calcularSalarioEquipo(jugadores) {

    return jugadores.reduce(
        function(total, jugador) {

            return total +
                obtenerSalarioJugador(jugador);
        },
        0
    );
}


function obtenerSalarioJugador(jugador) {

    const candidatos = [

        jugador.salary,
        jugador.salario,
        jugador.salary2026,
        jugador.salary2027,
        jugador.salario2026,
        jugador.currentSalary,
        jugador.contract?.salary,
        jugador.contract?.currentSalary

    ];

    for (const valor of candidatos) {

        const salario =
            convertirSalarioNumero(valor);

        if (salario > 0) {

            return salario;
        }
    }

    return 0;
}


function convertirSalarioNumero(valor) {

    if (typeof valor === "number") {

        return valor;
    }

    if (typeof valor !== "string") {

        return 0;
    }

    let limpio =
        valor
            .replaceAll("$", "")
            .replaceAll("€", "")
            .replaceAll(" ", "")
            .toUpperCase();

    if (limpio.includes("M")) {

        limpio =
            limpio.replace("M", "");

        limpio =
            limpio.replace(",", ".");

        return Number(limpio) * 1000000;
    }

    limpio =
        limpio
            .replaceAll(".", "")
            .replaceAll(",", "");

    return Number(limpio) || 0;
}


function obtenerEstadoSalarial(espacio) {

    if (espacio > 10000000) {

        return {
            texto:
                `+${formatearMillones(espacio)} libres`,
            clase:
                "salary-positive"
        };
    }

    if (espacio >= 0) {

        return {
            texto:
                `+${formatearMillones(espacio)} libres`,
            clase:
                "salary-warning"
        };
    }

    return {
        texto:
            `${formatearMillones(
                Math.abs(espacio)
            )} sobre el límite`,
        clase:
            "salary-negative"
    };
}


function formatearMillones(cantidad) {

    return (
        cantidad / 1000000
    ).toLocaleString(
        "es-ES",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    ) + " M";
}


// ========================================
// DATOS DEL EQUIPO
// ========================================

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


function obtenerManager(equipo) {

    return (
        equipo.manager ||
        equipo.generalManager ||
        equipo.gm ||
        "Sin manager asignado"
    );
}


function obtenerConferencia(equipo) {

    const conferencia =
        String(
            equipo.conference ||
            equipo.conferencia ||
            ""
        ).toLowerCase();

    if (
        conferencia.includes("east") ||
        conferencia.includes("este")
    ) {

        return "Este";
    }

    if (
        conferencia.includes("west") ||
        conferencia.includes("oeste")
    ) {

        return "Oeste";
    }

    return "Liga TMLFE";
}


function obtenerLogoEquipo(equipo) {

    const nombre =
        obtenerNombreEquipo(equipo)
            .trim();

    return (
        equipo.logo ||
        equipo.logoUrl ||
        LOGOS_NBA[nombre] ||
        ""
    );
}


// ========================================
// ERROR Y SEGURIDAD
// ========================================

function mostrarError(mensaje) {

    const contenedor =
        document.getElementById(
            "lista-franquicias"
        );

    contenedor.innerHTML = `
        <div class="error-message">
            ${escaparHTML(mensaje)}
        </div>
    `;
}


function escaparHTML(valor) {

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


console.log(
    "⚙️ teams.js cargado correctamente"
);
