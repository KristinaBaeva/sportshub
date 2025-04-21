document.addEventListener('DOMContentLoaded', function() {
  // Мобильное меню
  const burgerMenu = document.querySelector('.burger-menu');
  const navList = document.querySelector('.nav__list');
  
  burgerMenu.addEventListener('click', function() {
      this.classList.toggle('active');
      navList.classList.toggle('active');
  });
  
  // Переключение языка (заглушка)
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
      languageToggle.addEventListener('click', function() {
          // Здесь будет логика переключения языка
          alert('Функция переключения языка будет реализована позже');
      });
  }
  
  // Инициализация популярных товаров на главной
  if (document.getElementById('popular-products')) {
      fetchProducts().then(products => {
          loadPopularProducts(products);
      });
  }
  
  // Инициализация каталога
  if (document.getElementById('catalog-products')) {
      fetchProducts().then(products => {
          loadCatalogProducts(products);
          setupFilters();
      });
  }
  
  // Инициализация формы заказа
  if (document.getElementById('order-form')) {
      setupOrderForm();
      // Fetch and cache products before loading order items
      fetchAndCacheProducts().then(() => {
          loadOrderItems();
      });
  }
});

// Функция получения товаров с сервера
function fetchProducts() {
  return fetch('fetch_products.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка загрузки товаров');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Ошибка при получении товаров:', error);
      return [];
    });
}

// Загрузка популярных товаров (3 товара)
function loadPopularProducts(products) {
  const popularProductsContainer = document.getElementById('popular-products');
  
  // Берем первые 3 товара
  const popularProducts = products.slice(0, 3);
  
  popularProductsContainer.innerHTML = '';
  popularProducts.forEach(product => {
      const productCard = createProductCard(product);
      popularProductsContainer.appendChild(productCard);
  });
}

// Загрузка товаров каталога
function loadCatalogProducts(products) {
  const catalogProductsContainer = document.getElementById('catalog-products');
  catalogProductsContainer.innerHTML = '';
  
  products.forEach(product => {
      const productCard = createProductCard(product);
      catalogProductsContainer.appendChild(productCard);
  });
}

// Создание карточки товара
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const priceText = (product.price !== undefined && product.price !== null && !isNaN(product.price))
    ? `${Number(product.price).toLocaleString('ru-RU')} ₽`
    : '';

  card.innerHTML = `
      <img src="${product.image_url || product.image}" alt="${product.name}" class="product-card__image">
      <div class="product-card__content">
          <h2 class="product-card__title">${product.name}</h2>
          <span class="product-card__category">${product.subcategory_name || ''}</span>
          <div class="product-card__price">${priceText}</div>
          <button class="product-card__btn" data-id="${product.id}">Купить</button>
      </div>
  `;
  
  // Добавляем обработчик для кнопки "Купить"
  card.querySelector('.product-card__btn').addEventListener('click', function() {
      addToCart(product.id);
  });
  
  return card;
}

// Настройка фильтров каталога
function setupFilters() {
  const categoryFilter = document.getElementById('category');
  const sizeFilter = document.getElementById('size');
  const priceFilter = document.getElementById('price');
  
  [categoryFilter, sizeFilter, priceFilter].forEach(filter => {
      if (filter) {
          filter.addEventListener('change', applyFilters);
      }
  });
}

// Применение фильтров
function applyFilters() {
  const category = document.getElementById('category') ? document.getElementById('category').value : 'all';
  const size = document.getElementById('size') ? document.getElementById('size').value : 'all';
  const price = document.getElementById('price') ? document.getElementById('price').value : 'all';
  
  fetchProducts().then(products => {
    let filteredProducts = products;
    
    // Фильтрация по категории
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            if (category === 'men') return product.gender === 'male';
            if (category === 'women') return product.gender === 'female';
            return product.category.toLowerCase().includes(category);
        });
    }
    
    // Фильтрация по размеру
    if (size !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.sizes.includes(size)
        );
    }
    
    // Фильтрация по цене
    if (price !== 'all') {
        const [min, max] = price.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (max) return product.price >= min && product.price <= max;
            return product.price >= min;
        });
    }
    
    loadCatalogProducts(filteredProducts);
  });
}

// Cached products list
let cachedProducts = [];

// Fetch products and cache them
function fetchAndCacheProducts() {
  return fetchProducts().then(products => {
    cachedProducts = products;
    return products;
  });
}

