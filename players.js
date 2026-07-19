"use strict";

window.addEventListener("load", function () {

    const TEMPORADA = "2026/27";

    const contenedor =
        document.getElementById("players-container");

    const contador =
        document.getElementById("numero-jugadores");

    const buscador =
        document.getElementById("player-search");

    const selectorOrden =
        document.getElementById("orden-jugadores");

    const tituloPagina =
        document.getElementById("titulo-pagina");

    const equipoCodigo =
        document.getElementById("equipo-codigo");

    const equipoNombre =
        document.getElementById("equipo-nombre");

    const equipoDescripcion =
        document.getElementById("equipo-descripcion");


    if (!contenedor) {
        return;
    }


    if (
        !window.TMLFE ||
        !Array.isArray(window.TMLFE.players)
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

                ERROR: No se han encontrado los jugadores
                dentro de database.js.

            </div>

        `;

        return;
    }


    const jugadores =
        window.TMLFE.players;

    const equipos =
        Array.isArray(window.TMLFE.teams)
            ? window.TMLFE.teams
            : [];


    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const equipoSolicitado =
        String(
            parametros.get("team") || ""
        ).trim();


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


    function obtenerValor(objeto, nombres, defecto) {

        for (const nombre of nombres) {

            if (
                objeto &&
                objeto[nombre] !== undefined &&
                objeto[nombre] !== null &&
                objeto[nombre] !== ""
            ) {

                return objeto[nombre];
            }
        }

        return defecto;
    }


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

        const texto =
            String(valor)
                .replace(/\./g, "")
                .replace(",", ".");

        const coincidencia =
            texto.match(/-?\d+(\.\d+)?/);

        return coincidencia
            ? Number(coincidencia[0]) || 0
            : 0;
    }


    function obtenerSalario(jugador) {

        if (
            jugador.salaries &&
            jugador.salaries[TEMPORADA] !== undefined
        ) {

            return convertirNumero(
                jugador.salaries[TEMPORADA]
            );
        }

        return convertirNumero(
            obtenerValor(
                jugador,
                [
                    "salary",
                    "salario",
                    "currentSalary"
                ],
                0
            )
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


    function perteneceAlEquipo(jugador, codigo) {

        if (!codigo) {
            return true;
        }

        const codigoNormalizado =
            normalizar(codigo);

        const datosJugador = [

            jugador.teamShort,
            jugador.teamCode,
            jugador.team,
            jugador.equipo,
            jugador.franchise,
            jugador.franchiseShort

        ].map(normalizar);


        return datosJugador.includes(
            codigoNormalizado
        );
    }


    function buscarEquipo(codigo) {

        const codigoNormalizado =
            normalizar(codigo);

        return equipos.find(function (equipo) {

            return (
                normalizar(equipo.short) ===
                    codigoNormalizado ||

                normalizar(equipo.name) ===
                    codigoNormalizado
            );
        });
    }


    const equipoSeleccionado =
        equipoSolicitado
            ? buscarEquipo(equipoSolicitado)
            : null;


    if (equipoSolicitado) {

        const nombre =
            equipoSeleccionado
                ? equipoSeleccionado.name
                : equipoSolicitado;

        if (tituloPagina) {
            tituloPagina.textContent =
                `Plantilla · ${nombre}`;
        }

        if (equipoCodigo) {
            equipoCodigo.textContent =
                equipoSeleccionado
                    ? equipoSeleccionado.short
                    : equipoSolicitado;
        }

        if (equipoNombre) {
            equipoNombre.textContent =
                nombre;
        }

        if (equipoDescripcion) {

            equipoDescripcion.textContent =
                equipoSeleccionado
                    ? `General Manager: ${
                        equipoSeleccionado.manager ||
                        "Sin asignar"
                    }`
                    : "Plantilla de la franquicia seleccionada";
        }
    }


    let jugadoresBase =
        jugadores.filter(function (jugador) {

            return perteneceAlEquipo(
                jugador,
                equipoSolicitado
            );
        });


    function crearTarjetaJugador(jugador) {

        const nombre =
            obtenerValor(
                jugador,
                [
                    "name",
                    "nombre",
                    "playerName",
                    "fullName"
                ],
                "Jugador sin nombre"
            );

        const posicion =
            obtenerValor(
                jugador,
                [
                    "position",
                    "pos",
                    "posicion"
                ],
                "—"
            );

        const edad =
            obtenerValor(
                jugador,
                [
                    "age",
                    "edad"
                ],
                "—"
            );

        const media =
            obtenerValor(
                jugador,
                [
                    "overall",
                    "ovr",
                    "rating",
                    "media"
                ],
                "—"
            );

        const equipo =
            obtenerValor(
                jugador,
                [
                    "teamShort",
                    "teamCode",
                    "team",
                    "equipo"
                ],
                "Sin equipo"
            );

        const salario =
            obtenerSalario(jugador);


        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "franchise-card player-card";

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


        tarjeta.innerHTML = `

            <div class="franchise-header">

                <div class="franchise-logo-box">

                    <strong class="franchise-logo-fallback">
                        ${escaparHTML(
                            String(nombre)
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </strong>

                </div>


                <div class="franchise-identity">

                    <span>
                        ${escaparHTML(equipo)}
                        ·
                        ${escaparHTML(posicion)}
                    </span>

                    <h3>
                        ${escaparHTML(nombre)}
                    </h3>

                    <p>
                        Edad ${escaparHTML(edad)}
                    </p>

                </div>

            </div>


            <div class="franchise-numbers">

                <div>

                    <span>
                        Media
                    </span>

                    <strong>
                        ${escaparHTML(media)}
                    </strong>

                    <small>
                        valoración
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
                        ${TEMPORADA}
                    </small>

                </div>

            </div>


            <div class="franchise-manager">

                <span>
                    Contrato
                </span>

                <strong>
                    ${
                        salario > 0
                            ? formatearMillones(salario)
                            : "Sin salario registrado"
                    }
                </strong>

            </div>

        `;

        return tarjeta;
    }


    function renderizar(lista) {

        contenedor.innerHTML = "";


        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No se encontraron jugadores
                    </strong>

                    <span>
                        La franquicia seleccionada todavía
                        no tiene jugadores asociados en database.js.
                    </span>

                </div>

            `;

            if (contador) {
                contador.textContent = "0";
            }

            return;
        }


        lista.forEach(function (jugador) {

            contenedor.appendChild(
                crearTarjetaJugador(jugador)
            );
        });


        if (contador) {

            contador.textContent =
                lista.length;
        }
    }


    function aplicarFiltros() {

        const texto =
            normalizar(
                buscador
                    ? buscador.value
                    : ""
            );


        let resultados =
            jugadoresBase.filter(function (jugador) {

                const contenido =
                    normalizar(
                        [
                            jugador.name,
                            jugador.nombre,
                            jugador.playerName,
                            jugador.fullName,
                            jugador.position,
                            jugador.pos,
                            jugador.posicion,
                            jugador.team,
                            jugador.teamShort,
                            jugador.teamCode,
                            jugador.equipo
                        ].join(" ")
                    );

                return (
                    !texto ||
                    contenido.includes(texto)
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

                const nombreA =
                    obtenerValor(
                        a,
                        [
                            "name",
                            "nombre",
                            "playerName",
                            "fullName"
                        ],
                        ""
                    );

                const nombreB =
                    obtenerValor(
                        b,
                        [
                            "name",
                            "nombre",
                            "playerName",
                            "fullName"
                        ],
                        ""
                    );

                return String(nombreA)
                    .localeCompare(
                        String(nombreB),
                        "es"
                    );
            });
        }


        if (orden === "media-desc") {

            resultados.sort(function (a, b) {

                const mediaA =
                    convertirNumero(
                        obtenerValor(
                            a,
                            [
                                "overall",
                                "ovr",
                                "rating",
                                "media"
                            ],
                            0
                        )
                    );

                const mediaB =
                    convertirNumero(
                        obtenerValor(
                            b,
                            [
                                "overall",
                                "ovr",
                                "rating",
                                "media"
                            ],
                            0
                        )
                    );

                return mediaB - mediaA;
            });
        }


        if (orden === "salario-desc") {

            resultados.sort(function (a, b) {

                return (
                    obtenerSalario(b) -
                    obtenerSalario(a)
                );
            });
        }


        if (orden === "edad-asc") {

            resultados.sort(function (a, b) {

                const edadA =
                    convertirNumero(
                        obtenerValor(
                            a,
                            [
                                "age",
                                "edad"
                            ],
                            999
                        )
                    );

                const edadB =
                    convertirNumero(
                        obtenerValor(
                            b,
                            [
                                "age",
                                "edad"
                            ],
                            999
                        )
                    );

                return edadA - edadB;
            });
        }


        renderizar(resultados);
    }


    if (buscador) {

        buscador.addEventListener(
            "input",
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
