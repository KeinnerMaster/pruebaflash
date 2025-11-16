// productos.js - lista completa de productos con todas las categorías
const productos = [
    // TECNOLOGIA
    { 
        id: 1, 
        nombre: "Cargador inalámbrico FastCharge", 
        precio: 49.90, 
        imagen: "https://images.unsplash.com/photo-1591290619762-c588dc522ff5?w=600&h=400&fit=crop", 
        categoria: "Tecnologia", 
        stock: 120 
    },
    { 
        id: 2, 
        nombre: "Audífonos In-Ear Pro", 
        precio: 89.90, 
        imagen: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop", 
        categoria: "Tecnologia", 
        stock: 60 
    },
    { 
        id: 6, 
        nombre: "Lámpara LED Ambiente", 
        precio: 34.90, 
        imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop", 
        categoria: "Tecnologia", 
        stock: 70 
    },
    { 
        id: 7, 
        nombre: "Mouse Gamer RGB", 
        precio: 79.90, 
        imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop", 
        categoria: "Tecnologia", 
        stock: 45 
    },
    { 
        id: 8, 
        nombre: "Teclado Mecánico", 
        precio: 129.90, 
        imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop", 
        categoria: "Tecnologia", 
        stock: 35 
    },
    
    // ROPA
    { 
        id: 3, 
        nombre: "Camiseta Casual", 
        precio: 39.90, 
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop", 
        categoria: "Ropa", 
        stock: 80 
    },
    { 
        id: 9, 
        nombre: "Sudadera con Capucha", 
        precio: 69.90, 
        imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop", 
        categoria: "Ropa", 
        stock: 55 
    },
    { 
        id: 10, 
        nombre: "Jeans Slim Fit", 
        precio: 89.90, 
        imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop", 
        categoria: "Ropa", 
        stock: 65 
    },
    { 
        id: 11, 
        nombre: "Chaqueta Deportiva", 
        precio: 99.90, 
        imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop", 
        categoria: "Ropa", 
        stock: 40 
    },
    
    // ACCESORIOS
    { 
        id: 4, 
        nombre: "Mochila Urbana", 
        precio: 59.90, 
        imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop", 
        categoria: "Accesorios", 
        stock: 40 
    },
    { 
        id: 12, 
        nombre: "Reloj Inteligente", 
        precio: 149.90, 
        imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop", 
        categoria: "Accesorios", 
        stock: 30 
    },
    { 
        id: 13, 
        nombre: "Gafas de Sol Polarizadas", 
        precio: 45.90, 
        imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop", 
        categoria: "Accesorios", 
        stock: 75 
    },
    { 
        id: 14, 
        nombre: "Billetera de Cuero", 
        precio: 35.90, 
        imagen: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=400&fit=crop", 
        categoria: "Accesorios", 
        stock: 90 
    },
    
    // UTENSILIOS
    { 
        id: 5, 
        nombre: "Organizador de Cocina 3 en 1", 
        precio: 29.90, 
        imagen: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop", 
        categoria: "Utensilios", 
        stock: 100 
    },
    { 
  id: 90, 
  nombre: "Mouse gamer prueba de agg prod", 
  precio: 90.00, 
  imagen: "file:///C:/Users/usuario/Desktop/P%C3%A1gina%20FlashBuy/Logos/banner.svg", 
  categoria: "Tecnologia", 
  stock: 100 
},
    { 
        id: 15, 
        nombre: "Set de Cuchillos Premium", 
        precio: 79.90, 
        imagen: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=400&fit=crop", 
        categoria: "Utensilios", 
        stock: 50 
    },
    { 
        id: 16, 
        nombre: "Licuadora Portátil", 
        precio: 54.90, 
        imagen: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop", 
        categoria: "Utensilios", 
        stock: 60 
    },
    { 
        id: 17, 
        nombre: "Tabla de Cortar Bambú", 
        precio: 24.90, 
        imagen: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=400&fit=crop", 
        categoria: "Utensilios", 
        stock: 85 
    }
];

function formatBRL(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts(filterCategory) {
    const lista = document.getElementById("product-list");
    if (!lista) return;
    
    lista.innerHTML = '';
    const toShow = filterCategory ? productos.filter(p => p.categoria === filterCategory) : productos;
    
    if (toShow.length === 0) {
        lista.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No hay productos en esta categoría.</p>';
        return;
    }
    
    toShow.forEach(p => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            <h4>${p.nombre}</h4>
            <p>${formatBRL(p.precio)}</p>
            <small style="color:#666">Categoría: ${p.categoria} • Stock: ${p.stock}</small>
            <button onclick="agregar(${p.id})">Agregar al carrito</button>
        `;
        lista.appendChild(div);
    });
    
    // Update category selector highlight
    const allLinks = document.querySelectorAll('.cat-link, nav a[data-cat]');
    allLinks.forEach(a => a.classList.remove('active'));
    
    if (filterCategory) {
        const activeLinks = document.querySelectorAll(`[data-cat="${filterCategory}"]`);
        activeLinks.forEach(link => link.classList.add('active'));
    }
}

function agregar(id) {
    const p = productos.find(x => x.id === id);
    if (!p) return alert("Producto no encontrado");
    
    let carrito = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
    
    // Check total quantity of this product in cart
    const existingItem = carrito.find(item => item.id === id);
    const currentQuantity = existingItem ? existingItem.cantidad : 0;
    
    if (currentQuantity >= p.stock) {
        return alert('No hay más stock disponible de este producto.');
    }
    
    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        carrito.push({ ...p, cantidad: 1 });
    }
    
    localStorage.setItem('flashbuy_cart', JSON.stringify(carrito));
    alert("✓ Producto agregado al carrito: " + p.nombre);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() { 
    renderProducts(); 
});

// Expose functions globally for inline onclick handlers
window.renderProducts = renderProducts;
window.agregar = agregar;
