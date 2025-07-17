/**
 * SISTEMA DE LOGIN PARA PAPELERÍA - ADMINISTRADORES
 * Usuarios predefinidos:
 * - Usuario: andres / Contraseña: P@peleria2023
 * - Usuario: diana / Contraseña: D1@n4Adm1n
 */

document.addEventListener('DOMContentLoaded', function() {
    // ================== CONFIGURACIÓN ================== //
    const MAX_ATTEMPTS = 3; // Intentos antes de bloquear
    const LOCK_TIME = 30000; // 30 segundos de bloqueo
    let attempts = 0; // Contador de intentos
    let isLocked = false; // Estado de bloqueo

    // 🔐 BASE DE DATOS DE USUARIOS (En producción esto iría en el backend)
    const adminUsers = {
        'andres': {
            password: 'P@peleria2023', // Contraseña en texto plano solo para demo
            name: 'Andrés Otavo',
            role: 'Super Administrador'
        },
        'diana': {
            password: 'D1@n4Adm1n', // Contraseña en texto plano solo para demo
            name: 'Diana',
            role: 'Administradora'
        }
    };

    // ================== ELEMENTOS HTML ================== //
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordBtn = document.querySelector('.show-password');
    const notification = document.getElementById('notification');
    const loginBtn = document.querySelector('.login-btn');

    // ================== FUNCIONALIDADES ================== //

    // 👁️ Mostrar/ocultar contraseña
    showPasswordBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    // 🔒 Bloquear sistema temporalmente
    function lockSystem() {
        isLocked = true;
        loginBtn.disabled = true;
        loginBtn.innerHTML = `Sistema bloqueado (${LOCK_TIME/1000}s)`;
        
        setTimeout(() => {
            isLocked = false;
            attempts = 0;
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Acceder</span><div class="btn-shine"></div>';
            showNotification('Puede intentar nuevamente', 'info');
        }, LOCK_TIME);
    }

    // 📢 Mostrar notificaciones
    function showNotification(message, type = 'error') {
        notification.textContent = message;
        notification.className = 'notification show';
        
        // Colores según tipo
        const colors = {
            error: '#ef233c',
            success: '#4cc9f0',
            warning: '#ffbe0b',
            info: '#4361ee'
        };
        notification.style.backgroundColor = colors[type];
        
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    // ================== VALIDACIÓN DE LOGIN ================== //
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar si el sistema está bloqueado
        if (isLocked) {
            showNotification(`Espere ${LOCK_TIME/1000} segundos para reintentar`, 'warning');
            return;
        }

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        // Validar campos vacíos
        if (!username || !password) {
            showNotification('Ingrese usuario y contraseña', 'warning');
            return;
        }

        // Verificar credenciales
        if (adminUsers[username] && adminUsers[username].password === password) {
            // ✅ Login exitoso
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            
            // Simular proceso de autenticación
            setTimeout(() => {
                showNotification(
                    `Bienvenido/a ${adminUsers[username].name} (${adminUsers[username].role})`, 
                    'success'
                );
                loginBtn.innerHTML = '<i class="fas fa-check-circle"></i> Redirigiendo...';
                
                // Simular redirección (en producción sería window.location.href)
                setTimeout(() => {
                    loginForm.reset();
                    loginBtn.innerHTML = '<span>Acceder</span><div class="btn-shine"></div>';
                    
                    // Aquí iría la redirección real:
                    // Dentro de la validación exitosa del login:
if (adminUsers[username] && adminUsers[username].password === password) {
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    
    setTimeout(() => {
        // Redirigir según el usuario
        if (username === 'andres') {
            window.location.href = 'Admin/Andres.html';
        } else {
            window.location.href = 'Admin/Diana.html';
        }
    }, 1500);
}
                    // window.location.href = 'panel-admin.html';
                }, 1500);
            }, 1000);
            
        } else {
            // ❌ Login fallido
            attempts++;
            const remainingAttempts = MAX_ATTEMPTS - attempts;
            
            if (remainingAttempts > 0) {
                showNotification(
                    `Credenciales incorrectas. ${remainingAttempts} intento(s) restante(s)`, 
                    'error'
                );
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            } else {
                showNotification('Cuenta bloqueada temporalmente por seguridad', 'error');
                lockSystem();
            }
        }
    });

    // Auto-corrección: forzar minúsculas en usuario
    usernameInput.addEventListener('input', function() {
        this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '');
    });
});