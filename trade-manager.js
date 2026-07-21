"use strict";

(function () {

    const STORAGE_KEY = "tmlfe-current-trade";

    const estadoInicial = {
        teamA: "",
        teamB: "",
        playersA: [],
        playersB: []
    };

    function clonar(valor) {
        return JSON.parse(JSON.stringify(valor));
    }

    function cargarEstado() {

        try {

            const guardado =
                JSON.parse(
                    localStorage.getItem(STORAGE_KEY)
                );

            if (
                guardado &&
                typeof guardado === "object"
            ) {

                return {
                    ...clonar(estadoInicial),
                    ...guardado,
                    playersA: Array.isArray(guardado.playersA)
                        ? guardado.playersA
                        : [],
                    playersB: Array.isArray(guardado.playersB)
                        ? guardado.playersB
                        : []
                };
            }

        } catch (error) {

            console.warn(
                "No se pudo cargar el trade guardado.",
                error
            );
        }

        return clonar(estadoInicial);
    }

    let estado = cargarEstado();

    function guardarEstado() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(estado)
        );

        window.dispatchEvent(
            new CustomEvent(
                "tmlfe-trade-updated",
                {
                    detail: obtenerEstado()
                }
            )
        );
    }

    function obtenerEstado() {
        return clonar(estado);
    }

    function obtenerIdJugador(jugador) {

        return String(
            jugador.id ||
            jugador.playerId ||
            jugador.name ||
            jugador.nombre ||
            jugador.playerName ||
            jugador.fullName ||
            ""
        ).trim();
    }

    function obtenerNombreJugador(jugador) {

        return String(
            jugador.name ||
            jugador.nombre ||
            jugador.playerName ||
            jugador.fullName ||
            "Jugador sin nombre"
        ).trim();
    }

    function obtenerEquipoJugador(jugador) {

        return String(
            jugador.teamShort ||
            jugador.teamCode ||
            jugador.team ||
            jugador.equipo ||
            jugador.franchiseShort ||
            ""
        ).trim();
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

    function obtenerSalario(jugador) {

        if (
            jugador.salaries &&
            jugador.salaries["2026/27"] !== undefined
        ) {

            return convertirNumero(
                jugador.salaries["2026/27"]
            );
        }

        return convertirNumero(
            jugador.salary ||
            jugador.salario ||
            jugador.currentSalary ||
            0
        );
    }

    function prepararJugador(jugador) {

        return {
            id: obtenerIdJugador(jugador),
            name: obtenerNombreJugador(jugador),
            team: obtenerEquipoJugador(jugador),
            salary: obtenerSalario(jugador),
            position:
                jugador.position ||
                jugador.pos ||
                jugador.posicion ||
                "",
            overall:
                jugador.overall ||
                jugador.ovr ||
                jugador.rating ||
                jugador.media ||
                ""
        };
    }

    function contieneJugador(lista, id) {

        return lista.some(
            function (jugador) {
                return jugador.id === id;
            }
        );
    }

    function añadirJugador(jugador) {

        if (!jugador) {
            return {
                ok: false,
                message: "No se ha recibido ningún jugador."
            };
        }

        const jugadorPreparado =
            prepararJugador(jugador);

        if (!jugadorPreparado.id) {

            return {
                ok: false,
                message: "El jugador no tiene un identificador válido."
            };
        }

        const equipo =
            jugadorPreparado.team;

        if (!equipo) {

            return {
                ok: false,
                message: "El jugador no tiene una franquicia asignada."
            };
        }

        if (
            contieneJugador(
                estado.playersA,
                jugadorPreparado.id
            ) ||
            contieneJugador(
                estado.playersB,
                jugadorPreparado.id
            )
        ) {

            return {
                ok: false,
                message: `${jugadorPreparado.name} ya está añadido al trade.`
            };
        }

        if (!estado.teamA) {

            estado.teamA = equipo;
            estado.playersA.push(jugadorPreparado);
            guardarEstado();

            return {
                ok: true,
                side: "A",
                message: `${jugadorPreparado.name} añadido al equipo A.`
            };
        }

        if (equipo === estado.teamA) {

            estado.playersA.push(jugadorPreparado);
            guardarEstado();

            return {
                ok: true,
                side: "A",
                message: `${jugadorPreparado.name} añadido al equipo A.`
            };
        }

        if (!estado.teamB) {

            estado.teamB = equipo;
            estado.playersB.push(jugadorPreparado);
            guardarEstado();

            return {
                ok: true,
                side: "B",
                message: `${jugadorPreparado.name} añadido al equipo B.`
            };
        }

        if (equipo === estado.teamB) {

            estado.playersB.push(jugadorPreparado);
            guardarEstado();

            return {
                ok: true,
                side: "B",
                message: `${jugadorPreparado.name} añadido al equipo B.`
            };
        }

        return {
            ok: false,
            message:
                "Este primer sistema solo admite dos franquicias por traspaso."
        };
    }

    function quitarJugador(idJugador) {

        const id =
            String(idJugador || "").trim();

        estado.playersA =
            estado.playersA.filter(
                function (jugador) {
                    return jugador.id !== id;
                }
            );

        estado.playersB =
            estado.playersB.filter(
                function (jugador) {
                    return jugador.id !== id;
                }
            );

        if (estado.playersA.length === 0) {
            estado.teamA = "";
        }

        if (estado.playersB.length === 0) {
            estado.teamB = "";
        }

        guardarEstado();
    }

    function vaciarTrade() {

        estado =
            clonar(estadoInicial);

        guardarEstado();
    }

    function obtenerResumen() {

        const salarioA =
            estado.playersA.reduce(
                function (total, jugador) {
                    return total + convertirNumero(jugador.salary);
                },
                0
            );

        const salarioB =
            estado.playersB.reduce(
                function (total, jugador) {
                    return total + convertirNumero(jugador.salary);
                },
                0
            );

        return {
            teamA: estado.teamA,
            teamB: estado.teamB,
            playersA: estado.playersA.length,
            playersB: estado.playersB.length,
            salaryA: salarioA,
            salaryB: salarioB,
            difference: salarioA - salarioB
        };
    }

    window.TMLFETradeManager = {
        addPlayer: añadirJugador,
        removePlayer: quitarJugador,
        clear: vaciarTrade,
        getState: obtenerEstado,
        getSummary: obtenerResumen
    };

})();
