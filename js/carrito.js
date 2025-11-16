
// carrito.js - simple cart renderer (updated)
function formatBRL(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function renderCart() {
    const cont = document.getElementById('cart-contents');
    const carrito = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
    if(!cont) return;
    if(carrito.length === 0) {
        cont.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }
    let html = '<ul style="list-style:none;padding:0;">';
    let total = 0;
    carrito.forEach((it, i) => {
        html += `<li style="margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:12px;">
            <strong>${it.nombre}</strong><br>${formatBRL(it.precio)} x ${it.cantidad}
            <div style="margin-top:6px;">
              <button onclick="removeItem(${i})">Eliminar</button>
            </div>
        </li>`;
        total += it.precio * it.cantidad;
    });
    html += '</ul><p><strong>Total: ' + formatBRL(total) + '</strong></p>';
    html += '<p>Para finalizar tu pedido, contáctanos por <a href="https://wa.me/5511999999999">WhatsApp</a> o integra Mercado Pago.</p>';
    cont.innerHTML = html;
}
function removeItem(index) {
    const carrito = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
    carrito.splice(index,1);
    localStorage.setItem('flashbuy_cart', JSON.stringify(carrito));
    renderCart();
}
document.addEventListener('DOMContentLoaded', renderCart);
