// =========================================================
// TMLFE - ROSTER CONTROLLER
// Pantalla individual de cada franquicia
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarPantallaPlantilla
);


// =========================================================
// CONFIGURACIÓN ECONÓMICA
// =========================================================

const LIMITE_SALARIAL = 170000000;


// =========================================================
// ESTADO DE LA PANTALLA
// =========================================================

let franquiciaActual = null;
let jugadoresActuales = [];


// =========================================================
// INICIO
// =========================================================

function iniciarPantallaPlantilla() {

    const identificadorFranquicia =
        obtenerFranquiciaDesdeURL();

    if (!identificadorFranquicia) {

        mostrarErrorPlantilla(
            "No se ha indicado ninguna franquicia."
        );

        return;
    }

    franquiciaActual =
        buscarFranquicia(
            identificadorFranquicia
        );

    if (!franquiciaActual) {

        mostrarErrorPlantilla(
            "No se ha encontrado la franquicia seleccionada."
        );

        return;
    }

    jugadoresActuales =
        obtenerJugadoresFranquicia(
            franquiciaActual
        );

    renderizarFranquicia();

    configurarBuscadorPlantilla();

}


// =========================================================
// OBTENER FRANQUICIA DESDE LA URL
// Ejemplo:
// roster.html?team=charlotte-hornets
// =========================================================

function obtenerFranquiciaDesdeURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    return (
        parametros.get("team") ||
        parametros.get("id") ||
        parametros.get("equipo") ||
        ""
    );

}


// =========================================================
// BUSCAR FRANQUICIA
// Compatible con diferentes nombres de base de datos
// =========================================================

function buscarFranquicia(identificador) {

    const franquicias =
        obtenerListaFranquicias();

    const valorBuscado =
        normalizarTexto(
            identificador
        );

    return franquicias.find(
        franquicia => {

            const posiblesValores = [

                franquicia.id,
                franquicia.slug,
                franquicia.codigo,
                franquicia.abbreviation,
                franquicia.abreviatura,
                franquicia.name,
                franquicia.nombre,
                franquicia.fullName,
                franquicia.nombreCompleto

            ];

            return posiblesValores.some(
                valor =>
                    normalizarTexto(valor) ===
                    valorBuscado
            );

        }
    );

}


// =========================================================
// OBTENER LISTA DE FRANQUICIAS
// =========================================================

function obtenerListaFranquicias() {

    if (
        typeof franquicias !== "undefined" &&
        Array.isArray(franquicias)
    ) {
        return franquicias;
    }

    if (
        typeof equipos !== "undefined" &&
        Array.isArray(equipos)
    ) {
        return equipos;
    }

    if (
        typeof teams !== "undefined" &&
        Array.isArray(teams)
    ) {
        return teams;
    }

    if (
        typeof database !== "undefined"
    ) {

        if (
            Array.isArray(database.franquicias)
        ) {
            return database.franquicias;
        }

        if (
            Array.isArray(database.equipos)
        ) {
            return database.equipos;
        }

        if (
            Array.isArray(database.teams)
        ) {
            return database.teams;
        }

    }

    if (
        typeof TMLFE_DATABASE !== "undefined"
    ) {

        if (
            Array.isArray(
                TMLFE_DATABASE.franquicias
            )
        ) {
            return TMLFE_DATABASE.franquicias;
        }

        if (
            Array.isArray(
                TMLFE_DATABASE.equipos
            )
        ) {
            return TMLFE_DATABASE.equipos;
        }

        if (
            Array.isArray(
                TMLFE_DATABASE.teams
            )
        ) {
            return TMLFE_DATABASE.teams;
        }

    }

    return [];

}


// =========================================================
// OBTENER JUGADORES DE LA FRANQUICIA
// =========================================================

function obtenerJugadoresFranquicia(
    franquicia
) {

    const jugadoresInternos =

        franquicia.jugadores ||
        franquicia.players ||
        franquicia.roster ||
        franquicia.plantilla;

    if (
        Array.isArray(jugadoresInternos)
    ) {
        return jugadoresInternos;
    }

    const todosLosJugadores =
        obtenerListaGeneralJugadores();

    const identificadoresEquipo = [

        franquicia.id,
        franquicia.slug,
        franquicia.codigo,
        franquicia.abbreviation,
        franquicia.abreviatura,
        franquicia.name,
        franquicia.nombre,
        franquicia.fullName,
        franquicia.nombreCompleto

    ]
        .filter(Boolean)
        .map(normalizarTexto);

    return todosLosJugadores.filter(
        jugador => {

            const posiblesEquipos = [

                jugador.teamId,
                jugador.team,
                jugador.equipo,
                jugador.equipoId,
                jugador.franchise,
                jugador.franquicia,
                jugador.teamCode,
                jugador.codigoEquipo

            ]
                .filter(Boolean)
                .map(normalizarTexto);

            return posiblesEquipos.some(
                valor =>
                    identificadoresEquipo.includes(
                        valor
                    )
            );

        }
    );

}


