
// productos.js - lista de productos con categoria y stock
const productos = [
    { id: 1, nombre: "Cargador inalámbrico FastCharge", precio: 49.90, imagen: "https://via.placeholder.com/600x400?text=Cargador", categoria: "Tecnologia", stock: 120 },
    { id: 2, nombre: "Audífonos In-Ear Pro", precio: 89.90, imagen: "https://via.placeholder.com/600x400?text=Audifonos", categoria: "Tecnologia", stock: 60 },
    { id: 3, nombre: "Camiseta Casual", precio: 39.90, imagen: "https://via.placeholder.com/600x400?text=Camiseta", categoria: "Ropa", stock: 80 },
    { id: 4, nombre: "Mochila Urbana", precio: 59.90, imagen: "https://via.placeholder.com/600x400?text=Mochila", categoria: "Accesorios", stock: 40 },
    { id: 5, nombre: "Organizador de Cocina 3 en 1", precio: 29.90, imagen: "https://via.placeholder.com/600x400?text=Utencilio", categoria: "Utensilios", stock: 100 },
    { id: 6, nombre: "Lámpara LED Ambiente", precio: 34.90, imagen: "https://via.placeholder.com/600x400?text=Lampara+LED", categoria: "Tecnologia", stock: 70 }
];

function formatBRL(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts(filterCategory) {
    const lista = document.getElementById("product-list");
    if(!lista) return;
    lista.innerHTML = '';
    const toShow = filterCategory ? productos.filter(p=>p.categoria===filterCategory) : productos;
    toShow.forEach(p => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <h4>${p.nombre}</h4>
            <p>${formatBRL(p.precio)}</p>
            <small style="color:#666">Categoria: ${p.categoria}</small><br>
            <button onclick="agregar(${p.id})">Agregar al carrito</button>
        `;
        lista.appendChild(div);
    });
    // update category selector highlight if exists
    const sel = document.querySelectorAll('.cat-link');
    sel.forEach(a => a.classList.remove('active'));
    if(filterCategory){
      const active = document.querySelector('[data-cat="'+filterCategory+'"]');
      if(active) active.classList.add('active');
    }
}

function agregar(id) {
    const p = productos.find(x => x.id === id);
    if(!p) return alert("Producto no encontrado");
    let carrito = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
    // check stock
    const countSame = carrito.filter(i => i.id===id).length;
    if(countSame >= p.stock) return alert('No hay más stock disponible.');
    carrito.push({ ...p, cantidad:1 });
    localStorage.setItem('flashbuy_cart', JSON.stringify(carrito));
    alert("Producto agregado al carrito: " + p.nombre);
}

document.addEventListener('DOMContentLoaded', function(){ renderProducts(); });
// expose renderProducts to global so menu can call it
window.renderProducts = renderProducts;
