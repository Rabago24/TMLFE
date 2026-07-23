"use strict";

(function () {
    const TEMPORADA = "2026/27";
    const SALARY_CAP = 170000000;
    const STORAGE_EDICIONES = "tmlfe-player-edits";
    const STORAGE_HISTORIAL = "tmlfe-trade-history";

    function iniciarDashboard() {
        const base = window.TMLFE || window.TMLFE_DATABASE;

        if (!base) {
            console.error("TMLFE: no se ha cargado database.js");
            mostrarToast("No se ha podido cargar la base de datos.");
            return;
        }

        const equipos = Array.isArray(base.teams)
            ? base.teams
            : Array.isArray(base.equipos)
                ? base.equipos
                : [];

        const jugadoresOriginales = Array.isArray(base.players)
            ? base.players
            : Array.isArray(base.jugadores)
                ? base.jugadores
                : [];

        const jugadores = aplicarEdiciones(jugadoresOriginales);

        const historial = leerListaLocal(STORAGE_HISTORIAL)
            .slice()
            .sort(function (a, b) {
                return new Date(b.fecha || 0) - new Date(a.fecha || 0);
            });

        ponerTexto("total-equipos", equipos.length);
        ponerTexto("total-jugadores", jugadores.length);
        ponerTexto("total-trades", historial.length);

        actualizarSituacionSalarial(equipos, jugadores);
        renderizarUltimoTrade(historial, equipos);
        renderizarActividadReciente(historial, equipos);

        console.log(
            `Dashboard cargado: ${equipos.length} franquicias, ` +
            `${jugadores.length} jugadores y ${historial.length} trades.`
        );
    }

    function aplicarEdiciones(jugadores) {
        const ediciones = leerObjetoLocal(STORAGE_EDICIONES);

        return jugadores.map(function (jugador) {
            const id = String(
                jugador.id ||
                jugador.playerId ||
                jugador.name ||
                jugador.nombre ||
                ""
            ).trim();

            return id && ediciones[id]
                ? Object.assign({}, jugador, ediciones[id])
                : Object.assign({}, jugador);
        });
    }

    function leerObjetoLocal(clave) {
        try {
            const valor = JSON.parse(localStorage.getItem(clave));

            return valor &&
                typeof valor === "object" &&
                !Array.isArray(valor)
                ? valor
                : {};

        } catch (error) {
            console.warn(`No se pudo leer ${clave}.`, error);
            return {};
        }
    }

    function leerListaLocal(clave) {
        try {
            const valor = JSON.parse(localStorage.getItem(clave));
            return Array.isArray(valor) ? valor : [];

        } catch (error) {
            console.warn(`No se pudo leer ${clave}.`, error);
            return [];
        }
    }

    function actualizarSituacionSalarial(equipos, jugadores) {
        let bajoCap = 0;
        let sobreCap = 0;

        equipos.forEach(function (equipo) {
            const codigo = codigoEquipo(equipo);

            const nomina = jugadores
                .filter(function (jugador) {
                    return normalizar(codigoJugador(jugador)) ===
                        normalizar(codigo);
                })
                .reduce(function (total, jugador) {
                    return total + salarioJugador(jugador);
                }, 0);

            if (nomina < SALARY_CAP) {
                bajoCap += 1;
            } else {
                sobreCap += 1;
            }
        });

        ponerTexto("equipos-bajo-cap", bajoCap);
        ponerTexto("resumen-bajo-cap", bajoCap);
        ponerTexto("equipos-sobre-cap", sobreCap);
    }

    function salarioJugador(jugador) {
        if (
            jugador.salaries &&
            typeof jugador.salaries === "object" &&
            jugador.salaries[TEMPORADA] !== undefined
        ) {
            return numero(jugador.salaries[TEMPORADA]);
        }

        if (
            jugador.salary &&
            typeof jugador.salary === "object" &&
            jugador.salary[TEMPORADA] !== undefined
        ) {
            return numero(jugador.salary[TEMPORADA]);
        }

        return numero(
            jugador.salary ??
            jugador.salario ??
            jugador.currentSalary ??
            jugador["26/27"] ??
            0
        );
    }

    function numero(valor) {
        if (typeof valor === "number") {
            return Number.isFinite(valor) ? valor : 0;
        }

        const original = String(valor ?? "").trim();

        if (!original) {
            return 0;
        }

        let texto = original
            .replace(/\s/g, "")
            .replace(/[€$]/g, "");

        if (texto.includes(",") && texto.includes(".")) {
            texto = texto
                .replace(/\./g, "")
                .replace(",", ".");
        } else {
            texto = texto.replace(",", ".");
        }

        const coincidencia = texto.match(/-?\d+(\.\d+)?/);

        let resultado = coincidencia
            ? Number(coincidencia[0]) || 0
            : 0;

        if (
            /m(illones?)?$/i.test(original) &&
            Math.abs(resultado) < 1000000
        ) {
            resultado *= 1000000;
        }

        return resultado;
    }

    function codigoEquipo(equipo) {
        return String(
            equipo.short ||
            equipo.code ||
            equipo.abbreviation ||
            equipo.id ||
            equipo.codigo ||
            ""
        ).trim();
    }

    function nombreEquipo(equipo) {
        return String(
            equipo.name ||
            equipo.nombre ||
            equipo.fullName ||
            equipo.franchise ||
            codigoEquipo(equipo) ||
            "Franquicia"
        ).trim();
    }

    function codigoJugador(jugador) {
        return String(
            jugador.teamShort ||
            jugador.teamCode ||
            jugador.team ||
            jugador.equipo ||
            jugador.franchiseShort ||
            jugador.franchise ||
            ""
        ).trim();
    }

    function buscarEquipo(equipos, codigo) {
        const buscado = normalizar(codigo);

        return equipos.find(function (equipo) {
            return (
                normalizar(codigoEquipo(equipo)) === buscado ||
                normalizar(nombreEquipo(equipo)) === buscado
            );
        });
    }

    function nombrePorCodigo(equipos, codigo) {
        const equipo = buscarEquipo(equipos, codigo);

        return equipo
            ? nombreEquipo(equipo)
            : codigo || "Franquicia";
    }

    function renderizarUltimoTrade(historial, equipos) {
        const contenedor = document.getElementById("ultimo-trade");

        if (!contenedor) {
            return;
        }

        if (historial.length === 0) {
            contenedor.innerHTML = `
                <div class="dashboard-empty-state">
                    <strong>Todavía no hay traspasos</strong>
                    <span>
                        La primera operación confirmada aparecerá aquí
                        automáticamente.
                    </span>
                </div>
            `;

            return;
        }

        const trade = historial[0];

        const equipoA = nombrePorCodigo(
            equipos,
            trade.teamA
        );

        const equipoB = nombrePorCodigo(
            equipos,
            trade.teamB
        );

        const jugadoresA = Array.isArray(trade.playersA)
            ? trade.playersA
            : [];

        const jugadoresB = Array.isArray(trade.playersB)
            ? trade.playersB
            : [];

        contenedor.innerHTML = `
            <div class="latest-trade-header">

                <div class="latest-trade-team">
                    <strong>${escapar(equipoA)}</strong>
                </div>

                <div class="latest-trade-arrow">
                    ⇄
                </div>

                <div class="latest-trade-team">
                    <strong>${escapar(equipoB)}</strong>
                </div>

            </div>

            <div class="latest-trade-players">

                <div>
                    <span>${escapar(equipoA)} recibe</span>
                    ${listaJugadores(jugadoresB)}
                </div>

                <div>
                    <span>${escapar(equipoB)} recibe</span>
                    ${listaJugadores(jugadoresA)}
                </div>

            </div>

            <div class="latest-trade-footer">

                <span class="status-pill">
                    Trade confirmado
                </span>

                <time>
                    ${escapar(formatearFecha(trade.fecha))}
                </time>

            </div>
        `;
    }

    function listaJugadores(jugadores) {
        if (jugadores.length === 0) {
            return `
                <p class="latest-trade-empty">
                    Sin jugadores registrados
                </p>
            `;
        }

        return `
            <ul>
                ${jugadores.map(function (jugador) {
                    return `
                        <li>
                            <strong>
                                ${escapar(
                                    jugador.name ||
                                    jugador.nombre ||
                                    "Jugador"
                                )}
                            </strong>
                        </li>
                    `;
                }).join("")}
            </ul>
        `;
    }

    function renderizarActividadReciente(historial, equipos) {
        const contenedor =
            document.getElementById("actividad-reciente");

        if (!contenedor) {
            return;
        }

        const movimientos = [];

        historial.slice(0, 6).forEach(function (trade) {
            const destinoA = nombrePorCodigo(
                equipos,
                trade.teamB
            );

            const destinoB = nombrePorCodigo(
                equipos,
                trade.teamA
            );

            const jugadoresA = Array.isArray(trade.playersA)
                ? trade.playersA
                : [];

            const jugadoresB = Array.isArray(trade.playersB)
                ? trade.playersB
                : [];

            jugadoresA.forEach(function (jugador) {
                movimientos.push({
                    jugador:
                        jugador.name ||
                        jugador.nombre ||
                        "Jugador",

                    equipo: destinoA,
                    fecha: trade.fecha
                });
            });

            jugadoresB.forEach(function (jugador) {
                movimientos.push({
                    jugador:
                        jugador.name ||
                        jugador.nombre ||
                        "Jugador",

                    equipo: destinoB,
                    fecha: trade.fecha
                });
            });
        });

        if (movimientos.length === 0) {
            contenedor.innerHTML = `
                <div class="dashboard-empty-state">
                    <strong>Sin movimientos recientes</strong>
                    <span>
                        Los jugadores traspasados aparecerán en esta sección.
                    </span>
                </div>
            `;

            return;
        }

        contenedor.innerHTML = movimientos
            .slice(0, 8)
            .map(function (movimiento) {
                return `
                    <div class="activity-item">

                        <div class="activity-item-copy">

                            <strong>
                                ${escapar(movimiento.jugador)}
                            </strong>

                            <span>
                                se incorpora a
                                ${escapar(movimiento.equipo)}
                            </span>

                        </div>

                        <time>
                            ${escapar(
                                formatearFechaCorta(
                                    movimiento.fecha
                                )
                            )}
                        </time>

                    </div>
                `;
            })
            .join("");
    }

    function formatearFecha(fecha) {
        const valor = new Date(fecha);

        if (
            !fecha ||
            Number.isNaN(valor.getTime())
        ) {
            return "Fecha no disponible";
        }

        return valor.toLocaleString(
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

    function formatearFechaCorta(fecha) {
        const valor = new Date(fecha);

        if (
            !fecha ||
            Number.isNaN(valor.getTime())
        ) {
            return "";
        }

        return valor.toLocaleDateString(
            "es-ES",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );
    }

    function normalizar(valor) {
        return String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    }

    function escapar(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function ponerTexto(id, valor) {
        const elemento =
            document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    }

    function mostrarToast(mensaje) {
        const toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent = mensaje;
        toast.classList.add("show");

        window.clearTimeout(
            mostrarToast.temporizador
        );

        mostrarToast.temporizador =
            window.setTimeout(function () {
                toast.classList.remove("show");
            }, 2600);
    }

    window.addEventListener(
        "load",
        iniciarDashboard
    );
})();