// =========================================================
// OBTENER LISTA GENERAL DE JUGADORES
// =========================================================

function obtenerListaGeneralJugadores() {

    if (
        typeof jugadores !== "undefined" &&
        Array.isArray(jugadores)
    ) {
        return jugadores;
    }

    if (
        typeof players !== "undefined" &&
        Array.isArray(players)
    ) {
        return players;
    }

    if (
        typeof database !== "undefined"
    ) {

        if (
            Array.isArray(database.jugadores)
        ) {
            return database.jugadores;
        }

        if (
            Array.isArray(database.players)
        ) {
            return database.players;
        }

    }

    if (
        typeof TMLFE_DATABASE !== "undefined"
    ) {

        if (
            Array.isArray(
                TMLFE_DATABASE.jugadores
            )
        ) {
            return TMLFE_DATABASE.jugadores;
        }

        if (
            Array.isArray(
                TMLFE_DATABASE.players
            )
        ) {
            return TMLFE_DATABASE.players;
        }

    }

    return [];

}


// =========================================================
// RENDERIZAR PANTALLA COMPLETA
// =========================================================

function renderizarFranquicia() {

    mostrarContenidoPlantilla();

    renderizarCabeceraFranquicia();

    renderizarResumenEconomico();

    renderizarBarraSalarial();

    renderizarTablaJugadores(
        jugadoresActuales
    );

}


// =========================================================
// CABECERA DE LA FRANQUICIA
// =========================================================

function renderizarCabeceraFranquicia() {

    const nombre =
        obtenerNombreFranquicia(
            franquiciaActual
        );

    const conferencia =
        obtenerConferencia(
            franquiciaActual
        );

    const division =
        obtenerDivision(
            franquiciaActual
        );

    const manager =
        obtenerManager(
            franquiciaActual
        );

    const logo =
        obtenerLogoFranquicia(
            franquiciaActual
        );

    const media =
        calcularMediaEquipo(
            jugadoresActuales
        );

    cambiarTexto(
        "pageTitle",
        nombre
    );

    cambiarTexto(
        "teamName",
        nombre
    );

    cambiarTexto(
        "teamConference",
        construirTextoConferencia(
            conferencia,
            division
        )
    );

    cambiarTexto(
        "teamManager",
        manager
            ? `General Manager: ${manager}`
            : "General Manager sin asignar"
    );

    cambiarTexto(
        "teamOverall",
        media > 0
            ? media.toFixed(0)
            : "--"
    );

    const imagenLogo =
        document.getElementById(
            "teamLogo"
        );

    if (imagenLogo) {

        imagenLogo.src = logo;

        imagenLogo.alt =
            `Escudo de ${nombre}`;

        imagenLogo.onerror =
            function () {

                this.style.display =
                    "none";

            };

    }

    document.title =
        `TMLFE | ${nombre}`;

}


// =========================================================
// RESUMEN ECONÓMICO
// =========================================================

function renderizarResumenEconomico() {

    const numeroJugadores =
        jugadoresActuales.length;

    const salarioTotal =
        calcularSalarioTotal(
            jugadoresActuales
        );

    const espacioSalarial =
        LIMITE_SALARIAL -
        salarioTotal;

    cambiarTexto(
        "playerCount",
        numeroJugadores
    );

    cambiarTexto(
        "teamSalary",
        formatearMillones(
            salarioTotal
        )
    );

    cambiarTexto(
        "capSpace",
        formatearEspacioSalarial(
            espacioSalarial
        )
    );

    const capStatus =
        document.getElementById(
            "capStatus"
        );

    const capSpace =
        document.getElementById(
            "capSpace"
        );

    if (espacioSalarial >= 0) {

        if (capStatus) {
            capStatus.textContent =
                "espacio disponible";
        }

        if (capSpace) {

            capSpace.classList.remove(
                "salary-negative"
            );

            capSpace.classList.add(
                "salary-positive"
            );

        }

    } else {

        if (capStatus) {
            capStatus.textContent =
                "exceso salarial";
        }

        if (capSpace) {

            capSpace.classList.remove(
                "salary-positive"
            );

            capSpace.classList.add(
                "salary-negative"
            );

        }

    }

}


