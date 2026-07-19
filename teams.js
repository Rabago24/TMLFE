"use strict";

window.addEventListener("load", function () {

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const SALARY_CAP = 170000000;
    const TEMPORADA = "2026/27";

    const contenedor =
        document.getElementById("lista-franquicias");

    const contador =
        document.getElementById("numero-franquicias");

    const buscador =
        document.getElementById("buscar-equipo");

    const filtroConferencia =
        document.getElementById("filtro-conferencia");

    const selectorOrden =
        document.getElementById("orden-equipos");


    // =====================================================
    // COMPROBACIONES
    // =====================================================

    if (!contenedor) {

        alert(
            "ERROR: No existe el contenedor lista-franquicias"
        );

        return;
    }

    contenedor.innerHTML = "";


    if (
        !window.TMLFE ||
        !Array.isArray(window.TMLFE.teams)
    ) {

        contenedor.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                padding: 30px;
                background: #481b1b;
                color: white;
                border-radius: 14px;
                font-size: 18px;
            ">

                ERROR: database.js no está cargando correctamente.

            </div>

        `;

        return;
    }


    const equipos =
        window.TMLFE.teams;

    const jugadores =
        Array.isArray(window.TMLFE.players)
            ? window.TMLFE.players
            : [];


    // =====================================================
    // UTILIDADES
    // =====================================================

    function normalizar(valor) {

        return String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    }


    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function obtenerJugadoresEquipo(equipo) {

        const codigoEquipo =
            normalizar(equipo.short);

        const nombreEquipo =
            normalizar(equipo.name);

        return jugadores.filter(function (jugador) {

            const codigoJugador =
                normalizar(jugador.teamShort);

            const nombreJugador =
                normalizar(jugador.team);

            return (
                codigoJugador === codigoEquipo ||
                nombreJugador === nombreEquipo
            );
        });
    }


    // =====================================================
    // SALARIOS
    // =====================================================

    function convertirSalario(valor) {

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


        /*
        Sirve también para salarios como:

        "10183200 TO"
        "16438275 PO"
        */

        const texto =
            String(valor).trim();

        const coincidencia =
            texto.match(/\d+/);

        if (!coincidencia) {
            return 0;
        }

        return Number(coincidencia[0]) || 0;
    }


    function obtenerSalarioJugador(jugador) {

        if (
            jugador.salaries &&
            jugador.salaries[TEMPORADA] !== undefined
        ) {

            return convertirSalario(
                jugador.salaries[TEMPORADA]
            );
        }

        return 0;
    }


    function obtenerSalarioEquipo(equipo) {

        const plantilla =
            obtenerJugadoresEquipo(equipo);

        return plantilla.reduce(
            function (total, jugador) {

                return (
                    total +
                    obtenerSalarioJugador(jugador)
                );
            },
            0
        );
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


    function formatearEspacioSalarial(espacio) {

        if (espacio >= 0) {

            return (
                "+" +
                formatearMillones(espacio) +
                " libres"
            );
        }

        return (
            "-" +
            formatearMillones(
                Math.abs(espacio)
            ) +
            " excedido"
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


    // =====================================================
    // LOGOS
    // =====================================================

    function crearLogoEquipo(equipo) {

        const caja =
            document.createElement("div");

        caja.className =
            "franchise-logo-box";


        const imagen =
            document.createElement("img");

        imagen.className =
            "franchise-logo";

        imagen.alt =
            `Escudo de ${equipo.name}`;


        const codigo =
            String(equipo.short || "").trim();

        const codigoMinusculas =
            codigo.toLowerCase();


        /*
        El programa probará estas rutas automáticamente.
        */

        const rutas = [

            `assets/logos/${codigoMinusculas}.png`,
            `assets/logos/${codigo}.png`,

            `logos/${codigoMinusculas}.png`,
            `logos/${codigo}.png`,

            `assets/${codigoMinusculas}.png`,
            `assets/${codigo}.png`

        ];


        let posicion = 0;


        function probarSiguienteLogo() {

            if (posicion >= rutas.length) {

                imagen.remove();

                const siglas =
                    document.createElement("strong");

                siglas.className =
                    "franchise-logo-fallback";

                siglas.textContent =
                    codigo || "?";

                caja.appendChild(siglas);

                return;
            }

            imagen.src =
                rutas[posicion];

            posicion++;
        }


        imagen.addEventListener(
            "error",
            probarSiguienteLogo
        );


        caja.appendChild(imagen);

        probarSiguienteLogo();

        return caja;
    }


    // =====================================================
    // CREAR TARJETAS
    // =====================================================

    function crearTarjeta(equipo) {

        const plantilla =
            obtenerJugadoresEquipo(equipo);

        const salario =
            obtenerSalarioEquipo(equipo);

        const espacio =
            SALARY_CAP - salario;

        const porcentajeSalario =
            Math.min(
                Math.max(
                    (
                        salario /
                        SALARY_CAP
                    ) * 100,
                    0
                ),
                100
            );


        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "franchise-card";


        /*
        Mantiene visibles las tarjetas aunque quede alguna
        animación antigua en styles.css.
        */

        tarjeta.style.setProperty(
            "display",
            "block",
            "important"
        );

        tarjeta.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        tarjeta.style.setProperty(
            "opacity",
            "1",
            "important"
        );

        tarjeta.style.setProperty(
            "transform",
            "none",
            "important"
        );


        // =================================================
        // CABECERA
        // =================================================

        const cabecera =
            document.createElement("div");

        cabecera.className =
            "franchise-header";


        const logo =
            crearLogoEquipo(equipo);


        const identidad =
            document.createElement("div");

        identidad.className =
            "franchise-identity";

        identidad.innerHTML = `

            <span>
                ${escaparHTML(equipo.conference)}
                ·
                ${escaparHTML(equipo.division)}
            </span>

            <h3>
                ${escaparHTML(equipo.name)}
            </h3>

            <p>
                ${escaparHTML(equipo.short)}
            </p>

        `;


        cabecera.appendChild(logo);
        cabecera.appendChild(identidad);

        tarjeta.appendChild(cabecera);


        // =================================================
        // INFORMACIÓN
        // =================================================

        const informacion =
            document.createElement("div");

        informacion.innerHTML = `

            <div class="franchise-manager">

                <span>
                    General Manager
                </span>

                <strong>
                    ${escaparHTML(
                        equipo.manager ||
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
                        ${plantilla.length}
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
                        obtenerClaseSalarial(espacio)
                    }">

                        ${formatearEspacioSalarial(
                            espacio
                        )}

                    </strong>

                </div>


                <div class="salary-track">

                    <span
                        style="width: ${porcentajeSalario}%"
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
                    href="players.html?team=${
                        encodeURIComponent(equipo.short)
                    }"
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


        tarjeta.appendChild(informacion);

        return tarjeta;
    }


    // =====================================================
    // RENDERIZAR
    // =====================================================

    function renderizar(listaEquipos) {

        contenedor.innerHTML = "";


        if (
            !Array.isArray(listaEquipos) ||
            listaEquipos.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No se encontraron franquicias
                    </strong>

                    <span>
                        Revisa la búsqueda o los filtros.
                    </span>

                </div>

            `;

            if (contador) {
                contador.textContent = "0";
            }

            return;
        }


        listaEquipos.forEach(function (equipo) {

            contenedor.appendChild(
                crearTarjeta(equipo)
            );
        });


        if (contador) {

            contador.textContent =
                listaEquipos.length;
        }
    }


    // =====================================================
    // FILTROS
    // =====================================================

    function aplicarFiltros() {

        const texto =
            normalizar(
                buscador
                    ? buscador.value
                    : ""
            );

        const conferencia =
            normalizar(
                filtroConferencia
                    ? filtroConferencia.value
                    : ""
            );


        let resultados =
            equipos.filter(function (equipo) {

                const datosEquipo =
                    normalizar(
                        [
                            equipo.name,
                            equipo.short,
                            equipo.manager,
                            equipo.conference,
                            equipo.division
                        ].join(" ")
                    );


                const coincideTexto =
                    !texto ||
                    datosEquipo.includes(texto);


                const coincideConferencia =
                    !conferencia ||
                    normalizar(
                        equipo.conference
                    ) === conferencia;


                return (
                    coincideTexto &&
                    coincideConferencia
                );
            });


        resultados =
            [...resultados];


        const orden =
            selectorOrden
                ? selectorOrden.value
                : "nombre";


        if (orden === "nombre") {

            resultados.sort(function (a, b) {

                return String(a.name)
                    .localeCompare(
                        String(b.name),
                        "es"
                    );
            });
        }


        if (orden === "salario-desc") {

            resultados.sort(function (a, b) {

                return (
                    obtenerSalarioEquipo(b) -
                    obtenerSalarioEquipo(a)
                );
            });
        }


        if (orden === "salario-asc") {

            resultados.sort(function (a, b) {

                return (
                    obtenerSalarioEquipo(a) -
                    obtenerSalarioEquipo(b)
                );
            });
        }


        if (orden === "jugadores-desc") {

            resultados.sort(function (a, b) {

                return (
                    obtenerJugadoresEquipo(b).length -
                    obtenerJugadoresEquipo(a).length
                );
            });
        }


        renderizar(resultados);
    }


    // =====================================================
    // EVENTOS
    // =====================================================

    if (buscador) {

        buscador.addEventListener(
            "input",
            aplicarFiltros
        );
    }


    if (filtroConferencia) {

        filtroConferencia.addEventListener(
            "change",
            aplicarFiltros
        );
    }


    if (selectorOrden) {

        selectorOrden.addEventListener(
            "change",
            aplicarFiltros
        );
    }


    aplicarFiltros();

});
