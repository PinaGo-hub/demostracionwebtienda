// Clase que se encarga de interactuar con la API de productos
class TiendaAPI {
  constructor() {
    this.end_point = 'https://fakestoreapi.com/products';
  }

  executeRequest() {
    return fetch(this.end_point)
      .then(response => {
        if (!response.ok) throw new Error('Error al obtener los productos');
        return response.json();
      });
  }
}


//Variables
const tienda = new TiendaAPI();
let productosOriginales = [];
let ordenPrecioAsc = true;
let ordenAZAsc = true;
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];



function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}


function agregarAlCarrito(producto) {
  const index = carrito.findIndex(item => item.id === producto.id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
}


//  Muestran productos en card de materialize
function mostrarProductos(productos) {
  const contenedor = document.getElementById('product-list');
  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('col', 's12', 'm6', 'l4');

    tarjeta.innerHTML = `
      <div class="card hoverable">
      <div class="card-image">
      <img src="${producto.image}" alt="${producto.title}" style="height: 250px; object-fit: contain;">
       <span class="card-title" style="background-color: rgba(0,0,0,0.6); padding: 4px;">${producto.title}</span>
      </div>
      <div class="card-content">
     <p><strong>Precio:</strong> L${producto.price.toFixed(2)}</p>
      </div>
       <div class="card-action indigo darken-4 center z-depth-3">
      <a href="#" class="comprar-btn" style="color:white;"> Ver producto</a>
       </div>
      </div>
    `;

    //Modal
    tarjeta.querySelector('.comprar-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      Swal.fire({
        title: producto.title,
        text: producto.description,
        imageUrl: producto.image,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: producto.title,
        html: `
          <p style="margin-top: 10px;"><strong>Precio:</strong> L${producto.price.toFixed(2)}</p>
          <button id="comprar-btn" class="swal2-confirm swal2-styled" style="margin-top: 15px;">
            Comprar 🛍️
          </button>
        `,


        //Modal
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
          document.getElementById('comprar-btn').addEventListener('click', () => {
            agregarAlCarrito(producto);
            Swal.fire({
              icon: 'success',
              title: '¡Agregado al carrito!',
              text: 'Producto agregado con éxito.',
              timer: 2000,
              showConfirmButton: false
            });
          });
        }
      });
    });

    contenedor.appendChild(tarjeta);
  });
}



//  Obtener productos
tienda.executeRequest()
  .then(productos => {
    productosOriginales = productos;
    mostrarProductos(productos);
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('product-list').innerHTML = '<p>Error al cargar los productos.</p>';
  });




//  Logica Ordenar por precio
document.getElementById('btn-precio').addEventListener('click', () => {
  const ordenados = [...productosOriginales].sort((a, b) =>
    ordenPrecioAsc ? a.price - b.price : b.price - a.price
  );
  ordenPrecioAsc = !ordenPrecioAsc;
  mostrarProductos(ordenados);
});




// Ordenar por nombre A-Z 
document.getElementById('btn-az').addEventListener('click', () => {
  const ordenados = [...productosOriginales].sort((a, b) =>
    ordenAZAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );
  ordenAZAsc = !ordenAZAsc;
  mostrarProductos(ordenados);
});




// Buscar productos
const buscador = document.getElementById('buscador');
buscador.addEventListener('input', (e) => {
  const texto = e.target.value.toLowerCase();
  const filtrados = productosOriginales.filter(producto =>
    producto.title.toLowerCase().includes(texto)
  );

//Modal buscador de productos
  if (filtrados.length === 0) {

    document.getElementById('product-list').innerHTML = '';
    Swal.fire({
      icon: 'info',
      title: 'Sin resultados',
      text: 'No se encontraron productos con ese nombre.',
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    mostrarProductos(filtrados);
  }
});



// Ver carrito
document.getElementById('ver-carrito').addEventListener('click', () => {


  if (carrito.length === 0) {
    Swal.fire('Tu carrito está vacío 🛍️');
    return;
  }

  let html = '<div style="text-align: left;">';

  carrito.forEach((producto, index) => {
    html += `
      <div style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
      <strong>${producto.title}</strong><br/>
      <img src="${producto.image}" width="50" style="vertical-align: middle;" />
       <span style="margin-left: 10px;">L${producto.price.toFixed(2)} x </span>
      <input type="number" min="1" value="${producto.cantidad}" 
       data-index="${index}" class="cantidad-input" 
       style="width: 50px; text-align: center;" />
      <span style="margin-left: 10px;">= L${(producto.price * producto.cantidad).toFixed(2)}</span>
       <button class="quitar-btn" data-index="${index}" style="margin-left: 10px; color: red; border: none; background: none; cursor: pointer;">
       ❌ Quitar
       </button>
      </div>
    `;
  });

  const total = carrito.reduce((sum, p) => sum + p.price * p.cantidad, 0);
  html += `<hr/><strong>Total: L${total.toFixed(2)}</strong></div>`;

//Modal
  Swal.fire({
    title: '🛒 Tu carrito',
    html: html,
    showCloseButton: true,
    confirmButtonText: 'Seguir comprando',
    didOpen: () => {
      Swal.getHtmlContainer().querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const i = e.target.dataset.index;
          const nuevaCantidad = parseInt(e.target.value);
          if (nuevaCantidad < 1) {
            carrito.splice(i, 1);
          } else {
            carrito[i].cantidad = nuevaCantidad;
          }
          guardarCarrito();
          document.getElementById('ver-carrito').click();
        });
      });

      Swal.getHtmlContainer().querySelectorAll('.quitar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          carrito.splice(index, 1);
          guardarCarrito();
          document.getElementById('ver-carrito').click();
        });
      });
    }
  });
});




