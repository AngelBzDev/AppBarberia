let pagina = 1;

const cita = {
   nombre: '', fecha: '', hora: '', servicios: []
}

document.addEventListener('DOMContentLoaded', () => iniciarApp());

const iniciarApp = () => {
   mostrarServicios();
   //Resaltar la seccion actual
   mostrarSeccion();
   //Ocultar o  mostrar una seccion segun el tab que se preciona
   cambiarSeccion();
   //Paginacion siguiente y anterior
   paginaSiguiente();
   paginaAnterior();
   //Verificar la pagina actual para ocultar o mostrar la paginacion
   botonesPaginado();
   //Muestra el resumen o msj de error
   mostrarResumen();
   //Almacena el nombre del cliente
   nombreCita();
   //Almacena la fecha de cita en el objeto
   fechaCita();
   //Deshabilitar dias pasados
   deshabilitarFechaAnterior();
   //Almacenar la hora en la cita
   horaCita();
}

function mostrarSeccion() {

   //Eliminar .mostrar-seccion de la seccion anterior
   const seccAnt = document.querySelector('.mostrar-seccion');
   if(seccAnt) {
      seccAnt.classList.remove('mostrar-seccion');
   }

   const seccionActual = document.querySelector(`#paso-${pagina}`);
   seccionActual.classList.add('mostrar-seccion');

   const tabAnt = document.querySelector('.tabs .actual');
   //Eliminar .actual en el tab anterior
   if(tabAnt) {
      tabAnt.classList.remove('actual');
   }

   //resaltar el tab actual
   const tab = document.querySelector(`[data-paso="${pagina}"]`);
   tab.classList.add('actual');
}

function cambiarSeccion() {
   const enlaces = document.querySelectorAll('.tabs button');
   enlaces.forEach(enlace => {
      enlace.addEventListener('click', e =>{
         e.preventDefault();
         pagina = parseInt(e.target.dataset.paso);

         mostrarSeccion();

         botonesPaginado();
      });
   });
}

async function mostrarServicios(){
   try {
      const resultado = await fetch('../servicios.json');
      const db = await resultado.json();
      const {servicios} = db;
      //Generar el html
      servicios.forEach(servicio => {
         const {id, nombre, precio} = servicio;

         //Comienzo del DOM scripting
         //Generando el nombre del servicio
         const nomServ = document.createElement('P');
         nomServ.textContent = nombre;
         nomServ.classList.add('nombre-servicio');
         //Precio del servicio
         const prec = document.createElement('P');
         prec.textContent = `$ ${precio}`;
         prec.classList.add('precio-servicio');

         //Generando el div que contine los servicios
         const servicioDiv = document.createElement('DIV');
         servicioDiv.classList.add('servicio');
         servicioDiv.dataset.idServicio = id;

         //Inyectar nombre y precio al div
         servicioDiv.appendChild(nomServ);
         servicioDiv.appendChild(prec);

         //Inyectar el div de servicios en el HTML
         document.querySelector('#servicios').appendChild(servicioDiv);

         //Seleccionar un servicio
         servicioDiv.onclick = seleccionarServicio;
      });
   } catch (error) {
      console.log(error);
   }
}

const seleccionarServicio = e => {
   let elemento;

   if(e.target.tagName === 'P') {
      elemento = e.target.parentElement;
   }
   else {
      elemento = e.target;
   }

   if(elemento.classList.contains('seleccionado')) {
      elemento.classList.remove('seleccionado');
      const id = parseInt(elemento.dataset.idServicio);
      eliminarServicio(id);
   }
   else {
      elemento.classList.add('seleccionado');

      const servicioObj = {
         id: parseInt(elemento.dataset.idServicio),
         nombre: elemento.firstElementChild.textContent,
         precio: elemento.firstElementChild.nextElementSibling.textContent
      }

      agregarServicio(servicioObj);
   }
}

function eliminarServicio(id) {
   //console.log(`Eliminando.. ${id}`);
   const {servicios} = cita;
   cita.servicios = servicios.filter(servicio => servicio.id !== id);
   //console.log(cita);
}

function agregarServicio(objeto) {
   const {servicios} = cita;
   cita.servicios = [...servicios, objeto];
   // console.log(cita);
}