// =========================================================
// BARRA SALARIAL
// =========================================================

function renderizarBarraSalarial() {

    const salarioTotal =
        calcularSalarioTotal(
            jugadoresActuales
        );

    const porcentajeReal =
        LIMITE_SALARIAL > 0
            ? (
                salarioTotal /
                LIMITE_SALARIAL
            ) * 100
            : 0;

    const porcentajeBarra =
        Math.min(
            porcentajeReal,
            100
        );

    cambiarTexto(
        "salaryUsage",
        `${formatearMillones(salarioTotal)} / 170,0 M`
    );

    cambiarTexto(
        "salaryPercentage",
        `${porcentajeReal.toFixed(1).replace(".", ",")} %`
    );

    const barra =
        document.getElementById(
            "salaryBar"
        );

    if (!barra) {
        return;
    }

    barra.style.width =
        `${porcentajeBarra}%`;

    barra.classList.remove(
        "salary-positive",
        "salary-warning",
        "salary-negative"
    );

    if (porcentajeReal < 85) {

        barra.classList.add(
            "salary-positive"
        );

    } else if (
        porcentajeReal <= 100
    ) {

        barra.classList.add(
            "salary-warning"
        );

    } else {

        barra.classList.add(
            "salary-negative"
        );

    }

}


// =========================================================
// TABLA DE JUGADORES
// =========================================================

function renderizarTablaJugadores(
    listaJugadores
) {

    const cuerpoTabla =
        document.getElementById(
            "rosterTableBody"
        );

    const mensajeVacio =
        document.getElementById(
            "rosterEmpty"
        );

    if (!cuerpoTabla) {
        return;
    }

    cuerpoTabla.innerHTML = "";

    if (
        !Array.isArray(listaJugadores) ||
        listaJugadores.length === 0
    ) {

        if (mensajeVacio) {
            mensajeVacio.hidden = false;
        }

        return;
    }

    if (mensajeVacio) {
        mensajeVacio.hidden = true;
    }

    const jugadoresOrdenados =
        [...listaJugadores].sort(
            ordenarJugadores
        );

    jugadoresOrdenados.forEach(
        jugador => {

            const fila =
                crearFilaJugador(
                    jugador
                );

            cuerpoTabla.appendChild(
                fila
            );

        }
    );

}


// =========================================================
// CREAR FILA DE JUGADOR
// =========================================================

function crearFilaJugador(
    jugador
) {

    const fila =
        document.createElement("tr");

    const nombre =
        obtenerNombreJugador(
            jugador
        );

    const posicion =
        obtenerPosicionJugador(
            jugador
        );

    const edad =
        obtenerEdadJugador(
            jugador
        );

    const media =
        obtenerMediaJugador(
            jugador
        );

    const salario =
        obtenerSalarioJugador(
            jugador
        );

    const contrato =
        obtenerContratoJugador(
            jugador
        );

    const estado =
        obtenerEstadoJugador(
            jugador
        );

    fila.innerHTML = `

        <td>

            <div class="player-cell">

                <div class="player-avatar">

                    ${obtenerIniciales(nombre)}

                </div>

                <div>

                    <strong>
                        ${escaparHTML(nombre)}
                    </strong>

                    <span>
                        ${escaparHTML(
                            obtenerDorsalJugador(
                                jugador
                            )
                        )}
                    </span>

                </div>

            </div>

        </td>


        <td>

            <span class="position-badge">

                ${escaparHTML(posicion)}

            </span>

        </td>


        <td>

            ${escaparHTML(
                String(edad)
            )}

        </td>


        <td>

            <span class="overall-badge">

                ${media || "--"}

            </span>

        </td>


        <td>

            <strong>

                ${formatearMillones(
                    salario
                )}

            </strong>

        </td>


        <td>

            ${escaparHTML(contrato)}

        </td>


        <td>

            <span class="status-badge">

                ${escaparHTML(estado)}

            </span>

        </td>

    `;

    return fila;

}


// =========================================================
// BUSCADOR DE JUGADORES
// =========================================================

