function showMessage(text, isError = false) {
  const el = document.getElementById('message');
  el.innerText = text;
  el.className = isError ? 'error' : 'success';
}

async function registerUser() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    showMessage('Completa nombre, email y contraseña.', true);
    return;
  }

  try {
    // 1) Registro
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al registrar');
    }

    // 2) Generar OTP (backend en /api/user/verification-otp requiere auth)
    const otpRes = await fetch('http://localhost:3000/api/user/verification-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!otpRes.ok) {
      const err = await otpRes.json();
      throw new Error(err.message || 'No se pudo enviar el código de verificación');
    }

    // 3) Redirigir a página de verificación
    window.location.href = 'verify.html';
  } catch (error) {
    showMessage(error.message, true);
  }
}