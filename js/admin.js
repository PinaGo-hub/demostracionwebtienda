let carrito = [];

// Cargar carrito desde localStorage al iniciar
if(localStorage.getItem('carrito')){
  carrito = JSON.parse(localStorage.getItem('carrito'));
  actualizarCarrito();
}









// Lista de productos
const productos = [
  {id:1, nombre:"Conjunto formal negro", precio:500, imagen:"img/card4.png"},
  {id:2, nombre:"Conjunto casual blanco", precio:650, imagen:"img/card5.png"},
  {id:3, nombre:"Conjunto elegante azul", precio:750, imagen:"img/card3.png"} // puedes agregar más
];











// Generar cards dinámicamente
const contenedor = document.getElementById("productos-container");
productos.forEach(producto => {
  const col = document.createElement("div");
  col.className = "col s12 m4";
  col.setAttribute("data-aos","fade-up");
  col.innerHTML = `
    <div class="card hoverable" style="border-radius:10px;">
      <div class="card-image">
        <img src="${producto.imagen}" style="height:400px; border-radius:10px;">
      </div>
      <div class="card-content center-align">
        <span class="card-title">${producto.nombre}</span>
        <p>L.${producto.precio}</p>
        <label>Talla:</label>
        <select id="talla-${producto.id}" class="browser-default">
          <option value="">Seleccionar</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <label>Cantidad:</label>
        <input id="cantidad-${producto.id}" type="number" value="1" min="1">
      </div>
      <div class="card-action center teal darken-1" style="border-radius:10px;">
        <a href="#!" class="white-text" onclick="agregarAlCarrito(${producto.id},'${producto.nombre}',${producto.precio},'${producto.imagen}')">Agregar al carrito</a>
      </div>
    </div>`;
  contenedor.appendChild(col);
});

// Funciones del carrito
function agregarAlCarrito(id,nombre,precio,imagen){
  const talla = document.getElementById(`talla-${id}`).value;
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
  if(!talla || cantidad<=0){ alert("Selecciona talla y cantidad válida"); return; }
  const existente = carrito.find(item => item.id===id && item.talla===talla);
  if(existente){ existente.cantidad += cantidad; } 
  else { carrito.push({id,nombre,precio,imagen,talla,cantidad}); }
  actualizarCarrito();
}

function actualizarCarrito(){
  const cont = document.getElementById("carrito-items"); cont.innerHTML="";
  let total=0;
  carrito.forEach((item,i)=>{
    const subtotal=item.precio*item.cantidad; total+=subtotal;
    cont.innerHTML+=`
      <div class="carrito-item">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div style="flex:1;">
          <strong>${item.nombre}</strong><br>
          Talla: ${item.talla} | Cantidad: ${item.cantidad}<br>
          Precio: L.${item.precio} c/u<br>
          Subtotal: L.${subtotal}
        </div>
        <button onclick="eliminarDelCarrito(${i})">X</button>
      </div>`;
  });
  document.getElementById("cartTotal").innerText="Total: L."+total;

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function eliminarDelCarrito(i){ 
  carrito.splice(i,1); 
  actualizarCarrito(); 
}
function abrirCarrito(){ document.getElementById("cartModal").style.display="block"; }
function cerrarCarrito(){ document.getElementById("cartModal").style.display="none"; }

function cotizarWhatsApp(){
  if(carrito.length===0){ alert("Carrito vacío"); return; }
  let mensaje="¡Hola! Me interesa cotizar los siguientes productos:%0A%0A";
  carrito.forEach(item=>{
    mensaje+=`- ${item.nombre} | Talla: ${item.talla} | Cantidad: ${item.cantidad} | Precio: L.${item.precio} c/u | Subtotal: L.${item.precio*item.cantidad}%0A`;
  });
  const total=carrito.reduce((acc,item)=>acc+(item.precio*item.cantidad),0);
  mensaje+=`%0ATotal: L.${total}`;
  window.open(`https://wa.me/50498174113?text=${mensaje}`,"_blank");
}

// Materialize y AOS
document.addEventListener('DOMContentLoaded', function(){
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Modal.init(document.querySelectorAll('.modal'));
  AOS.init({duration:1000,once:true});
});


function agregarAlCarrito(id, nombre, precio, imagen){
  const talla = document.getElementById(`talla-${id}`).value;
  const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);

  if(!talla || cantidad <= 0){
    alert("Selecciona talla y cantidad válida");
    return;
  }

  const existente = carrito.find(item => item.id === id && item.talla === talla);

  if(existente){
    existente.cantidad += cantidad;
  } else {
    carrito.push({id, nombre, precio, imagen, talla, cantidad});
  }

  // Actualizamos el carrito
  actualizarCarrito();

  // Animación SweetAlert2
  Swal.fire({
    icon: 'success',
    title: '¡Agregado al carrito!',
    text: `${nombre} (${cantidad} x ${talla})`,
    showConfirmButton: false,
    timer: 1500,
    position: 'top-end',
    toast: true,
    background: '#28a745',
    color: 'white',
    showCloseButton: true
  });
}
