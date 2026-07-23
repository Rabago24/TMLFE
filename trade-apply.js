"use strict";

(function () {

    const STORAGE_KEY_EDICIONES = "tmlfe-player-edits";
    const STORAGE_KEY_HISTORIAL = "tmlfe-trade-history";


    function clonar(valor) {

        return JSON.parse(
            JSON.stringify(valor)
        );
    }


    function normalizar(valor) {

        return String(valor || "")
            .trim()
            .toLowerCase();
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


    function obtenerCodigoEquipoJugador(jugador) {

        return String(
            jugador.teamShort ||
            jugador.teamCode ||
            jugador.team ||
            jugador.equipo ||
            jugador.franchiseShort ||
            ""
        ).trim();
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


    function guardarEdicionJugador(
        jugador,
        nuevoEquipo
    ) {

        const id =
            obtenerIdJugador(jugador);

        if (!id) {
            return false;
        }

        const ediciones =
            cargarObjetoLocal(
                STORAGE_KEY_EDICIONES
            );

        const edicionAnterior =
            ediciones[id] &&
            typeof ediciones[id] === "object"
                ? ediciones[id]
                : {};

        ediciones[id] = {
            ...edicionAnterior,

            team: nuevoEquipo,
            teamShort: nuevoEquipo,
            teamCode: nuevoEquipo,
            equipo: nuevoEquipo,
            franchiseShort: nuevoEquipo
        };

        localStorage.setItem(
            STORAGE_KEY_EDICIONES,
            JSON.stringify(ediciones)
        );

        return true;
    }


    function actualizarJugadorEnMemoria(
        jugadorTrade,
        nuevoEquipo
    ) {

        if (
            !window.TMLFE ||
            !Array.isArray(window.TMLFE.players)
        ) {
            return false;
        }

        const idBuscado =
            obtenerIdJugador(jugadorTrade);

        const jugadorBase =
            window.TMLFE.players.find(
                function (jugador) {

                    return (
                        obtenerIdJugador(jugador) ===
                        idBuscado
                    );
                }
            );

        if (!jugadorBase) {
            return false;
        }

        jugadorBase.team = nuevoEquipo;
        jugadorBase.teamShort = nuevoEquipo;
        jugadorBase.teamCode = nuevoEquipo;
        jugadorBase.equipo = nuevoEquipo;
        jugadorBase.franchiseShort = nuevoEquipo;

        return true;
    }


    function cambiarEquipoJugador(
        jugador,
        nuevoEquipo
    ) {

        const guardado =
            guardarEdicionJugador(
                jugador,
                nuevoEquipo
            );

        const actualizado =
            actualizarJugadorEnMemoria(
                jugador,
                nuevoEquipo
            );

        return guardado || actualizado;
    }


    function crearRegistroHistorial(
        estado,
        validacion
    ) {

        return {
            id:
                "trade-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .slice(2, 8),

            fecha:
                new Date().toISOString(),

            temporada:
                "2026/27",

            teamA:
                estado.teamA,

            teamB:
                estado.teamB,

            playersA:
                estado.playersA.map(
                    function (jugador) {

                        return {
                            id:
                                obtenerIdJugador(
                                    jugador
                                ),

                            name:
                                obtenerNombreJugador(
                                    jugador
                                ),

                            salary:
                                jugador.salary || 0
                        };
                    }
                ),

            playersB:
                estado.playersB.map(
                    function (jugador) {

                        return {
                            id:
                                obtenerIdJugador(
                                    jugador
                                ),

                            name:
                                obtenerNombreJugador(
                                    jugador
                                ),

                            salary:
                                jugador.salary || 0
                        };
                    }
                ),

            validation:
                clonar(validacion)
        };
    }


    function guardarHistorial(
        estado,
        validacion
    ) {

        const historial =
            cargarListaLocal(
                STORAGE_KEY_HISTORIAL
            );

        historial.unshift(
            crearRegistroHistorial(
                estado,
                validacion
            )
        );

        localStorage.setItem(
            STORAGE_KEY_HISTORIAL,
            JSON.stringify(
                historial.slice(0, 100)
            )
        );
    }


    function aplicarTrade() {

        if (
            !window.TMLFETradeManager ||
            typeof window.TMLFETradeManager.getState !== "function"
        ) {

            return {
                ok: false,
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
                ok: false,
                message:
                    "No hay un traspaso completo preparado."
            };
        }

        if (
            normalizar(estado.teamA) ===
            normalizar(estado.teamB)
        ) {

            return {
                ok: false,
                message:
                    "Las dos franquicias del traspaso deben ser diferentes."
            };
        }

        if (
            !window.TMLFETradeValidator ||
            typeof window.TMLFETradeValidator.validate !== "function"
        ) {

            return {
                ok: false,
                message:
                    "No se ha cargado el validador."
            };
        }

        const resultado =
            window.TMLFETradeValidator.validate();

        if (!resultado.valid) {

            return {
                ok: false,
                message:
                    resultado.message ||
                    "El traspaso no cumple las reglas.",
                validation:
                    resultado
            };
        }

        const errores = [];

        estado.playersA.forEach(
            function (jugador) {

                const correcto =
                    cambiarEquipoJugador(
                        jugador,
                        estado.teamB
                    );

                if (!correcto) {

                    errores.push(
                        obtenerNombreJugador(
                            jugador
                        )
                    );
                }
            }
        );

        estado.playersB.forEach(
            function (jugador) {

                const correcto =
                    cambiarEquipoJugador(
                        jugador,
                        estado.teamA
                    );

                if (!correcto) {

                    errores.push(
                        obtenerNombreJugador(
                            jugador
                        )
                    );
                }
            }
        );

        if (errores.length > 0) {

            return {
                ok: false,
                message:
                    "No se pudieron actualizar estos jugadores: " +
                    errores.join(", ") +
                    "."
            };
        }

        guardarHistorial(
            estado,
            resultado
        );

        window.dispatchEvent(
            new CustomEvent(
                "tmlfe-trade-applied",
                {
                    detail: {
                        state:
                            clonar(estado),

                        validation:
                            clonar(resultado)
                    }
                }
            )
        );

        window.TMLFETradeManager.clear();

        return {
            ok: true,
            message:
                "Traspaso aplicado correctamente. Las plantillas y los salarios se han actualizado.",
            trade: estado,
            validation: resultado
        };
    }


    function obtenerHistorial() {

        return cargarListaLocal(
            STORAGE_KEY_HISTORIAL
        );
    }


    window.TMLFETradeApply = {
        apply: aplicarTrade,
        getHistory: obtenerHistorial
    };

})();