function configurarBuscadorPlantilla() {

    const buscador =
        document.getElementById(
            "rosterSearch"
        );

    if (!buscador) {
        return;
    }

    buscador.addEventListener(
        "input",
        function () {

            const termino =
                normalizarTexto(
                    this.value
                );

            const resultados =
                jugadoresActuales.filter(
                    jugador => {

                        const textoJugador =
                            normalizarTexto(
                                [
                                    obtenerNombreJugador(
                                        jugador
                                    ),
                                    obtenerPosicionJugador(
                                        jugador
                                    ),
                                    obtenerEstadoJugador(
                                        jugador
                                    )
                                ].join(" ")
                            );

                        return textoJugador.includes(
                            termino
                        );

                    }
                );

            renderizarTablaJugadores(
                resultados
            );

        }
    );

}


// =========================================================
// CÁLCULOS
// =========================================================

function calcularSalarioTotal(
    listaJugadores
) {

    return listaJugadores.reduce(
        (
            acumulado,
            jugador
        ) => {

            return (
                acumulado +
                obtenerSalarioJugador(
                    jugador
                )
            );

        },
        0
    );

}


function calcularMediaEquipo(
    listaJugadores
) {

    const mediasValidas =
        listaJugadores
            .map(
                obtenerMediaJugador
            )
            .filter(
                media =>
                    Number.isFinite(media) &&
                    media > 0
            );

    if (
        mediasValidas.length === 0
    ) {
        return 0;
    }

    const suma =
        mediasValidas.reduce(
            (
                total,
                media
            ) =>
                total + media,
            0
        );

    return (
        suma /
        mediasValidas.length
    );

}


// =========================================================
// DATOS DE FRANQUICIA
// =========================================================

function obtenerNombreFranquicia(
    franquicia
) {

    return (
        franquicia.fullName ||
        franquicia.nombreCompleto ||
        franquicia.name ||
        franquicia.nombre ||
        franquicia.teamName ||
        "Franquicia TMLFE"
    );

}


function obtenerConferencia(
    franquicia
) {

    return (
        franquicia.conference ||
        franquicia.conferencia ||
        ""
    );

}


function obtenerDivision(
    franquicia
) {

    return (
        franquicia.division ||
        franquicia.división ||
        ""
    );

}


function obtenerManager(
    franquicia
) {

    return (
        franquicia.manager ||
        franquicia.generalManager ||
        franquicia.gm ||
        franquicia.propietario ||
        ""
    );

}


function obtenerLogoFranquicia(
    franquicia
) {

    return (
        franquicia.logo ||
        franquicia.logoUrl ||
        franquicia.escudo ||
        franquicia.image ||
        ""
    );

}


// =========================================================
// DATOS DE JUGADOR
// =========================================================

function obtenerNombreJugador(
    jugador
) {

    return (
        jugador.name ||
        jugador.nombre ||
        jugador.fullName ||
        jugador.nombreCompleto ||
        "Jugador sin nombre"
    );

}


function obtenerPosicionJugador(
    jugador
) {

    return (
        jugador.position ||
        jugador.posicion ||
        jugador.posición ||
        jugador.primaryPosition ||
        "-"
    );

}


function obtenerEdadJugador(
    jugador
) {

    const edad =
        jugador.age ??
        jugador.edad;

    const numero =
        Number(edad);

    return Number.isFinite(numero)
        ? numero
        : "-";

}


function obtenerMediaJugador(
    jugador
) {

    const media =
        jugador.overall ??
        jugador.media ??
        jugador.rating ??
        jugador.ovr;

    const numero =
        Number(media);

    return Number.isFinite(numero)
        ? numero
        : 0;

}


function obtenerSalarioJugador(
    jugador
) {

    const salario =

        jugador.salary ??
        jugador.salario ??
        jugador.currentSalary ??
        jugador.salarioActual ??
        jugador.contract?.salary ??
        jugador.contrato?.salario ??
        0;

    return convertirSalarioANumero(
        salario
    );

}


function obtenerContratoJugador(
    jugador
) {

    if (
        typeof jugador.contract ===
        "string"
    ) {
        return jugador.contract;
    }

    if (
        typeof jugador.contrato ===
        "string"
    ) {
        return jugador.contrato;
    }

    const años =

        jugador.contractYears ??
        jugador.years ??
        jugador.añosContrato ??
        jugador.aniosContrato ??
        jugador.contract?.years ??
        jugador.contrato?.años;

    const opcion =

        jugador.option ??
        jugador.opcion ??
        jugador.contract?.option ??
        jugador.contrato?.opcion;

    if (años && opcion) {
        return `${años} años · ${opcion}`;
    }

    if (años) {
        return `${años} años`;
    }

    return "Sin datos";
}


