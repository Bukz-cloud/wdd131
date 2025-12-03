const currentYear = new Date().getFullYear();
document.getElementById("currentyear").innerHTML = `${currentYear}`;
document.getElementById("lastModified").innerHTML = `Last modified: ${document.lastModified}`;

/* script.js
   Implements:
   - slideshow with lazy-aware loading
   - rendering of property cards (objects/array/array methods)
   - search/filter with conditional branching
   - save favorites to localStorage
   - DOM interactions and event listeners
   - template literals exclusively for building dynamic HTML
*/

(() => {
  // ---------- Data (listings) ----------
  const listings = [
    {
      id: "p1",
      title: "Cozy family house in Cape Town",
      type: "house",
      price: 750000,
      beds: 3,
      purpose: "buy",
      img: "images/interior-seven.webp",
      thumbSet: "images/interior-seven.webp 480w, images/interior-seven.webp 1200w",
      alt: "A bright living room with fireplace"
    },
    {
      id: "p2",
      title: "Modern apartment near beach",
      type: "apartment",
      price: 420000,
      beds: 2,
      purpose: "buy",
      img: "images/sale-two.webp",
      thumbSet: "images/sale-two.webp 480w, images/sale-two.webp 1200w",
      alt: "Modern apartment with balcony"
    },
    {
      id: "p3",
      title: "Downtown loft (short-term rent)",
      type: "apartment",
      price: 1400,
      beds: 1,
      purpose: "rent",
      img: "images/rent-four.webp",
      thumbSet: "images/rent-four.webp 480w, images/rent-four.webp 1200w",
      alt: "Loft style apartment interior"
    },
    {
      id: "p4",
      title: "Spacious townhouse with garden",
      type: "townhouse",
      price: 620000,
      beds: 4,
      purpose: "buy",
      img: "images/sale-three.webp",
      thumbSet: "images/sale-three.webp 480w, images/sale-three.webp 1200w",
      alt: "Townhouse garden and terrace"
    }
  ];

  // ---------- Globals ----------
  const hero = document.getElementById('hero');
  const featuredListEl = document.getElementById('featuredList');
  const favoritesListEl = document.getElementById('favoritesList');
  const buyListEl = document.getElementById('buyList');
  const rentListEl = document.getElementById('rentList');

  const SLIDES = [
    {src: "images/interior-five.webp", alt: "Bright bedroom with sunlight"},
    {src: "images/interior-six.webp", alt: "Modern living room"},
    {src: "images/interior-seven.webp", alt: "Cozy lounge by fireplace"}
  ];
  let slideIndex = 0;
  let slideInterval = null;

  // ---------- Local Storage ----------
  const LS_KEYS = {favorites: "abj:favoriteProperties", visitCount:"abj:visitCount"};

  function saveToLocalStorage(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage might be disabled — fallback noop
      console.warn('LocalStorage save failed', e);
    }
  }

  function loadFromLocalStorage(key, fallback=null){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('LocalStorage load failed', e);
      return fallback;
    }
  }

  // ---------- Slideshow functions ----------
  function setHeroBackground(src){
    // use template literal for CSS url
    hero.style.backgroundImage = `url("${src}")`;
  }

  function startSlideshow(){
    // lazy-aware: don't start if hero not in viewport; IntersectionObserver handles it
    if (slideInterval) return;
    setHeroBackground(SLIDES[slideIndex].src);
    slideInterval = setInterval(() => {
      slideIndex = (slideIndex + 1) % SLIDES.length;
      setHeroBackground(SLIDES[slideIndex].src);
    }, 6000);
  }

  function stopSlideshow(){
    if (slideInterval){
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  // ---------- Render functions (use template literals) ----------
  function createCardHTML(item){
    // template literal exclusively
    return `
      <article class="card" data-id="${item.id}" aria-labelledby="title-${item.id}">
        <picture>
          <source srcset="${item.thumbSet}" sizes="(max-width:600px) 480px, 1200px">
          <img loading="lazy" src="${item.img}" alt="${item.alt}">
        </picture>
        <div class="card-body">
          <h3 id="title-${item.id}" class="card-title">${item.title}</h3>
          <div class="card-meta">${item.type} • ${item.beds} beds • ${typeof item.price === 'number' ? formatPrice(item.price) : item.price}</div>
          <div class="card-actions">
            <button class="btn btn-fav" data-id="${item.id}" aria-pressed="false">♡ Save</button>
            <a class="btn" href="contact.html" aria-label="Contact about ${item.title}">Contact</a>
          </div>
        </div>
      </article>
    `;
  }

  function formatPrice(price){
    // price > 10000 => currency style, else monthly rate label
    if (price > 10000){
      return `R ${price.toLocaleString()}`;
    } else {
      return `R ${price.toLocaleString()} / month`;
    }
  }

  // ---------- Render listing groups ----------
  function renderFeatured(){
    // pick first 3
    const featured = listings.slice(0,3);
    const html = featured.map(item => createCardHTML(item)).join('');
    if (featuredListEl) featuredListEl.innerHTML = html;
  }

  function renderBuyList(){
    if (!buyListEl) return;
    const html = listings
      .filter(i => i.purpose === 'buy')
      .map(i => createCardHTML(i))
      .join('');
    buyListEl.innerHTML = html;
  }

  function renderRentList(){
    if (!rentListEl) return;
    const html = listings
      .filter(i => i.purpose === 'rent')
      .map(i => createCardHTML(i))
      .join('');
    rentListEl.innerHTML = html;
  }

  // ---------- Favorites handling ----------
  function getFavorites(){
    return loadFromLocalStorage(LS_KEYS.favorites, []);
  }

  function isFavorited(id){
    const fav = getFavorites();
    return fav.includes(id);
  }

  function toggleFavorite(id){
    let fav = getFavorites();
    if (fav.includes(id)){
      fav = fav.filter(i => i !== id);
    } else {
      fav.push(id);
    }
    saveToLocalStorage(LS_KEYS.favorites, fav);
    renderFavorites();
    synchronizeFavButtons();
  }

  function renderFavorites(){
    const fav = getFavorites();
    if (!favoritesListEl) return;
    if (!fav.length){
      favoritesListEl.innerHTML = "You have no saved properties yet.";
      return;
    }
    const html = fav
      .map(id => listings.find(l => l.id === id))
      .filter(Boolean)
      .map(item => `
        <div class="card" style="display:flex;gap:10px">
          <img src="${item.img}" alt="${item.alt}" loading="lazy" style="width:120px;height:80px;object-fit:cover;border-radius:6px">
          <div style="flex:1">
            <div style="font-weight:700">${item.title}</div>
            <div style="color:#666">${item.type} • ${item.beds} beds</div>
            <div style="margin-top:8px"><button class="btn btn-remove" data-id="${item.id}">Remove</button></div>
          </div>
        </div>
      `).join('');
    favoritesListEl.innerHTML = html;
  }

  function synchronizeFavButtons(){
    const buttons = document.querySelectorAll('.btn-fav');
    buttons.forEach(btn => {
      const id = btn.dataset.id;
      const pressed = isFavorited(id);
      btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      btn.textContent = pressed ? '♥ Saved' : '♡ Save';
    });
  }

  // ---------- Search / Filter ----------
  function handleSearchSubmit(e){
    e.preventDefault();
    const q = (document.getElementById('q') || {value:''}).value.trim().toLowerCase();
    const type = (document.getElementById('type') || {value:''}).value;
    const price = (document.getElementById('price') || {value:''}).value;
    const beds = (document.getElementById('beds') || {value:''}).value;

    const filtered = listings.filter(item => {
      // conditional branching and array methods used
      let match = true;
      if (q){
        const combined = `${item.title} ${item.alt}`.toLowerCase();
        match = match && combined.includes(q);
      }
      if (type) match = match && item.type === type;
      if (beds) match = match && (item.beds >= Number(beds));
      if (price){
        const [min,max] = price.split('-');
        if (max){
          match = match && (item.price >= Number(min) && item.price <= Number(max));
        } else if (price.endsWith('+')){
          const num = Number(price.replace('+',''));
          match = match && (item.price >= num);
        }
      }
      return match;
    });

    // render results into featured / main lists (re-use featured area)
    if (featuredListEl){
      featuredListEl.innerHTML = filtered.length
        ? filtered.map(i => createCardHTML(i)).join('')
        : `<p>No properties found that match your criteria.</p>`;
    }
    // attach listeners for new buttons after render
    attachCardEventHandlers();
  }

  // ---------- Event delegation for card buttons ----------
  function attachCardEventHandlers(){
    // favorite/save buttons
    document.querySelectorAll('.btn-fav').forEach(btn => {
      btn.removeEventListener('click', favClickHandler);
      btn.addEventListener('click', favClickHandler);
    });

    // remove buttons in favorites
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.removeEventListener('click', removeClickHandler);
      btn.addEventListener('click', removeClickHandler);
    });
  }

  function favClickHandler(e){
    const id = e.currentTarget.dataset.id;
    toggleFavorite(id);
  }
  function removeClickHandler(e){
    const id = e.currentTarget.dataset.id;
    toggleFavorite(id); // toggle will remove
  }

  // ---------- Contact form ----------
  function handleContactSubmit(e){
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const feedback = document.getElementById('contactFeedback');

    // simple validation
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()){
      feedback.textContent = 'Please complete all required fields.';
      feedback.style.color = 'crimson';
      return;
    }

    // create a message object and persist locally (simulated send)
    const msg = {id: `m${Date.now()}`, name: name.value.trim(), email: email.value.trim(), message: message.value.trim(), sentAt: new Date().toISOString()};
    // store in localStorage under a messages array (example of using objects & arrays)
    const existing = loadFromLocalStorage('abj:messages', []);
    existing.push(msg);
    saveToLocalStorage('abj:messages', existing);

    feedback.textContent = 'Thanks — your message was saved. Our agent will contact you soon.';
    feedback.style.color = 'green';
    e.target.reset();
  }

  // ---------- small-screen nav toggle ----------
  function setupNavToggle(){
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    toggle && toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      if (nav){
        nav.style.display = expanded ? 'none' : 'block';
      }
    });
  }


  // ---------- lazy hero: start slideshow when visible ----------
  function setupHeroLazyStart(){
    if (!('IntersectionObserver' in window)) {
      // fallback: start immediately
      startSlideshow();
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startSlideshow();
        } else {
          // pause to conserve resources when scrolled away
          stopSlideshow();
        }
      });
    }, {threshold: 0.25});
    io.observe(hero);
  }

  // ---------- Visit count (localStorage example) ----------
  function trackVisit(){
    let count = loadFromLocalStorage(LS_KEYS.visitCount, 0) || 0;
    count++;
    saveToLocalStorage(LS_KEYS.visitCount, count);
    // reflect in footer(s)
    document.querySelectorAll('#year, #year-buy, #year-rent, #year-contact').forEach(el => {
      if (el) el.textContent = new Date().getFullYear();
    });
  }

  // ---------- initialize page-specific behaviours ----------
  function init(){
    // render main / featured lists
    renderFeatured();
    renderBuyList();
    renderRentList();
    renderFavorites();
    synchronizeFavButtons();
    attachCardEventHandlers();
    trackVisit();

    // search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) searchForm.addEventListener('submit', handleSearchSubmit);

    // contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

    // delegate click from document for new elements later too
    document.addEventListener('click', (e) => {
      // if a property card image clicked, open contact page with intent (example)
      if (e.target.matches('.card img')){
        window.location.href = 'contact.html';
      }
    });

    setupNavToggle();
    setupHeroLazyStart();

    // accessibility: ensure search inputs have usable placeholders, labels exist in markup
  }

  // ---------- run init after DOM ready ----------
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
