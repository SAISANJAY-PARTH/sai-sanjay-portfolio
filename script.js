const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = isOpen ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.textContent = '☰';
  }));
}

const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => filter.classList.toggle('active', filter === button));
  const category = button.dataset.filter;
  projects.forEach(project => {
    const categories = (project.dataset.category || '').split(' ');
    project.hidden = category !== 'all' && !categories.includes(category);
  });
}));

document.querySelectorAll('.details-toggle').forEach(button => button.addEventListener('click', () => {
  const details = button.nextElementSibling;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  button.querySelector('span').textContent = expanded ? '＋' : '−';
  if (details) details.classList.toggle('open', !expanded);
}));
