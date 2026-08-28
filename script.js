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