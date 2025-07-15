/* ──────────────────────────────
   1. Menú hamburguesa
──────────────────────────────── */
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
  navLinks.style.color = 'white';
}

/* ──────────────────────────────
   2. Animaciones por scroll (reveal)
──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);         // quita si quieres repetir
        }
      });
    },
    { threshold: 0.3 }                        // 30 % visible
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

/* ──────────────────────────────
   3. Pop-up formulario → Google Sheets
──────────────────────────────── */

/* Configuración */
const TIME_DELAY   = 12000;  // 12 s
const SCROLL_RATIO = 0.55;   // 55 % de scroll

/* Referencias DOM (formulario) */
const modal     = document.getElementById('infoModal');
const overlay   = document.getElementById('modalOverlay');
const btnClose  = document.getElementById('modalClose');
const leadForm  = document.getElementById('leadForm');

/* Referencias DOM (agradecimiento) */
const thankModal   = document.getElementById('thankModal');
const thankOverlay = document.getElementById('thankOverlay');
const thankClose   = document.getElementById('thankClose');
const thankOk      = document.getElementById('thankOk');

/* Helpers */
const openModal   = () => modal .classList.add('show');
const closeModal  = () => modal .classList.remove('show');
const openThank   = () => thankModal.classList.add('show');
const closeThank  = () => thankModal.classList.remove('show');

/* Cerrar modales */
[btnClose, overlay].forEach(el => el.addEventListener('click', closeModal));
[thankClose, thankOk, thankOverlay].forEach(el =>
  el.addEventListener('click', closeThank)
);

/* Apertura automática */
const timerID = setTimeout(openModal, TIME_DELAY);

function handleScroll() {
  const ratio = (window.scrollY + window.innerHeight) /
                document.documentElement.scrollHeight;
  if (ratio >= SCROLL_RATIO) {
    openModal();
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(timerID);
  }
}
window.addEventListener('scroll', handleScroll);

leadForm.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    name   : leadForm.name.value.trim(),
    email  : leadForm.email.value.trim(),
    phone  : leadForm.phone.value.trim(),
    message: leadForm.message.value.trim(),
    origin : 'Formulario Web'
  };

  try {
    closeModal();
    openThank();
    await fetch(
      'https://script.google.com/macros/s/AKfycbxlBgB28gJM1LyutP76PLlsJy9dWhuZTgwFwT3fYZrEH4CBZu0UQ8peW3hkz8Nnsukjqw/exec',
      {
        method : 'POST',
        mode   : 'no-cors',
        body   : JSON.stringify(data)
      }
    );

    leadForm.reset();

  } catch (err) {
    console.error(err);
    alert('Ups, no se pudo enviar. Inténtalo de nuevo.');
  }
});
