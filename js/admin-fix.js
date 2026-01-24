/**
 * ADMIN FIX SCRIPT - FlashBuy (FINAL)
 */

(function () {

  const sessionRaw = localStorage.getItem('flashbuy_admin_session');

  // Si NO hay sesión → login
  if (!sessionRaw) {
    window.location.href = 'admin-login.html';
    return;
  }

  const session = JSON.parse(sessionRaw);

  // Forzar OWNER para DATA001
  if (session.id === 'DATA001') {
    session.role = 'owner';
    localStorage.setItem('flashbuy_admin_session', JSON.stringify(session));
  }

  // Navegación
  window.showSection = function (sectionId) {
    document.querySelectorAll('.section')
      .forEach(s => s.classList.remove('active'));

    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.menu-item')
      .forEach(m => m.classList.remove('active'));

    const active = document.querySelector(`[data-section="${sectionId}"]`);
    if (active) active.classList.add('active');
  };

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-item').forEach(item => {
      const section = item.dataset.section;
      if (section) item.onclick = () => showSection(section);
    });

    showSection('dashboard');
  });

})();
