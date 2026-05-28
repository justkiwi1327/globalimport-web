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
    email: document.getElementById('email'),
    email2: document.getElementById('email2'),
    password: document.getElementById('password'),
    password2: document.getElementById('password2'),
    telefono: document.getElementById('telefono'),
    aceptaTerminos: document.getElementById('aceptaTerminos'),
    aceptaPrivacidad: document.getElementById('aceptaPrivacidad')
  };

  const categories = Array.from(document.querySelectorAll('input[name="cat"]'));
  const clientTypes = Array.from(document.querySelectorAll('input[name="tipo"]'));
  const referenciaCount = document.getElementById('referenciaCount');
  const successPanel = document.getElementById('successMessage');
  const successName = document.getElementById('successName');

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
    document.querySelectorAll('.campo-error, .campo-ok').forEach((field) => {
      field.classList.remove('campo-error', 'campo-ok');
    });
    document.querySelectorAll('.field-message').forEach((message) => {
      message.textContent = '';
    });
  }

  function getMessageNode(element) {
    if (!element) return null;
    const container = element.closest('.field') || element.parentElement;
    if (!container) return null;
    let msg = container.querySelector('.field-message');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'field-message';
      container.appendChild(msg);
    }
    return msg;
  }

  function showFieldError(field, message) {
    if (!field) return;
    field.classList.remove('campo-ok');
    field.classList.add('campo-error');
    const msg = getMessageNode(field);
    if (msg) msg.textContent = message;
  }

  function showFieldOk(field) {
    if (!field) return;
    field.classList.remove('campo-error');
    field.classList.add('campo-ok');
    const msg = getMessageNode(field);
    if (msg) msg.textContent = '';
  }

  function showGroupError(elements, message) {
    if (!elements || !elements.length) return;
    elements.forEach((field) => {
      field.classList.remove('campo-ok');
      field.classList.add('campo-error');
    });
    const container = elements[0].closest('.field') || elements[0].parentElement;
    if (container) {
      let msg = container.querySelector('.field-message');
      if (!msg) {
        msg = document.createElement('p');
        msg.className = 'field-message';
        container.appendChild(msg);
      }
      msg.textContent = message;
    }
  }

  function clearGroupFeedback(elements) {
    if (!elements || !elements.length) return;
    elements.forEach((field) => field.classList.remove('campo-error', 'campo-ok'));
    const container = elements[0].closest('.field') || elements[0].parentElement;
    if (container) {
      const msg = container.querySelector('.field-message');
      if (msg) msg.textContent = '';
    }
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
    return regex.rut.test(value);
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

  function validateNombre() {
    const value = fields.nombre?.value.trim() || '';
    if (!regex.name.test(value)) {
      showFieldError(fields.nombre, 'El nombre debe tener solo letras y espacios y entre 3 y 60 caracteres.');
      return false;
    }
    showFieldOk(fields.nombre);
    return true;
  }

  function validateNacimiento() {
    const value = fields.nacimiento?.value || '';
    if (!validateAge(value)) {
      showFieldError(fields.nacimiento, 'Debes ser mayor de 18 años para registrarte.');
      return false;
    }
    showFieldOk(fields.nacimiento);
    return true;
  }

  function validateDocumento() {
    const value = fields.documento?.value.trim() || '';
    if (!validateRutRut(value)) {
      showFieldError(fields.documento, 'RUT inválido: solo números y entre 7 y 8 dígitos.');
      return false;
    }
    showFieldOk(fields.documento);
    return true;
  }

  function validateGenero() {
    if (!fields.genero?.value) {
      showFieldError(fields.genero, 'Selecciona una opción de género.');
      return false;
    }
    showFieldOk(fields.genero);
    return true;
  }

  function validateNacionalidad() {
    if (!fields.nacionalidad?.value) {
      showFieldError(fields.nacionalidad, 'Selecciona tu nacionalidad.');
      return false;
    }
    showFieldOk(fields.nacionalidad);
    return true;
  }

  function validatePaisEntrega() {
    if (!fields.pais_entrega?.value) {
      showFieldError(fields.pais_entrega, 'Selecciona el país de entrega.');
      return false;
    }
    showFieldOk(fields.pais_entrega);
    return true;
  }

  function validateProvincia() {
    const value = fields.provincia?.value.trim() || '';
    if (!value) {
      showFieldError(fields.provincia, 'La provincia o estado no puede estar vacío.');
      return false;
    }
    showFieldOk(fields.provincia);
    return true;
  }

  function validateCiudad() {
    const value = fields.ciudad?.value.trim() || '';
    if (!validateCity(value)) {
      showFieldError(fields.ciudad, 'Ciudad inválida: solo letras y espacios, mínimo 2 caracteres.');
      return false;
    }
    showFieldOk(fields.ciudad);
    return true;
  }

  function validateCalle() {
    const value = fields.calle?.value.trim() || '';
    if (value.length < 5) {
      showFieldError(fields.calle, 'Calle y número: mínimo 5 caracteres.');
      return false;
    }
    showFieldOk(fields.calle);
    return true;
  }

  function validatePostalField() {
    const value = fields.postal?.value.trim() || '';
    if (!validatePostal(value)) {
      showFieldError(fields.postal, 'Código postal inválido: solo alfanumérico entre 4 y 10 caracteres.');
      return false;
    }
    showFieldOk(fields.postal);
    return true;
  }

  function validateReferenciaField() {
    const value = fields.referencia?.value || '';
    if (!validateReference(value)) {
      showFieldError(fields.referencia, 'Referencia no puede superar los 200 caracteres.');
      return false;
    }
    showFieldOk(fields.referencia);
    return true;
  }

  function validateEmailField() {
    const value = fields.email?.value.trim() || '';
    if (!regex.email.test(value)) {
      showFieldError(fields.email, 'El email no tiene un formato válido.');
      return false;
    }
    showFieldOk(fields.email);
    return true;
  }

  function validateEmail2Field() {
    const value = fields.email2?.value.trim() || '';
    if (!regex.email.test(value)) {
      showFieldError(fields.email2, 'El email no tiene un formato válido.');
      return false;
    }
    if (!validateEmailMatch(fields.email?.value.trim() || '', value)) {
      showFieldError(fields.email2, 'Los correos electrónicos deben coincidir exactamente.');
      return false;
    }
    showFieldOk(fields.email2);
    return true;
  }

  function validatePasswordField() {
    const value = fields.password?.value || '';
    if (!regex.password.test(value)) {
      showFieldError(fields.password, 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.');
      return false;
    }
    showFieldOk(fields.password);
    return true;
  }

  function validatePassword2Field() {
    const value = fields.password2?.value || '';
    if (!validatePasswordMatch(fields.password?.value || '', value)) {
      showFieldError(fields.password2, 'Las contraseñas deben coincidir.');
      return false;
    }
    showFieldOk(fields.password2);
    return true;
  }

  function validateTelefonoField() {
    const value = fields.telefono?.value.trim() || '';
    if (!validatePhone(value)) {
      showFieldError(fields.telefono, 'Teléfono inválido: utiliza solo dígitos, +, - o espacios y al menos 8 dígitos.');
      return false;
    }
    showFieldOk(fields.telefono);
    return true;
  }

  function validateCategoriesField() {
    if (!hasSelectedCategory()) {
      showGroupError(categories, 'Selecciona al menos una categoría de interés.');
      return false;
    }
    clearGroupFeedback(categories);
    categories.forEach((checkbox) => checkbox.classList.add('campo-ok'));
    return true;
  }

  function validateClientTypeField() {
    if (!hasSelectedClientType()) {
      showGroupError(clientTypes, 'Selecciona un tipo de cliente.');
      return false;
    }
    clearGroupFeedback(clientTypes);
    clientTypes.forEach((radio) => radio.classList.add('campo-ok'));
    return true;
  }

  function validateTerminos() {
    if (!fields.aceptaTerminos?.checked) {
      showFieldError(fields.aceptaTerminos, 'Debes aceptar los Términos y Condiciones.');
      return false;
    }
    showFieldOk(fields.aceptaTerminos);
    return true;
  }

  function validatePrivacidad() {
    if (!fields.aceptaPrivacidad?.checked) {
      showFieldError(fields.aceptaPrivacidad, 'Debes aceptar la Política de Privacidad.');
      return false;
    }
    showFieldOk(fields.aceptaPrivacidad);
    return true;
  }

  function updateReferenceCount() {
    if (!referenciaCount || !fields.referencia) return;
    const count = fields.referencia.value.length;
    referenciaCount.textContent = count;
    if (count > 200) {
      showFieldError(fields.referencia, 'Referencia no puede superar los 200 caracteres.');
    } else {
      validateReferenciaField();
    }
  }

  function validateAll() {
    clearErrors();
    const valid = [
      validateNombre(),
      validateNacimiento(),
      validateDocumento(),
      validateGenero(),
      validateNacionalidad(),
      validatePaisEntrega(),
      validateProvincia(),
      validateCiudad(),
      validateCalle(),
      validatePostalField(),
      validateReferenciaField(),
      validateEmailField(),
      validateEmail2Field(),
      validatePasswordField(),
      validatePassword2Field(),
      validateTelefonoField(),
      validateCategoriesField(),
      validateClientTypeField(),
      validateTerminos(),
      validatePrivacidad()
    ];
    return valid.every(Boolean);
  }

  const validators = {
    nombre: validateNombre,
    nacimiento: validateNacimiento,
    documento: validateDocumento,
    genero: validateGenero,
    nacionalidad: validateNacionalidad,
    pais_entrega: validatePaisEntrega,
    provincia: validateProvincia,
    ciudad: validateCiudad,
    calle: validateCalle,
    postal: validatePostalField,
    referencia: updateReferenceCount,
    email: validateEmailField,
    email2: validateEmail2Field,
    password: validatePasswordField,
    password2: validatePassword2Field,
    telefono: validateTelefonoField
  };

  Object.entries(validators).forEach(([key, validator]) => {
    const field = fields[key];
    if (!field) return;
    const eventType = ['genero', 'nacionalidad', 'pais_entrega'].includes(key) ? 'change' : 'blur';
    field.addEventListener(eventType, validator);
  });

  categories.forEach((checkbox) => {
    checkbox.addEventListener('change', validateCategoriesField);
  });

  clientTypes.forEach((radio) => {
    radio.addEventListener('change', validateClientTypeField);
  });

  if (fields.referencia) {
    fields.referencia.addEventListener('input', updateReferenceCount);
  }

  if (fields.aceptaTerminos) {
    fields.aceptaTerminos.addEventListener('change', validateTerminos);
  }

  if (fields.aceptaPrivacidad) {
    fields.aceptaPrivacidad.addEventListener('change', validatePrivacidad);
  }

  function showSuccess(name) {
    if (form) form.classList.add('hidden');
    if (successPanel) {
      successName.textContent = name || 'usuario';
      successPanel.classList.remove('hidden');
      successPanel.classList.add('visible');
    }
  }

  function handleSubmit(event) {
    if (!validateAll()) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const name = fields.nombre?.value.trim() || '';
    showSuccess(name);
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

  form.addEventListener('submit', handleSubmit);
});
