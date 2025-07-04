function showMessage(text, isError = false) {
  const el = document.getElementById('message');
  el.innerText = text;
  el.className = isError ? 'error' : 'success';
}

document.getElementById('btn-verify').addEventListener('click', async () => {
  const otp = document.getElementById('otp').value.trim();
  if (otp.length !== 6) {
    showMessage('Ingresa un código de 6 dígitos.', true);
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/user/verify/${otp}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Código inválido');
    }
    const data = await res.json();
    if (data.status === 'success') {
      showMessage('¡Email verificado! Redirigiendo al login...');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      throw new Error('Código incorrecto');
    }
  } catch (error) {
    showMessage(error.message, true);
  }
});

// Reenviar OTP
document.getElementById('btn-resend').addEventListener('click', async () => {
  try {
    const res = await fetch('http://localhost:3000/api/user/verification-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error reenviando código');
    }
    showMessage('Código reenviado. Revisa tu correo.');
  } catch (error) {
    showMessage(error.message, true);
  }
});
