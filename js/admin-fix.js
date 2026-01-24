/**
 * ADMIN FIX SCRIPT - FlashBuy
 * Script corregido y estable
 */

(function () {
  console.log("🚀 Admin Fix cargado correctamente");

  // 1. Verificar sesión
  const sessionRaw = localStorage.getItem('flashbuy_admin_session');

  if (!sessionRaw) {
    window.location.href = 'admin-login.html';
    return;
  }

  let session;
  try {
    session = JSON.parse(sessionRaw);
  } catch (e) {
    localStorage.removeItem('flashbuy_admin_session');
    window.location.href = 'admin-login.html';
    return;
  }

  // 2. Forzar rol owner solo para DATA001
  if (session.id === 'DATA001' && session.name === 'DATA001') {
    session.role = 'owner';
    localStorage.setItem('flashbuy_admin_session', JSON.stringify(session));
  }

  // 3. Función global para mostrar secciones
  window.showSection = function (sectionId) {
    console.log("Mostrando sección:", sectionId);

    document.querySelectorAll('.section').forEach(sec =>
      sec.classList.remove('active')
    );

    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
    }

    document.querySelectorAll('.menu-item').forEach(item =>
      item.classList.remove('active')
    );

    const activeMenu = document.querySelector(
      `.menu-item[data-section="${sectionId}"]`
    );
    if (activeMenu) activeMenu.classList.add('active');
  };

  // 4. Activar menú al cargar
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-item').forEach(item => {
      const section = item.getAttribute('data-section');
      if (section) {
        item.addEventListener('click', () => showSection(section));
      }
    });

    // Sección por defecto
    showSection('dashboard');
  });

})();