function paginaSiguiente() {
   const pagS = document.querySelector('#siguiente');
   pagS.addEventListener('click', () => {
      pagina++;
      botonesPaginado()
   });
}

function paginaAnterior() {
   const pagA = document.querySelector('#anterior');
   pagA.addEventListener('click', () => {
      pagina--;
      botonesPaginado()
   });
}

function botonesPaginado() {
   const pagS = document.querySelector('#siguiente');
   const pagA = document.querySelector('#anterior');

   if(pagina === 1) {
      pagA.classList.add('ocultar');
   }
   else if(pagina === 3) {
      pagA.classList.remove('ocultar');
      pagS.classList.add('ocultar');
      mostrarResumen();
   }
   else{
      pagA.classList.remove('ocultar');
      pagS.classList.remove('ocultar');
   }

   mostrarSeccion();
}

function mostrarResumen() {
   const {nombre, fecha, hora, servicios} = cita;

   const divResumen = document.querySelector('.contenido-resumen');
   //Validacion de objetos
   if(Object.values(cita).includes('')) {
      const noServicios = document.createElement('P');
      noServicios.textContent = 'Faltan datos';
      noServicios.classList.add('invalidar-cita', 'text-center');
      //agregar a resumen div
      divResumen.appendChild(noServicios);
   }
   else{
      console.log('Buenas guapo');
   }
}

function nombreCita(){
   const nombreInput = document.querySelector('#nombre');
   nombreInput.addEventListener('input', e => {
      const nomTexto = e.target.value.trim();
      // console.log(nomTexto);
      //Validar que nombreTexto tenga un valor
      if(nomTexto === '' || nomTexto.length < 3) {
         mostrarAlerta('Llene el campo correctamente', 1);
      }
      else {
         // console.log('Valido');
         const alerta = document.querySelector('.alerta');
         if(alerta) {
            alerta.remove();
         }
         cita.nombre = nomTexto;
         // console.log(cita);
      }
   });
}

function mostrarAlerta(msj, tipo) {
   //Si ya hay una alerta no mostrar otra
   let alertaPrevia = document.querySelector('.alerta');
   if(alertaPrevia) {
      return;
   }

   const alerta = document.createElement('DIV');
   alerta.textContent = msj;
   alerta.classList.add('alerta');
   //Para el tipo 1 significa error y 2 significa nice :)
   if(parseInt(tipo) === 1) {
      alerta.classList.add('error');
   }
   else if(parseInt(tipo) === 2) {
      alerta.classList.add('nice');
   }
   const formulario = document.querySelector('.formulario');
   formulario.appendChild(alerta);

   //Eliminar la alerta despues de 3 segundos
   setTimeout(() => {
      alerta.remove();
   }, 3000);
}

function fechaCita(){
   const fechaInput = document.querySelector('#fecha');
   fechaInput.addEventListener('input', e =>{
      const dia = new Date(e.target.value).getUTCDay();
      if([0, 6].includes(dia)) {
         e.preventDefault();
         fechaInput.value = '';
         mostrarAlerta("Los fines de semana no abrimos", 1);
      }
      else {
         cita.fecha = fechaInput.value;
         console.log(cita)
      }
   });
}

function deshabilitarFechaAnterior() {

   const fecha = new Date();
   const year = fecha.getFullYear();
   const mes = fecha.getMonth() + 1;
   const dia = fecha.getDate();
   let m, d;

   //ahora le agregas un 0 para el formato date
   if (mes < 10) m = `0${mes}`;
   else m = mes.toString;

   if(dia < 10) d = `0${dia}`;
   else d = dia.toString();

   let diaDesh = `${year}-${m}-${d}`;
   document.querySelector('#fecha').min = diaDesh;
}

function horaCita() {
   const inputHora = document.querySelector('#hora');
   inputHora.addEventListener('input', e => {
      const horaCita = e.target.value;
      const hora = horaCita.split(':');
      if(hora < 9 || hora > 21) {
         mostrarAlerta('La hora no es valida', 1);
         setTimeout(() => {
            inputHora.value = '';
         }, 3000);
      }
      else {
         cita.hora = horaCita;
      }
   });
}