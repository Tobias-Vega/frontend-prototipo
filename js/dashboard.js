function showError(text) {
  document.getElementById('message').innerText = text;
}

async function checkAuth() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/check-status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // <--- Muy importante para enviar la cookie HttpOnly
    });

    if (!res.ok) {
      // Si no está autenticado (401 o 403), redirigir a login
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();
    // data trae { auth_token, name, email, roles, … }
    const nombre = data.name || data.email || 'Usuario';
    console.log(data.name);
    document.getElementById('welcome').innerText = `¡Bienvenido, ${nombre}!`;
  } catch (error) {
    // Si hay error de red o similar, redirigir de todas formas
    window.location.href = 'login.html';
  }
}

async function logout() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error cerrando sesión');
    }

    // El backend ya borró la cookie, volvemos a login
    window.location.href = 'login.html';
  } catch (error) {
    showError(error.message);
  }
}

// Al cargar, valida la cookie + token
window.onload = checkAuth;
