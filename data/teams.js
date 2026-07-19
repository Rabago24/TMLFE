// =======================================
// TMLFE - Teams Database
// Gestión de franquicias
// =======================================


const TeamsDB = {

    equipos: []

};




// =======================================
// CREAR EQUIPO
// =======================================


function crearEquipo(datos){


    const equipo = {


        id: Date.now(),


        nombre: datos.nombre || "Sin nombre",


        ciudad: datos.ciudad || "",


        conferencia: datos.conferencia || "",


        division: datos.division || "",


        salarioActual: datos.salarioActual || 0,


        limiteDisponible: datos.limiteDisponible || 0,


        jugadores: [],


        activo:true


    };



    TeamsDB.equipos.push(equipo);



    console.log(
        "Franquicia creada:",
        equipo.nombre
    );



    return equipo;


}





// =======================================
// BUSCAR EQUIPO
// =======================================


function buscarEquipo(nombre){


    return TeamsDB.equipos.find(

        equipo =>

        equipo.nombre
        .toLowerCase()
        .includes(
            nombre.toLowerCase()
        )

    );


}





// =======================================
// AÑADIR JUGADOR A EQUIPO
// =======================================


function añadirJugadorEquipo(
    equipoId,
    jugadorId
){


    const equipo =
    TeamsDB.equipos.find(
        e=>e.id===equipoId
    );


    if(equipo){


        equipo.jugadores.push(jugadorId);


    }


}





// =======================================
// QUITAR JUGADOR
// =======================================


function quitarJugadorEquipo(
    equipoId,
    jugadorId
){


    const equipo =
    TeamsDB.equipos.find(
        e=>e.id===equipoId
    );


    if(equipo){


        equipo.jugadores =
        equipo.jugadores.filter(

            id => id !== jugadorId

        );


    }


}





// =======================================
// ACTUALIZAR SALARIOS
// =======================================


function actualizarSalarioEquipo(
    equipoId,
    nuevoSalario
){


    const equipo =
    TeamsDB.equipos.find(
        e=>e.id===equipoId
    );


    if(equipo){


        equipo.salarioActual =
        nuevoSalario;


    }


}





// =======================================
// CARGA INICIAL DE FRANQUICIAS
// =======================================


function cargarEquiposIniciales(){



    const equiposIniciales = [


        {
            nombre:"Charlotte Hornets",
            ciudad:"Charlotte",
            conferencia:"Este",
            division:"Southeast"
        },


        {
            nombre:"Dallas Mavericks",
            ciudad:"Dallas",
            conferencia:"Oeste",
            division:"Southwest"
        },


        {
            nombre:"Los Angeles Lakers",
            ciudad:"Los Angeles",
            conferencia:"Oeste",
            division:"Pacific"
        },


        {
            nombre:"Boston Celtics",
            ciudad:"Boston",
            conferencia:"Este",
            division:"Atlantic"
        }


    ];




    equiposIniciales.forEach(

        equipo =>

        crearEquipo(equipo)

    );



    console.log(
        "Equipos iniciales cargados"
    );


}




// =======================================
// OBTENER TODAS LAS FRANQUICIAS
// =======================================


function obtenerEquipos(){


    return TeamsDB.equipos;


}




// =======================================
// INICIO
// =======================================


cargarEquiposIniciales();



console.log(
"🏀 Teams.js cargado correctamente"
);
