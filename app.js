// =======================================
// TMLFE - Main Controller
// Trade Machine Liga Franquicia Extraditables
// =======================================



document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacion
);





function iniciarAplicacion(){


    console.log(
        "🏀 TMLFE iniciada correctamente"
    );



    inicializarDatos();


    actualizarDashboardPrincipal();


}





// =======================================
// CARGA INICIAL DE DATOS
// =======================================


function inicializarDatos(){



    // Evitamos duplicar franquicias

    if(
        TMLFE_DATABASE.equipos.length === 0
    ){


        cargarFranquiciasLFE();


    }



}





// =======================================
// ACTUALIZAR DASHBOARD
// =======================================


function actualizarDashboardPrincipal(){



    const equipos =

    document.getElementById(
        "total-equipos"
    );



    const jugadores =

    document.getElementById(
        "total-jugadores"
    );



    const trades =

    document.getElementById(
        "total-trades"
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
// GUARDADO LOCAL
// =======================================


function guardarEstado(){



    localStorage.setItem(

        "TMLFE_DATA",

        JSON.stringify(
            TMLFE_DATABASE
        )

    );



    console.log(
        "💾 Datos guardados"
    );


}





// =======================================
// CARGAR DATOS GUARDADOS
// =======================================


function cargarEstado(){



    const datos =

    localStorage.getItem(
        "TMLFE_DATA"
    );



    if(datos){


        console.log(
            "📂 Datos recuperados"
        );


    }



}





console.log(
"⚙️ App.js cargado correctamente"
);
