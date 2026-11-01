// Navbar scroll state
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || '0', 10);
      setTimeout(() => e.target.classList.add('in'), delay);
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '-60px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Contact form
const form = document.getElementById('contact-form');
const msg = document.getElementById('form-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fd = new FormData(form);

  const name = (fd.get('name') || '').toString().trim();
  const email = (fd.get('email') || '').toString().trim();
  const message = (fd.get('message') || '').toString().trim();

  msg.classList.remove('err');

  if (!name) return showErr('Name required');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return showErr('Invalid email');
  }

  if (!message) return showErr('Message required');

  msg.textContent = 'Sending message...';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: fd
    });

    const result = await response.json();

    if (result.success) {
      msg.textContent = 'Message sent successfully!';
      form.reset();
    } else {
      showErr('Could not send message. Please try again.');
    }

  } catch (error) {
    showErr('Something went wrong. Please try again.');
  }
});

function showErr(t) {
  msg.textContent = t;
  msg.classList.add('err');
}
// Project card flip

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});
// Certificate lightbox
const lightbox = document.getElementById('cert-lightbox');
const lightboxImg = document.getElementById('cert-lightbox-img');
const lightboxClose = document.getElementById('cert-close');

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.certificate-card').forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('.certificate-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // stops page scrolling behind it
  });
});

lightboxClose.addEventListener('click', closeLightbox);

// Click on the dark background closes it too
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Esc key closes it
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});