// Get product by id from cached products
function getProductById(id) {
  return cachedProducts.find(product => product.id === id) || {};
}

// Настройка формы заказа
function setupOrderForm() {
  const orderForm = document.getElementById('order-form');
  
  if (!orderForm) return;
  
  orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('order-name').value.trim();
      const phone = document.getElementById('order-phone').value.trim();
      const email = document.getElementById('order-email').value.trim();
      const address = document.getElementById('order-address').value.trim();
      const comment = document.getElementById('order-comment').value.trim();
      const delivery = document.querySelector('input[name="delivery"]:checked')?.value || '';
      const payment = document.querySelector('input[name="payment"]:checked')?.value || '';
      const cart = getCart();
      
      if (!name || !phone || !email || !address) {
          alert('Пожалуйста, заполните все обязательные поля.');
          return;
      }
      
      if (cart.length === 0) {
          alert('Ваша корзина пуста.');
          return;
      }
      
      const orderData = {
          customer: { name, phone, email, address },
          cart,
          delivery,
          payment,
          comment
      };
      
      fetch('submit_order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Заказ успешно оформлен! Номер заказа: ' + data.orderId);
              clearCart();
              loadOrderItems();
              orderForm.reset();
          } else {
              alert('Ошибка при оформлении заказа: ' + (data.error || 'Неизвестная ошибка'));
          }
      })
      .catch(error => {
          alert('Ошибка при отправке заказа: ' + error.message);
      });
  });
  
  // Обновление стоимости доставки при изменении способа
  const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
  deliveryOptions.forEach(option => {
      option.addEventListener('change', updateOrderSummary);
  });
}

// Загрузка товаров в корзине
function loadOrderItems() {
  const orderItemsContainer = document.getElementById('order-items');
  if (!orderItemsContainer) return;
  
  orderItemsContainer.innerHTML = '';
  
  const cart = getCart();
  
  if (cart.length === 0) {
      orderItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
      updateOrderSummary();
      return;
  }
  
  cart.forEach(item => {
      const product = getProductById(item.id);
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      orderItem.innerHTML = `
          <img src="${product.image_url || product.image}" alt="${product.name}" class="order-item__image">
          <div class="order-item__details">
              <h4 class="order-item__title">${product.name}</h4>
              <div class="order-item__price">${product.price.toLocaleString('ru-RU')} ₽ × ${item.quantity}</div>
          </div>
          <span class="order-item__remove" data-id="${product.id}">×</span>
      `;
      orderItemsContainer.appendChild(orderItem);
  });
  
  // Добавляем обработчики для кнопок удаления
  document.querySelectorAll('.order-item__remove').forEach(btn => {
      btn.addEventListener('click', function() {
          removeFromCart(this.dataset.id);
          loadOrderItems();
      });
  });
  
  updateOrderSummary();
}

// Обновление итоговой суммы заказа
function updateOrderSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
      const product = getProductById(item.id);
      return sum + (product.price * item.quantity);
  }, 0);
  
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked') ? document.querySelector('input[name="delivery"]:checked').value : 'pickup';
  const shippingCost = deliveryMethod === 'courier' ? 300 : 0;
  const total = subtotal + shippingCost;
  
  if (document.getElementById('order-subtotal')) {
      document.getElementById('order-subtotal').textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
  }
  if (document.getElementById('order-shipping')) {
      document.getElementById('order-shipping').textContent = shippingCost.toLocaleString('ru-RU') + ' ₽';
  }
  if (document.getElementById('order-total')) {
      document.getElementById('order-total').textContent = total.toLocaleString('ru-RU') + ' ₽';
  }
}

// Работа с корзиной (localStorage)
function getCart() {
  return JSON.parse(localStorage.getItem('sportshub_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('sportshub_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({ id: productId, quantity: 1 });
  }
  
  saveCart(cart);
  showCartNotification();
  // Reload order items if on order page
  if (document.getElementById('order-items')) {
    loadOrderItems();
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem('sportshub_cart');
}

function showCartNotification() {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = 'Товар добавлен в корзину';
  document.body.appendChild(notification);
  
  setTimeout(() => {
      notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
          document.body.removeChild(notification);
      }, 300);
  }, 3000);
}

// Уведомление
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--accent-green);
      color: var(--bg-dark);
      padding: 12px 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1001;
  }
  
  .notification.show {
      opacity: 1;
  }
`;
document.head.appendChild(notificationStyles);