function obtenerEstadoJugador(
    jugador
) {

    return (
        jugador.status ||
        jugador.estado ||
        jugador.contractStatus ||
        "Activo"
    );

}


function obtenerDorsalJugador(
    jugador
) {

    const dorsal =

        jugador.number ??
        jugador.dorsal ??
        jugador.jerseyNumber;

    if (
        dorsal === undefined ||
        dorsal === null ||
        dorsal === ""
    ) {
        return "TMLFE";
    }

    return `#${dorsal}`;

}


// =========================================================
// ORDENAR JUGADORES
// =========================================================

function ordenarJugadores(
    jugadorA,
    jugadorB
) {

    const mediaA =
        obtenerMediaJugador(
            jugadorA
        );

    const mediaB =
        obtenerMediaJugador(
            jugadorB
        );

    if (mediaB !== mediaA) {
        return mediaB - mediaA;
    }

    return obtenerNombreJugador(
        jugadorA
    ).localeCompare(
        obtenerNombreJugador(
            jugadorB
        ),
        "es"
    );

}


// =========================================================
// FORMATOS
// =========================================================

function formatearMillones(
    cantidad
) {

    const numero =
        Number(cantidad) || 0;

    return (
        numero /
        1000000
    )
        .toLocaleString(
            "es-ES",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }
        ) + " M";

}


function formatearEspacioSalarial(
    cantidad
) {

    const simbolo =
        cantidad >= 0
            ? "+"
            : "-";

    return (
        simbolo +
        formatearMillones(
            Math.abs(cantidad)
        )
    );

}


function convertirSalarioANumero(
    salario
) {

    if (
        typeof salario === "number"
    ) {

        if (
            salario > 0 &&
            salario < 1000
        ) {
            return salario * 1000000;
        }

        return salario;

    }

    if (
        typeof salario !== "string"
    ) {
        return 0;
    }

    let texto =
        salario
            .trim()
            .toLowerCase()
            .replace(/\s/g, "")
            .replace(/€/g, "")
            .replace(/\$/g, "");

    const esMillones =
        texto.includes("m");

    texto =
        texto.replace(/m/g, "");

    if (
        texto.includes(",") &&
        texto.includes(".")
    ) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    } else {

        texto =
            texto.replace(",", ".");

    }

    const numero =
        Number(texto);

    if (!Number.isFinite(numero)) {
        return 0;
    }

    if (
        esMillones ||
        (
            numero > 0 &&
            numero < 1000
        )
    ) {
        return numero * 1000000;
    }

    return numero;

}


// =========================================================
// UTILIDADES
// =========================================================

function construirTextoConferencia(
    conferencia,
    division
) {

    if (
        conferencia &&
        division
    ) {
        return `${conferencia} · ${division}`;
    }

    if (conferencia) {
        return conferencia;
    }

    if (division) {
        return division;
    }

    return "FRANQUICIA TMLFE";

}


function obtenerIniciales(
    nombre
) {

    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            palabra =>
                palabra.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function normalizarTexto(
    valor
) {

    return String(
        valor || ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function cambiarTexto(
    id,
    contenido
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent =
            contenido;
    }

}


// =========================================================
// VISIBILIDAD DE LA PANTALLA
// =========================================================

function mostrarContenidoPlantilla() {

    const carga =
        document.getElementById(
            "rosterLoading"
        );

    const contenido =
        document.getElementById(
            "rosterContent"
        );

    const error =
        document.getElementById(
            "rosterError"
        );

    if (carga) {
        carga.hidden = true;
    }

    if (contenido) {
        contenido.hidden = false;
    }

    if (error) {
        error.hidden = true;
    }

}


function mostrarErrorPlantilla(
    mensaje
) {

    const carga =
        document.getElementById(
            "rosterLoading"
        );

    const contenido =
        document.getElementById(
            "rosterContent"
        );

    const error =
        document.getElementById(
            "rosterError"
        );

    if (carga) {
        carga.hidden = true;
    }

    if (contenido) {
        contenido.hidden = true;
    }

    if (error) {

        error.hidden = false;

        error.innerHTML = `

            ${escaparHTML(mensaje)}

            <br><br>

            <a
                class="primary-button"
                href="teams.html"
            >
                Volver a franquicias
            </a>

        `;

    }

}
