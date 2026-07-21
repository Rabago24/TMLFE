"use strict";

(function () {

    const TEMPORADA_ACTUAL = "2026/27";
    const STORAGE_KEY = "tmlfe-player-edits";

    function escaparHTML(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function obtenerValor(objeto, nombres, defecto = "") {

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
            return Number.isFinite(valor) ? valor : 0;
        }

        let texto = String(valor)
            .trim()
            .replace(/\s/g, "")
            .replace(/[€$]/g, "");

        if (texto.includes(",") && texto.includes(".")) {
            texto = texto
                .replace(/\./g, "")
                .replace(",", ".");
        } else {
            texto = texto.replace(",", ".");
        }

        const numero = Number(texto);

        return Number.isFinite(numero) ? numero : 0;
    }

    function obtenerSalario(jugador) {

        if (
            jugador.salaries &&
            jugador.salaries[TEMPORADA_ACTUAL] !== undefined
        ) {
            return convertirNumero(
                jugador.salaries[TEMPORADA_ACTUAL]
            );
        }

        return convertirNumero(
            obtenerValor(
                jugador,
                ["salary", "salario", "currentSalary"],
                0
            )
        );
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
                Date.now()
            )
        );
    }

    function guardarEdicionLocal(jugador) {

        let ediciones = {};

        try {
            ediciones =
                JSON.parse(
                    localStorage.getItem(STORAGE_KEY)
                ) || {};
        } catch (error) {
            ediciones = {};
        }

        const id = obtenerIdJugador(jugador);

        ediciones[id] = jugador;

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(ediciones)
        );
    }

    function crearEstilos() {

        if (
            document.getElementById(
                "tmlfe-editor-styles"
            )
        ) {
            return;
        }

        const estilos =
            document.createElement("style");

        estilos.id =
            "tmlfe-editor-styles";

        estilos.textContent = `

            body.tmlfe-editor-open {
                overflow: hidden;
            }

            .tmlfe-editor-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(3, 6, 18, 0.82);
                backdrop-filter: blur(10px);
                opacity: 0;
                visibility: hidden;
                transition:
                    opacity 0.22s ease,
                    visibility 0.22s ease;
            }

            .tmlfe-editor-overlay.is-visible {
                opacity: 1;
                visibility: visible;
            }

            .tmlfe-editor-modal {
                width: min(880px, 100%);
                max-height: calc(100vh - 48px);
                overflow-y: auto;
                border: 1px solid rgba(139, 120, 255, 0.24);
                border-radius: 24px;
                background:
                    linear-gradient(
                        145deg,
                        rgba(30, 31, 58, 0.98),
                        rgba(12, 19, 31, 0.99)
                    );
                box-shadow:
                    0 30px 90px rgba(0, 0, 0, 0.55);
                transform:
                    translateY(18px)
                    scale(0.98);
                transition:
                    transform 0.22s ease;
            }

            .tmlfe-editor-overlay.is-visible
            .tmlfe-editor-modal {
                transform:
                    translateY(0)
                    scale(1);
            }

            .tmlfe-editor-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 20px;
                padding: 28px 30px 22px;
                border-bottom:
                    1px solid rgba(255, 255, 255, 0.08);
            }

            .tmlfe-editor-kicker {
                margin: 0 0 8px;
                color: #9b87ff;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.18em;
                text-transform: uppercase;
            }

            .tmlfe-editor-title {
                margin: 0;
                color: #ffffff;
                font-size: clamp(25px, 4vw, 38px);
                line-height: 1.08;
            }

            .tmlfe-editor-subtitle {
                margin: 9px 0 0;
                color: #97a0b5;
                font-size: 14px;
            }

            .tmlfe-editor-close {
                width: 42px;
                height: 42px;
                flex: 0 0 auto;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 13px;
                background: rgba(255, 255, 255, 0.04);
                color: #ffffff;
                font-size: 23px;
                cursor: pointer;
                transition:
                    background 0.2s ease,
                    transform 0.2s ease;
            }

            .tmlfe-editor-close:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-1px);
            }

            .tmlfe-editor-body {
                padding: 26px 30px 30px;
            }

            .tmlfe-editor-section-title {
                margin: 0 0 15px;
                color: #b7a9ff;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.14em;
                text-transform: uppercase;
            }

            .tmlfe-editor-grid {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 17px;
            }

            .tmlfe-editor-grid
            + .tmlfe-editor-section-title {
                margin-top: 28px;
            }

            .tmlfe-editor-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .tmlfe-editor-field.full-width {
                grid-column: 1 / -1;
            }

            .tmlfe-editor-field label {
                color: #aeb6c8;
                font-size: 12px;
                font-weight: 700;
            }

            .tmlfe-editor-field input,
            .tmlfe-editor-field select,
            .tmlfe-editor-field textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 13px;
                outline: none;
                background: rgba(6, 11, 23, 0.55);
                color: #ffffff;
                font: inherit;
                transition:
                    border-color 0.2s ease,
                    box-shadow 0.2s ease;
            }

            .tmlfe-editor-field input,
            .tmlfe-editor-field select {
                height: 48px;
                padding: 0 14px;
            }

            .tmlfe-editor-field textarea {
                min-height: 105px;
                padding: 13px 14px;
                resize: vertical;
            }

            .tmlfe-editor-field input:focus,
            .tmlfe-editor-field select:focus,
            .tmlfe-editor-field textarea:focus {
                border-color: #7458ef;
                box-shadow:
                    0 0 0 3px rgba(116, 88, 239, 0.15);
            }

            .tmlfe-editor-field option {
                color: #111827;
            }

            .tmlfe-editor-help {
                color: #697386;
                font-size: 11px;
            }

            .tmlfe-editor-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                margin-top: 30px;
                padding-top: 22px;
                border-top:
                    1px solid rgba(255, 255, 255, 0.08);
            }

            .tmlfe-editor-button {
                min-height: 46px;
                padding: 0 22px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 13px;
                background: rgba(255, 255, 255, 0.04);
                color: #ffffff;
                font-weight: 800;
                cursor: pointer;
                transition:
                    transform 0.2s ease,
                    filter 0.2s ease,
                    background 0.2s ease;
            }

            .tmlfe-editor-button:hover {
                transform: translateY(-1px);
                background: rgba(255, 255, 255, 0.09);
            }

            .tmlfe-editor-button.primary {
                min-width: 190px;
                border-color: transparent;
                background:
                    linear-gradient(
                        135deg,
                        #7657f0,
                        #6139d8
                    );
                box-shadow:
                    0 12px 30px rgba(105, 72, 229, 0.25);
            }

            .tmlfe-editor-button.primary:hover {
                filter: brightness(1.08);
            }

            .tmlfe-editor-message {
                display: none;
                margin-bottom: 20px;
                padding: 13px 15px;
                border: 1px solid rgba(73, 222, 128, 0.28);
                border-radius: 12px;
                background: rgba(22, 163, 74, 0.12);
                color: #86efac;
                font-size: 13px;
                font-weight: 700;
            }

            .tmlfe-editor-message.is-visible {
                display: block;
            }

            @media (max-width: 680px) {

                .tmlfe-editor-overlay {
                    align-items: flex-end;
                    padding: 0;
                }

                .tmlfe-editor-modal {
                    max-height: 92vh;
                    border-radius: 22px 22px 0 0;
                }

                .tmlfe-editor-header,
                .tmlfe-editor-body {
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .tmlfe-editor-grid {
                    grid-template-columns: 1fr;
                }

                .tmlfe-editor-field.full-width {
                    grid-column: auto;
                }

                .tmlfe-editor-actions {
                    flex-direction: column-reverse;
                }

                .tmlfe-editor-button {
                    width: 100%;
                }
            }

        `;

        document.head.appendChild(estilos);
    }

    function crearModal() {

        let overlay =
            document.getElementById(
                "tmlfe-editor-overlay"
            );

        if (overlay) {
            return overlay;
        }

        overlay =
            document.createElement("div");

        overlay.id =
            "tmlfe-editor-overlay";

        overlay.className =
            "tmlfe-editor-overlay";

        overlay.innerHTML = `

            <div
                class="tmlfe-editor-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tmlfe-editor-title"
            >

                <div class="tmlfe-editor-header">

                    <div>

                        <p class="tmlfe-editor-kicker">
                            Player Management
                        </p>

                        <h2
                            class="tmlfe-editor-title"
                            id="tmlfe-editor-title"
                        >
                            Editar jugador
                        </h2>

                        <p
                            class="tmlfe-editor-subtitle"
                            id="tmlfe-editor-subtitle"
                        >
                            Modifica los datos deportivos y contractuales.
                        </p>

                    </div>

                    <button
                        class="tmlfe-editor-close"
                        type="button"
                        aria-label="Cerrar editor"
                        data-editor-close
                    >
                        ×
                    </button>

                </div>

                <form
                    class="tmlfe-editor-body"
                    id="tmlfe-editor-form"
                >

                    <div
                        class="tmlfe-editor-message"
                        id="tmlfe-editor-message"
                    >
                        Cambios guardados correctamente.
                    </div>

                    <p class="tmlfe-editor-section-title">
                        Información deportiva
                    </p>

                    <div class="tmlfe-editor-grid">

                        <div
                            class="
                                tmlfe-editor-field
                                full-width
                            "
                        >

                            <label for="editor-name">
                                Nombre del jugador
                            </label>

                            <input
                                id="editor-name"
                                name="name"
                                type="text"
                                required
                            >

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-position">
                                Posición
                            </label>

                            <input
                                id="editor-position"
                                name="position"
                                type="text"
                                placeholder="PG/SG"
                                required
                            >

                            <span class="tmlfe-editor-help">
                                Ejemplo: PG, SG/SF o PF/C
                            </span>

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-overall">
                                Media general
                            </label>

                            <input
                                id="editor-overall"
                                name="overall"
                                type="number"
                                min="40"
                                max="99"
                                required
                            >

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-age">
                                Edad
                            </label>

                            <input
                                id="editor-age"
                                name="age"
                                type="number"
                                min="16"
                                max="50"
                            >

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-number">
                                Dorsal
                            </label>

                            <input
                                id="editor-number"
                                name="number"
                                type="text"
                                maxlength="3"
                                placeholder="00"
                            >

                        </div>

                    </div>

                    <p class="tmlfe-editor-section-title">
                        Contrato
                    </p>

                    <div class="tmlfe-editor-grid">

                        <div class="tmlfe-editor-field">

                            <label for="editor-salary">
                                Salario 2026/27
                            </label>

                            <input
                                id="editor-salary"
                                name="salary"
                                type="number"
                                min="0"
                                step="1"
                            >

                            <span class="tmlfe-editor-help">
                                Introduce la cantidad completa,
                                por ejemplo 1800000.
                            </span>

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-contract-years">
                                Años de contrato
                            </label>

                            <input
                                id="editor-contract-years"
                                name="contractYears"
                                type="number"
                                min="0"
                                max="10"
                            >

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-bird">
                                Derechos Bird
                            </label>

                            <select
                                id="editor-bird"
                                name="bird"
                            >

                                <option value="">
                                    Sin especificar
                                </option>

                                <option value="Sí">
                                    Sí
                                </option>

                                <option value="No">
                                    No
                                </option>

                            </select>

                        </div>

                        <div class="tmlfe-editor-field">

                            <label for="editor-free-agency">
                                Agencia libre
                            </label>

                            <select
                                id="editor-free-agency"
                                name="freeAgency"
                            >

                                <option value="">
                                    Sin especificar
                                </option>

                                <option value="UFA">
                                    UFA
                                </option>

                                <option value="RFA">
                                    RFA
                                </option>

                                <option value="TO">
                                    Team Option
                                </option>

                                <option value="PO">
                                    Player Option
                                </option>

                                <option value="ETO">
                                    Early Termination Option
                                </option>

                            </select>

                        </div>

                        <div
                            class="
                                tmlfe-editor-field
                                full-width
                            "
                        >

                            <label for="editor-notes">
                                Notas
                            </label>

                            <textarea
                                id="editor-notes"
                                name="notes"
                                placeholder="Información adicional sobre el jugador..."
                            ></textarea>

                        </div>

                    </div>

                    <div class="tmlfe-editor-actions">

                        <button
                            class="tmlfe-editor-button"
                            type="button"
                            data-editor-close
                        >
                            Cancelar
                        </button>

                        <button
                            class="
                                tmlfe-editor-button
                                primary
                            "
                            type="submit"
                        >
                            Guardar cambios
                        </button>

                    </div>

                </form>

            </div>

        `;

        document.body.appendChild(overlay);

        overlay
            .querySelectorAll(
                "[data-editor-close]"
            )
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        cerrarEditor
                    );
                }
            );

        overlay.addEventListener(
            "click",
            function (evento) {

                if (evento.target === overlay) {
                    cerrarEditor();
                }
            }
        );

        document.addEventListener(
            "keydown",
            function (evento) {

                if (
                    evento.key === "Escape" &&
                    overlay.classList.contains(
                        "is-visible"
                    )
                ) {
                    cerrarEditor();
                }
            }
        );

        return overlay;
    }

    function cerrarEditor() {

        const overlay =
            document.getElementById(
                "tmlfe-editor-overlay"
            );

        if (!overlay) {
            return;
        }

        overlay.classList.remove(
            "is-visible"
        );

        document.body.classList.remove(
            "tmlfe-editor-open"
        );
    }

    function abrirEditor(
        jugador,
        alGuardar
    ) {

        if (!jugador) {
            return;
        }

        crearEstilos();

        const overlay =
            crearModal();

        const formulario =
            overlay.querySelector(
                "#tmlfe-editor-form"
            );

        const nombre =
            obtenerValor(
                jugador,
                [
                    "name",
                    "nombre",
                    "playerName",
                    "fullName"
                ],
                ""
            );

        const posicion =
            obtenerValor(
                jugador,
                [
                    "position",
                    "pos",
                    "posicion"
                ],
                ""
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
                ""
            );

        const edad =
            obtenerValor(
                jugador,
                ["age", "edad"],
                ""
            );

        const dorsal =
            obtenerValor(
                jugador,
                [
                    "number",
                    "jersey",
                    "dorsal"
                ],
                ""
            );

        const aniosContrato =
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

        const derechosBird =
            obtenerValor(
                jugador,
                [
                    "bird",
                    "birdRights",
                    "derechosBird"
                ],
                ""
            );

        const agenciaLibre =
            obtenerValor(
                jugador,
                [
                    "freeAgency",
                    "agency",
                    "tipoAgencia"
                ],
                ""
            );

        const notas =
            obtenerValor(
                jugador,
                [
                    "notes",
                    "notas",
                    "observations"
                ],
                ""
            );

        formulario.elements.name.value =
            nombre;

        formulario.elements.position.value =
            posicion;

        formulario.elements.overall.value =
            media;

        formulario.elements.age.value =
            edad;

        formulario.elements.number.value =
            dorsal;

        formulario.elements.salary.value =
            obtenerSalario(jugador);

        formulario.elements.contractYears.value =
            aniosContrato;

        formulario.elements.bird.value =
            derechosBird;

        formulario.elements.freeAgency.value =
            agenciaLibre;

        formulario.elements.notes.value =
            notas;

        const titulo =
            overlay.querySelector(
                "#tmlfe-editor-title"
            );

        const subtitulo =
            overlay.querySelector(
                "#tmlfe-editor-subtitle"
            );

        const mensaje =
            overlay.querySelector(
                "#tmlfe-editor-message"
            );

        titulo.textContent =
            `Editar · ${nombre}`;

        subtitulo.textContent =
            "Actualiza sus datos deportivos y contractuales.";

        mensaje.classList.remove(
            "is-visible"
        );

        formulario.onsubmit =
            function (evento) {

                evento.preventDefault();

                const datos =
                    new FormData(formulario);

                const nuevoNombre =
                    String(
                        datos.get("name") || ""
                    ).trim();

                const nuevaPosicion =
                    String(
                        datos.get("position") || ""
                    ).trim();

                const nuevaMedia =
                    convertirNumero(
                        datos.get("overall")
                    );

                const nuevaEdad =
                    convertirNumero(
                        datos.get("age")
                    );

                const nuevoDorsal =
                    String(
                        datos.get("number") || ""
                    ).trim();

                const nuevoSalario =
                    convertirNumero(
                        datos.get("salary")
                    );

                const nuevosAnios =
                    convertirNumero(
                        datos.get("contractYears")
                    );

                const nuevoBird =
                    String(
                        datos.get("bird") || ""
                    );

                const nuevaAgencia =
                    String(
                        datos.get("freeAgency") || ""
                    );

                const nuevasNotas =
                    String(
                        datos.get("notes") || ""
                    ).trim();

                jugador.name =
                    nuevoNombre;

                jugador.position =
                    nuevaPosicion;

                jugador.overall =
                    nuevaMedia;

                jugador.age =
                    nuevaEdad;

                jugador.number =
                    nuevoDorsal;

                jugador.contractYears =
                    nuevosAnios;

                jugador.bird =
                    nuevoBird;

                jugador.freeAgency =
                    nuevaAgencia;

                jugador.notes =
                    nuevasNotas;

                if (
                    !jugador.salaries ||
                    typeof jugador.salaries !== "object"
                ) {
                    jugador.salaries = {};
                }

                jugador.salaries[
                    TEMPORADA_ACTUAL
                ] = nuevoSalario;

                guardarEdicionLocal(
                    jugador
                );

                mensaje.classList.add(
                    "is-visible"
                );

                if (
                    typeof alGuardar ===
                    "function"
                ) {
                    alGuardar(jugador);
                }

                window.setTimeout(
                    function () {

                        cerrarEditor();
                    },
                    700
                );
            };

        document.body.classList.add(
            "tmlfe-editor-open"
        );

        window.requestAnimationFrame(
            function () {

                overlay.classList.add(
                    "is-visible"
                );
            }
        );

        window.setTimeout(
            function () {

                formulario.elements.name.focus();
            },
            180
        );
    }

    window.TMLFEEditor = {
        open: abrirEditor,
        close: cerrarEditor
    };

})();
