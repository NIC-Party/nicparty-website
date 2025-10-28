/* ui.js
   Handles:
   - Nav solid-on-scroll
   - Search modal open/close and a11y
   - Floating CTA click (scroll to join)
   - Simple focus management
*/

document.addEventListener('DOMContentLoaded', function () {
  const topNav = document.getElementById('top-nav');
  const hero = document.getElementById('hero');
  const searchToggle = document.getElementById('search-toggle');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const floatingCta = document.getElementById('floating-cta');

  // Make nav solid when scrolled past hero threshold
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) topNav.classList.remove('is-solid');
      else topNav.classList.add('is-solid');
    });
  }, { root: null, threshold: 0.08 });

  if (hero) heroObserver.observe(hero);

  // Search modal open/close with accessibility attributes
  function openSearch(){
    searchModal.setAttribute('aria-hidden','false');
    searchModal.style.display = 'grid';
    setTimeout(()=> searchInput.focus(), 120);
  }
  function closeSearch(){
    searchModal.setAttribute('aria-hidden','true');
    searchModal.style.display = '';
    searchToggle.focus();
  }

  searchToggle.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);

  // close when click outside panel
  searchModal.addEventListener('click', function(e){
    if (e.target === searchModal) closeSearch();
  });

  // keyboard escape
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') {
      if (searchModal.getAttribute('aria-hidden') === 'false') closeSearch();
    }
  });

  // Floating CTA scroll to join section
  floatingCta.addEventListener('click', function(){
    const join = document.getElementById('join');
    if (join) join.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-menu a').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({behavior:'smooth', block:'start'});
        // update active state
        document.querySelectorAll('.nav-menu a').forEach(x=>x.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Simple focus trap for modal (basic)
  searchModal.addEventListener('keydown', function(e){
    if (searchModal.getAttribute('aria-hidden') === 'false' && e.key === 'Tab') {
      const focusables = searchModal.querySelectorAll('input,button,a,textarea,select');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length-1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Simple parallax effect for hero decorations (lightweight)
  const aurora = document.querySelector('.aurora');
  const globe = document.querySelector('.globe-mesh');
  window.addEventListener('mousemove', function(e){
    const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (aurora) aurora.style.transform = `translate3d(${x*8}px, ${y*6}px, 0) rotate(-6deg)`;
    if (globe) globe.style.transform = `translate3d(${x*18}px, ${y*10}px, 0)`;
  }, {passive:true});
});

