document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.querySelector('.chatbot__toggle');
  const chatbotWindow = document.querySelector('.chatbot__window');
  const chatbotClose = document.querySelector('.chatbot__close');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  
  if (!chatbotToggle) return;
  
  // Открытие/закрытие чата
  chatbotToggle.addEventListener('click', function() {
      chatbotWindow.classList.toggle('active');
  });
  
  chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.remove('active');
  });
  
  // Отправка сообщения
  function sendMessage() {
      const messageText = chatbotInput.value.trim();
      if (!messageText) return;
      
      // Добавляем сообщение пользователя
      addMessage(messageText, 'user');
      chatbotInput.value = '';
      
      // Имитация ответа бота
      setTimeout(() => {
          const botResponse = getBotResponse(messageText);
          addMessage(botResponse, 'bot');
      }, 1000);
  }
  
  chatbotSend.addEventListener('click', sendMessage);
  
  chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });
  
  // Добавление сообщения в чат
  function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.className = `chatbot__message chatbot__message--${sender}`;
      messageElement.textContent = text;
      chatbotMessages.appendChild(messageElement);
      messageElement.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Ответы бота
  function getBotResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
          return 'Привет! Я виртуальный помощник SPORTSHUB. Чем могу помочь?';
      }
      
      if (lowerMessage.includes('каталог') || lowerMessage.includes('товар')) {
          return 'Наш каталог включает спортивную одежду для мужчин и женщин: футболки, шорты, брюки, костюмы, куртки и многое другое. Перейдите в раздел "Каталог" для просмотра.';
      }
      
      if (lowerMessage.includes('доставк') || lowerMessage.includes('получ')) {
          return 'Мы осуществляем доставку по всей России. Стоимость курьерской доставки - 300 ₽, самовывоз бесплатный. Срок доставки 1-5 дней.';
      }
      
      if (lowerMessage.includes('оплат') || lowerMessage.includes('купи')) {
          return 'Вы можете оплатить заказ онлайн картой или наличными при получении. Мы принимаем Visa, Mastercard, МИР.';
      }
      
      if (lowerMessage.includes('контакт') || lowerMessage.includes('связать')) {
          return 'Наши контакты: Москва, ул. Спортивная, 15. Телефон: +7 (495) 123-45-67. Email: info@sportshub.ru. Часы работы: Пн-Пт 10:00-20:00.';
      }
      
      if (lowerMessage.includes('помощ') || lowerMessage.includes('help')) {
          return 'Я могу помочь с информацией о каталоге, доставке, оплате и контактах. Задайте ваш вопрос.';
      }
      
      return 'Извините, я не совсем понял ваш вопрос. Попробуйте переформулировать или задайте вопрос о каталоге, доставке или оплате.';
  }
});