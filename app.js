cargarFranquiciasLFE();


}





// =======================================
// DATOS INICIALES
// =======================================


function inicializarDatos(){


    // Evita cargar dos veces la información


    if(
        TMLFE_DATABASE.equipos.length === 0
    ){


        databaseCrearEquipo({

            nombre:
            "Charlotte Hornets",

            ciudad:
            "Charlotte",

            conferencia:
            "Este"

        });



        databaseCrearEquipo({

            nombre:
            "Dallas Mavericks",

            ciudad:
            "Dallas",

            conferencia:
            "Oeste"

        });


    }


}





// =======================================
// DASHBOARD PRINCIPAL
// =======================================


function actualizarDashboardPrincipal(){


    const equipos =

    document.querySelector(
        ".card:nth-child(1) p"
    );


    const jugadores =

    document.querySelector(
        ".card:nth-child(2) p"
    );


    const trades =

    document.querySelector(
        ".card:nth-child(3) p"
    );



    if(equipos){

        equipos.innerHTML =

        TMLFE_DATABASE.equipos.length
        +
        " franquicias cargadas";

    }



    if(jugadores){

        jugadores.innerHTML =

        TMLFE_DATABASE.jugadores.length
        +
        " jugadores registrados";

    }



    if(trades){

        trades.innerHTML =

        TradesDB.trades.length
        +
        " trades realizados";

    }



}





// =======================================
// NAVEGACIÓN
// =======================================


function abrirModulo(modulo){


    console.log(

        "Abriendo módulo:",
        modulo

    );


}





// =======================================
// SISTEMA
// =======================================


function guardarEstado(){


    localStorage.setItem(

        "TMLFE_DATA",

        JSON.stringify(
            TMLFE_DATABASE
        )

    );


}





function cargarEstado(){


    const datos =

    localStorage.getItem(
        "TMLFE_DATA"
    );



    if(datos){


        console.log(
            "Datos recuperados"
        );


    }


}





console.log(
"⚙️ App.js actualizado"
);
