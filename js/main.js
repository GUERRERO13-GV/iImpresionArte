document.addEventListener('DOMContentLoaded', () => {

    const cartIcon = document.querySelector('.cart-icon');
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCounter = document.querySelector('.cart-counter');
    const cartTotalAmount = document.querySelector('.cart-total-amount');

    let cart = JSON.parse(localStorage.getItem('impresionarte_cart')) || [];

    // --- FUNCIONES ---

    const openCart = () => {
        cartPanel.classList.add('open');
        cartOverlay.classList.add('open');
    };

    const closeCart = () => {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('open');
    };

    const saveCartToStorage = () => {
        localStorage.setItem('impresionarte_cart', JSON.stringify(cart));
    };

    const updateCart = () => {
        renderCartItems();
        updateCartTotal();
        updateCartCounter();
        saveCartToStorage();
    };

    const addProductToCart = (product) => {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    };

    const handleProductClick = (event) => {
        const productElement = event.target.closest('.product-item');
        if (!productElement) return;

        const product = {
            id: productElement.dataset.id,
            name: productElement.dataset.name,
            price: parseFloat(productElement.dataset.price),
            image: productElement.dataset.image,
        };
        addProductToCart(product);
    };

    const renderCartItems = () => {
        cartItemsContainer.innerHTML = ''; // Limpiar el contenedor
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">${item.price.toFixed(2)} €</p>
                        <div class="cart-item-quantity">
                            <span>Cantidad: ${item.quantity}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove-btn">&times;</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    };

    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = `${total.toFixed(2)} €`;
    };

    const updateCartCounter = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    };

    const handleCartActions = (event) => {
        if (event.target.classList.contains('cart-item-remove-btn')) {
            const productElement = event.target.closest('.cart-item');
            const productId = productElement.dataset.id;
            removeProductFromCart(productId);
        }
    };

    const removeProductFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    };


    // --- EVENT LISTENERS ---

    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleProductClick);
    });

    cartItemsContainer.addEventListener('click', handleCartActions);


    // --- INICIALIZACIÓN ---

    updateCart(); // Cargar carrito al iniciar la página
});