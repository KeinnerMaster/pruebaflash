// productos.js - Carga productos desde Supabase

async function fetchProducts() {
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchFeaturedProduct() {
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('is_featured', true)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data;
    } catch (error) {
        console.error('Error fetching featured product:', error);
        return null;
    }
}

async function fetchSiteSettings() {
    try {
        const { data, error } = await window.supabaseClient
            .from('site_settings')
            .select('*');

        if (error) throw error;
        
        const settings = {};
        data.forEach(item => {
            settings[item.key] = item.value;
        });
        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {};
    }
}

function formatBRL(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function renderIndex() {
    const productList = document.getElementById('product-list');
    const announcementContent = document.querySelector('.announcement-content');
    const featuredSection = document.querySelector('.featured-product');
    
    // 1. Cargar Configuración (Anuncio y Mantenimiento)
    const settings = await fetchSiteSettings();
    
    if (settings.maintenance_mode === 'true') {
        const maintenancePage = document.getElementById('maintenancePage');
        const mainContent = document.getElementById('mainContent');
        if (maintenancePage && mainContent) {
            maintenancePage.classList.add('active');
            mainContent.style.display = 'none';
            return;
        }
    }

    if (announcementContent && settings.announcement_text) {
        announcementContent.style.setProperty('--text', `'${settings.announcement_text}'`);
    }

    // 2. Cargar Producto Destacado
    const featured = await fetchFeaturedProduct();
    if (featured && featuredSection) {
        featuredSection.innerHTML = `
            <div class="featured-inner">
                <div class="featured-image">
                    <img src="${featured.imagen}" alt="${featured.nombre}" />
                    <span class="badge-destacado">⭐ DESTACADO</span>
                </div>
                <div class="featured-info">
                    <h2>${featured.nombre}</h2>
                    <p class="featured-price">${formatBRL(featured.precio)}</p>
                    <p class="featured-description">${featured.descripcion}</p>
                    <div class="featured-actions">
                        <button onclick="agregar(${featured.id})" class="btn-add-cart">
                            🛒 Agregar al carrito
                        </button>
                        <a href="productos.html" class="btn-ver-mas">Ver más productos</a>
                    </div>
                    <p class="featured-stock">📦 Stock disponible: ${featured.stock} unidades</p>
                </div>
            </div>
        `;
    }

    // 3. Cargar Lista de Productos
    if (productList) {
        const products = await fetchProducts();
        productList.innerHTML = products.map(p => `
            <div class="producto-card">
                <div class="producto-img">
                    <img src="${p.imagen}" alt="${p.nombre}">
                </div>
                <div class="producto-info">
                    <h4>${p.nombre}</h4>
                    <p class="categoria">${p.categoria}</p>
                    <p class="precio">${formatBRL(p.precio)}</p>
                    <button onclick="agregar(${p.id})" class="btn-add">Agregar</button>
                    <a href="detalle-producto.html?id=${p.id}" class="btn-detalles">Ver detalles</a>
                </div>
            </div>
        `).join('');
    }
}

// Función para agregar al carrito (adaptada para Supabase)
async function agregar(id) {
    try {
        const { data: product, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        let cart = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
        const existing = cart.find(item => item.id === id);

        if (existing) {
            if (existing.cantidad < product.stock) {
                existing.cantidad++;
            } else {
                alert('No hay más stock disponible');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                categoria: product.categoria,
                stock: product.stock,
                cantidad: 1
            });
        }

        localStorage.setItem('flashbuy_cart', JSON.stringify(cart));
        alert('Producto agregado al carrito');
        
        // Si estamos en la página del carrito, refrescar
        if (window.renderCart) window.renderCart();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar anuncio en todas las páginas
    const announcementContent = document.getElementById('announcement-content');
    if (announcementContent) {
        const { data } = await window.supabaseClient.from('site_settings').select('value').eq('key', 'announcement_text').single();
        if (data) {
            announcementContent.style.setProperty('--text', `'${data.value}'`);
        }
    }

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        renderIndex();
    } else if (window.location.pathname.endsWith('productos.html')) {
        renderProductsPage();
    }
});

async function renderProductsPage() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');

    let query = window.supabase.from('products').select('*');
    if (categoria) {
        query = query.eq('categoria', categoria);
    }

    const { data: products, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading products:', error);
        return;
    }

    productList.innerHTML = products.map(p => `
        <div class="producto-card">
            <div class="producto-img">
                <img src="${p.imagen}" alt="${p.nombre}">
            </div>
            <div class="producto-info">
                <h4>${p.nombre}</h4>
                <p class="categoria">${p.categoria}</p>
                <p class="precio">${formatBRL(p.precio)}</p>
                <button onclick="agregar(${p.id})" class="btn-add">Agregar</button>
                <a href="detalle-producto.html?id=${p.id}" class="btn-detalles">Ver detalles</a>
            </div>
        </div>
    `).join('');
}

window.agregar = agregar;
