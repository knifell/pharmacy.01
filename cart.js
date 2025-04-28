// Получение корзины из localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Добавление товара в корзину
function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Увеличиваем количество, если товар уже в корзине
    } else {
        product.quantity = 1; // Добавляем товар в корзину с количеством 1
        cart.push(product);
    }
    saveCart(cart);
}

// Удаление товара из корзины
function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
}

// Очистка корзины
function clearCart() {
    saveCart([]);
}

// Обновление количества товаров в корзине
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Отображение корзины
function renderCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
         <img src="${item.image}" alt="${item.title}">
         <div class="cart-item-details">
         <h3>${item.title}</h3>
            <span>₽${item.price}</span>
    <span>Количество: ${item.quantity}</span>
    <button onclick="removeFromCart(${item.id})">Удалить</button>
  </div>
`;

`;
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('total-price').textContent = `₽${totalPrice}`;
}

// Инициализация страницы корзины
function initCartPage() {
    renderCart();
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', initCartPage);

// Обработчик оформления заказа
document.querySelector('.checkout').addEventListener('click', () => {
    const address = document.getElementById('delivery-address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!address) {
        alert('Пожалуйста, введите адрес доставки.');
        return;
    }

    // Логика оформления заказа (например, сохранение в БД через сервер)
    alert(`Заказ оформлен! Способ оплаты: ${paymentMethod}, Адрес доставки: ${address}`);
    clearCart();
});

// Функция оформления заказа с отправкой на сервер
document.getElementById("checkout").addEventListener("click", function () {
    // Собираем информацию о заказе
    const customerName = document.getElementById("customer-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const cart = JSON.parse(localStorage.getItem("cart"));
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Подготовим данные для отправки
    const orderData = {
        customer_name: customerName,
        email: email,
        phone: phone,
        address: address,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        items: cart
    };

    // Отправляем данные на сервер
    fetch("order.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Очистить корзину после успешного заказа
            localStorage.removeItem("cart");
            window.location.href = "index.html"; // Переходим на главную страницу
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

document.getElementById("checkout").addEventListener("click", function () {
    const customerName = document.getElementById("customer-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!customerName || !email || !phone || !address || !paymentMethod) {
        alert("Заполните все поля!");
        return;
    }

    const orderData = {
        customer_name: customerName,
        email: email,
        phone: phone,
        address: address,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        items: cart
    };

    fetch("order.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            localStorage.removeItem("cart");
            window.location.href = "index.html"; // После оформления заказа
        })
        .catch(error => {
            console.error("Ошибка:", error);
        });
});

// Переключение тёмной темы
const themeToggleButton = document.getElementById('theme-toggle');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
