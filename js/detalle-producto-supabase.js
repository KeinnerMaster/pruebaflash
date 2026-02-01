// detalle-producto.js - Gestión de la página de detalle del producto con Supabase

let currentProduct = null;
let currentImageIndex = 0;
let selectedColor = null;
let selectedSize = null;
let quantity = 1;

// Función para obtener el ID del producto de la URL
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

// Función para formatear precio
function formatBRL(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Cargar información del producto desde Supabase
async function loadProductDetail() {
  const productId = getProductIdFromURL();
  
  if (!productId) {
    alert('Producto no encontrado');
    window.location.href = 'productos.html';
    return;
  }

  try {
    const { data: product, error } = await window.supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      throw new Error('Producto no encontrado');
    }

    currentProduct = product;

    // Actualizar breadcrumb
    document.getElementById('breadcrumb-categoria').href = `productos.html?categoria=${currentProduct.categoria}`;
    document.getElementById('breadcrumb-categoria').textContent = currentProduct.categoria;
    document.getElementById('breadcrumb-producto').textContent = currentProduct.nombre;

    // Actualizar información del producto
    document.getElementById('product-name').textContent = currentProduct.nombre;
    document.getElementById('product-price').textContent = formatBRL(currentProduct.precio);
    document.getElementById('product-category').textContent = currentProduct.categoria;
    
    // Actualizar stock
    updateStockDisplay();

    // Cargar descripción
    document.getElementById('product-description').textContent = currentProduct.descripcion || '';

    // Cargar galería de imágenes
    loadGallery();

    // Cargar opciones (color, talla)
    loadOptions();

    // Cargar productos relacionados
    loadRelatedProducts();
  } catch (error) {
    console.error('Error loading product detail:', error);
    alert('Error al cargar el producto');
    window.location.href = 'productos.html';
  }
}

// Cargar galería de imágenes
function loadGallery() {
  const images = currentProduct.imagenes && currentProduct.imagenes.length > 0 
    ? currentProduct.imagenes 
    : [currentProduct.imagen];
  
  // Imagen principal
  document.getElementById('main-image').src = images[0];
  document.getElementById('main-image').alt = currentProduct.nombre;

  // Miniaturas
  const thumbnailContainer = document.getElementById('thumbnail-gallery');
  thumbnailContainer.innerHTML = '';

  images.forEach((img, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
    thumbnail.innerHTML = `<img src="${img}" alt="${currentProduct.nombre} - Imagen ${index + 1}">`;
    thumbnail.onclick = () => selectImage(index);
    thumbnailContainer.appendChild(thumbnail);
  });
}

// Seleccionar imagen
function selectImage(index) {
  const images = currentProduct.imagenes && currentProduct.imagenes.length > 0 
    ? currentProduct.imagenes 
    : [currentProduct.imagen];
  currentImageIndex = index;
  
  document.getElementById('main-image').src = images[index];
  
  // Actualizar miniaturas activas
  document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

// Cargar opciones del producto (colores, tallas)
function loadOptions() {
  // Colores
  if (currentProduct.colores && currentProduct.colores.length > 0) {
    document.getElementById('color-selector-group').style.display = 'block';
    const colorContainer = document.getElementById('color-options');
    colorContainer.innerHTML = '';

    currentProduct.colores.forEach(color => {
      const colorOption = document.createElement('div');
      colorOption.className = 'color-option';
      colorOption.style.backgroundColor = color.hex;
      colorOption.title = color.nombre;
      colorOption.onclick = (e) => selectColor(color.nombre, e.target);
      colorContainer.appendChild(colorOption);
    });
  }

  // Tallas
  if (currentProduct.tallas && currentProduct.tallas.length > 0) {
    document.getElementById('size-selector-group').style.display = 'block';
    const sizeContainer = document.getElementById('size-options');
    sizeContainer.innerHTML = '';

    currentProduct.tallas.forEach(size => {
      const sizeOption = document.createElement('div');
      sizeOption.className = 'size-option';
      sizeOption.textContent = size;
      sizeOption.onclick = (e) => selectSize(size, e.target);
      sizeContainer.appendChild(sizeOption);
    });
  }
}

// Seleccionar color
function selectColor(colorName, element) {
  selectedColor = colorName;
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('selected');
  });
  element.classList.add('selected');
}

// Seleccionar talla
function selectSize(size, element) {
  selectedSize = size;
  document.querySelectorAll('.size-option').forEach(option => {
    option.classList.remove('selected');
  });
  element.classList.add('selected');
}

// Cambiar cantidad
function changeQuantity(change) {
  const input = document.getElementById('quantity-input');
  const newValue = quantity + change;
  
  if (newValue < 1) return;
  
  if (newValue > currentProduct.stock) {
    alert(`Stock máximo disponible: ${currentProduct.stock} unidades`);
    return;
  }
  
  quantity = newValue;
  input.value = quantity;
}

