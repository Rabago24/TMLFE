"use strict";

window.addEventListener(
    "load",
    function () {

        const botonBorrarHistorial =
            document.getElementById(
                "btn-borrar-historial"
            );

        if (!botonBorrarHistorial) {

            console.error(
                "No se ha encontrado el botón para borrar el historial."
            );

            return;
        }


        botonBorrarHistorial.addEventListener(
            "click",
            function () {

                const confirmado =
                    window.confirm(
                        "¿Seguro que quieres borrar todo el historial de traspasos?\n\nLas plantillas, los jugadores y los salarios no se modificarán."
                    );

                if (!confirmado) {
                    return;
                }


                if (
                    !window.TMLFETradeApply ||
                    typeof window
                        .TMLFETradeApply
                        .clearHistory !== "function"
                ) {

                    window.alert(
                        "No se ha podido cargar la función para borrar el historial."
                    );

                    return;
                }


                window.TMLFETradeApply
                    .clearHistory();


                botonBorrarHistorial.textContent =
                    "✅ Historial eliminado";


                botonBorrarHistorial.disabled =
                    true;


                window.alert(
                    "El historial de traspasos se ha borrado correctamente."
                );


                window.setTimeout(
                    function () {

                        botonBorrarHistorial.textContent =
                            "🗑 Reiniciar historial de traspasos";


                        botonBorrarHistorial.disabled =
                            false;

                    },
                    2000
                );
            }
        );
    }
);
