// Мок данных - замените на реальные запросы к вашей БД
function getAllProducts() {
  return [
      {
          id: 1,
          name: 'Футболка мужская TechFit',
          category: 'Футболки',
          gender: 'male',
          price: 1999,
          sizes: ['S', 'M', 'L', 'XL'],
          image: 'images/products/tshirt1.jpg'
      },
      {
          id: 2,
          name: 'Шорты женские AirFlow',
          category: 'Шорты',
          gender: 'female',
          price: 2499,
          sizes: ['XS', 'S', 'M'],
          image: 'images/products/shorts1.jpg'
      },
      {
          id: 3,
          name: 'Куртка мужская StormShield',
          category: 'Куртки',
          gender: 'male',
          price: 8999,
          sizes: ['M', 'L', 'XL', 'XXL'],
          image: 'images/products/jacket1.jpg'
      },
      {
          id: 4,
          name: 'Легинсы женские FlexFit',
          category: 'Легинсы',
          gender: 'female',
          price: 3499,
          sizes: ['XS', 'S', 'M', 'L'],
          image: 'images/products/leggings1.jpg'
      },
      {
          id: 5,
          name: 'Майка мужская CoolMax',
          category: 'Майки',
          gender: 'male',
          price: 1599,
          sizes: ['S', 'M', 'L'],
          image: 'images/products/tank1.jpg'
      },
      {
          id: 6,
          name: 'Спортивный бюстгальтер ActiveSupport',
          category: 'Спортивные бюстгальтеры',
          gender: 'female',
          price: 2799,
          sizes: ['XS', 'S', 'M', 'L'],
          image: 'images/products/bra1.jpg'
      },
      {
          id: 7,
          name: 'Ветровка женская WindBreaker',
          category: 'Ветровки',
          gender: 'female',
          price: 5999,
          sizes: ['XS', 'S', 'M'],
          image: 'images/products/windbreaker1.jpg'
      },
      {
          id: 8,
          name: 'Толстовка мужская UrbanPro',
          category: 'Толстовки',
          gender: 'male',
          price: 4599,
          sizes: ['S', 'M', 'L', 'XL'],
          image: 'images/products/hoodie1.jpg'
      }
  ];
}

function getProductById(id) {
  return getAllProducts().find(product => product.id === parseInt(id));
}

function getRandomProducts(count) {
  const allProducts = getAllProducts();
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Для реального проекта замените эти функции на запросы к вашему API/БД