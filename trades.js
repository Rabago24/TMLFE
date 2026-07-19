// =======================================
// TMLFE - Trade Machine Interface
// =======================================



document.addEventListener(
"DOMContentLoaded",
()=>{


cargarEquiposTrade();


});





function cargarEquiposTrade(){


const origen =
document.getElementById(
"equipo-origen"
);


const destino =
document.getElementById(
"equipo-destino"
);



if(!origen || !destino)
return;




TMLFE_DATABASE.equipos.forEach(

equipo=>{


let op1 =
document.createElement(
"option"
);


op1.textContent =
equipo.nombre;


op1.value =
equipo.nombre;



let op2 =
op1.cloneNode(true);



origen.appendChild(op1);


destino.appendChild(op2);



}

);


}







function analizarTrade(){



const origen =

document.getElementById(
"equipo-origen"
).value;



const destino =

document.getElementById(
"equipo-destino"
).value;




const salen =

document.getElementById(
"jugadores-sale"
).value;




const llegan =

document.getElementById(
"jugadores-llegan"
).value;




const resultado =

document.getElementById(
"resultado-trade"
);





if(
origen==="Seleccionar equipo"
||
destino==="Seleccionar equipo"
){


resultado.innerHTML =

"❌ Selecciona dos franquicias";


return;


}






const trade = crearTrade({

equipoOrigen:origen,

equipoDestino:destino,

jugadoresEnviados:
salen.split("\n"),

jugadoresRecibidos:
llegan.split("\n")

});






resultado.innerHTML =

`
<h3>✅ Trade creado</h3>

<p>
${origen}
 ➡️ 
${destino}
</p>

<p>
Estado:
${trade.estado}
</p>
`;



}
