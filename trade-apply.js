"use strict";

(function () {

    function aplicarTrade() {

        const estado =
            window.TMLFETradeManager.getState();

        if (
            !estado.teamA ||
            !estado.teamB
        ) {

            return {
                ok: false,
                message:
                    "No hay ningún traspaso preparado."
            };
        }

        if (
            !window.TMLFETradeValidator
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
                    "El traspaso no cumple las reglas."
            };
        }

        return {
            ok: true,
            message:
                "Trade listo para aplicarse. (Próximo paso)"
        };

    }

    window.TMLFETradeApply = {
        apply: aplicarTrade
    };

})();
