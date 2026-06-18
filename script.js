// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.12});
revealEls.forEach(el=>io.observe(el));

// Mobile menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
navToggle.addEventListener('click', ()=> mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', ()=> mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>mobileMenu.classList.remove('open')));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!isOpen) item.classList.add('open');
  });
});

// Product filter
const chips = document.querySelectorAll('.filter-chip');
const cards = document.querySelectorAll('.product-card');
chips.forEach(chip=>{
  chip.addEventListener('click', ()=>{
    chips.forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card=>{
      card.style.display = (f==='all' || card.dataset.cat===f) ? '' : 'none';
    });
  });
});

// Nav shrink/glass intensify on scroll
const navEl = document.querySelector('.nav');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 40){ navEl.style.boxShadow = 'var(--shadow-lift)'; }
  else { navEl.style.boxShadow = ''; }
});

// Catalog Data
const catalog = [
  { id: 'clean-face', name: 'Crème Nuit Clean Face', price: 5000, img: 'clean-face.png', cat: 'visage', desc: 'Anti-imperfections et éclaircissante.' },
  { id: 'chantilly-cacao', name: 'Chantilly de Beurre de Cacao', price: 6000, img: 'chantillycreme.png', cat: 'corps', desc: 'Soin gourmand et fondant qui nourrit en profondeur.' },
  { id: 'mini-kit', name: 'Mini-Kit Super Éclaircissant', price: 13500, img: 'mini-kit.jpg', cat: 'visage', desc: 'Kit complet pour le visage.' },
  { id: 'savon-chevre', name: 'Savon au Lait de Chèvre', price: 6000, img: 'savon-chevre.png', cat: 'savon', desc: 'Savon gommant doux, régénérant.' },
  { id: 'savon-aloe', name: 'Savon Aloe Vera', price: 5000, img: 'savon-aloe.png', cat: 'savon', desc: 'Idéal pour les vergetures et cicatrices.' },
  { id: 'savon-noir', name: 'Savon Noir', price: 5000, img: 'savon-noir.jpg', cat: 'savon', desc: 'Activateur d\'éclat au quotidien.' },
  { id: 'intense-glow', name: 'Intense Glow Oil', price: 6000, img: 'intense-glow-oil.jpg', cat: 'corps', desc: 'Huile clarifiante aux pétales de rose.' },
  { id: 'douche-glowup', name: 'Gel Douche Glow Up', price: 10000, img: 'gel-douche-glowup.jpg', cat: 'corps', desc: 'Nettoyant super éclaircissant.' },
  { id: 'douche-metisse', name: 'Gel Douche Teint Métissé', price: 8000, img: 'gel-douche-metisse.jpg', cat: 'corps', desc: 'Nettoie, exfolie en douceur.' },
  { id: 'gamme-glowup', name: 'Gamme Glow Up', price: 40000, img: 'gamme-glowup.jpg', cat: 'gammes', desc: 'Booste l\'éclat du teint.' },
  { id: 'gamme-blanchissante', name: 'Gamme Blanchissante', price: 46500, img: 'gamme-blanchissante.jpg', cat: 'gammes', desc: 'Jusqu\'à 4 teintes d\'éclat.' },
  { id: 'gamme-nettoyante-plus', name: 'Gamme Nettoyante Plus', price: 46500, img: 'gamme-nettoyante-plus.jpg', cat: 'gammes', desc: 'Contre le masque de grossesse.' },
  { id: 'gamme-booster', name: 'Booster d\'Éclat 3 en 1', price: 47000, img: 'gamme-booster3en1.jpg', cat: 'gammes', desc: 'Coup d\'éclat rapide.' },
  { id: 'gamme-metisse', name: 'Métisse Super Éclaircissant', price: 46000, img: 'gamme-metisse.jpg', cat: 'gammes', desc: 'Teint métissé lumineux.' },
  { id: 'gamme-nettoyante', name: 'Gamme Nettoyante', price: 38000, img: 'gamme-nettoyante.jpg', cat: 'gammes', desc: 'Teint lumineux et uniforme.' },
  { id: 'gamme-kojic', name: 'Éclaircissante Kojic Plus', price: 37500, img: 'gamme-kojic.jpg', cat: 'gammes', desc: 'Pour peaux claires ou marron clair.' },
  { id: 'gamme-nila', name: 'Booster d\'Éclat Plus Nila', price: 30500, img: 'gamme-nila.jpg', cat: 'gammes', desc: 'Pour les teints noirs et marron.' }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('akd_cart')) || [];
let favs = JSON.parse(localStorage.getItem('akd_favs')) || [];

function saveCart() { localStorage.setItem('akd_cart', JSON.stringify(cart)); updateCartBadge(); renderCart(); }
function saveFavs() { localStorage.setItem('akd_favs', JSON.stringify(favs)); }

function addToCart(id, qty=1) {
  const item = cart.find(i => i.id === id);
  if(item) item.qty += qty;
  else {
    const prod = catalog.find(p => p.id === id);
    if(prod) cart.push({...prod, qty});
  }
  saveCart();
  openCart();
}
function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}
function toggleFav(id) {
  if(favs.includes(id)) favs = favs.filter(i => i !== id);
  else favs.push(id);
  saveFavs();
  // Update UI if on boutique
  const btn = document.querySelector(`.fav-btn[data-id="${id}"]`);
  if(btn) {
    if(favs.includes(id)) { btn.classList.add('active'); btn.innerHTML = '<i class="ph-fill ph-heart"></i>'; }
    else { btn.classList.remove('active'); btn.innerHTML = '<i class="ph ph-heart"></i>'; }
  }
}

// Cart UI
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if(!badge) return;
  const total = cart.reduce((acc, item) => acc + item.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}
function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if(!container) return;
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${item.price} F</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateQty('${item.id}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  });
  if(cart.length === 0) container.innerHTML = '<p style="color:var(--wood-600);text-align:center;">Votre panier est vide.</p>';
  if(totalEl) totalEl.textContent = total + ' F';
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCart();
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function sendWhatsApp() {
  if(cart.length === 0) return;
  let text = "Bonjour, je souhaite commander :\\n\\n";
  let total = 0;
  cart.forEach(item => {
    text += `- ${item.qty}x ${item.name} (${item.price * item.qty} F)\\n`;
    total += item.price * item.qty;
  });
  text += `\\nTotal: ${total} F\\n\\nMerci !`;
  window.open(`https://wa.me/22968544800?text=${encodeURIComponent(text)}`, '_blank');
}

// Initialize Cart Drawer HTML if not exists
document.addEventListener('DOMContentLoaded', () => {
  if(!document.getElementById('cartDrawer')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
      <div class="cart-drawer" id="cartDrawer">
        <div class="cart-header">
          <h2>Mon Panier</h2>
          <button class="cart-close" onclick="closeCart()"><i class="ph ph-x"></i></button>
        </div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-footer">
          <div class="cart-total"><span>Total</span><span id="cartTotal">0 F</span></div>
          <button class="btn-whatsapp" onclick="sendWhatsApp()"><i class="ph ph-whatsapp-logo"></i> Commander sur WhatsApp</button>
        </div>
      </div>
    `);
  }
  updateCartBadge();
});



