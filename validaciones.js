document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const yearSpan = document.getElementById('year');
  const pw = document.getElementById('password');
  const pwBar = document.getElementById('pwBar');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  form.setAttribute('novalidate', '');

  const fields = {
    nombre: document.getElementById('nombre'),
    nacimiento: document.getElementById('nacimiento'),
    documento: document.getElementById('documento'),
    genero: document.getElementById('genero'),
    nacionalidad: document.getElementById('nacionalidad'),
    pais_entrega: document.getElementById('pais_entrega'),
    provincia: document.getElementById('provincia'),
    ciudad: document.getElementById('ciudad'),
    calle: document.getElementById('calle'),
    postal: document.getElementById('postal'),
    referencia: document.getElementById('referencia'),
    aceptaTerminos: document.getElementById('aceptaTerminos'),
    aceptaPrivacidad: document.getElementById('aceptaPrivacidad')
  };

  const categories = Array.from(document.querySelectorAll('input[name="cat"]'));
  const clientTypes = Array.from(document.querySelectorAll('input[name="tipo"]'));
  const referenciaCount = document.getElementById('referenciaCount');

  const regex = {
    name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,60}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    rut: /^[0-9]{7,8}$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
    phone: /^[\d+\-\s]+$/,
    city: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/,
    postal: /^[A-Za-z0-9]{4,10}$/
  };

  function clearErrors() {
    Object.values(fields).forEach((field) => {
      if (field) field.classList.remove('error');
    });
  }

  function markError(field) {
    if (field) field.classList.add('error');
  }

  function validateAge(value) {
    const dob = new Date(value);
    if (Number.isNaN(dob.getTime())) return false;
    const today = new Date();
    const diff = today.getTime() - dob.getTime();
    const age = diff / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }

  function validateRutRut(value) {
    if (!regex.rut.test(value)) return false;
    return true;
  }

  function countDigits(value) {
    return value.replace(/\D/g, '').length;
  }

  function validateEmailMatch(email, email2) {
    return email === email2;
  }

  function validatePasswordMatch(password, password2) {
    return password === password2;
  }

  function validatePhone(value) {
    return regex.phone.test(value) && countDigits(value) >= 8;
  }

  function validateCity(value) {
    return regex.city.test(value.trim());
  }

  function validatePostal(value) {
    return regex.postal.test(value.trim());
  }

  function validateReference(value) {
    return !value || value.length <= 200;
  }

  function hasSelectedCategory() {
    return categories.some((checkbox) => checkbox.checked);
  }

  function hasSelectedClientType() {
    return clientTypes.some((radio) => radio.checked);
  }

  if (pw && pwBar) {
    pw.addEventListener('input', () => {
      const val = pw.value;
      let score = 0;
      if (val.length >= 8) score += 30;
      if (/[A-Z]/.test(val)) score += 20;
      if (/[0-9]/.test(val)) score += 25;
      if (/[!@#$%^&*]/.test(val)) score += 25;
      const width = Math.min(100, score);
      pwBar.style.width = width + '%';
      if (width < 40) pwBar.style.background = '#ff4d4f';
      else if (width < 70) pwBar.style.background = '#ff8a00';
      else pwBar.style.background = '#16a34a';
    });
  }

  form.addEventListener('submit', (event) => {
    clearErrors();
    const errors = [];

    const nombre = fields.nombre?.value.trim() || '';
    const nacimiento = fields.nacimiento?.value || '';
    const documento = fields.documento?.value.trim() || '';
    const genero = fields.genero?.value || '';
    const nacionalidad = fields.nacionalidad?.value || '';
    const paisEntrega = fields.pais_entrega?.value || '';
    const provincia = fields.provincia?.value.trim() || '';
    const ciudad = fields.ciudad?.value.trim() || '';
    const calle = fields.calle?.value.trim() || '';
    const postal = fields.postal?.value.trim() || '';
    const referencia = fields.referencia?.value.trim() || '';
    const email = fields.email?.value.trim() || '';
    const email2 = fields.email2?.value.trim() || '';
    const password = fields.password?.value || '';
    const password2 = fields.password2?.value || '';

    if (!regex.name.test(nombre)) {
      errors.push('Nombre completo: solo letras y espacios, entre 3 y 60 caracteres.');
      markError(fields.nombre);
    }

    if (!validateAge(nacimiento)) {
      errors.push('Debes ser mayor de 18 años para registrarte.');
      markError(fields.nacimiento);
    }

    if (!validateRutRut(documento)) {
      errors.push('RUT inválido: debe tener solo números y entre 7 y 8 dígitos.');
      markError(fields.documento);
    }

    if (!genero) {
      errors.push('Selecciona una opción de género.');
      markError(fields.genero);
    }

    if (!nacionalidad) {
      errors.push('Selecciona tu nacionalidad.');
      markError(fields.nacionalidad);
    }

    if (!paisEntrega) {
      errors.push('Selecciona el país de entrega.');
      markError(fields.pais_entrega);
    }

    if (provincia.length < 1) {
      errors.push('La provincia o estado no puede estar vacío.');
      markError(fields.provincia);
    }

    if (!validateCity(ciudad)) {
      errors.push('Ciudad inválida: solo letras y espacios, mínimo 2 caracteres.');
      markError(fields.ciudad);
    }

    if (calle.length < 5) {
      errors.push('Calle y número: mínimo 5 caracteres.');
      markError(fields.calle);
    }

    if (!validatePostal(postal)) {
      errors.push('Código postal inválido: solo caracteres alfanuméricos entre 4 y 10.');
      markError(fields.postal);
    }

    if (!validateReference(referencia)) {
      errors.push('Referencia no puede superar los 200 caracteres.');
      markError(fields.referencia);
    }

    if (!regex.email.test(email)) {
      errors.push('Correo electrónico inválido.');
      markError(fields.email);
    }

    if (!validateEmailMatch(email, email2)) {
      errors.push('Los correos electrónicos deben coincidir exactamente.');
      markError(fields.email);
      markError(fields.email2);
    }

    if (!regex.password.test(password)) {
      errors.push('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.');
      markError(fields.password);
    }

    if (!validatePasswordMatch(password, password2)) {
      errors.push('Las contraseñas no coinciden.');
      markError(fields.password);
      markError(fields.password2);
    }

    if (!validatePhone(telefono)) {
      errors.push('Teléfono inválido: utiliza solo dígitos, +, - o espacios y al menos 8 dígitos.');
      markError(fields.telefono);
    }

    if (!hasSelectedCategory()) {
      errors.push('Selecciona al menos una categoría de interés.');
      categories.forEach((checkbox) => markError(checkbox));
    }

    if (!hasSelectedClientType()) {
      errors.push('Selecciona un tipo de cliente.');
      clientTypes.forEach((radio) => markError(radio));
    }

    if (!fields.aceptaTerminos?.checked) {
      errors.push('Debes aceptar los Términos y Condiciones.');
      markError(fields.aceptaTerminos);
    }

    if (!fields.aceptaPrivacidad?.checked) {
      errors.push('Debes aceptar la Política de Privacidad.');
      markError(fields.aceptaPrivacidad);
    }

    if (errors.length > 0) {
      event.preventDefault();
      alert(errors.join('\n'));
    }
  });
});
