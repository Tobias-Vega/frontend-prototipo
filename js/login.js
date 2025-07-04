function showMessage(text, isError = false) {
  const el = document.getElementById('message');
  el.innerText = text;
  el.className = isError ? 'error' : 'success';
}

async function loginUser() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showMessage('Completa email y contraseña.', true);
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      // Si es por email no verificado, reenviamos OTP y redirigimos
      if (err.message === 'Debes verficar tu cuenta antes de iniciar sesión') {
        showMessage('Tu email no está verificado. Reenviando código…');
        // Llamada al endpoint de generación de OTP
        await fetch('http://localhost:3000/api/user/verification-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        setTimeout(() => {
          window.location.href = 'verify.html';
        }, 1500);
        return;
      }
      // cualquier otro error
      throw new Error(err.message || 'Credenciales inválidas');
    }

    // Login OK
    const data = await res.json();
    showMessage('¡Inicio de sesión exitoso! Redirigiendo al dashboard…');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);

  } catch (error) {
    showMessage(error.message, true);
  }
}