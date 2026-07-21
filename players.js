"use strict";

window.addEventListener("load", function () {

    const TEMPORADA = "2026/27";
    const SALARY_CAP = 170000000;

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

    const logoContenedor =
        document.getElementById("equipo-logo-contenedor");

    const logoEquipo =
        document.getElementById("equipo-logo");

    const salarioTotalElemento =
        document.getElementById("salario-total");

    const espacioSalarialElemento =
        document.getElementById("espacio-salarial");

    const mediaPlantillaElemento =
        document.getElementById("media-plantilla");


    if (!contenedor) {
        return;
    }


    if (
        !window.TMLFE ||
        !Array.isArray(window.TMLFE.players)
    ) {

        contenedor.innerHTML = `

            <div class="error-message">

                ERROR: No se han encontrado los jugadores
                dentro de base de datos.js.

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


    function perteneceAlEquipo(
        jugador,
        codigo
    ) {

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


        return equipos.find(
            function (equipo) {

                return (

                    normalizar(equipo.short) ===
                        codigoNormalizado ||

                    normalizar(equipo.name) ===
                        codigoNormalizado

                );
            }
        );
    }


    function obtenerCodigoEquipo(jugador) {

        return String(

            obtenerValor(
                jugador,
                [
                    "teamShort",
                    "teamCode",
                    "team",
                    "equipo",
                    "franchiseShort"
                ],
                "FA"
            )

        ).trim();
    }


    function obtenerRutaEscudo(codigo) {

        const limpio =
            String(codigo || "")
                .trim()
                .toLowerCase();

        return limpio
            ? `${limpio}.png`
            : "";
    }


    function obtenerRutaFoto(jugador) {

        return String(

            obtenerValor(
                jugador,
                [
                    "photo",
                    "photoUrl",
                    "image",
                    "imageUrl",
                    "foto",
                    "portrait"
                ],
                ""
            )

        ).trim();
    }


    function obtenerIniciales(nombre) {

        return String(nombre || "?")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(
                function (parte) {

                    return parte
                        .charAt(0)
                        .toUpperCase();
                }
            )
            .join("");
    }


    function obtenerAniosContrato(jugador) {

        const valorDirecto =
            obtenerValor(
                jugador,
                [
                    "contractYears",
                    "years",
                    "aniosContrato",
                    "añosContrato",
                    "yearsRemaining"
                ],
                ""
            );


        if (valorDirecto !== "") {
            return valorDirecto;
        }


        if (
            jugador.salaries &&
            typeof jugador.salaries === "object"
        ) {

            const temporadasConSalario =
                Object.values(jugador.salaries)
                    .filter(
                        function (salario) {

                            return (
                                convertirNumero(salario) > 0
                            );
                        }
                    );


            if (
                temporadasConSalario.length > 0
            ) {

                return temporadasConSalario.length;
            }
        }


        return "—";
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


        if (
            logoContenedor &&
            logoEquipo
        ) {

            const codigoLogo =
                equipoSeleccionado
                    ? equipoSeleccionado.short
                    : equipoSolicitado;


            logoEquipo.src =
                obtenerRutaEscudo(codigoLogo);


            logoEquipo.alt =
                `Escudo de ${nombre}`;


            logoContenedor.hidden =
                false;


            logoEquipo.addEventListener(
                "error",
                function () {

                    logoContenedor.hidden =
                        true;
                },
                {
                    once: true
                }
            );
        }
    }


    const jugadoresBase =
        jugadores.filter(
            function (jugador) {

                return perteneceAlEquipo(
                    jugador,
                    equipoSolicitado
                );
            }
        );


    function actualizarResumen(lista) {

        const salarioTotal =
            lista.reduce(
                function (
                    total,
                    jugador
                ) {

                    return (
                        total +
                        obtenerSalario(jugador)
                    );
                },
                0
            );


        const mediasValidas =
            lista
                .map(
                    function (jugador) {

                        return convertirNumero(

                            obtenerValor(
                                jugador,
                                [
                                    "overall",
                                    "ovr",
                                    "rating",
                                    "media"
                                ],
                                0
                            )
                        );
                    }
                )
                .filter(
                    function (media) {

                        return media > 0;
                    }
                );


        const mediaPlantilla =
            mediasValidas.length > 0

                ? mediasValidas.reduce(
                    function (
                        total,
                        media
                    ) {

                        return total + media;
                    },
                    0
                ) / mediasValidas.length

                : 0;


        const espacio =
            SALARY_CAP - salarioTotal;


        if (salarioTotalElemento) {

            salarioTotalElemento.textContent =
                formatearMillones(
                    salarioTotal
                );
        }


        if (espacioSalarialElemento) {

            espacioSalarialElemento.textContent =

                espacio >= 0

                    ? `+${formatearMillones(
                        espacio
                    )}`

                    : `-${formatearMillones(
                        Math.abs(espacio)
                    )}`;


            espacioSalarialElemento
                .classList
                .toggle(
                    "summary-negative",
                    espacio < 0
                );
        }


        if (mediaPlantillaElemento) {

            mediaPlantillaElemento.textContent =

                mediaPlantilla > 0

                    ? mediaPlantilla.toLocaleString(
                        "es-ES",
                        {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                        }
                    )

                    : "—";
        }
    }


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


        const dorsal =
            obtenerValor(
                jugador,
                [
                    "number",
                    "jersey",
                    "dorsal"
                ],
                "—"
            );


        const salario =
            obtenerSalario(jugador);


        const aniosContrato =
            obtenerAniosContrato(jugador);


        const codigoEquipo =
            obtenerCodigoEquipo(jugador);


        const foto =
            obtenerRutaFoto(jugador);


        const escudo =
            obtenerRutaEscudo(codigoEquipo);


        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "player-card";


        tarjeta.innerHTML = `

            <div class="player-card-top">

                <div class="player-photo-wrap">

                    ${
                        foto

                            ? `

                                <img
                                    class="player-photo"
                                    src="${escaparHTML(foto)}"
                                    alt="${escaparHTML(nombre)}"
                                >

                            `

                            : `

                                <div class="player-photo-fallback">

                                    ${escaparHTML(
                                        obtenerIniciales(nombre)
                                    )}

                                </div>

                            `
                    }


                    <img
                        class="player-team-badge"
                        src="${escaparHTML(escudo)}"
                        alt="${escaparHTML(codigoEquipo)}"
                    >

                </div>


                <div class="player-card-main">

                    <div class="player-card-heading">

                        <div>

                            <p class="player-kicker">

                                ${escaparHTML(codigoEquipo)}
                                ·
                                ${escaparHTML(posicion)}

                            </p>


                            <h3>
                                ${escaparHTML(nombre)}
                            </h3>

                        </div>


                        <div class="player-overall">

                            <strong>
                                ${escaparHTML(media)}
                            </strong>

                            <span>
                                OVR
                            </span>

                        </div>

                    </div>


                    <div class="player-details">

                        <div>

                            <span>
                                Edad
                            </span>

                            <strong>
                                ${escaparHTML(edad)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Dorsal
                            </span>

                            <strong>
                                #${escaparHTML(dorsal)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Salario
                            </span>

                            <strong>
                                ${formatearMillones(
                                    salario
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Contrato
                            </span>

                            <strong>

                                ${
                                    aniosContrato === "—"
                                        ? "—"
                                        : `${escaparHTML(
                                            aniosContrato
                                        )} años`
                                }

                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <div class="player-card-actions">

                <button
                    class="player-action-button"
                    type="button"
                    data-action="edit"
                >

                    Editar jugador

                </button>


                <a
                    class="player-action-button primary"
                    href="comercio.html?player=${
                        encodeURIComponent(nombre)
                    }&team=${
                        encodeURIComponent(codigoEquipo)
                    }"
                >

                    Añadir al Trade

                </a>

            </div>

        `;


        const fotoElemento =
            tarjeta.querySelector(
                ".player-photo"
            );


        if (fotoElemento) {

            fotoElemento.addEventListener(
                "error",
                function () {

                    const reemplazo =
                        document.createElement(
                            "div"
                        );


                    reemplazo.className =
                        "player-photo-fallback";


                    reemplazo.textContent =
                        obtenerIniciales(nombre);


                    fotoElemento.replaceWith(
                        reemplazo
                    );
                },
                {
                    once: true
                }
            );
        }


        const escudoElemento =
            tarjeta.querySelector(
                ".player-team-badge"
            );


        if (escudoElemento) {

            escudoElemento.addEventListener(
                "error",
                function () {

                    escudoElemento.remove();
                },
                {
                    once: true
                }
            );
        }


        const botonEditar =
            tarjeta.querySelector(
                '[data-action="edit"]'
            );


      if (botonEditar) {

    botonEditar.addEventListener(
        "click",
        function () {

            if (
                !window.TMLFEEditor ||
                typeof window.TMLFEEditor.open !== "function"
            ) {

                mostrarToast(
                    "No se ha podido cargar el editor de jugadores."
                );

                return;
            }

            window.TMLFEEditor.open(
                jugador,
                function () {

                    aplicarFiltros();

                    mostrarToast(
                        `${nombre} se ha actualizado correctamente.`
                    );
                }
            );
        }
    );
}


        return tarjeta;
    }


    function mostrarToast(mensaje) {

        const toast =
            document.getElementById("toast");


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


    function renderizar(lista) {

        contenedor.innerHTML =
            "";


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

                        La franquicia seleccionada
                        todavía no tiene jugadores
                        asociados en la base de datos.

                    </span>

                </div>

            `;


            if (contador) {

                contador.textContent =
                    "0";
            }


            actualizarResumen([]);


            return;
        }


        const fragmento =
            document.createDocumentFragment();


        lista.forEach(
            function (jugador) {

                fragmento.appendChild(
                    crearTarjetaJugador(jugador)
                );
            }
        );


        contenedor.appendChild(
            fragmento
        );


        if (contador) {

            contador.textContent =
                lista.length;
        }


        actualizarResumen(lista);
    }


    function aplicarFiltros() {

        const texto =
            normalizar(
                buscador
                    ? buscador.value
                    : ""
            );


        let resultados =
            jugadoresBase.filter(
                function (jugador) {

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
                }
            );


        resultados =
            [...resultados];


        const orden =
            selectorOrden
                ? selectorOrden.value
                : "nombre";


        if (orden === "nombre") {

            resultados.sort(
                function (a, b) {

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
                }
            );
        }


        if (orden === "media-desc") {

            resultados.sort(
                function (a, b) {

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
                }
            );
        }


        if (orden === "salario-desc") {

            resultados.sort(
                function (a, b) {

                    return (
                        obtenerSalario(b) -
                        obtenerSalario(a)
                    );
                }
            );
        }


        if (orden === "edad-asc") {

            resultados.sort(
                function (a, b) {

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
                }
            );
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
