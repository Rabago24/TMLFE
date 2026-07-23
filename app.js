"use strict";

document.addEventListener(
    "DOMContentLoaded",
    iniciarDashboard
);


(function () {

    const TEMPORADA =
        "2026/27";

    const SALARY_CAP =
        170000000;

    const STORAGE_KEY_EDICIONES =
        "tmlfe-player-edits";

    const STORAGE_KEY_HISTORIAL =
        "tmlfe-trade-history";


    function iniciarDashboard() {

        const datos =
            obtenerDatosTMLFE();

        if (!datos) {

            mostrarToast(
                "No se ha podido cargar la base de datos."
            );

            return;
        }

        const jugadoresActualizados =
            aplicarEdicionesGuardadas(
                datos.jugadores
            );

        const historial =
            obtenerHistorialTrades();

        actualizarContadores(
            datos.equipos,
            jugadoresActualizados,
            historial
        );

        actualizarSituacionSalarial(
            datos.equipos,
            jugadoresActualizados
        );

        renderizarUltimoTrade(
            historial,
            datos.equipos
        );

        renderizarActividadReciente(
            historial,
            datos.equipos
        );
    }


    function obtenerDatosTMLFE() {

        const base =
            window.TMLFE ||
            window.TMLFE_DATABASE;

        if (!base) {

            console.error(
                "No se ha cargado database.js."
            );

            return null;
        }

        const equipos =
            Array.isArray(base.teams)
                ? base.teams
                : (
                    Array.isArray(base.equipos)
                        ? base.equipos
                        : []
                );

        const jugadores =
            Array.isArray(base.players)
                ? base.players
                : (
                    Array.isArray(base.jugadores)
                        ? base.jugadores
                        : []
                );

        return {
            equipos,
            jugadores
        };
    }


    function cargarObjetoLocal(clave) {

        try {

            const valor =
                JSON.parse(
                    localStorage.getItem(clave)
                );

            return (
                valor &&
                typeof valor === "object"
            )
                ? valor
                : {};

        } catch (error) {

            console.warn(
                `No se pudo leer ${clave}.`,
                error
            );

            return {};
        }
    }


    function cargarListaLocal(clave) {

        try {

            const valor =
                JSON.parse(
                    localStorage.getItem(clave)
                );

            return Array.isArray(valor)
                ? valor
                : [];

        } catch (error) {

            console.warn(
                `No se pudo leer ${clave}.`,
                error
            );

            return [];
        }
    }


    function obtenerHistorialTrades() {

        return cargarListaLocal(
            STORAGE_KEY_HISTORIAL
        );
    }


    function obtenerValor(
        objeto,
        nombres,
        defecto
    ) {

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


    function obtenerIdJugador(jugador) {

        return String(
            obtenerValor(
                jugador,
                [
                    "id",
                    "playerId",
                    "name",
                    "nombre",
                    "playerName",
                    "fullName"
                ],
                ""
            )
        ).trim();
    }


    function aplicarEdicionesGuardadas(
        jugadores
    ) {

        const ediciones =
            cargarObjetoLocal(
                STORAGE_KEY_EDICIONES
            );

        return jugadores.map(
            function (jugador) {

                const id =
                    obtenerIdJugador(
                        jugador
                    );

                if (
                    id &&
                    ediciones[id] &&
                    typeof ediciones[id] ===
                        "object"
                ) {

                    return {
                        ...jugador,
                        ...ediciones[id]
                    };
                }

                return {
                    ...jugador
                };
            }
        );
    }


    function normalizar(valor) {

        return String(valor || "")
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim()
            .toLowerCase();
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

        const textoOriginal =
            String(valor).trim();

        if (!textoOriginal) {

            return 0;
        }

        let texto =
            textoOriginal
                .replace(/\s/g, "")
                .replace(/[€$]/g, "");

        if (
            texto.includes(",") &&
            texto.includes(".")
        ) {

            texto =
                texto
                    .replace(/\./g, "")
                    .replace(",", ".");

        } else if (
            texto.includes(",")
        ) {

            texto =
                texto.replace(",", ".");
        }

        const coincidencia =
            texto.match(
                /-?\d+(\.\d+)?/
            );

        let numero =
            coincidencia
                ? Number(
                    coincidencia[0]
                ) || 0
                : 0;

        if (
            /m(illones?)?$/i.test(
                textoOriginal
            ) &&
            Math.abs(numero) <
                1000000
        ) {

            numero *=
                1000000;
        }

        return numero;
    }


    function obtenerSalarioJugador(
        jugador
    ) {

        if (
            jugador.salaries &&
            typeof jugador.salaries ===
                "object" &&
            jugador.salaries[TEMPORADA] !==
                undefined
        ) {

            return convertirNumero(
                jugador.salaries[
                    TEMPORADA
                ]
            );
        }

        if (
            jugador.salary &&
            typeof jugador.salary ===
                "object" &&
            jugador.salary[TEMPORADA] !==
                undefined
        ) {

            return convertirNumero(
                jugador.salary[
                    TEMPORADA
                ]
            );
        }

        return convertirNumero(
            obtenerValor(
                jugador,
                [
                    "salary",
                    "salario",
                    "currentSalary",
                    "26/27"
                ],
                0
            )
        );
    }


    function obtenerCodigoEquipo(
        equipo
    ) {

        return String(
            obtenerValor(
                equipo,
                [
                    "short",
                    "code",
                    "abbreviation",
                    "id",
                    "codigo"
                ],
                ""
            )
        ).trim();
    }


    function obtenerNombreEquipo(
        equipo
    ) {

        return String(
            obtenerValor(
                equipo,
                [
                    "name",
                    "nombre",
                    "fullName",
                    "franchise"
                ],
                obtenerCodigoEquipo(
                    equipo
                ) ||
                "Franquicia"
            )
        ).trim();
    }


    function obtenerCodigoJugador(
        jugador
    ) {

        return String(
            obtenerValor(
                jugador,
                [
                    "teamShort",
                    "teamCode",
                    "team",
                    "equipo",
                    "franchiseShort",
                    "franchise"
                ],
                ""
            )
        ).trim();
    }


    function buscarEquipo(
        equipos,
        codigo
    ) {

        const buscado =
            normalizar(codigo);

        return equipos.find(
            function (equipo) {

                return (
                    normalizar(
                        obtenerCodigoEquipo(
                            equipo
                        )
                    ) === buscado ||

                    normalizar(
                        obtenerNombreEquipo(
                            equipo
                        )
                    ) === buscado
                );
            }
        );
    }


    function obtenerNombreEquipoPorCodigo(
        equipos,
        codigo
    ) {

        const equipo =
            buscarEquipo(
                equipos,
                codigo
            );

        return equipo
            ? obtenerNombreEquipo(
                equipo
            )
            : codigo ||
                "Franquicia";
    }


    function obtenerRutaEscudo(codigo) {

        const limpio =
            String(codigo || "")
                .trim()
                .toLowerCase();

        return limpio
            ? `./${limpio}.png`
            : "";
    }


    function obtenerNominaEquipo(
        jugadores,
        codigoEquipo
    ) {

        const codigo =
            normalizar(
                codigoEquipo
            );

        return jugadores
            .filter(
                function (jugador) {

                    return (
                        normalizar(
                            obtenerCodigoJugador(
                                jugador
                            )
                        ) ===
                        codigo
                    );
                }
            )
            .reduce(
                function (
                    total,
                    jugador
                ) {

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


    function actualizarContadores(
        equipos,
        jugadores,
        historial
    ) {

        ponerTexto(
            "total-equipos",
            equipos.length
        );

        ponerTexto(
            "total-jugadores",
            jugadores.length
        );

        ponerTexto(
            "total-trades",
            historial.length
        );
    }


    function actualizarSituacionSalarial(
        equipos,
        jugadores
    ) {

        let bajoCap =
            0;

        let sobreCap =
            0;

        equipos.forEach(
            function (equipo) {

                const codigo =
                    obtenerCodigoEquipo(
                        equipo
                    );

                const nomina =
                    obtenerNominaEquipo(
                        jugadores,
                        codigo
                    );

                if (
                    nomina <
                    SALARY_CAP
                ) {

                    bajoCap += 1;

                } else {

                    sobreCap += 1;
                }
            }
        );

        ponerTexto(
            "equipos-bajo-cap",
            bajoCap
        );

        ponerTexto(
            "resumen-bajo-cap",
            bajoCap
        );

        ponerTexto(
            "equipos-sobre-cap",
            sobreCap
        );
    }


    function renderizarUltimoTrade(
        historial,
        equipos
    ) {

        const contenedor =
            document.getElementById(
                "ultimo-trade"
            );

        if (!contenedor) {

            return;
        }

        if (
            historial.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="dashboard-empty-state">

                    <strong>
                        Todavía no hay traspasos
                    </strong>

                    <span>
                        La primera operación confirmada
                        aparecerá aquí automáticamente.
                    </span>

                </div>

            `;

            return;
        }

        const trade =
            historial[0];

        const nombreA =
            obtenerNombreEquipoPorCodigo(
                equipos,
                trade.teamA
            );

        const nombreB =
            obtenerNombreEquipoPorCodigo(
                equipos,
                trade.teamB
            );

        const jugadoresA =
            Array.isArray(
                trade.playersA
            )
                ? trade.playersA
                : [];

        const jugadoresB =
            Array.isArray(
                trade.playersB
            )
                ? trade.playersB
                : [];

        contenedor.innerHTML = `

            <div class="latest-trade-header">

                <div class="latest-trade-team">

                    <img
                        src="${escaparHTML(
                            obtenerRutaEscudo(
                                trade.teamA
                            )
                        )}"
                        alt="${escaparHTML(
                            nombreA
                        )}"
                        onerror="
                            this.style.display='none';
                        "
                    >

                    <div>

                        <span>
                            ${escaparHTML(
                                trade.teamA
                            )}
                        </span>

                        <strong>
                            ${escaparHTML(
                                nombreA
                            )}
                        </strong>

                    </div>

                </div>


                <div class="latest-trade-arrow">
                    ⇄
                </div>


                <div class="latest-trade-team">

                    <img
                        src="${escaparHTML(
                            obtenerRutaEscudo(
                                trade.teamB
                            )
                        )}"
                        alt="${escaparHTML(
                            nombreB
                        )}"
                        onerror="
                            this.style.display='none';
                        "
                    >

                    <div>

                        <span>
                            ${escaparHTML(
                                trade.teamB
                            )}
                        </span>

                        <strong>
                            ${escaparHTML(
                                nombreB
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div class="latest-trade-players">

                <div>

                    <span>
                        ${escaparHTML(
                            nombreA
                        )} recibe
                    </span>

                    ${crearListaJugadores(
                        jugadoresB
                    )}

                </div>


                <div>

                    <span>
                        ${escaparHTML(
                            nombreB
                        )} recibe
                    </span>

                    ${crearListaJugadores(
                        jugadoresA
                    )}

                </div>

            </div>


            <div class="latest-trade-footer">

                <span class="status-pill">
                    Trade confirmado
                </span>

                <time>
                    ${escaparHTML(
                        formatearFecha(
                            trade.fecha
                        )
                    )}
                </time>

            </div>

        `;
    }


    function crearListaJugadores(
        jugadores
    ) {

        if (
            !Array.isArray(
                jugadores
            ) ||
            jugadores.length === 0
        ) {

            return `

                <p class="latest-trade-empty">
                    Sin jugadores registrados
                </p>

            `;
        }

        return `

            <ul>

                ${jugadores.map(
                    function (jugador) {

                        return `

                            <li>

                                <strong>
                                    ${escaparHTML(
                                        jugador.name ||
                                        "Jugador"
                                    )}
                                </strong>

                            </li>

                        `;
                    }
                ).join("")}

            </ul>

        `;
    }


    function renderizarActividadReciente(
        historial,
        equipos
    ) {

        const contenedor =
            document.getElementById(
                "actividad-reciente"
            );

        if (!contenedor) {

            return;
        }

        if (
            historial.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="dashboard-empty-state">

                    <strong>
                        Sin movimientos recientes
                    </strong>

                    <span>
                        Los jugadores traspasados aparecerán
                        en esta sección.
                    </span>

                </div>

            `;

            return;
        }

        const movimientos =
            [];

        historial
            .slice(0, 6)
            .forEach(
                function (trade) {

                    const nombreA =
                        obtenerNombreEquipoPorCodigo(
                            equipos,
                            trade.teamA
                        );

                    const nombreB =
                        obtenerNombreEquipoPorCodigo(
                            equipos,
                            trade.teamB
                        );

                    const jugadoresA =
                        Array.isArray(
                            trade.playersA
                        )
                            ? trade.playersA
                            : [];

                    const jugadoresB =
                        Array.isArray(
                            trade.playersB
                        )
                            ? trade.playersB
                            : [];

                    jugadoresA.forEach(
                        function (jugador) {

                            movimientos.push({
                                player:
                                    jugador.name ||
                                    "Jugador",

                                team:
                                    nombreB,

                                code:
                                    trade.teamB,

                                date:
                                    trade.fecha
                            });
                        }
                    );

                    jugadoresB.forEach(
                        function (jugador) {

                            movimientos.push({
                                player:
                                    jugador.name ||
                                    "Jugador",

                                team:
                                    nombreA,

                                code:
                                    trade.teamA,

                                date:
                                    trade.fecha
                            });
                        }
                    );
                }
            );

        contenedor.innerHTML =
            movimientos
                .slice(0, 8)
                .map(
                    function (movimiento) {

                        return `

                            <div class="activity-item">

                                <div class="activity-team-logo">

                                    <img
                                        src="${escaparHTML(
                                            obtenerRutaEscudo(
                                                movimiento.code
                                            )
                                        )}"
                                        alt=""
                                        onerror="
                                            this.style.display='none';
                                        "
                                    >

                                </div>


                                <div class="activity-item-copy">

                                    <strong>
                                        ${escaparHTML(
                                            movimiento.player
                                        )}
                                    </strong>

                                    <span>
                                        se incorpora a
                                        ${escaparHTML(
                                            movimiento.team
                                        )}
                                    </span>

                                </div>


                                <time>
                                    ${escaparHTML(
                                        formatearFechaCorta(
                                            movimiento.date
                                        )
                                    )}
                                </time>

                            </div>

                        `;
                    }
                )
                .join("");
    }


    function formatearFecha(fecha) {

        if (!fecha) {

            return "Fecha no disponible";
        }

        const objetoFecha =
            new Date(fecha);

        if (
            Number.isNaN(
                objetoFecha.getTime()
            )
        ) {

            return "Fecha no disponible";
        }

        return objetoFecha.toLocaleString(
            "es-ES",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function formatearFechaCorta(
        fecha
    ) {

        if (!fecha) {

            return "";
        }

        const objetoFecha =
            new Date(fecha);

        if (
            Number.isNaN(
                objetoFecha.getTime()
            )
        ) {

            return "";
        }

        return objetoFecha.toLocaleDateString(
            "es-ES",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );
    }


    function ponerTexto(
        id,
        valor
    ) {

        const elemento =
            document.getElementById(
                id
            );

        if (elemento) {

            elemento.textContent =
                valor;
        }
    }


    function mostrarToast(
        mensaje
    ) {

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
            "show"
        );

        window.clearTimeout(
            mostrarToast.temporizador
        );

        mostrarToast.temporizador =
            window.setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );
                },
                2600
            );
    }


    function escaparHTML(valor) {

        return String(
            valor ?? ""
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

})();
