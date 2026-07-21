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

    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function convertirNumero(valor) {

        const numero =
            Number(valor);

        return Number.isFinite(numero)
            ? numero
            : 0;
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
            ? `./assets/logos/${limpio}.png`
            : "";
    }

    function mostrarToast(mensaje) {

        const toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent =
            mensaje;

        toast.classList.add("show");

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
                2500
            );
    }

    function crearJugadorTrade(jugador) {

        const elemento =
            document.createElement("div");

        elemento.className =
            "trade-player-card";

        elemento.innerHTML = `

            <div class="trade-player-main">

                <div class="trade-player-rating">

                    ${
                        escaparHTML(
                            jugador.overall || "—"
                        )
                    }

                </div>

                <div>

                    <strong>
                        ${escaparHTML(
                            jugador.name
                        )}
                    </strong>

                    <span>

                        ${escaparHTML(
                            jugador.position || "—"
                        )}

                        ·

                        ${formatearMillones(
                            jugador.salary
                        )}

                    </span>

                </div>

            </div>

            <button
                class="trade-remove-player"
                type="button"
                aria-label="Quitar jugador"
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
                    `${jugador.name} eliminado del trade.`
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

        contenedor.innerHTML = "";

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
                    crearJugadorTrade(jugador)
                );
            }
        );
    }

    function actualizarLogo(
        contenedor,
        codigo,
        letra
    ) {

        contenedor.innerHTML = "";

        if (!codigo) {
            contenedor.textContent =
                letra;
            return;
        }

        const imagen =
            document.createElement("img");

        imagen.src =
            obtenerRutaEscudo(codigo);

        imagen.alt =
            codigo;

        imagen.addEventListener(
            "error",
            function () {

                contenedor.textContent =
                    codigo;
            },
            {
                once: true
            }
        );

        contenedor.appendChild(imagen);
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

        if (
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

            estadoTrade.className =
                "trade-status pending";

            estadoTrade.textContent =
                "Añade jugadores de dos franquicias para analizar el traspaso.";

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

            const resumen =
                manager.getSummary();

            if (
                resumen.playersA === 0 ||
                resumen.playersB === 0
            ) {

                mostrarToast(
                    "Debes añadir jugadores de ambos equipos."
                );

                return;
            }

            estadoTrade.className =
                "trade-status valid";

            estadoTrade.textContent =
                "Trade preparado. El validador salarial se añadirá en el siguiente paso.";

            mostrarToast(
                "Trade preparado correctamente."
            );
        }
    );

    window.addEventListener(
        "tmlfe-trade-updated",
        renderizar
    );

    renderizar();

});
