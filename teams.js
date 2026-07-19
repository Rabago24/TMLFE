// =========================================================
// TMLFE - PÁGINA DE FRANQUICIAS
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("lista-franquicias");
    const contador = document.getElementById("numero-franquicias");
    const buscador = document.getElementById("buscar-equipo");
    const filtroConferencia = document.getElementById("filtro-conferencia");
    const selectorOrden = document.getElementById("orden-equipos");

    const SALARY_CAP = 170000000;
    const TEMPORADA = "2026/27";

    if (!contenedor) {
        console.error("No existe #lista-franquicias");
        return;
    }

    if (
        typeof window.TMLFE === "undefined" ||
        !Array.isArray(window.TMLFE.teams)
    ) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <strong>Error al cargar database.js</strong>
                <span>No se encuentra window.TMLFE.teams.</span>
            </div>
        `;

        console.error(
            "TMLFE no está disponible:",
            window.TMLFE
        );

        return;
    }

    const equipos = window.TMLFE.teams;
    const jugadores = Array.isArray(window.TMLFE.players)
        ? window.TMLFE.players
        : [];

    console.log("TMLFE cargado correctamente");
    console.log("Equipos:", equipos.length);
    console.log("Jugadores:", jugadores.length);

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

        return jugadores.filter(function (jugador) {

            return (
                normalizar(jugador.team) === normalizar(equipo.name) ||
                normalizar(jugador.teamShort) === normalizar(equipo.short)
            );
        });
    }

    function obtenerCantidadSalario(valor) {

        if (typeof valor === "number") {
            return Number.isFinite(valor) ? valor : 0;
        }

        if (typeof valor !== "string") {
            return 0;
        }

        const coincidencia = valor.match(/\d+/g);

        if (!coincidencia) {
            return 0;
        }

        return Number(coincidencia.join("")) || 0;
    }

    function obtenerSalarioEquipo(equipo) {

        const plantilla = obtenerJugadoresEquipo(equipo);

        return plantilla.reduce(function (total, jugador) {

            const salarioTemporada =
                jugador.salaries &&
                jugador.salaries[TEMPORADA] !== undefined
                    ? jugador.salaries[TEMPORADA]
                    : 0;

            return total + obtenerCantidadSalario(salarioTemporada);

        }, 0);
    }

    function formatearMillones(cantidad) {

        return (
            (cantidad / 1000000).toLocaleString(
                "es-ES",
                {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }
            ) + " M"
        );
    }

    function formatearEspacio(cantidad) {

        if (cantidad >= 0) {
            return `+${formatearMillones(cantidad)} libres`;
        }

        return `-${formatearMillones(Math.abs(cantidad))} excedido`;
    }

    function obtenerClaseSalarial(cantidad) {

        if (cantidad < 0) {
            return "salary-negative";
        }

        if (cantidad < 15000000) {
            return "salary-warning";
        }

        return "salary-positive";
    }

    function obtenerRutaLogo(equipo) {

        const codigo = String(equipo.short || "")
            .trim()
            .toLowerCase();

        return `assets/logos/${codigo}.png`;
    }

    function crearTarjeta(equipo, indice) {

        const plantilla = obtenerJugadoresEquipo(equipo);
        const salario = obtenerSalarioEquipo(equipo);
        const espacio = SALARY_CAP - salario;

        const porcentaje = Math.min(
            Math.max(
                (salario / SALARY_CAP) * 100,
                0
            ),
            100
        );

        const tarjeta = document.createElement("article");

        tarjeta.className = "franchise-card";
        tarjeta.style.animationDelay = `${indice * 0.025}s`;

        tarjeta.innerHTML = `

            <div class="franchise-card-glow"></div>

            <div class="franchise-header">

                <div class="franchise-logo-box">

                    <img
                        class="franchise-logo"
                        src="${escaparHTML(obtenerRutaLogo(equipo))}"
                        alt="${escaparHTML(equipo.name)}"
                    >

                </div>

                <div class="franchise-identity">

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

                </div>

            </div>

            <div class="franchise-manager">

                <span>
                    General Manager
                </span>

                <strong>
                    ${escaparHTML(
                        equipo.manager || "Sin asignar"
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

                    <strong class="${obtenerClaseSalarial(espacio)}">
                        ${formatearEspacio(espacio)}
                    </strong>

                </div>

                <div class="salary-track">

                    <span style="width: ${porcentaje}%"></span>

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
                    href="players.html?team=${encodeURIComponent(equipo.short)}"
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

        const imagen = tarjeta.querySelector(".franchise-logo");

        if (imagen) {

            imagen.addEventListener("error", function () {
                this.style.visibility = "hidden";
            });
        }

        return tarjeta;
    }

    function renderizar(lista) {

        contenedor.innerHTML = "";

        if (!Array.isArray(lista) || lista.length === 0) {

            contenedor.innerHTML = `
                <div class="empty-state">
                    <strong>No se encontraron franquicias</strong>
                    <span>Revisa la búsqueda o los filtros.</span>
                </div>
            `;

            if (contador) {
                contador.textContent = "0";
            }

            return;
        }

        lista.forEach(function (equipo, indice) {

            contenedor.appendChild(
                crearTarjeta(equipo, indice)
            );
        });

        if (contador) {
            contador.textContent = lista.length;
        }
    }

    function aplicarFiltros() {

        const textoBusqueda = normalizar(
            buscador ? buscador.value : ""
        );

        const conferencia = filtroConferencia
            ? normalizar(filtroConferencia.value)
            : "";

        let resultados = equipos.filter(function (equipo) {

            const textoEquipo = normalizar(
                [
                    equipo.name,
                    equipo.short,
                    equipo.manager,
                    equipo.conference,
                    equipo.division
                ].join(" ")
            );

            const coincideBusqueda =
                !textoBusqueda ||
                textoEquipo.includes(textoBusqueda);

            const coincideConferencia =
                !conferencia ||
                normalizar(equipo.conference) === conferencia;

            return coincideBusqueda && coincideConferencia;
        });

        const orden = selectorOrden
            ? selectorOrden.value
            : "nombre";

        resultados = [...resultados];

        if (orden === "nombre") {

            resultados.sort(function (a, b) {
                return a.name.localeCompare(
                    b.name,
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

    renderizar(equipos);
});
