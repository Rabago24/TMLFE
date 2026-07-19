"use strict";

window.addEventListener("load", function () {

    const contenedor = document.getElementById("lista-franquicias");
    const contador = document.getElementById("numero-franquicias");

    if (!contenedor) {
        alert("ERROR: No existe el contenedor lista-franquicias");
        return;
    }

    contenedor.innerHTML = "";

    if (!window.TMLFE) {

        contenedor.innerHTML = `
            <div style="
                padding: 30px;
                background: #481b1b;
                color: white;
                border-radius: 14px;
                font-size: 18px;
            ">
                ERROR: database.js no está cargando.
            </div>
        `;

        return;
    }

    if (!Array.isArray(window.TMLFE.teams)) {

        contenedor.innerHTML = `
            <div style="
                padding: 30px;
                background: #481b1b;
                color: white;
                border-radius: 14px;
                font-size: 18px;
            ">
                ERROR: TMLFE.teams no existe.
            </div>
        `;

        return;
    }

    const equipos = window.TMLFE.teams;

    if (contador) {
        contador.textContent = equipos.length;
    }

    equipos.forEach(function (equipo) {

        const tarjeta = document.createElement("article");

        tarjeta.className = "franchise-card";

        /*
        Estas reglas fuerzan la visibilidad aunque styles.css
        tenga una animación o un opacity incorrecto.
        */

        tarjeta.style.setProperty(
            "display",
            "block",
            "important"
        );

        tarjeta.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        tarjeta.style.setProperty(
            "opacity",
            "1",
            "important"
        );

        tarjeta.style.setProperty(
            "transform",
            "none",
            "important"
        );

        tarjeta.innerHTML = `

            <div class="franchise-header">

                <div class="franchise-logo-box">

                    <img
                        class="franchise-logo"
                        src="assets/logos/${equipo.short.toLowerCase()}.png"
                        alt="${equipo.name}"
                        style="
                            visibility: visible;
                            opacity: 1;
                        "
                    >

                </div>

                <div class="franchise-identity">

                    <span>
                        ${equipo.conference} · ${equipo.division}
                    </span>

                    <h3>
                        ${equipo.name}
                    </h3>

                    <p>
                        ${equipo.short}
                    </p>

                </div>

            </div>

            <div class="franchise-manager">

                <span>
                    General Manager
                </span>

                <strong>
                    ${equipo.manager || "Sin asignar"}
                </strong>

            </div>

            <div class="franchise-numbers">

                <div>
                    <span>Plantilla</span>
                    <strong>—</strong>
                    <small>jugadores</small>
                </div>

                <div>
                    <span>Salario</span>
                    <strong>—</strong>
                    <small>comprometido</small>
                </div>

            </div>

            <div class="franchise-footer">

                <a
                    class="franchise-open-button"
                    href="players.html?team=${equipo.short}"
                >
                    <span>Ver plantilla</span>
                    <span>→</span>
                </a>

            </div>
        `;

        contenedor.appendChild(tarjeta);
    });

});
