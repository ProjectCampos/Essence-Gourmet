const products = [
  {
    id: 1,
    name: 'Brigadeiro Gourmet',
    price: 4.50,
    description: 'Chocolate belga 70% cacau com granulado artesanal de avelã.',
    image: 'images/brigadeiro.png',
  },
  {
    id: 2,
    name: 'Torta de Limão',
    price: 12.00,
    description: 'Massa amanteigada, curd de limão siciliano e merengue suíço.',
    image: 'images/torta-limao.png',
  },
  {
    id: 3,
    name: 'Brownie',
    price: 8.50,
    description: 'Textura fudgy intensa, pedaços de nozes e toque de flor de sal.',
    image: 'images/brownie.png',
  },
  {
    id: 4,
    name: 'Macaron',
    price: 6.00,
    description: 'Casquinha crocante com ganache de framboesa fresca e baunilha.',
    image: 'images/macaron.png',
  },
  {
    id: 5,
    name: 'Pudim',
    price: 5.50,
    description: 'Ganache de caramelo artesanal com flor de sal do Himalaia.',
    image: 'images/pudim.png',
  },
  {
    id: 6,
    name: 'Cheesecake',
    price: 15.00,
    description: 'Creme suave de cream cheese com calda de goiaba cascão.',
    image: 'https://plus.unsplash.com/premium_photo-1722686461601-b2a018a4213b?auto=format&fit=crop&w=600&h=400&q=80',
  },
];

const cart = {};

const productsGrid = document.getElementById('productsGrid');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card__visual">
            <img
              class="product-card__image"
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
              width="600"
              height="400"
            >
          </div>
          <div class="product-card__body">
            <div class="product-card__header">
              <h3 class="product-card__name">${product.name}</h3>
              <span class="product-card__price">${formatCurrency(product.price)}</span>
            </div>
            <p class="product-card__description">${product.description}</p>
            <button class="btn btn--outline product-card__btn" data-add="${product.id}">
              Adicionar
            </button>
          </div>
        </article>
      `
    )
    .join('');
}

function getTotalItems() {
  return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
}

function getTotalPrice() {
  return Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function updateCartUI() {
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  cartCount.textContent = totalItems;
  cartCount.classList.toggle('is-visible', totalItems > 0);
  cartTotal.textContent = formatCurrency(totalPrice);
  checkoutBtn.disabled = totalItems === 0;

  if (totalItems === 0) {
    cartItems.innerHTML = `
      <li class="cart__empty">
        <span class="cart__empty-icon" aria-hidden="true">🛒</span>
        <p>Seu carrinho está vazio.</p>
        <p>Explore nosso cardápio e escolha seus favoritos!</p>
      </li>
    `;
    return;
  }

  cartItems.innerHTML = Object.values(cart)
    .map(
      (item) => `
        <li class="cart-item" data-id="${item.id}">
          <img
            class="cart-item__thumb"
            src="${item.image}"
            alt=""
            width="48"
            height="48"
            loading="lazy"
          >
          <div class="cart-item__info">
            <p class="cart-item__name">${item.name}</p>
            <p class="cart-item__unit-price">${formatCurrency(item.price)} un.</p>
          </div>
          <div class="cart-item__controls">
            <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Diminuir quantidade de ${item.name}">−</button>
            <span class="cart-item__qty">${item.quantity}</span>
            <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}" aria-label="Aumentar quantidade de ${item.name}">+</button>
          </div>
          <span class="cart-item__subtotal">${formatCurrency(item.price * item.quantity)}</span>
        </li>
      `
    )
    .join('');
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = { ...product, quantity: 1 };
  }

  updateCartUI();
  showToast(`${product.name} adicionado ao carrinho`);
}

function updateQuantity(productId, delta) {
  if (!cart[productId]) return;

  cart[productId].quantity += delta;

  if (cart[productId].quantity <= 0) {
    delete cart[productId];
  }

  updateCartUI();
}

function openCart() {
  cartSidebar.classList.add('is-open');
  cartOverlay.classList.add('is-open');
  cartSidebar.setAttribute('aria-hidden', 'false');
  cartOverlay.setAttribute('aria-hidden', 'false');
  cartToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('is-open');
  cartOverlay.classList.remove('is-open');
  cartSidebar.setAttribute('aria-hidden', 'true');
  cartOverlay.setAttribute('aria-hidden', 'true');
  cartToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('is-visible'));

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

productsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  addToCart(Number(btn.dataset.add));
});

cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const delta = btn.dataset.action === 'increase' ? 1 : -1;
  updateQuantity(id, delta);
});

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
  if (getTotalItems() === 0) return;
  showToast('Pedido enviado! Em breve entraremos em contato. 🍬');
  Object.keys(cart).forEach((key) => delete cart[key]);
  updateCartUI();
  closeCart();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartSidebar.classList.contains('is-open')) {
    closeCart();
  }
});

renderProducts();
updateCartUI();
