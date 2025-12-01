// tracking.js - Sistema de tracking de visitantes y comportamiento

// ============================================
// TRACKING DE VISITANTES
// ============================================

(function() {
  'use strict';
  
  let analyticsData = JSON.parse(localStorage.getItem('flashbuy_analytics') || '{}');
  
  // Inicializar estructura si no existe
  if (!analyticsData.visitantes) analyticsData.visitantes = [];
  if (!analyticsData.productosVendidos) analyticsData.productosVendidos = [];
  if (!analyticsData.productosClickeados) analyticsData.productosClickeados = {};
  if (!analyticsData.carritoAgregados) analyticsData.carritoAgregados = {};
  if (!analyticsData.carritoRemovidos) analyticsData.carritoRemovidos = {};
  if (!analyticsData.ventasPorHora) analyticsData.ventasPorHora = Array(24).fill(0);
  
  // ============================================
  // DETECTAR INFORMACIÓN DEL VISITANTE
  // ============================================
  
  async function obtenerInfoVisitante() {
    try {
      // Intentar obtener ubicación por IP usando API gratuita
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        ip: data.ip || generarIPSimulada(),
        pais: data.country_name || 'Desconocido',
        bandera: obtenerBandera(data.country_code || 'XX'),
        ciudad: data.city || 'Desconocida',
        fecha: new Date().toISOString(),
        paginasVistas: 1,
        duracion: '< 1min'
      };
    } catch (error) {
      // Si falla la API, usar datos simulados
      console.log('Error al obtener ubicación, usando datos simulados');
      return {
        ip: generarIPSimulada(),
        pais: 'Brasil',
        bandera: '🇧🇷',
        ciudad: 'São Paulo',
        fecha: new Date().toISOString(),
        paginasVistas: 1,
        duracion: '< 1min'
      };
    }
  }
  
  function generarIPSimulada() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }
  
  function obtenerBandera(countryCode) {
    const flags = {
      'BR': '🇧🇷', 'CO': '🇨🇴', 'MX': '🇲🇽', 'AR': '🇦🇷', 'ES': '🇪🇸',
      'US': '🇺🇸', 'CL': '🇨🇱', 'PE': '🇵🇪', 'VE': '🇻🇪', 'EC': '🇪🇨',
      'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴', 'CR': '🇨🇷', 'PA': '🇵🇦',
      'XX': '🌍'
    };
    return flags[countryCode] || '🌍';
  }
  
  // ============================================
  // REGISTRAR VISITA
  // ============================================
  
  async function registrarVisita() {
    // Verificar si ya se registró en esta sesión
    const sessionKey = 'flashbuy_session_' + new Date().toDateString();
    if (sessionStorage.getItem(sessionKey)) {
      return; // Ya se registró hoy
    }
    
    const infoVisitante = await obtenerInfoVisitante();
    
    // Agregar a analytics
    analyticsData.visitantes.push(infoVisitante);
    
    // Registrar hora de visita
    const hora = new Date().getHours();
    analyticsData.ventasPorHora[hora]++;
    
    // Guardar
    localStorage.setItem('flashbuy_analytics', JSON.stringify(analyticsData));
    sessionStorage.setItem(sessionKey, 'true');
    
    console.log('✅ Visita registrada:', infoVisitante);
  }
  
  // ============================================
  // TRACKING DE CLICKS EN PRODUCTOS
  // ============================================
  
  function trackProductClick(productId) {
    if (!analyticsData.productosClickeados[productId]) {
      analyticsData.productosClickeados[productId] = 0;
    }
    analyticsData.productosClickeados[productId]++;
    localStorage.setItem('flashbuy_analytics', JSON.stringify(analyticsData));
    console.log(`📊 Click registrado en producto ${productId}`);
  }
  
  // ============================================
  // TRACKING DE CARRITO
  // ============================================
  
  function trackCarritoAgregado(productId) {
    if (!analyticsData.carritoAgregados[productId]) {
      analyticsData.carritoAgregados[productId] = 0;
    }
    analyticsData.carritoAgregados[productId]++;
    localStorage.setItem('flashbuy_analytics', JSON.stringify(analyticsData));
    console.log(`🛒 Producto ${productId} agregado al carrito`);
  }
  
  function trackCarritoRemovido(productId) {
    if (!analyticsData.carritoRemovidos[productId]) {
      analyticsData.carritoRemovidos[productId] = 0;
    }
    analyticsData.carritoRemovidos[productId]++;
    localStorage.setItem('flashbuy_analytics', JSON.stringify(analyticsData));
    console.log(`🗑️ Producto ${productId} removido del carrito`);
  }
  
  // ============================================
  // TRACKING DE VENTAS
  // ============================================
  
  function trackVenta(productId, cantidad) {
    analyticsData.productosVendidos.push({
      productoId: productId,
      cantidad: cantidad,
      fecha: new Date().toISOString()
    });
    localStorage.setItem('flashbuy_analytics', JSON.stringify(analyticsData));
    console.log(`💰 Venta registrada: Producto ${productId}, Cantidad ${cantidad}`);
  }
  
  // ============================================
  // INTEGRAR CON FUNCIONES EXISTENTES
  // ============================================
  
  // Sobrescribir función agregar del productos.js
  window.addEventListener('load', function() {
    // Registrar visita al cargar la página
    registrarVisita();
    
    // Interceptar clicks en productos (si estamos en detalle-producto.html)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId && window.location.pathname.includes('detalle-producto')) {
      trackProductClick(parseInt(productId));
    }
    
    // Monitorear clicks en la galería de productos
    document.addEventListener('click', function(e) {
      const productoCard = e.target.closest('.producto');
      if (productoCard) {
        // Intentar extraer ID del producto desde el onclick del botón
        const button = productoCard.querySelector('button[onclick]');
        if (button) {
          const match = button.getAttribute('onclick').match(/agregar\((\d+)\)/);
          if (match) {
            const prodId = parseInt(match[1]);
            trackProductClick(prodId);
          }
        }
      }
    });
  });
  
  // Sobrescribir función agregar original
  const originalAgregar = window.agregar;
  if (originalAgregar) {
    window.agregar = function(id) {
      trackCarritoAgregado(id);
      return originalAgregar(id);
    };
  }
  
  // Monitorear función removeItem del carrito
  const originalRemoveItem = window.removeItem;
  if (originalRemoveItem) {
    window.removeItem = function(index) {
      const carrito = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');
      if (carrito[index]) {
        trackCarritoRemovido(carrito[index].id);
      }
      return originalRemoveItem(index);
    };
  }
  
  // Exponer funciones globalmente para uso manual
  window.flashbuyTracking = {
    trackProductClick: trackProductClick,
    trackCarritoAgregado: trackCarritoAgregado,
    trackCarritoRemovido: trackCarritoRemovido,
    trackVenta: trackVenta,
    registrarVisita: registrarVisita
  };
  
})();

// ============================================
// INSTRUCCIONES DE USO
// ============================================

/*
PARA TRACKEAR VENTAS MANUALMENTE:

Cuando se complete una venta (después de confirmar en WhatsApp o en tu proceso de pago):

window.flashbuyTracking.trackVenta(productoId, cantidad);

Ejemplo:
window.flashbuyTracking.trackVenta(2, 3); // Producto ID 2, cantidad 3

PARA TRACKEAR EVENTOS PERSONALIZADOS:

window.flashbuyTracking.trackProductClick(productoId);
window.flashbuyTracking.trackCarritoAgregado(productoId);
window.flashbuyTracking.trackCarritoRemovido(productoId);
*/
