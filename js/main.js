
/* Programa mediante el cual un usuario puede comprar los productos de verduleria indicados en el catalogo.
    A través del boton "AGREGAR" puede ir sumando productos al carrito (boton debajo del header a la izquierda)
    y elegir más de una vez el mismo para incrementar su cantidad. Una vez dentro del carrito, el usuario 
    podrá ver detalladamente su elección. (nombre del producto, el precio
    de acuerdo la cantidad elegida, eliminar productos, total a pagar) */
    


// Vegas Js

$(document).ready(function(){
    $("body").vegas({
        delay: 7500,
        slides: [
            { src: "img/fondo7.jpg" },
            { src: "img/fondo6.jpg" },
         ],

         overlay: "overlays/06.png",
         animation: "kenburnsUpLeft"

    }) 
});


// Titulo Nav

let tituloNav = document.getElementById("tituloNav");
tituloNav.innerText = "Verduleria el Greench"
console.log(tituloNav.innerText);


// Conte modelo

const contenedorModal = document.getElementsByClassName('conteModelo')[0];
const botonAbrir = document.getElementById('btnCarrito');
const botonCerrar = document.getElementById('carritoCerrar');
const modalCarrito = document.getElementsByClassName('carritoModelo')[0];


botonAbrir.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modeloActivo');
});
botonCerrar.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modeloActivo');
});

contenedorModal.addEventListener('click', (event) =>{
    contenedorModal.classList.toggle('modeloActivo');

});
modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation() 
});

const contenedorProductos = document.getElementById('conteProd');


const contenedorCarrito = document.getElementById('conteCarrito');

// Vaciar carrito
const botonVaciar = document.getElementById('vaciarCarrito');

// Confirmar compra
const botonConfirmar = document.getElementById('confirmarCompra');





// Contador
const contadorCarrito = document.getElementById('contadorCarrito');

// Cantidad // Precio total
const cantidad = document.getElementById('cantidad');
const precioTotal = document.getElementById('precioTotal');
const cantidadTotal = document.getElementById('cantidadTotal');

// Array carrito

let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarCarrito();
    }
});

botonVaciar.addEventListener('click', () => {
    localStorage.removeItem("carrito")
    carrito.length = 0;
    Toastify({
        text: "Vaciaste el carrito",
        className: "info",
        gravity: "bottom",
        style: {
          background: "red",
                  }
      }).showToast();
    actualizarCarrito();
    
});


function confirmarCompra(){
    Swal.fire({
        title: "¿Estas seguro de realizar la compra?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        confirmButtonColor: "green",
        cancelButtonColor: "red",
    }).then((result) => {       
        if (result.isConfirmed){
            swal.fire({
                title: 'Confirmaste tu compra',
                icon: 'success',
                confirmButtonColor: 'green',
                text: `Gracias por confiar en nosotros.`,                
                

            })
             
            localStorage.removeItem("carrito")
            carrito.length = 0;
            actualizarCarrito();

        }else{
            swal.fire({
                title: 'La compra no fue realizada, volveras al paso anterior',
                icon: 'info', 
                confirmButtonColor: 'green',              
                timer: 4000
            })      
                      
        }
    })

}

//BotonCarrito

botonConfirmar.addEventListener('click', ()=>{
    confirmarCompra()
})


const htmlCards = (products) =>{
products.forEach((producto) => {
    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
    <img class="imgGrilla" src=${producto.img} alt= "">
    <h3 class="titProd">${producto.nombre}</h3>    
    <p class="precioProducto ${producto.precio <= 100 ? "ofertaColor" : "precioComun"}"> Precio: $${producto.precio}kg.</p>
    <button id="agregar${producto.id}" class="btn">Agregar <i class="fas fa-shopping-cart"></i></button>
    `
    contenedorProductos.appendChild(div);

    const boton = document.getElementById(`agregar${producto.id}`);
 

    boton.addEventListener('click', () => {

        agregarAlCarrito(producto.id);
        
    });
});
}

//Fetch

let arrayProductos

fetch('../catalogo.json')
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        arrayProductos = data
        htmlCards(data)
    })

// Agregar al carrito 

const agregarAlCarrito = (prodId) => {
   
    const existe = carrito.some (prod => prod.id === prodId);

    
    if (existe){
        carrito.forEach(prod => {         
            if (prod.id === prodId){
                prod.cantidad++
                
            };
        });
    } else { 
        const item = arrayProductos.find((prod) => prod.id === prodId);
        carrito.push(item);
        Toastify({
            text: "Producto agregado",
            gravity: "bottom",
            className: "info",
            style: {
              background: "linear-gradient(to right, #acc90a, #06921d)",
            }
          }).showToast();
        
    }
  
    actualizarCarrito();
}

// Eliminar del carrito

const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId);

    const indice = carrito.indexOf(item); 

    carrito.splice(indice, 1);
    Toastify({
        text: "Producto eliminado",
        className: "info",
        gravity: "bottom",
        style: {
          background: "linear-gradient(to right, #acc90a, red)",
        }
      }).showToast();
    actualizarCarrito();     
    console.log(carrito);
}

// Actualizar carrito

const actualizarCarrito = () => {
 
    contenedorCarrito.innerHTML = "" 
    carrito.forEach((prod) => {
        const div = document.createElement('div');
        div.className = ('productoEnCarrito');
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="btnEliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div);
        
        localStorage.setItem('carrito', JSON.stringify(carrito));

    })
   
    contadorCarrito.innerText = carrito.length 
    
    console.log(carrito);
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0);
    
}



