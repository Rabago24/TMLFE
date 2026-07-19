// =======================================
// TMLFE - Database System
// Base central de datos
// =======================================



const TMLFE_DATABASE = {


    temporada: "2026/27",


    equipos: [],


    jugadores: [],


    historialCambios: []



};





// =======================================
// CREAR EQUIPO
// =======================================


function databaseCrearEquipo(datos){


    const equipo = {


        id: Date.now(),


        nombre: datos.nombre || "Sin nombre",


        ciudad: datos.ciudad || "",


        conferencia: datos.conferencia || "",


        division: datos.division || "",


        salarioTotal: 0,


        jugadores: []



    };



    TMLFE_DATABASE.equipos.push(equipo);



    return equipo;



}





// =======================================
// CREAR JUGADOR
// =======================================


function databaseCrearJugador(datos){


    const jugador = {


        id: Date.now(),


        nombre: datos.nombre || "Sin nombre",


        equipo: datos.equipo || "Libre",


        posicion: datos.posicion || "",


        media: datos.media || 70,


        edad: datos.edad || 0,


        salario: datos.salario || 0,


        añosContrato: datos.añosContrato || 1,



        // atributos editables

        tiro3: datos.tiro3 || 0,


        tiroMedia: datos.tiroMedia || 0,


        defensa: datos.defensa || 0,


        rebote: datos.rebote || 0,


        atletismo: datos.atletismo || 0,


        insignias: datos.insignias || []



    };



    TMLFE_DATABASE.jugadores.push(jugador);



    return jugador;



}





// =======================================
// BUSCAR JUGADOR
// =======================================


function databaseBuscarJugador(nombre){


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
// EDITAR JUGADOR
// =======================================


function databaseEditarJugador(
    id,
    cambios
){


    const jugador =

    TMLFE_DATABASE.jugadores.find(

        j => j.id === id

    );



    if(!jugador)
        return null;




    Object.assign(

        jugador,

        cambios

    );



    TMLFE_DATABASE.historialCambios.push({


        jugador: jugador.nombre,


        cambios: cambios,


        fecha: new Date()


    });



    return jugador;



}





// =======================================
// ELIMINAR JUGADOR
// =======================================


function databaseEliminarJugador(id){


    TMLFE_DATABASE.jugadores =

    TMLFE_DATABASE.jugadores.filter(


        jugador =>

        jugador.id !== id


    );


}





// =======================================
// OBTENER EQUIPOS
// =======================================


function obtenerEquipos(){


    return TMLFE_DATABASE.equipos;


}





// =======================================
// OBTENER JUGADORES
// =======================================


function obtenerJugadores(){


    return TMLFE_DATABASE.jugadores;


}





// =======================================
// GUARDAR DATOS LOCALMENTE
// =======================================


function guardarBaseDatos(){


    localStorage.setItem(

        "TMLFE_DATABASE",

        JSON.stringify(
            TMLFE_DATABASE
        )

    );


}





// =======================================
// CARGAR DATOS LOCALES
// =======================================


function cargarBaseDatos(){


    const datos =

    localStorage.getItem(
        "TMLFE_DATABASE"
    );



    if(datos){


        const recuperado =

        JSON.parse(datos);



        TMLFE_DATABASE.equipos =

        recuperado.equipos || [];



        TMLFE_DATABASE.jugadores =

        recuperado.jugadores || [];



        TMLFE_DATABASE.historialCambios =

        recuperado.historialCambios || [];



    }


}





console.log(
"🗄️ Database.js cargado correctamente"
);
