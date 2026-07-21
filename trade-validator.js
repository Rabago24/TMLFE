"use strict";

(function () {

    const SALARY_CAP = 170000000;
    const TEMPORADA = "2026/27";

    function normalizar(valor) {

        return String(valor || "")
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

        } else {

            texto =
                texto.replace(",", ".");
        }

        const coincidencia =
            texto.match(/-?\d+(\.\d+)?/);

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

    function obtenerCodigoEquipo(jugador) {

        return String(
            jugador.teamShort ||
            jugador.teamCode ||
            jugador.team ||
            jugador.equipo ||
            jugador.franchiseShort ||
            ""
        ).trim();
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
            jugador.salary ||
            jugador.salario ||
            jugador.currentSalary ||
            0
        );
    }

    function obtenerJugadoresBase() {

        if (
            !window.TMLFE ||
            !Array.isArray(window.TMLFE.players)
        ) {
            return [];
        }

        return window.TMLFE.players;
    }

    function calcularNominaEquipo(codigoEquipo) {

        const codigo =
            normalizar(codigoEquipo);

        return obtenerJugadoresBase()
            .filter(
                function (jugador) {

                    return (
                        normalizar(
                            obtenerCodigoEquipo(jugador)
                        ) === codigo
                    );
                }
            )
            .reduce(
                function (total, jugador) {

                    return (
                        total +
                        obtenerSalario(jugador)
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
            function (total, jugador) {

                return (
                    total +
                    convertirNumero(
                        jugador.salary
                    )
                );
            },
            0
        );
    }

    function validarEquipo(datos) {

        const antes =
            calcularNominaEquipo(
                datos.team
            );

        const envia =
            sumarSalarios(
                datos.playersOut
            );

        const recibe =
            sumarSalarios(
                datos.playersIn
            );

        const despues =
            antes - envia + recibe;

        const debajoAntes =
            antes < SALARY_CAP;

        const debajoDespues =
            despues < SALARY_CAP;

        let valido = true;
        let mensaje = "";

        if (
            debajoAntes &&
            !debajoDespues
        ) {

            valido = false;

            mensaje =
                "El equipo estaba por debajo del límite y no puede terminar en el límite o por encima.";
        } else {

            mensaje =
                "El equipo cumple la primera regla salarial.";
        }

        return {
            team: datos.team,
            before: antes,
            sends: envia,
            receives: recibe,
            after: despues,
            valid: valido,
            message: mensaje,
            underCapBefore: debajoAntes,
            underCapAfter: debajoDespues
        };
    }

    function validarTrade() {

        if (
            !window.TMLFETradeManager
        ) {

            return {
                valid: false,
                message:
                    "No se ha cargado el gestor de traspasos."
            };
        }

        const estado =
            window.TMLFETradeManager.getState();

        if (
            !estado.teamA ||
            !estado.teamB ||
            estado.playersA.length === 0 ||
            estado.playersB.length === 0
        ) {

            return {
                valid: false,
                message:
                    "Debes añadir jugadores de dos franquicias."
            };
        }

        const equipoA =
            validarEquipo({
                team: estado.teamA,
                playersOut: estado.playersA,
                playersIn: estado.playersB
            });

        const equipoB =
            validarEquipo({
                team: estado.teamB,
                playersOut: estado.playersB,
                playersIn: estado.playersA
            });

        return {
            valid:
                equipoA.valid &&
                equipoB.valid,
            teamA: equipoA,
            teamB: equipoB,
            salaryCap: SALARY_CAP,
            message:
                equipoA.valid &&
                equipoB.valid
                    ? "El traspaso cumple la primera regla salarial."
                    : "El traspaso no cumple la primera regla salarial."
        };
    }

    window.TMLFETradeValidator = {
        validate: validarTrade,
        calculateTeamPayroll:
            calcularNominaEquipo,
        salaryCap: SALARY_CAP
    };

})();