// Actualizar display de stock
function updateStockDisplay() {
  const stockElement = document.getElementById('product-stock');
  const stock = currentProduct.stock;
  
  if (stock > 20) {
    stockElement.className = 'product-stock';
    stockElement.textContent = `✓ En stock (${stock} unidades disponibles)`;
  } else if (stock > 0) {
    stockElement.className = 'product-stock low-stock';
    stockElement.textContent = `⚠️ ¡Últimas unidades! Solo quedan ${stock} disponibles`;
  } else {
    stockElement.className = 'product-stock out-of-stock';
    stockElement.textContent = '✕ Agotado';
  }
}

// Agregar al carrito
function addToCart() {
  if (currentProduct.stock === 0) {
    alert('Este producto está agotado');
    return;
  }

  // Validar opciones requeridas
  if (currentProduct.tallas && currentProduct.tallas.length > 0 && !selectedSize) {
    alert('Por favor selecciona una talla');
    return;
  }

  if (currentProduct.colores && currentProduct.colores.length > 0 && !selectedColor) {
    alert('Por favor selecciona un color');
    return;
  }

  // Obtener carrito actual
  let carrito = JSON.parse(localStorage.getItem('flashbuy_cart') || '[]');

  // Verificar stock disponible
  const existingItem = carrito.find(item => 
    item.id === currentProduct.id && 
    item.color === selectedColor && 
    item.talla === selectedSize
  );
  
  const currentQuantityInCart = existingItem ? existingItem.cantidad : 0;
  
  if (currentQuantityInCart + quantity > currentProduct.stock) {
    alert(`No puedes agregar más de ${currentProduct.stock} unidades al carrito`);
    return;
  }

  // Agregar o actualizar producto en el carrito
  if (existingItem) {
    existingItem.cantidad += quantity;
  } else {
    const cartItem = {
      id: currentProduct.id,
      nombre: currentProduct.nombre,
      precio: currentProduct.precio,
      imagen: currentProduct.imagen,
      categoria: currentProduct.categoria,
      stock: currentProduct.stock,
      cantidad: quantity
    };
    
    if (selectedColor) cartItem.color = selectedColor;
    if (selectedSize) cartItem.talla = selectedSize;
    
    carrito.push(cartItem);
  }

  // Guardar carrito
  localStorage.setItem('flashbuy_cart', JSON.stringify(carrito));
  alert('Producto agregado al carrito');
}

// Comprar ahora
function buyNow() {
  addToCart();
  setTimeout(() => {
    window.location.href = 'carrito.html';
  }, 100);
}

// Zoom de imagen
function openZoom() {
  const modal = document.getElementById('zoom-modal');
  const zoomImage = document.getElementById('zoom-image');
  const images = currentProduct.imagenes && currentProduct.imagenes.length > 0 
    ? currentProduct.imagenes 
    : [currentProduct.imagen];
  
  zoomImage.src = images[currentImageIndex];
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeZoom() {
  const modal = document.getElementById('zoom-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function prevImage() {
  const images = currentProduct.imagenes && currentProduct.imagenes.length > 0 
    ? currentProduct.imagenes 
    : [currentProduct.imagen];
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  selectImage(currentImageIndex);
  document.getElementById('zoom-image').src = images[currentImageIndex];
}

function nextImage() {
  const images = currentProduct.imagenes && currentProduct.imagenes.length > 0 
    ? currentProduct.imagenes 
    : [currentProduct.imagen];
  currentImageIndex = (currentImageIndex + 1) % images.length;
  selectImage(currentImageIndex);
  document.getElementById('zoom-image').src = images[currentImageIndex];
}

// Cargar productos relacionados
async function loadRelatedProducts() {
  const relatedContainer = document.getElementById('related-products-list');
  
  try {
    const { data: relatedProducts, error } = await window.supabase
      .from('products')
      .select('*')
      .eq('categoria', currentProduct.categoria)
      .neq('id', currentProduct.id)
      .limit(4);

    if (error) throw error;

    relatedContainer.innerHTML = '';

    if (!relatedProducts || relatedProducts.length === 0) {
      relatedContainer.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No hay productos relacionados disponibles.</p>';
      return;
    }

    relatedProducts.forEach(p => {
      const div = document.createElement("div");
      div.className = "producto-card";
      div.innerHTML = `
        <div class="producto-img">
            <img src="${p.imagen}" alt="${p.nombre}">
        </div>
        <div class="producto-info">
            <h4>${p.nombre}</h4>
            <p class="precio">${formatBRL(p.precio)}</p>
            <a href="detalle-producto.html?id=${p.id}" class="btn-detalles">Ver detalles</a>
        </div>
      `;
      relatedContainer.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading related products:', error);
  }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', loadProductDetail);

// Exponer funciones globalmente
window.selectImage = selectImage;
window.selectColor = selectColor;
window.selectSize = selectSize;
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.openZoom = openZoom;
window.closeZoom = closeZoom;
window.prevImage = prevImage;
window.nextImage = nextImage;
