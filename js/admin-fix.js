(function() {
    // Configuración
    const DASHBOARD_URL = 'admin-data001.html';
    const LOGIN_URL = 'admin-login.html';
    const SESSION_KEY = 'flashbuy_admin_session';
    // 1. Lógica de Redirección Inteligente
    const session = localStorage.getItem(SESSION_KEY);
    const path = window.location.pathname;
    
    // Si estamos en el login y hay sesión -> ir al dashboard
    if (path.includes(LOGIN_URL) && session) {
        window.location.href = DASHBOARD_URL;
    }
    
    // Si estamos en el dashboard y NO hay sesión -> ir al login
    if (path.includes(DASHBOARD_URL) && !session) {
        window.location.href = LOGIN_URL;
    }
    // 2. Lógica del Menú Lateral (Solo se ejecuta si existen los elementos)
    document.addEventListener('DOMContentLoaded', function() {
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.section');
        if (menuItems.length > 0) {
            menuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    // Si es un enlace real a otra página, dejamos que navegue
                    if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) return;
                    e.preventDefault();
                    
                    // Actualizar clase visual 'active'
                    menuItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    // Mostrar la sección correspondiente
                    const targetId = this.getAttribute('href')?.replace('#', '') || this.getAttribute('data-target');
                    if (targetId) {
                        sections.forEach(sec => {
                            sec.classList.remove('active');
                            if (sec.id === targetId) sec.classList.add('active');
                        });
                    }
                });
            });
        }
    });
})();