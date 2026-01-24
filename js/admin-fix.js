/**
 * ADMIN FIX SCRIPT - FlashBuy
 * Este script fuerza la activación de los menús y corrige errores de carga.
 */

(function() {
    console.log("🚀 Aplicando parches de seguridad y navegación...");

    // 1. Asegurar que la sesión sea válida
    const sessionRaw = localStorage.getItem('flashbuy_admin_session');
    if (!sessionRaw) {
        console.warn("No hay sesión, redirigiendo...");
        window.location.href = 'admin-login.html';
        return;
    }

    const session = JSON.parse(sessionRaw);

    // 2. Forzar que el rol sea 'owner' si es DATA001 para desbloquear todo
    if (session.id === 'DATA001') {
        session.role = 'owner';
        localStorage.setItem('flashbuy_admin_session', JSON.stringify(session));
    }

    // 3. Función para cambiar de sección (Desbloqueo de menús)
    window.showSection = function(sectionId) {
        console.log("Cambiando a sección:", sectionId);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        // Mostrar la seleccionada
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
        } else {
            console.error("Sección no encontrada:", sectionId);
        }

        // Actualizar menú lateral
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        const activeMenu = document.querySelector([onclick="showSection('${sectionId}')"]);
        if (activeMenu) activeMenu.classList.add('active');
    };

    // 4. Re-vincular clics en el menú lateral al cargar
    window.addEventListener('DOMContentLoaded', () => {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const section = item.getAttribute('data-section');
            if (section) {
                item.onclick = () => showSection(section);
            }
        });

        // Mostrar dashboard por defecto
        showSection('dashboard');
    });

    // 5. Parche para botones que no responden
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.menu-item');
        if (btn && !btn.onclick) {
            const section = btn.getAttribute('data-section');
            if (section) showSection(section);
        }
    });

})();