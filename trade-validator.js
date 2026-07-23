"use strict";

(function () {

    const TEMPORADA = "2026/27";

    const SALARY_CAP =
        170000000;

    /*
     * Regla para equipos que terminan por encima del límite:
     * pueden recibir hasta el 125 % del salario enviado
     * más 100.000.
     */
    const PORCENTAJE_SOBRE_CAP =
        1.25;

    const MARGEN_SOBRE_CAP =
        100000;

    const STORAGE_KEY_EDICIONES =
        "tmlfe-player-edits";


    function normalizar(valor) {

        return String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
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

        } else if (texto.includes(",")) {

            texto =
                texto.replace(",", ".");
        }

        const coincidencia =
            texto.match(
                /-?\d+(\.\d+)?/
            );

        let numero =
            coincidencia
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


    function formatearMillones(cantidad) {

        return (
            convertirNumero(cantidad) /
            1000000
        ).toLocaleString(
            "es-ES",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            }
        ) + " M";
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


    function obtenerNombreJugador(jugador) {

        return String(
            obtenerValor(
                jugador,
                [
                    "name",
                    "nombre",
                    "playerName",
                    "fullName"
                ],
                "Jugador sin nombre"
            )
        ).trim();
    }


    function obtenerCodigoEquipoJugador(
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


    function obtenerSalarioJugador(
        jugador
    ) {

        if (
            jugador.salaries &&
            typeof jugador.salaries === "object" &&
            jugador.salaries[TEMPORADA] !== undefined
        ) {

            return convertirNumero(
                jugador.salaries[TEMPORADA]
            );
        }

        if (
            jugador.salary &&
            typeof jugador.salary === "object" &&
            jugador.salary[TEMPORADA] !== undefined
        ) {

            return convertirNumero(
                jugador.salary[TEMPORADA]
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


    function cargarEdiciones() {

        try {

            const datos =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY_EDICIONES
                    )
                );

            return (
                datos &&
                typeof datos === "object"
            )
                ? datos
                : {};

        } catch (error) {

            return {};
        }
    }


    function obtenerJugadoresActualizados() {

        if (
            !window.TMLFE ||
            !Array.isArray(window.TMLFE.players)
        ) {

            return [];
        }

        const ediciones =
            cargarEdiciones();

        return window.TMLFE.players.map(
            function (jugador) {

                const id =
                    obtenerIdJugador(
                        jugador
                    );

                if (
                    id &&
                    ediciones[id] &&
                    typeof ediciones[id] === "object"
                ) {

                    return {
                        ...jugador,
                        ...ediciones[id]
                    };
                }

                return jugador;
            }
        );
    }


    function obtenerNominaEquipo(
        codigoEquipo
    ) {

        const codigoNormalizado =
            normalizar(codigoEquipo);

        return obtenerJugadoresActualizados()
            .filter(
                function (jugador) {

                    return (
                        normalizar(
                            obtenerCodigoEquipoJugador(
                                jugador
                            )
                        ) ===
                        codigoNormalizado
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


    function sumarSalarios(lista) {

        if (!Array.isArray(lista)) {
            return 0;
        }

        return lista.reduce(
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


    function comprobarJugadoresDelEquipo(
        lista,
        codigoEquipo
    ) {

        const codigoNormalizado =
            normalizar(codigoEquipo);

        const incorrectos =
            lista.filter(
                function (jugador) {

                    return (
                        normalizar(
                            obtenerCodigoEquipoJugador(
                                jugador
                            )
                        ) !==
                        codigoNormalizado
                    );
                }
            );

        return {
            valid:
                incorrectos.length === 0,

            players:
                incorrectos.map(
                    obtenerNombreJugador
                )
        };
    }


    function validarEquipo(datos) {

        const antes =
            datos.before;

        const envia =
            datos.sends;

        const recibe =
            datos.receives;

        const despues =
            antes -
            envia +
            recibe;

        /*
         * REGLA 1:
         * Si después del traspaso el equipo queda
         * estrictamente por debajo del límite salarial,
         * puede absorber cualquier diferencia.
         */
        if (despues < SALARY_CAP) {

            return {
                valid: true,
                rule: "UNDER_CAP",
                before: antes,
                sends: envia,
                receives: recibe,
                after: despues,
                maximumReceivable: null,
                message:
                    "El equipo queda por debajo del límite salarial."
            };
        }

        /*
         * REGLA 2:
         * Quedar exactamente en 170 M no es válido.
         */
        if (despues === SALARY_CAP) {

            return {
                valid: false,
                rule: "EXACT_CAP",
                before: antes,
                sends: envia,
                receives: recibe,
                after: despues,
                maximumReceivable: null,
                message:
                    "El equipo quedaría exactamente en el límite salarial. Debe quedar por debajo o cumplir la regla de equipos sobre el límite."
            };
        }

        /*
         * REGLA 3:
         * Si el equipo termina por encima del límite,
         * se aplica el 125 % del salario enviado
         * más 100.000.
         */
        const maximoRecibible =
            envia *
            PORCENTAJE_SOBRE_CAP +
            MARGEN_SOBRE_CAP;

        const cumpleReglaSobreCap =
            envia > 0 &&
            recibe <= maximoRecibible;

        return {
            valid:
                cumpleReglaSobreCap,

            rule:
                "OVER_CAP",

            before:
                antes,

            sends:
                envia,

            receives:
                recibe,

            after:
                despues,

            maximumReceivable:
                maximoRecibible,

            message:
                cumpleReglaSobreCap

                    ? (
                        "El equipo cumple la regla salarial para equipos por encima del límite."
                    )

                    : (
                        "El equipo puede recibir como máximo " +
                        formatearMillones(
                            maximoRecibible
                        ) +
                        " y recibiría " +
                        formatearMillones(
                            recibe
                        ) +
                        "."
                    )
        };
    }


    function validarTrade() {

        if (
            !window.TMLFETradeManager ||
            typeof window
                .TMLFETradeManager
                .getState !== "function"
        ) {

            return {
                valid: false,
                message:
                    "No se ha cargado el gestor de traspasos.",
                teamA: null,
                teamB: null
            };
        }

        const estado =
            window.TMLFETradeManager
                .getState();

        if (
            !estado ||
            !estado.teamA ||
            !estado.teamB
        ) {

            return {
                valid: false,
                message:
                    "Debes añadir jugadores de dos franquicias diferentes.",
                teamA: null,
                teamB: null
            };
        }

        if (
            normalizar(estado.teamA) ===
            normalizar(estado.teamB)
        ) {

            return {
                valid: false,
                message:
                    "No puedes realizar un traspaso entre la misma franquicia.",
                teamA: null,
                teamB: null
            };
        }

        if (
            !Array.isArray(
                estado.playersA
            ) ||
            estado.playersA.length === 0
        ) {

            return {
                valid: false,
                message:
                    "El equipo A debe enviar al menos un jugador.",
                teamA: null,
                teamB: null
            };
        }

        if (
            !Array.isArray(
                estado.playersB
            ) ||
            estado.playersB.length === 0
        ) {

            return {
                valid: false,
                message:
                    "El equipo B debe enviar al menos un jugador.",
                teamA: null,
                teamB: null
            };
        }

        const propiedadA =
            comprobarJugadoresDelEquipo(
                estado.playersA,
                estado.teamA
            );

        const propiedadB =
            comprobarJugadoresDelEquipo(
                estado.playersB,
                estado.teamB
            );

        if (!propiedadA.valid) {

            return {
                valid: false,
                message:
                    "Hay jugadores que no pertenecen al equipo A: " +
                    propiedadA.players.join(", ") +
                    ".",
                teamA: null,
                teamB: null
            };
        }

        if (!propiedadB.valid) {

            return {
                valid: false,
                message:
                    "Hay jugadores que no pertenecen al equipo B: " +
                    propiedadB.players.join(", ") +
                    ".",
                teamA: null,
                teamB: null
            };
        }

        const nominaA =
            obtenerNominaEquipo(
                estado.teamA
            );

        const nominaB =
            obtenerNominaEquipo(
                estado.teamB
            );

        const salarioEnviadoA =
            sumarSalarios(
                estado.playersA
            );

        const salarioEnviadoB =
            sumarSalarios(
                estado.playersB
            );

        const resultadoA =
            validarEquipo({
                before:
                    nominaA,

                sends:
                    salarioEnviadoA,

                receives:
                    salarioEnviadoB
            });

        const resultadoB =
            validarEquipo({
                before:
                    nominaB,

                sends:
                    salarioEnviadoB,

                receives:
                    salarioEnviadoA
            });

        const teamA = {
            team:
                estado.teamA,

            valid:
                resultadoA.valid,

            before:
                resultadoA.before,

            sends:
                resultadoA.sends,

            receives:
                resultadoA.receives,

            after:
                resultadoA.after,

            maximumReceivable:
                resultadoA.maximumReceivable,

            rule:
                resultadoA.rule,

            message:
                resultadoA.message
        };

        const teamB = {
            team:
                estado.teamB,

            valid:
                resultadoB.valid,

            before:
                resultadoB.before,

            sends:
                resultadoB.sends,

            receives:
                resultadoB.receives,

            after:
                resultadoB.after,

            maximumReceivable:
                resultadoB.maximumReceivable,

            rule:
                resultadoB.rule,

            message:
                resultadoB.message
        };

        const valid =
            teamA.valid &&
            teamB.valid;

        return {
            valid: valid,

            message:
                valid

                    ? (
                        "El traspaso cumple las reglas salariales de ambos equipos."
                    )

                    : (
                        "El traspaso no cumple las reglas salariales de ambos equipos."
                    ),

            salaryCap:
                SALARY_CAP,

            teamA:
                teamA,

            teamB:
                teamB
        };
    }


    window.TMLFETradeValidator = {
        validate:
            validarTrade,

        getSalaryCap:
            function () {

                return SALARY_CAP;
            },

        formatMillions:
            formatearMillones
    };

})();
