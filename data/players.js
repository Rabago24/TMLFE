// =======================================
// TMLFE - Players Database
// Gestión de jugadores
// =======================================


const PlayersDB = {

    jugadores: []

};



// =======================================
// CREAR JUGADOR
// =======================================


function crearJugador(datos){


    const jugador = {


        id: Date.now(),


        nombre: datos.nombre || "Sin nombre",


        equipo: datos.equipo || "Libre",


        posicion: datos.posicion || "N/A",


        edad: datos.edad || 0,


        media: datos.media || 70,


        salario: datos.salario || 0,


        contrato: datos.contrato || 1,


        altura: datos.altura || "",


        peso: datos.peso || "",


        nacionalidad: datos.nacionalidad || "",


        activo:true


    };



    PlayersDB.jugadores.push(jugador);



    console.log(
        "Jugador creado:",
        jugador
    );



    return jugador;


}




// =======================================
// EDITAR JUGADOR
// =======================================


function editarJugador(id, cambios){


    const jugador =
    PlayersDB.jugadores.find(
        p => p.id === id
    );



    if(!jugador){

        console.log(
            "Jugador no encontrado"
        );

        return null;

    }



    Object.assign(
        jugador,
        cambios
    );



    console.log(
        "Jugador actualizado:",
        jugador
    );


    return jugador;

}





// =======================================
// ELIMINAR JUGADOR
// =======================================


function eliminarJugador(id){


    PlayersDB.jugadores =
    PlayersDB.jugadores.filter(
        p => p.id !== id
    );


}




// =======================================
// BUSCAR JUGADOR
// =======================================


function buscarJugador(nombre){


    return PlayersDB.jugadores.filter(

        jugador =>

        jugador.nombre
        .toLowerCase()
        .includes(
            nombre.toLowerCase()
        )

    );


}





// =======================================
// FILTRAR POR EQUIPO
// =======================================


function jugadoresPorEquipo(equipo){


    return PlayersDB.jugadores.filter(

        jugador =>

        jugador.equipo === equipo

    );


}





// =======================================
// FILTRAR POR POSICIÓN
// =======================================


function jugadoresPorPosicion(posicion){


    return PlayersDB.jugadores.filter(

        jugador =>

        jugador.posicion.includes(posicion)

    );


}





// =======================================
// CAMBIAR MEDIA 2K
// =======================================


function actualizarMedia(id,nuevaMedia){


    const jugador =
    PlayersDB.jugadores.find(
        p=>p.id===id
    );



    if(jugador){

        jugador.media = nuevaMedia;

        console.log(
            jugador.nombre +
            " ahora tiene media " +
            nuevaMedia
        );

    }


}





// =======================================
// CAMBIAR EQUIPO
// =======================================


function traspasarJugador(id,nuevoEquipo){


    const jugador =
    PlayersDB.jugadores.find(
        p=>p.id===id
    );



    if(jugador){

        jugador.equipo = nuevoEquipo;

        console.log(
            jugador.nombre +
            " pasa a " +
            nuevoEquipo
        );

    }


}





// =======================================
// EJEMPLO DE JUGADOR
// =======================================


crearJugador({

    nombre:"Ejemplo Player",

    equipo:"Charlotte Hornets",

    posicion:"SG",

    edad:22,

    media:78,

    salario:5000000,

    contrato:3

});





console.log(
"🏀 Players.js cargado correctamente"
);
