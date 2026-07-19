// =========================================================
// TMLFE - FRANCHISES CONTROLLER
// Pantalla general de franquicias
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarPantallaFranquicias
);


// =========================================================
// CONFIGURACIÓN ECONÓMICA
// =========================================================

const SALARY_CAP = 170000000;


// =========================================================
// ESTADO
// =========================================================

let todasLasFranquicias = [];


// =========================================================
// INICIO
// =========================================================

function iniciarPantallaFranquicias() {

    todasLasFranquicias =
        obtenerFranquiciasBaseDatos();

    configurarBuscador();

    configurarFiltros();

    renderizarFranquicias(
        todasLasFranquicias
    );

    actualizarNumeroFranquicias(
        todasLasFranquicias.length
    );

}


// =========================================================
// OBTENER FRANQUICIAS
// Compatible con distintas estructuras de database.js
// =========================================================

function obtenerFranquiciasBaseDatos() {

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
            Array.isArray(
                database.franquicias
            )
        ) {
            return database.franquicias;
        }

        if (
            Array.isArray(
                database.equipos
            )
        ) {
            return database.equipos;
        }

        if (
            Array.isArray(
                database.teams
            )
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

    console.error(
        "No se ha encontrado la lista de franquicias en database.js"
    );

    return [];

}


// =========================================================
// RENDERIZAR FRANQUICIAS
// =========================================================

function renderizarFranquicias(
    lista
) {

    const contenedor =
        obtenerContenedorFranquicias();

    if (!contenedor) {

        console.error(
            "No se encontró el contenedor de franquicias."
        );

        return;
    }

    contenedor.innerHTML = "";

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="empty-state">

                <strong>
                    No se encontraron franquicias
                </strong>

                <span>
                    Revisa los filtros o la base de datos.
                </span>

            </div>

        `;

        return;
    }

    lista.forEach(
        (
            franquicia,
            indice
        ) => {

            const tarjeta =
                crearTarjetaFranquicia(
                    franquicia,
                    indice
                );

            contenedor.appendChild(
                tarjeta
            );

        }
    );

}


// =========================================================
// CREAR TARJETA
// =========================================================

function crearTarjetaFranquicia(
    franquicia,
    indice
) {

    const nombre =
        obtenerNombreFranquicia(
            franquicia
        );

    const ciudad =
        obtenerCiudadFranquicia(
            franquicia
        );

    const conferencia =
        obtenerConferencia(
            franquicia
        );

    const division =
        obtenerDivision(
            franquicia
        );

    const manager =
        obtenerManager(
            franquicia
        );

    const logo =
        obtenerLogo(
            franquicia
        );

    const jugadores =
        obtenerJugadoresFranquicia(
            franquicia
        );

    const salario =
        calcularSalarioPlantilla(
            jugadores
        );

    const espacio =
        SALARY_CAP - salario;

    const porcentaje =
        SALARY_CAP > 0
            ? (
                salario /
                SALARY_CAP
            ) * 100
            : 0;

    const porcentajeBarra =
        Math.min(
            Math.max(
                porcentaje,
                0
            ),
            100
        );

    /*
       Este identificador es la corrección importante.

       Siempre se genera a partir del nombre de la franquicia.
       Ejemplo:

       Charlotte Hornets
       charlotte-hornets
    */

    const identificador =
        crearSlug(nombre);

    const tarjeta =
        document.createElement(
            "article"
        );

    tarjeta.className =
        "franchise-card";

    tarjeta.style.animationDelay =
        `${indice * 0.025}s`;

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
                    ${escaparHTML(ciudad)}
                </p>

            </div>


        </div>


        <div class="franchise-manager">

            <span>
                General Manager
            </span>

            <strong>
                ${escaparHTML(
                    manager ||
                    "Sin asignar"
                )}
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

                <strong class="${
                    obtenerClaseSalarial(
                        espacio
                    )
                }">

                    ${formatearEspacioSalarial(
                        espacio
                    )}

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
                href="roster.html?team=${encodeURIComponent(
                    identificador
                )}"
            >

                <span>
                    Abrir franquicia
                </span>

                <span>
                    →
                </span>

            </a>

        </div>

    `;

    const imagen =
        tarjeta.querySelector(
            ".franchise-logo"
        );

    if (imagen) {

        imagen.addEventListener(
            "error",
            function () {

                this.style.visibility =
                    "hidden";

            }
        );

    }

    return tarjeta;

}


// =========================================================
// CONTENEDOR DE FRANQUICIAS
// =========================================================

function obtenerContenedorFranquicias() {

    return (
        document.getElementById(
            "franchisesGrid"
        ) ||
        document.getElementById(
            "teamsGrid"
        ) ||
        document.getElementById(
            "franquiciasGrid"
        ) ||
        document.querySelector(
            ".franchises-grid"
        )
    );

}


// =========================================================
// BUSCADOR
// =========================================================

function configurarBuscador() {

    const buscador =
        document.getElementById(
            "teamSearch"
        ) ||
        document.getElementById(
            "franchiseSearch"
        ) ||
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

    const filtros =
        document.querySelectorAll(
            ".teams-toolbar select"
        );

    filtros.forEach(
        filtro => {

            filtro.addEventListener(
                "change",
                aplicarFiltros
            );

        }
    );

}


