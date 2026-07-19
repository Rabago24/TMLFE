// =======================================
// TMLFE - Database System
// Base central de datos
// =======================================


const TMLFE_DATABASE = {

    temporada:"2026/27",

    equipos:[],


    jugadores:[],


    historialCambios:[]


};





// =======================================
// CREAR EQUIPO EN DATABASE
// =======================================


function databaseCrearEquipo(datos){


    const equipo={


        id:Date.now(),


        nombre:datos.nombre,


        ciudad:datos.ciudad || "",


        conferencia:datos.conferencia || "",


        salarioTotal:0,


        jugadores:[]


    };



    TMLFE_DATABASE.equipos.push(equipo);



    return equipo;


}





// =======================================
// CREAR JUGADOR EN DATABASE
// =======================================


function databaseCrearJugador(datos){



    const jugador={


        id:Date.now(),


        nombre:datos.nombre,


        equipo:datos.equipo,


        posicion:datos.posicion || "",


        media:datos.media || 70,


        edad:datos.edad || 0,


        salario:datos.salario || 0,


        añosContrato:datos.añosContrato || 1,



        // Datos editables estilo 2K

        tiro3:datos.tiro3 || 0,


        tiroMedia:datos.tiroMedia || 0,


        defensa:datos.defensa || 0,


        rebote:datos.rebote || 0,


        atletismo:datos.atletismo || 0,


        insignias:datos.insignias || []

    };



    TMLFE_DATABASE.jugadores.push(jugador);



    return jugador;


}





// =======================================
// ASIGNAR JUGADOR A EQUIPO
// =======================================


function asignarJugadorEquipo(
    jugadorId,
    equipo
){


    const jugador =

    TMLFE_DATABASE.jugadores.find(

        j=>j.id===jugadorId

    );



    if(jugador){


        jugador.equipo=equipo;


    }


}





// =======================================
// BUSCAR JUGADORES
// =======================================


function databaseBuscarJugador(
    nombre
){


    return TMLFE_DATABASE.jugadores.filter(


        jugador =>


        jugador.nombre

        .toLowerCase()

        .includes(

            nombre.toLowerCase()

        )


    );


}





// =======================================
// EDITAR CUALQUIER DATO
// =======================================


function editarDatoJugador(
    id,
    campo,
    valor
){



    const jugador=

    TMLFE_DATABASE.jugadores.find(

        j=>j.id===id

    );



    if(jugador){


        jugador[campo]=valor;



        TMLFE_DATABASE.historialCambios.push({


            jugador:jugador.nombre,


            campo:campo,


            nuevoValor:valor,


            fecha:new Date()


        });



    }


}





// =======================================
// CARGA DE PLANTILLAS
// =======================================


function cargarPlantillaLiga(
    datos
){


    datos.forEach(

        jugador=>{


            databaseCrearJugador(jugador);


        }

    );


    console.log(

        "Plantilla cargada correctamente"

    );


}





// =======================================
// EXPORTAR DATOS
// =======================================


function exportarBaseDatos(){


    return JSON.stringify(

        TMLFE_DATABASE,

        null,

        2

    );


}





// =======================================
// LIMPIAR BASE
// =======================================


function limpiarBaseDatos(){


    TMLFE_DATABASE.equipos=[];


    TMLFE_DATABASE.jugadores=[];


    TMLFE_DATABASE.historialCambios=[];


}





console.log(
"🗄️ Database.js cargado correctamente"
);
