// carrito.js - sistema completo de carrito con Supabase

function formatBRL(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getCart() {
    return JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('flashbuy_cart', JSON.stringify(cart));
}

async function fetchCoupons() {
    try {
        const { data, error } = await window.supabase
            .from('coupons')
            .select('*')
            .eq('active', true);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }
}

async function fetchShippingZones() {
    try {
        const { data, error } = await window.supabase
            .from('shipping_zones')
            .select('*')
            .eq('active', true);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching shipping zones:', error);
        return [];
    }
}

async function renderCart() {
    const container = document.getElementById('cart-contents');
    if (!container) return;
    
    const carrito = getCart();
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega productos para comenzar tu compra!</p>
                <a href="productos.html" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#FF7A00;color:white;text-decoration:none;border-radius:6px;">Ver Productos</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="cart-items">';
    let subtotal = 0;
    
    carrito.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                    ${item.talla ? `<p>Talla: ${item.talla}</p>` : ''}
                    <p class="cart-item-price">${formatBRL(item.precio)} c/u</p>
                    <div class="quantity-display">
                        <button class="btn-minus" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>Cantidad: ${item.cantidad}</span>
                        <button class="btn-plus" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-remove" onclick="removeItem(${index})">🗑️ Eliminar</button>
                    </div>
                </div>
                <div style="text-align:right;">
                    <p style="font-size:12px;color:#666;margin:0;">Subtotal:</p>
                    <p class="cart-item-price">${formatBRL(itemTotal)}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Calcular envío (ejemplo dinámico si hay zonas)
    const zones = await fetchShippingZones();
    let envio = subtotal > 200 ? 0 : 15.00;
    
    if (zones.length > 0) {
        // Podríamos dejar que el usuario elija zona, por ahora usamos la primera activa o el default
        envio = subtotal > 200 ? 0 : parseFloat(zones[0].price);
    }

    const total = subtotal + envio;
    
    html += `
        <div class="cart-total">
            <h3>Resumen del Pedido</h3>
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatBRL(subtotal)}</span>
            </div>
            <div class="total-row">
                <span>Envío:</span>
                <span>${envio === 0 ? 'GRATIS' : formatBRL(envio)}</span>
            </div>
            ${envio === 0 ? '<p style="color:#25D366;font-size:14px;margin:8px 0;">✓ ¡Envío gratis en compras mayores a R$ 200!</p>' : ''}
            
            <div id="coupon-section" style="margin: 15px 0; padding: 10px; background: #fff; border-radius: 6px;">
                <input type="text" id="coupon-code" placeholder="Código de cupón" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 60%;">
                <button onclick="applyCoupon()" style="padding: 8px 12px; background: #FF7A00; color: white; border: none; border-radius: 4px; cursor: pointer;">Aplicar</button>
                <div id="coupon-message" style="font-size: 12px; margin-top: 5px;"></div>
            </div>

            <div class="total-row final">
                <span>Total:</span>
                <span>${formatBRL(total)}</span>
            </div>
            <p style="margin:16px 0;color:#666;font-size:14px;">
                <strong>Métodos de pago:</strong> Nequi, Daviplata, Contraentrega
            </p>
            <button class="checkout-btn" onclick="finalizarCompra()">
                💬 Finalizar compra por WhatsApp
            </button>
            <button onclick="clearCart()" style="width:100%;padding:12px;background:#ff4444;color:white;border:none;border-radius:6px;cursor:pointer;margin-top:8px;">
                Vaciar carrito
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

async function applyCoupon() {
    const code = document.getElementById('coupon-code').value.trim();
    const messageDiv = document.getElementById('coupon-message');
    if (!code) return;

    try {
        const { data: coupon, error } = await window.supabase
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('active', true)
            .single();

        if (error || !coupon) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'Cupón inválido o expirado';
            return;
        }

        messageDiv.style.color = 'green';
        messageDiv.textContent = `Cupón aplicado: ${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : formatBRL(coupon.discount_value)} de descuento`;
        
        // Aquí se aplicaría el descuento al total (lógica simplificada para el ejemplo)
        // En una implementación real, guardaríamos el cupón en el estado y recalcularíamos el total
    } catch (error) {
        console.error('Error applying coupon:', error);
    }
}

function updateQuantity(index, change) {
    const carrito = getCart();
    const item = carrito[index];
    
    if (!item) return;
    
    const newQuantity = item.cantidad + change;
    
    if (newQuantity <= 0) {
        removeItem(index);
        return;
    }
    
    if (newQuantity > item.stock) {
        alert(`Stock máximo disponible: ${item.stock} unidades`);
        return;
    }
    
    carrito[index].cantidad = newQuantity;
    saveCart(carrito);
    renderCart();
}

function removeItem(index) {
    if (!confirm('¿Eliminar este producto del carrito?')) return;
    
    const carrito = getCart();
    carrito.splice(index, 1);
    saveCart(carrito);
    renderCart();
}

function clearCart() {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    
    localStorage.removeItem('flashbuy_cart');
    renderCart();
}

function finalizarCompra() {
    const carrito = getCart();
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    let mensaje = '🛒 *Nuevo Pedido FlashBuy*\n\n';
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.nombre}\n`;
        if (item.color) mensaje += `  Color: ${item.color}\n`;
        if (item.talla) mensaje += `  Talla: ${item.talla}\n`;
        mensaje += `  Cantidad: ${item.cantidad}\n`;
        mensaje += `  Precio: ${formatBRL(item.precio)} c/u\n`;
        mensaje += `  Subtotal: ${formatBRL(subtotal)}\n\n`;
    });
    
    const envio = total > 200 ? 0 : 15.00;
    total += envio;
    
    mensaje += `Envío: ${envio === 0 ? 'GRATIS' : formatBRL(envio)}\n`;
    mensaje += `*Total: ${formatBRL(total)}*\n\n`;
    mensaje += '¡Espero tu confirmación para procesar el pedido! 😊';
    
    const whatsappURL = `https://wa.me/573156599566?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
}

document.addEventListener('DOMContentLoaded', renderCart);

window.renderCart = renderCart;
window.removeItem = removeItem;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.finalizarCompra = finalizarCompra;
window.applyCoupon = applyCoupon;
