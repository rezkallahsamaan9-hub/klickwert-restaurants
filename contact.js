document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('contactModal');
  const openBtns = document.querySelectorAll('.open-modal-btn, #openContactModal');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const checkboxError = document.getElementById('checkboxError');
  const leadMessage = document.getElementById('leadMessage');
  const messageLabel = document.querySelector('label[for="leadMessage"]');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (btn.classList.contains('message-required')) {
        leadMessage.setAttribute('required', 'true');
        messageLabel.textContent = 'Nachricht*';
        leadMessage.placeholder = 'Welche Fragen haben Sie zu den Paketen oder Dienstleistungen?';
      } else {
        leadMessage.removeAttribute('required');
        messageLabel.textContent = 'Nachricht (optional)';
        leadMessage.placeholder = 'Haben Sie Fragen?';
      }
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
      checkboxError.style.display = 'none';
      
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        input.classList.remove('error');
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else if (input.type === 'email') {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(input.value.trim())) {
            input.classList.add('error');
            isValid = false;
          }
        }
      });

      const checkboxes = form.querySelectorAll('input[name="services"]:checked');
      if (checkboxes.length === 0) {
        checkboxError.style.display = 'inline';
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sende...';

      const selectedServices = Array.from(checkboxes).map(cb => cb.value);

      const payload = {
        Datum: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
        Name: document.getElementById('leadName').value.trim(),
        Email: document.getElementById('leadEmail').value.trim(),
        Telefon: document.getElementById('leadPhone').value.trim(),
        Website: document.getElementById('leadWebsite').value.trim() || '',
        Dienstleistungen: selectedServices.join(', '),
        Nachricht: document.getElementById('leadMessage').value.trim() || ''
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Server error');

        form.style.display = 'none';
        document.querySelector('.modal-subtitle').style.display = 'none';
        formMessage.textContent = '✓ Danke! Wir melden uns innerhalb von 24 Stunden.';
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        formMessage.style.fontSize = '1.1rem';
        formMessage.style.padding = '24px';
        formMessage.style.marginTop = '2rem';
      } catch (error) {
        formMessage.textContent = 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Anfrage senden';
      }
    });
  }
});
