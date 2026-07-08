/*==================================================
    PresuTuft Lite V1
    app.js - Parte 1
==================================================*/

"use strict";

/*==================================================
    ELEMENTOS
==================================================*/

const $ = id => document.getElementById(id);

const cliente = $("cliente");
const diseno = $("diseno");
const ancho = $("ancho");
const alto = $("alto");
const cantidad = $("cantidad");
const complejidad = $("complejidad");

const precioLana = $("precioLana");
const precioTelaPrimaria = $("precioTelaPrimaria");
const precioTelaSecundaria = $("precioTelaSecundaria");
const precioPegamento = $("precioPegamento");

const btnGuardarConfiguracion = $("btnGuardarConfiguracion");
const btnCalcular = $("btnCalcular");
const btnLimpiar = $("btnLimpiar");
const btnWhatsapp = $("btnWhatsapp");

const precioFinal = $("precioFinal");

/*==================================================
    CONFIGURACIÓN
==================================================*/

const CONFIG_DEFAULT = {

    precioLana:8000,

    precioTelaPrimaria:15000,

    precioTelaSecundaria:15000,

    precioPegamento:25000

};

function cargarConfiguracion(){

    const cfg = JSON.parse(

        localStorage.getItem("presutuft_config")

    ) || CONFIG_DEFAULT;

    precioLana.value = cfg.precioLana;
    precioTelaPrimaria.value = cfg.precioTelaPrimaria;
    precioTelaSecundaria.value = cfg.precioTelaSecundaria;
    precioPegamento.value = cfg.precioPegamento;

}

function guardarConfiguracion(){

    const cfg = {

        precioLana:Number(precioLana.value),

        precioTelaPrimaria:Number(precioTelaPrimaria.value),

        precioTelaSecundaria:Number(precioTelaSecundaria.value),

        precioPegamento:Number(precioPegamento.value)

    };

    localStorage.setItem(

        "presutuft_config",

        JSON.stringify(cfg)

    );

    alert("Configuración guardada.");

}

/*==================================================
    UTILIDADES
==================================================*/

function dinero(valor){

    return new Intl.NumberFormat(

        "es-AR",

        {

            style:"currency",

            currency:"ARS",

            maximumFractionDigits:0

        }

    ).format(valor);

}

function redondear(valor){

    return Math.round(valor/1000)*1000;

}

function areaM2(){

    const a = Number(ancho.value)||0;

    const h = Number(alto.value)||0;

    return (a*h)/10000;

}

/*==================================================
    CÁLCULO
==================================================*/

let ultimoPrecio = 0;

function calcularPresupuesto(){

    const area = areaM2();

    const cant = Math.max(

        1,

        Number(cantidad.value)||1

    );

    const areaTotal = area*cant;

    /* LANA */

    const gramosLana = areaTotal*1000;

    const costoLana =

        (gramosLana/100)

        *

        Number(precioLana.value);

    /* TELAS */

    const costoTelaPrimaria =

        areaTotal

        *

        Number(precioTelaPrimaria.value);

    const costoTelaSecundaria =

        areaTotal

        *

        Number(precioTelaSecundaria.value);

    /* PEGAMENTO */

    const precioKgPegamento =

        Number(precioPegamento.value)/2;

    const costoPegamento =

        areaTotal

        *

        precioKgPegamento;

    /* COSTO MATERIALES */

    const costoMateriales =

        costoLana+

        costoTelaPrimaria+

        costoTelaSecundaria+

        costoPegamento;

    let multiplicador = 3;

    switch(complejidad.value){

        case "simple":

            multiplicador=3;

            break;

        case "media":

            multiplicador=4;

            break;

        case "compleja":

            multiplicador=5;

            break;

    }

    ultimoPrecio =

        redondear(

            costoMateriales

            *

            multiplicador

        );

    precioFinal.textContent =

        dinero(ultimoPrecio);

}

/*==================================================
    LIMPIAR
==================================================*/

function limpiarFormulario(){

    cliente.value = "";
    diseno.value = "";

    ancho.value = "";
    alto.value = "";

    cantidad.value = 1;
    complejidad.value = "media";

    ultimoPrecio = 0;

    precioFinal.textContent = "$0";

}

/*==================================================
    WHATSAPP
==================================================*/

async function compartirWhatsapp(){

    if(ultimoPrecio<=0){
        alert("Primero calculá el presupuesto.");
        return;
    }

    const mensaje =
`Hola 👋

Te paso el presupuesto.
Cliente: ${cliente.value}
Diseño: ${diseno.value}
Medidas: ${ancho.value} x ${alto.value} cm
Cantidad: ${cantidad.value}

Precio final: ${dinero(ultimoPrecio)}`;

    if (navigator.share) {

        try{
            await navigator.share({
                text: mensaje
            });
        }catch(e){}

    } else {

        navigator.clipboard.writeText(mensaje);

        alert("Tu navegador no permite compartir.\nEl presupuesto fue copiado al portapapeles.");

    }

}

/*==================================================
    EVENTOS
==================================================*/

btnGuardarConfiguracion.addEventListener(

    "click",

    guardarConfiguracion

);

btnCalcular.addEventListener(

    "click",

    calcularPresupuesto

);

btnLimpiar.addEventListener(

    "click",

    limpiarFormulario

);

btnWhatsapp.addEventListener(

    "click",

    compartirWhatsapp

);

/*==================================================
    INICIO
==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        cargarConfiguracion();

        precioFinal.textContent="$0";

    }

);