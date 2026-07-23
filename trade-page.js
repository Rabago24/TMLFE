"use strict";

window.addEventListener("load", function () {

    const manager =
        window.TMLFETradeManager;

    if (!manager) {

        console.error(
            "No se ha cargado TMLFETradeManager."
        );

        return;
    }


    const equipos =
        window.TMLFE &&
        Array.isArray(window.TMLFE.teams)

            ? window.TMLFE.teams
            : [];


    const jugadoresA =
        document.getElementById(
            "jugadores-equipo-a"
        );

    const jugadoresB =
        document.getElementById(
            "jugadores-equipo-b"
        );

    const nombreEquipoA =
        document.getElementById(
            "nombre-equipo-a"
        );

    const nombreEquipoB =
        document.getElementById(
            "nombre-equipo-b"
        );

    const logoEquipoA =
        document.getElementById(
            "logo-equipo-a"
        );

    const logoEquipoB =
        document.getElementById(
            "logo-equipo-b"
        );

    const salarioEquipoA =
        document.getElementById(
            "salario-equipo-a"
        );

    const salarioEquipoB =
        document.getElementById(
            "salario-equipo-b"
        );

    const cantidadJugadoresA =
        document.getElementById(
            "cantidad-jugadores-a"
        );

    const cantidadJugadoresB =
        document.getElementById(
            "cantidad-jugadores-b"
        );

    const diferenciaSalarial =
        document.getElementById(
            "diferencia-salarial"
        );

    const estadoTrade =
        document.getElementById(
            "estado-trade"
        );

    const botonVaciar =
        document.getElementById(
            "vaciar-trade"
        );

    const botonValidar =
        document.getElementById(
            "validar-trade"
        );

    const botonConfirmar =
        document.getElementById(
            "confirmar-trade"
        );


    if (
        !jugadoresA ||
        !jugadoresB ||
        !nombreEquipoA ||
        !nombreEquipoB ||
        !logoEquipoA ||
        !logoEquipoB ||
        !salarioEquipoA ||
        !salarioEquipoB ||
        !cantidadJugadoresA ||
        !cantidadJugadoresB ||
        !diferenciaSalarial ||
        !estadoTrade ||
        !botonVaciar ||
        !botonValidar ||
        !botonConfirmar
    ) {

        console.error(
            "Faltan elementos necesarios en trade.html."
        );

        return;
    }


    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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

        } else if (texto.includes(",")) {

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


    function formatearMillones(valor) {

        return (
            convertirNumero(valor) /
            1000000
        ).toLocaleString(
            "es-ES",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }
        ) + " M";
    }


    function buscarEquipo(codigo) {

        const codigoNormalizado =
            String(codigo || "")
                .trim()
                .toLowerCase();


        return equipos.find(
            function (equipo) {

                return (
                    String(
                        equipo.short || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    codigoNormalizado
                );
            }
        );
    }


    function obtenerNombreEquipo(codigo) {

        const equipo =
            buscarEquipo(codigo);


        return equipo
            ? equipo.name
            : codigo || "Sin seleccionar";
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


    function mostrarToast(mensaje) {

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


    function desactivarConfirmacion() {

        botonConfirmar.disabled =
            true;
    }


    function crearJugadorTrade(jugador) {

        const elemento =
            document.createElement(
                "div"
            );


        elemento.className =
            "trade-player-card";


        elemento.innerHTML = `

            <div class="trade-player-main">

                <div class="trade-player-rating">

                    ${escaparHTML(
                        jugador.overall ||
                        jugador.rating ||
                        jugador.media ||
                        "—"
                    )}

                </div>


                <div class="trade-player-data">

                    <strong>

                        ${escaparHTML(
                            jugador.name ||
                            jugador.nombre ||
                            jugador.playerName ||
                            "Jugador sin nombre"
                        )}

                    </strong>


                    <span>

                        ${escaparHTML(
                            jugador.position ||
                            jugador.pos ||
                            jugador.posicion ||
                            "—"
                        )}

                        ·

                        ${formatearMillones(
                            jugador.salary ||
                            jugador.salario ||
                            0
                        )}

                    </span>

                </div>

            </div>


            <button
                class="trade-remove-player"
                type="button"
                aria-label="Quitar jugador del trade"
            >

                ×

            </button>

        `;


        const botonQuitar =
            elemento.querySelector(
                ".trade-remove-player"
            );


        botonQuitar.addEventListener(
            "click",
            function () {

                manager.removePlayer(
                    jugador.id
                );


                mostrarToast(
                    `${
                        jugador.name ||
                        jugador.nombre ||
                        "El jugador"
                    } ha sido eliminado del trade.`
                );


                renderizar();
            }
        );


        return elemento;
    }


    function renderizarLista(
        contenedor,
        lista
    ) {

        contenedor.innerHTML =
            "";


        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="trade-empty-state">

                    No hay jugadores añadidos.

                </div>

            `;

            return;
        }


        lista.forEach(
            function (jugador) {

                contenedor.appendChild(
                    crearJugadorTrade(
                        jugador
                    )
                );
            }
        );
    }


    function actualizarLogo(
        contenedor,
        codigo,
        letra
    ) {

        contenedor.innerHTML =
            "";


        if (!codigo) {

            contenedor.textContent =
                letra;

            return;
        }


        const imagen =
            document.createElement(
                "img"
            );


        imagen.src =
            obtenerRutaEscudo(
                codigo
            );


        imagen.alt =
            `Escudo de ${codigo}`;


        imagen.addEventListener(
            "error",
            function () {

                contenedor.innerHTML =
                    "";

                contenedor.textContent =
                    codigo;
            },
            {
                once: true
            }
        );


        contenedor.appendChild(
            imagen
        );
    }


    function mostrarEstadoPendiente() {

        estadoTrade.className =
            "trade-status pending";


        estadoTrade.textContent =
            "Añade jugadores de dos franquicias para analizar el traspaso.";
    }


    function renderizar() {

        const estado =
            manager.getState();


        const resumen =
            manager.getSummary();


        nombreEquipoA.textContent =
            obtenerNombreEquipo(
                estado.teamA
            );


        nombreEquipoB.textContent =
            obtenerNombreEquipo(
                estado.teamB
            );


        actualizarLogo(
            logoEquipoA,
            estado.teamA,
            "A"
        );


        actualizarLogo(
            logoEquipoB,
            estado.teamB,
            "B"
        );


        renderizarLista(
            jugadoresA,
            estado.playersA
        );


        renderizarLista(
            jugadoresB,
            estado.playersB
        );


        salarioEquipoA.textContent =
            formatearMillones(
                resumen.salaryA
            );


        salarioEquipoB.textContent =
            formatearMillones(
                resumen.salaryB
            );


        cantidadJugadoresA.textContent =
            resumen.playersA;


        cantidadJugadoresB.textContent =
            resumen.playersB;


        diferenciaSalarial.textContent =
            formatearMillones(
                Math.abs(
                    resumen.difference
                )
            );


        desactivarConfirmacion();


        if (
            estado.teamA &&
            estado.teamB &&
            resumen.playersA > 0 &&
            resumen.playersB > 0
        ) {

            estadoTrade.className =
                "trade-status ready";


            estadoTrade.textContent =
                "El traspaso está listo para validarse.";


            botonValidar.disabled =
                false;

        } else {

            mostrarEstadoPendiente();


            botonValidar.disabled =
                true;
        }
    }


    botonVaciar.addEventListener(
        "click",
        function () {

            manager.clear();


            mostrarToast(
                "El traspaso se ha vaciado."
            );


            renderizar();
        }
    );


    botonValidar.addEventListener(
        "click",
        function () {

            desactivarConfirmacion();


            if (
                !window.TMLFETradeValidator ||
                typeof window
                    .TMLFETradeValidator
                    .validate !== "function"
            ) {

                mostrarToast(
                    "No se ha podido cargar el validador salarial."
                );

                return;
            }


            const resultado =
                window.TMLFETradeValidator
                    .validate();


            if (
                !resultado.teamA ||
                !resultado.teamB
            ) {

                estadoTrade.className =
                    "trade-status invalid";


                estadoTrade.textContent =
                    resultado.message ||
                    "No se ha podido validar el traspaso.";


                mostrarToast(
                    resultado.message ||
                    "No se ha podido validar el traspaso."
                );

                return;
            }


            const nombreA =
                obtenerNombreEquipo(
                    resultado.teamA.team
                );


            const nombreB =
                obtenerNombreEquipo(
                    resultado.teamB.team
                );


            estadoTrade.className =
                resultado.valid
                    ? "trade-status valid"
                    : "trade-status invalid";


            estadoTrade.innerHTML = `

                <div class="trade-validation-result">

                    <div class="trade-validation-team">

                        <strong>
                            ${escaparHTML(nombreA)}
                        </strong>

                        <span>
                            Antes:
                            ${formatearMillones(
                                resultado.teamA.before
                            )}
                        </span>

                        <span>
                            Envía:
                            ${formatearMillones(
                                resultado.teamA.sends
                            )}
                        </span>

                        <span>
                            Recibe:
                            ${formatearMillones(
                                resultado.teamA.receives
                            )}
                        </span>

                        <span>
                            Después:
                            ${formatearMillones(
                                resultado.teamA.after
                            )}
                        </span>

                        <p>

                            ${
                                resultado.teamA.valid

                                    ? "✅ Cumple la regla salarial."

                                    : "❌ No cumple la regla salarial."
                            }

                        </p>

                    </div>


                    <div class="trade-validation-team">

                        <strong>
                            ${escaparHTML(nombreB)}
                        </strong>

                        <span>
                            Antes:
                            ${formatearMillones(
                                resultado.teamB.before
                            )}
                        </span>

                        <span>
                            Envía:
                            ${formatearMillones(
                                resultado.teamB.sends
                            )}
                        </span>

                        <span>
                            Recibe:
                            ${formatearMillones(
                                resultado.teamB.receives
                            )}
                        </span>

                        <span>
                            Después:
                            ${formatearMillones(
                                resultado.teamB.after
                            )}
                        </span>

                        <p>

                            ${
                                resultado.teamB.valid

                                    ? "✅ Cumple la regla salarial."

                                    : "❌ No cumple la regla salarial."
                            }

                        </p>

                    </div>


                    <div class="trade-validation-final">

                        ${
                            resultado.valid
                                ? "🟢 TRADE VÁLIDO"
                                : "🔴 TRADE NO VÁLIDO"
                        }

                    </div>

                </div>

            `;


            botonConfirmar.disabled =
                !resultado.valid;


            mostrarToast(
                resultado.message ||
                (
                    resultado.valid
                        ? "El traspaso es válido."
                        : "El traspaso no es válido."
                )
            );
        }
    );


    botonConfirmar.addEventListener(
        "click",
        function () {

            if (
                !window.TMLFETradeApply ||
                typeof window
                    .TMLFETradeApply
                    .apply !== "function"
            ) {

                mostrarToast(
                    "No se ha podido cargar el ejecutor de traspasos."
                );

                return;
            }


            botonConfirmar.disabled =
                true;


            const resultado =
                window.TMLFETradeApply
                    .apply();


            mostrarToast(
                resultado.message
            );


            if (!resultado.ok) {

                botonConfirmar.disabled =
                    false;

                return;
            }


            renderizar();


            estadoTrade.className =
                "trade-status valid";


            estadoTrade.textContent =
                "✅ Traspaso aplicado correctamente. Las plantillas han sido actualizadas.";


            botonValidar.disabled =
                true;


            botonConfirmar.disabled =
                true;
        }
    );


    window.addEventListener(
        "tmlfe-trade-updated",
        renderizar
    );


    window.addEventListener(
        "tmlfe-trade-applied",
        function () {

            renderizar();
        }
    );


    renderizar();

});
