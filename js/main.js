
let carrito = [];
const botonComprar = document.querySelectorAll(".btn");
const listaCarrito = document.querySelector(".carrito");
const botonBorrar = document.querySelector(".btnBorrar");
const ComprarCarrito = document.querySelector(".btnComprar");

ComprarCarrito.addEventListener("click" , ()=>{
    Swal.fire({
        icon: 'success', 
        title: 'Haz realizado la compra con exito',
      })
        borrarCarrito();
        sumarTotal();
})

botonComprar.forEach( btn => {
    btn.addEventListener("click", agregarCarrito);
});

botonBorrar.addEventListener("click", function (){
    Swal.fire({
        title: '¿Esta seguro que desea borrar el carrito?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('El carrito ha sido borrado', '', 'success')
            borrarCarrito();
            sumarTotal();
        } else if (result.isDenied) {
          Swal.fire('El carrito no ha sido borrado', '', 'info')
        }
      })
});


function agregarCarrito(e){
    const boton = e.target;
    const item = boton.closest(".cardProducto");
    const itemImg = item.querySelector(".imagenProducto").src;
    const itemNombre = item.querySelector(".nombreProducto").textContent;
    const itemPrecio = item.querySelector(".precioProducto").textContent;
    
    const nuevoItem = {
        imagen: itemImg,
        nombre: itemNombre,
        precio: itemPrecio,
        cantidad: 1,
    }
    agregarItemCarrito(nuevoItem);
}

function agregarItemCarrito(nuevoItem){
    Swal.fire({
        icon: 'success', 
        title: 'Se agrego un producto al carrito',
      })
    const contador = listaCarrito.getElementsByClassName("contador");
    for (let  i = 0;  i < carrito.length; i+=1)
        if (carrito[i].nombre.trim() == nuevoItem.nombre.trim()){ 
        ++carrito[i].cantidad;
        const cont = contador[i];
        ++cont.value;
        return null;
    }
    carrito.push(nuevoItem);
    mostrarCarrito(nuevoItem);
}

function mostrarCarrito(){
    listaCarrito.innerHTML = "";
    carrito.map( item => {
        const carrito = document.createElement("div");
        carrito.classList.add("cardCarrito");

        const contenido = 
        `
            <img class="imagenProducto" src= ${item.imagen} alt="">
            <h2 class="nombre">${item.nombre}</h2>
            <h2>${item.precio}</h2>
            <div class="cantidad">
                <input class="contador" type="number" min="1" value=${item.cantidad}>
                <button class="btnQuitar">X</button>    
            </div>
        `
        carrito.innerHTML = contenido;
        listaCarrito.appendChild(carrito);

        carrito.querySelector(".btnQuitar").addEventListener("click", borrarProducto);
        carrito.querySelector(".contador").addEventListener("change", sumaContador);
    
    })
    sumarTotal();
}

function sumarTotal(){
    let total = 0;
    const totalCarrito = document.querySelector(".total"); 
    carrito.forEach( (item) => {
        const precio = Number(item.precio.replace("$", ""));
        total = total + precio*item.cantidad; 
    })
    totalCarrito.innerHTML = `Total: $${total}`
    agregarStorage();
}

function borrarProducto(e){
    Swal.fire({
        title: '¿Esta seguro que desea borrar el producto del carrito?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('El producto ha sido borrado del carrito', '', 'success')
                const borrarProducto = e.target;
                const card = borrarProducto.closest(".cardCarrito");
                const nombre = card.querySelector(".nombre").textContent;
            for (let i = 0; i < carrito.length; i++){
                if(carrito[i].nombre.trim() === nombre.trim()){
                carrito.splice(i,1);
                }
            }
            card.remove();
            sumarTotal();
                }else if (result.isDenied) {
                Swal.fire('El producto no ha sido borrado del carrito', '', 'info')
                }
        })
}

function sumaContador(e){
    const contador = e.target;
    const carr = contador.closest(".cardCarrito");
    const nombre = carr.querySelector(".nombre").textContent;
    carrito.forEach( item => {
        if(item.nombre.trim() === nombre){
            contador.value < 1 ? (contador.value = 1) : contador.value;
            item.cantidad = contador.value;
            sumarTotal();
        }    
    })
}

function agregarStorage(){
    localStorage.setItem("Carrito",JSON.stringify(carrito));
}

function borrarCarrito (){
    listaCarrito.innerHTML = "";
    carrito.splice(0,carrito.length);
    localStorage.clear();
}

window.onload = function(){
    const storage = JSON.parse(localStorage.getItem("Carrito"))
    if(storage){
        carrito = storage;
        mostrarCarrito();
    }
}

