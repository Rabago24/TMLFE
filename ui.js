// =======================================
// TMLFE - User Interface System
// Gestión visual de la aplicación
// =======================================



// =======================================
// CARGA DE INTERFAZ
// =======================================


document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        cargarInterfaz();


    }
);





function cargarInterfaz(){


    actualizarContadores();


    mostrarEquipos();


    mostrarJugadores();


    console.log(
        "🎨 UI cargada correctamente"
    );


}





// =======================================
// ACTUALIZAR DASHBOARD
// =======================================


function actualizarContadores(){



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

        TMLFE_DATABASE.equipos.length;


    }




    if(jugadores){


        jugadores.innerHTML =

        TMLFE_DATABASE.jugadores.length;


    }




    if(trades){


        trades.innerHTML =

        TradesDB.trades.length;


    }



}





// =======================================
// MOSTRAR EQUIPOS
// =======================================


function mostrarEquipos(){



    const contenedor =

    document.getElementById(
        "teams-container"
    );



    if(!contenedor)
        return;



    contenedor.innerHTML="";




    TMLFE_DATABASE.equipos.forEach(

        equipo=>{


            const tarjeta =

            document.createElement(
                "div"
            );


            tarjeta.className="team-card";



            tarjeta.innerHTML=`

                <h3>
                    ${equipo.nombre}
                </h3>


                <p>
                    Salarios:
                    ${formatoDinero(
                        equipo.salarioTotal
                    )}
                </p>


                <p>
                    Jugadores:
                    ${equipo.jugadores.length}
                </p>

            `;



            contenedor.appendChild(
                tarjeta
            );



        }

    );


}





// =======================================
// MOSTRAR JUGADORES
// =======================================


function mostrarJugadores(
    lista=null
){



    const contenedor =

    document.getElementById(
        "players-container"
    );



    if(!contenedor)
        return;




    contenedor.innerHTML="";



    const jugadores =

    lista ||

    TMLFE_DATABASE.jugadores;





    jugadores.forEach(

        jugador=>{


            const tarjeta =

            document.createElement(
                "div"
            );



            tarjeta.className=
            "player-card";




            tarjeta.innerHTML=`

                <h3>
                ${jugador.nombre}
                </h3>


                <p>
                ${jugador.posicion}
                </p>


                <strong>
                MEDIA ${jugador.media}
                </strong>


                <p>
                ${formatoDinero(
                    jugador.salario
                )}
                </p>


            `;



            contenedor.appendChild(
                tarjeta
            );



        }

    );



}





// =======================================
// BUSCADOR
// =======================================


function buscarDesdeUI(){



    const input =

    document.getElementById(
        "player-search"
    );



    if(!input)
        return;




    const resultado =

    databaseBuscarJugador(
        input.value
    );



    mostrarJugadores(
        resultado
    );


}





// =======================================
// PERFIL DE JUGADOR
// =======================================


function abrirJugador(id){



    const jugador =

    TMLFE_DATABASE.jugadores.find(

        j=>j.id===id

    );



    if(!jugador)
        return;




    alert(

`
${jugador.nombre}

Equipo:
${jugador.equipo}

Media:
${jugador.media}

Posición:
${jugador.posicion}

Salario:
${formatoDinero(jugador.salario)}
`

    );


}





// =======================================
// PANEL DE TRADE
// =======================================


function mostrarTrade(trade){



    const panel =

    document.getElementById(
        "trade-panel"
    );



    if(!panel)
        return;



    panel.innerHTML=`

        <h2>
        Trade
        </h2>


        <p>
        ${trade.equipoOrigen}
        ➡️
        ${trade.equipoDestino}
        </p>


        <p>
        Estado:
        ${trade.estado}
        </p>


    `;



}





// =======================================
// MODO FRANQUICIA
// =======================================


function mensajeSistema(
    texto
){


    const aviso =

    document.createElement(
        "div"
    );



    aviso.className=
    "system-message";


    aviso.innerHTML=texto;



    document.body.appendChild(
        aviso
    );



    setTimeout(

        ()=>{

            aviso.remove();

        },

        3000

    );


}





console.log(
"🏀 UI.js preparado"
);
