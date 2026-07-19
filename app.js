// =======================================
// TMLFE - Trade Machine Liga Franquicia Extraditables
// Archivo principal de lógica
// =======================================


// Base de datos inicial

const TMLFE = {

    equipos: [],

    jugadores: [],

    trades: [],


    configuracion: {

        limiteSalarial: 155000000,

        impuestoLujo: false,

        temporada: "2026/27"

    }

};



// =======================================
// CARGA INICIAL
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    iniciarTMLFE();

});



function iniciarTMLFE(){

    console.log("TMLFE iniciada correctamente");

    cargarDatosIniciales();

    actualizarDashboard();

}



// =======================================
// DATOS INICIALES
// =======================================


function cargarDatosIniciales(){


    // Ejemplo de estructura.
    // Aquí añadiremos las plantillas reales de la liga.

    TMLFE.equipos = [

        {
            id:1,
            nombre:"Charlotte Hornets",
            salario:0,
            jugadores:[]
        },

        {
            id:2,
            nombre:"Dallas Mavericks",
            salario:0,
            jugadores:[]
        }

    ];


}



// =======================================
// DASHBOARD
// =======================================


function actualizarDashboard(){


    const tarjetas = document.querySelectorAll(".card");


    if(tarjetas.length >= 4){


        tarjetas[0].querySelector("p").innerHTML =
        TMLFE.equipos.length + " franquicias cargadas";


        tarjetas[1].querySelector("p").innerHTML =
        TMLFE.jugadores.length + " jugadores registrados";


        tarjetas[2].querySelector("p").innerHTML =
        TMLFE.trades.length + " trades realizados";


    }


}



// =======================================
// JUGADORES
// =======================================


function añadirJugador(jugador){


    TMLFE.jugadores.push(jugador);


    console.log(
        "Jugador añadido:",
        jugador.nombre
    );


    actualizarDashboard();

}



// =======================================
// EQUIPOS
// =======================================


function añadirEquipo(equipo){


    TMLFE.equipos.push(equipo);


    console.log(
        "Equipo añadido:",
        equipo.nombre
    );


    actualizarDashboard();

}



// =======================================
// SISTEMA DE TRASPASOS
// =======================================


function crearTrade(equipoA, equipoB, jugadoresA, jugadoresB){


    const trade = {


        id:
        Date.now(),


        equipoOrigen:
        equipoA,


        equipoDestino:
        equipoB,


        salen:
        jugadoresA,


        llegan:
        jugadoresB,


        fecha:
        new Date()

    };



    TMLFE.trades.push(trade);



    console.log(
        "Nuevo trade creado:",
        trade
    );



    actualizarDashboard();


}




// =======================================
// VALIDACIÓN SALARIAL
// =======================================


function comprobarTrade(salarioAntes, salarioRecibido){


    const nuevoSalario =
    salarioAntes + salarioRecibido;



    if(nuevoSalario <= TMLFE.configuracion.limiteSalarial){


        return {

            valido:true,

            mensaje:
            "Trade válido según reglas salariales"

        };


    }


    return {


        valido:false,


        mensaje:
        "Trade pendiente de revisión salarial"


    };


}



// =======================================
// FUTURAS FUNCIONES
// =======================================


// - Cargar plantillas oficiales LFE
// - Editor de jugadores
// - Ratings NBA 2K
// - Contratos
// - Reglas de traspasos
// - Modo franquicia
// - Historial de movimientos



console.log(
"🏀 TMLFE preparada para construir la franquicia"
);