function aplicarFiltros() {

    const buscador =
        document.getElementById(
            "teamSearch"
        ) ||
        document.getElementById(
            "franchiseSearch"
        ) ||
        document.querySelector(
            '.teams-toolbar input[type="search"]'
        );

    const selects =
        Array.from(
            document.querySelectorAll(
                ".teams-toolbar select"
            )
        );

    const termino =
        normalizarTexto(
            buscador
                ? buscador.value
                : ""
        );

    const valoresSelect =
        selects
            .map(
                select =>
                    normalizarTexto(
                        select.value
                    )
            )
            .filter(
                valor =>
                    valor &&
                    valor !== "todos" &&
                    valor !== "todas" &&
                    valor !== "all"
            );

    const resultados =
        todasLasFranquicias.filter(
            franquicia => {

                const textoFranquicia =
                    normalizarTexto(
                        [
                            obtenerNombreFranquicia(
                                franquicia
                            ),
                            obtenerCiudadFranquicia(
                                franquicia
                            ),
                            obtenerConferencia(
                                franquicia
                            ),
                            obtenerDivision(
                                franquicia
                            ),
                            obtenerManager(
                                franquicia
                            )
                        ].join(" ")
                    );

                const coincideBusqueda =
                    !termino ||
                    textoFranquicia.includes(
                        termino
                    );

                const coincideSelects =
                    valoresSelect.every(
                        valor =>
                            textoFranquicia.includes(
                                valor
                            )
                    );

                return (
                    coincideBusqueda &&
                    coincideSelects
                );

            }
        );

    renderizarFranquicias(
        resultados
    );

    actualizarNumeroFranquicias(
        resultados.length
    );

}


// =========================================================
// JUGADORES DE UNA FRANQUICIA
// =========================================================

function obtenerJugadoresFranquicia(
    franquicia
) {

    const plantillaInterna =

        franquicia.jugadores ||
        franquicia.players ||
        franquicia.roster ||
        franquicia.plantilla;

    if (
        Array.isArray(
            plantillaInterna
        )
    ) {
        return plantillaInterna;
    }

    const jugadoresGenerales =
        obtenerListaGeneralJugadores();

    const identificadores =
        obtenerIdentificadoresFranquicia(
            franquicia
        );

    return jugadoresGenerales.filter(
        jugador => {

            const posiblesEquipos = [

                jugador.team,
                jugador.teamId,
                jugador.teamCode,
                jugador.equipo,
                jugador.equipoId,
                jugador.codigoEquipo,
                jugador.franchise,
                jugador.franquicia

            ]
                .filter(Boolean)
                .map(normalizarTexto);

            return posiblesEquipos.some(
                valor =>
                    identificadores.includes(
                        valor
                    )
            );

        }
    );

}


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
            Array.isArray(
                database.jugadores
            )
        ) {
            return database.jugadores;
        }

        if (
            Array.isArray(
                database.players
            )
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


function obtenerIdentificadoresFranquicia(
    franquicia
) {

    return [

        franquicia.id,
        franquicia.slug,
        franquicia.code,
        franquicia.codigo,
        franquicia.abbreviation,
        franquicia.abreviatura,
        franquicia.name,
        franquicia.nombre,
        franquicia.fullName,
        franquicia.nombreCompleto,
        obtenerNombreFranquicia(
            franquicia
        )

    ]
        .filter(Boolean)
        .map(normalizarTexto);

}


// =========================================================
// ECONOMÍA
// =========================================================

function calcularSalarioPlantilla(
    jugadores
) {

    return jugadores.reduce(
        (
            total,
            jugador
        ) => {

            return (
                total +
                obtenerSalarioJugador(
                    jugador
                )
            );

        },
        0
    );

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

    const expresadoEnMillones =
        texto.includes("m");

    texto =
        texto.replace(/m/g, "");

    if (
        texto.includes(".") &&
        texto.includes(",")
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
        expresadoEnMillones ||
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


function obtenerCiudadFranquicia(
    franquicia
) {

    return (
        franquicia.city ||
        franquicia.ciudad ||
        franquicia.location ||
        franquicia.ubicacion ||
        obtenerNombreFranquicia(
            franquicia
        )
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


function obtenerLogo(
    franquicia
) {

    return (
        franquicia.logo ||
        franquicia.logoUrl ||
        franquicia.escudo ||
        franquicia.image ||
        franquicia.imagen ||
        ""
    );

}


// =========================================================
// TEXTOS Y FORMATOS
// =========================================================

function construirUbicacion(
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


function formatearMillones(
    cantidad
) {

    const numero =
        Number(cantidad) || 0;

    return (
        numero /
        1000000
    ).toLocaleString(
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
        ) +
        (
            cantidad >= 0
                ? " libres"
                : " excedido"
        )
    );

}


function obtenerClaseSalarial(
    espacio
) {

    if (espacio < 0) {
        return "salary-negative";
    }

    if (
        espacio <
        15000000
    ) {
        return "salary-warning";
    }

    return "salary-positive";

}


// =========================================================
// IDENTIFICADORES
// =========================================================

function crearSlug(
    texto
) {

    return normalizarTexto(
        texto
    );

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


// =========================================================
// UTILIDADES
// =========================================================

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


function actualizarNumeroFranquicias(
    numero
) {

    const elementosPosibles = [

        document.getElementById(
            "teamsCount"
        ),

        document.getElementById(
            "franchiseCount"
        ),

        document.getElementById(
            "totalTeams"
        ),

        document.querySelector(
            ".teams-hero-number strong"
        )

    ];

    elementosPosibles.forEach(
        elemento => {

            if (elemento) {
                elemento.textContent =
                    numero;
            }

        }
    );

}
