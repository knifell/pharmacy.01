document.addEventListener("DOMContentLoaded", function () {
    const cartCount = document.getElementById("cart-count"); // Счетчик корзины
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    // Функция для получения товаров из LocalStorage
    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    // Функция для сохранения корзины в LocalStorage
    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Обновление счётчика товаров в корзине
    function updateCartCount() {
        const cart = getCart();
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Добавление товара в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productCard = this.closest(".product-card");
            const productId = productCard.getAttribute("data-id");
            const productName = productCard.querySelector("h3").textContent;
            const productPrice = parseFloat(productCard.querySelector(".price").textContent.replace('₽', '').trim()); // Парсим цену как число
            const productImage = productCard.querySelector("img").src;

            let cart = getCart();
            let existingProduct = cart.find(item => item.id === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
            }

            saveCart(cart);
            updateCartCount();
        });
    });

    // Обновление корзины и счетчика при загрузке страницы
    updateCartCount();
});

// Переключение тёмной темы
const themeToggleButton = document.getElementById('theme-toggle');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Функция для показа уведомления
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// === Подписка на рассылку ===
const subscribeBtn = document.getElementById('subscribe-btn');
if (subscribeBtn) {
    subscribeBtn.addEventListener('click', () => {
        if (localStorage.getItem('pharmacy_subscribed')) {
            showToast('Вы уже подписались!');
            return;
        }
        // Здесь твоя отправка данных подписки на сервер
        // Если серверный код есть — добавь fetch сюда
        localStorage.setItem('pharmacy_subscribed', 'true');
        showToast('Спасибо за подписку!');
    });
}

// === Отправка отзыва ===
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
    reviewForm.addEventListener('submit', event => {
        event.preventDefault();
        if (localStorage.getItem('pharmacy_reviewed')) {
            showToast('Вы уже оставили отзыв!');
            return;
        }
        const formData = new FormData(reviewForm);
        // Здесь твоя отправка отзыва на сервер
        fetch('submit_review.php', {
            method: 'POST',
            body: formData
        })
            .then(resp => {
                if (!resp.ok) throw new Error('Ошибка сервера');
                return resp.json();
            })
            .then(data => {
                if (data.success) {
                    localStorage.setItem('pharmacy_reviewed', 'true');
                    showToast('Спасибо за отзыв!');
                    reviewForm.reset();
                } else {
                    showToast('Не удалось отправить отзыв.');
                }
            })
            .catch(() => showToast('Ошибка сети, попробуйте позже.'));
    });
}
