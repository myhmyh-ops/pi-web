document.addEventListener('DOMContentLoaded', () => {
    // 购物车状态
    let cart = [];
    let cartTotal = 0;

    // DOM元素
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalElement = document.querySelector('.cart-total span');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    // 切换购物车显示
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // 添加到购物车
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const productPrice = parseFloat(card.querySelector('.price').textContent.replace('¥', ''));
            
            addToCart({
                name: productName,
                price: productPrice
            });
        });
    });

    // 商品筛选
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            products.forEach(product => {
                if (filter === 'all' || product.classList.contains(filter)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // 添加商品到购物车
    function addToCart(product) {
        cart.push(product);
        cartTotal += product.price;
        updateCartUI();
    }

    // 更新购物车UI
    function updateCartUI() {
        // 更新购物车数量
        cartCount.textContent = cart.length;
        
        // 更新购物车总额
        cartTotalElement.textContent = `¥${cartTotal.toFixed(2)}`;
        
        // 更新购物车商品列表
        cartItems.innerHTML = cart.map(item =>
            `<div class="cart-item">
                <span>${item.name}</span>
                <span>¥${item.price.toFixed(2)}</span>
            </div>`
        ).join('');
    }

    // 获取所有定制按钮
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // 直接跳转到联系页面
            window.location.href = 'contact.html';
        });
    });
}); 