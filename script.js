// 全局变量
let currentUser = null;
let cart = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentCategory = 'all';
let currentPriceRange = null;
let currentSort = 'default';

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
async function initializeApp() {
    try {
        // 等待 Supabase 客户端初始化
        if (window.supabaseManager) {
            // 监听用户认证状态变化
            window.supabaseManager.on('userSignedIn', handleUserSignedIn);
            window.supabaseManager.on('userSignedOut', handleUserSignedOut);
            
            // 获取当前用户
            currentUser = window.supabaseManager.getCurrentUser();
        }
        
        initNavigation();
        updateUIForUserState();
        
        // 根据页面初始化功能
        if (document.getElementById('featured-products')) {
            await loadFeaturedProducts();
        }
        if (document.getElementById('products-grid')) {
            await loadProductsList();
            setupEventListeners();
        }
        if (document.getElementById('cart-items')) {
            await loadCart();
            loadRecommendedProducts();
        }
        if (window.location.pathname.includes('product-detail')) {
            await loadProductDetail();
        }
        
        setupAuthEventListeners();
        
    } catch (error) {
        console.error('应用初始化失败:', error);
        // 如果 Supabase 未配置，回退到本地存储模式
        initializeLocalStorageMode();
    }
}

// 处理用户登录
function handleUserSignedIn(user) {
    currentUser = user;
    updateUIForUserState();
    showSuccessMessage('登录成功！');
}

// 处理用户登出
function handleUserSignedOut() {
    currentUser = null;
    cart = [];
    updateUIForUserState();
    showSuccessMessage('已成功登出');
}

// 根据用户状态更新UI
function updateUIForUserState() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        if (currentUser) {
            userMenu.innerHTML = `
                <div class="user-dropdown-toggle">
                    <a href="#" class="nav-link" onclick="toggleUserDropdown(event)">
                        <i class="fas fa-user"></i>
                        ${currentUser.email || '用户'}
                    </a>
                    <div class="user-dropdown" id="user-dropdown">
                        <a href="#" onclick="showProfile()">个人中心</a>
                        <a href="#" onclick="showOrders()">我的订单</a>
                        <a href="#" onclick="logout()">退出登录</a>
                    </div>
                </div>
            `;
        } else {
            userMenu.innerHTML = `
                <a href="#" class="nav-link" onclick="showLoginModal()">
                    <i class="fas fa-user"></i>
                    登录
                </a>
            `;
        }
    }
}

// 用户下拉菜单切换
function toggleUserDropdown(event) {
    event.preventDefault();
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// 本地存储模式（回退方案）
function initializeLocalStorageMode() {
    currentUser = null;
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('使用本地存储模式');
    
    // 初始化其他功能
    initNavigation();
    
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    if (document.getElementById('products-grid')) {
        loadProductsList();
        setupEventListeners();
    }
    if (document.getElementById('cart-items')) {
        loadCart();
        loadRecommendedProducts();
    }
    if (window.location.pathname.includes('product-detail')) {
        loadProductDetail();
    }
}

// ==================== 认证相关功能 ====================

// 设置认证事件监听器
function setupAuthEventListeners() {
    // 登录表单
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    }
    
    // 注册表单
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleRegister();
        });
    }
}

// 处理登录
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!window.supabaseManager) {
        // 本地模拟登录
        showSuccessMessage('本地模式：登录成功');
        currentUser = { email: email };
        updateUIForUserState();
        closeLoginModal();
        return;
    }
    
    try {
        const { data, error } = await window.supabaseManager.signIn(email, password);
        
        if (error) {
            showSuccessMessage('登录失败: ' + error.message);
        } else {
            closeLoginModal();
        }
    } catch (error) {
        showSuccessMessage('登录错误: ' + error.message);
    }
}

// 处理注册
async function handleRegister() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const username = document.getElementById('register-username').value;
    const phone = document.getElementById('register-phone').value;
    
    if (!window.supabaseManager) {
        // 本地模拟注册
        showSuccessMessage('本地模式：注册成功');
        currentUser = { email: email, username: username };
        updateUIForUserState();
        closeRegisterModal();
        return;
    }
    
    try {
        const { data, error } = await window.supabaseManager.signUp(email, password, {
            username: username,
            phone: phone
        });
        
        if (error) {
            showSuccessMessage('注册失败: ' + error.message);
        } else {
            showSuccessMessage('注册成功！请查收邮箱验证链接');
            closeRegisterModal();
        }
    } catch (error) {
        showSuccessMessage('注册错误: ' + error.message);
    }
}

// 用户登出
async function logout() {
    if (!window.supabaseManager) {
        // 本地模拟登出
        currentUser = null;
        cart = [];
        localStorage.removeItem('cart');
        updateUIForUserState();
        updateCartCount();
        return;
    }
    
    try {
        const { error } = await window.supabaseManager.signOut();
        if (error) {
            showSuccessMessage('登出失败: ' + error.message);
        }
    } catch (error) {
        showSuccessMessage('登出错误: ' + error.message);
    }
}

// 模态框控制
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function showRegisterModal() {
    closeLoginModal();
    const modal = document.getElementById('register-modal');
    if (modal) modal.style.display = 'flex';
}

function closeRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) modal.style.display = 'none';
}

function showProfile() {
    showSuccessMessage('个人中心功能开发中...');
}

function showOrders() {
    window.location.href = 'orders.html';
}

// ==================== 产品相关功能 ====================

// 模拟产品数据（本地模式）
const mockProducts = [
    {
        id: 1,
        name: "智能手表 Pro",
        price: 1299,
        original_price: 1599,
        image: "https://via.placeholder.com/300x200/3498db/ffffff?text=智能手表",
        category: "electronics",
        description: "新一代智能手表，支持心率监测、运动追踪、消息提醒等功能。",
        rating: 4.8,
        review_count: 156,
        stock_quantity: 50
    },
    {
        id: 2,
        name: "无线蓝牙耳机",
        price: 399,
        original_price: 499,
        image: "https://via.placeholder.com/300x200/e74c3c/ffffff?text=无线耳机",
        category: "electronics",
        description: "高品质无线蓝牙耳机，主动降噪，续航24小时。",
        rating: 4.7,
        review_count: 234,
        stock_quantity: 80
    }
    // 可以添加更多产品...
];

// 加载特色产品
async function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    try {
        let products = [];
        
        if (window.supabaseManager) {
            // 从 Supabase 获取产品
            const { data, error } = await window.supabaseManager.getProducts({
                is_featured: true,
                limit: 4
            });
            
            if (error) {
                console.error('获取产品失败:', error);
                products = mockProducts.slice(0, 4);
            } else {
                products = data || [];
            }
        } else {
            // 使用模拟数据
            products = mockProducts.slice(0, 4);
        }
        
        featuredContainer.innerHTML = products.map(product => createProductCard(product)).join('');
        
    } catch (error) {
        console.error('加载特色产品失败:', error);
        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<p>加载产品失败，请稍后重试</p>';
        }
    }
}

// 加载产品列表
async function loadProductsList() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    try {
        let products = [];
        
        if (window.supabaseManager) {
            const options = {
                page: currentPage,
                limit: itemsPerPage,
                sortBy: currentSort === 'default' ? 'created_at' : currentSort.replace('-', ''),
                sortOrder: currentSort.includes('-desc') ? 'desc' : 'asc'
            };
            
            if (currentCategory !== 'all') {
                options.category = currentCategory;
            }
            
            const { data, error } = await window.supabaseManager.getProducts(options);
            
            if (error) {
                console.error('获取产品失败:', error);
                products = mockProducts;
            } else {
                products = data || [];
            }
        } else {
            // 使用本地数据和筛选
            let filteredProducts = mockProducts;
            
            if (currentCategory !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
            }
            
            // 应用价格筛选
            if (currentPriceRange) {
                const [min, max] = currentPriceRange.split('-').map(p => p.replace('+', ''));
                filteredProducts = filteredProducts.filter(product => {
                    if (max) {
                        return product.price >= parseInt(min) && product.price <= parseInt(max);
                    } else {
                        return product.price >= parseInt(min);
                    }
                });
            }
            
            // 应用排序
            const sortedProducts = [...filteredProducts].sort((a, b) => {
                switch (currentSort) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'name':
                        return a.name.localeCompare(b.name);
                    default:
                        return 0;
                }
            });
            
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            products = sortedProducts.slice(startIndex, endIndex);
        }
        
        productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
        updatePagination();
        
    } catch (error) {
        console.error('加载产品列表失败:', error);
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = '<p>加载产品失败，请稍后重试</p>';
        }
    }
}

// 创建产品卡片
function createProductCard(product) {
    const stockStatus = product.stock_quantity > 20 ? 'in-stock' : 
                       product.stock_quantity > 0 ? 'low-stock' : 'out-of-stock';
    const stockText = product.stock_quantity > 20 ? '有货' : 
                     product.stock_quantity > 0 ? '库存紧张' : '缺货';
    
    return `
        <div class="product-card" onclick="goToProductDetail(${product.id})">
            <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="rating-stars">
                    ${generateStars(product.rating || 4.5)}
                    <span class="rating-number">(${product.review_count || 0})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">¥${product.price}</span>
                    ${product.original_price ? `<span class="product-original-price">¥${product.original_price}</span>` : ''}
                </div>
                <div class="stock-status ${stockStatus}">${stockText}</div>
                <button class="add-to-cart" onclick="addToCartFromCard(${product.id}, event)">
                    ${product.stock_quantity > 0 ? '加入购物车' : '暂时缺货'}
                </button>
            </div>
        </div>
    `;
}

// 生成评分星星
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// 跳转到产品详情页
function goToProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// ==================== 购物车功能 ====================

// 添加到购物车（从产品卡片）
async function addToCartFromCard(productId, event) {
    event.stopPropagation();
    
    if (!currentUser) {
        showSuccessMessage('请先登录后再添加商品到购物车');
        showLoginModal();
        return;
    }
    
    try {
        if (window.supabaseManager) {
            const { data, error } = await window.supabaseManager.addToCart(productId, 1);
            
            if (error) {
                showSuccessMessage('添加失败: ' + error.message);
            } else {
                updateCartCount();
                showSuccessMessage('商品已添加到购物车！');
            }
        } else {
            // 本地存储模式
            const product = mockProducts.find(p => p.id === productId);
            if (product && product.stock_quantity > 0) {
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        ...product,
                        quantity: 1
                    });
                }
                
                saveCart();
                updateCartCount();
                showSuccessMessage('商品已添加到购物车！');
            } else {
                showSuccessMessage('商品库存不足');
            }
        }
    } catch (error) {
        console.error('添加到购物车失败:', error);
        showSuccessMessage('添加失败，请重试');
    }
}

// 更新购物车数量
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        if (window.supabaseManager && currentUser) {
            // 从 Supabase 获取购物车数量
            window.supabaseManager.getCart().then(({ data, error }) => {
                if (!error && data) {
                    const totalItems = data.reduce((total, item) => total + item.quantity, 0);
                    cartCount.textContent = totalItems;
                }
            });
        } else {
            // 本地存储模式
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
}

// 加载购物车
async function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    
    try {
        let cartData = [];
        
        if (window.supabaseManager && currentUser) {
            const { data, error } = await window.supabaseManager.getCart();
            
            if (error) {
                console.error('获取购物车失败:', error);
                cartData = [];
            } else {
                cartData = data || [];
            }
        } else {
            cartData = cart;
        }
        
        if (cartData.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartContent) cartContent.style.display = 'grid';
            
            if (cartItems) {
                cartItems.innerHTML = cartData.map(item => createCartItem(item)).join('');
            }
            updateCartSummary();
        }
        
    } catch (error) {
        console.error('加载购物车失败:', error);
    }
}

// 创建购物车项目
function createCartItem(item) {
    const product = item.product_snapshot || item;
    return `
        <div class="cart-item">
            <div class="cart-item-info">
                <img src="${product.image || 'https://via.placeholder.com/80x80'}" alt="${product.name}" class="cart-item-image">
                <div>
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">¥${product.price}</div>
                </div>
            </div>
            <div class="cart-item-price">¥${product.price}</div>
            <div class="cart-item-quantity">
                <button onclick="updateCartItemQuantity('${item.id}', -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" max="99" 
                       onchange="updateCartItemQuantityFromInput('${item.id}', this.value)">
                <button onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-subtotal">¥${(product.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">删除</button>
        </div>
    `;
}

// 更新购物车汇总
function updateCartSummary() {
    let cartData = [];
    
    if (window.supabaseManager && currentUser) {
        // 从 Supabase 获取最新购物车数据
        window.supabaseManager.getCart().then(({ data, error }) => {
            if (!error && data) {
                calculateCartSummary(data);
            }
        });
    } else {
        cartData = cart;
        calculateCartSummary(cartData);
    }
}

function calculateCartSummary(cartData) {
    const subtotal = cartData.reduce((total, item) => {
        const product = item.product_snapshot || item;
        return total + (product.price * item.quantity);
    }, 0);
    
    const shipping = subtotal >= 199 ? 0 : 20;
    const total = subtotal + shipping;
    
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `¥${subtotal.toFixed(2)}`;
    }
    if (document.getElementById('shipping')) {
        document.getElementById('shipping').textContent = shipping === 0 ? '免运费' : `¥${shipping.toFixed(2)}`;
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = `¥${total.toFixed(2)}`;
    }
}

// ==================== 事件监听器设置 ====================

// 导航菜单切换
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 分类筛选
    document.querySelectorAll('.category-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.category-list a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.dataset.category;
            currentPage = 1;
            loadProductsList();
        });
    });
    
    // 价格筛选
    document.querySelectorAll('.price-filter a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.price-filter a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentPriceRange = link.dataset.price;
            currentPage = 1;
            loadProductsList();
        });
    });
    
    // 排序选择
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            loadProductsList();
        });
    }
    
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 分页功能
function changePage(direction) {
    const totalPages = Math.ceil(mockProducts.length / itemsPerPage); // 简化处理
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadProductsList();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(mockProducts.length / itemsPerPage); // 简化处理
    const currentPageElement = document.getElementById('current-page');
    const totalPagesElement = document.getElementById('total-pages');
    
    if (currentPageElement) currentPageElement.textContent = currentPage;
    if (totalPagesElement) totalPagesElement.textContent = totalPages;
}

// ==================== 工具函数 ====================

// 保存购物车到本地存储
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 显示成功消息
function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    if (successText) {
        successText.textContent = message;
    }
    
    if (successMessage) {
        successMessage.style.display = 'flex';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
    
    // 关闭用户下拉菜单
    if (!e.target.closest('.user-dropdown-toggle')) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }
});

// 产品详情页加载
async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) return;
    
    try {
        let product = null;
        
        if (window.supabaseManager) {
            const { data, error } = await window.supabaseManager.getProduct(productId);
            
            if (error) {
                console.error('获取产品详情失败:', error);
                product = mockProducts.find(p => p.id === productId);
            } else {
                product = data;
            }
        } else {
            product = mockProducts.find(p => p.id === productId);
        }
        
        if (product) {
            updateProductDetailUI(product);
        } else {
            showSuccessMessage('产品不存在');
        }
        
    } catch (error) {
        console.error('加载产品详情失败:', error);
        showSuccessMessage('加载失败，请重试');
    }
}

function updateProductDetailUI(product) {
    // 更新产品基本信息
    const nameElement = document.getElementById('product-name');
    const priceElement = document.getElementById('product-price');
    const originalPriceElement = document.getElementById('product-original-price');
    const descriptionElement = document.getElementById('product-description');
    
    if (nameElement) nameElement.textContent = product.name;
    if (priceElement) priceElement.textContent = `¥${product.price}`;
    if (originalPriceElement) originalPriceElement.textContent = `¥${product.original_price}`;
    if (descriptionElement) descriptionElement.textContent = product.description;
    
    // 更新产品图片
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail img');
    
    if (mainImage) mainImage.src = product.image || 'https://via.placeholder.com/400x400';
    
    thumbnails.forEach((thumb, index) => {
        thumb.src = product.image || 'https://via.placeholder.com/80x80';
    });
    
    // 缩略图点击事件
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (mainImage) mainImage.src = product.image || 'https://via.placeholder.com/400x400';
        });
    });
    
    // 更新评分显示
    const ratingElements = document.querySelectorAll('.product-rating .stars');
    ratingElements.forEach(element => {
        if (product.rating) {
            element.innerHTML = generateStars(product.rating);
        }
    });
}

// 加载推荐商品
function loadRecommendedProducts() {
    const recommendedContainer = document.getElementById('recommended-products');
    if (!recommendedContainer) return;
    
    // 简化：推荐前3个产品
    const recommended = mockProducts.slice(0, 3).map(product => `
        <div class="recommended-item" onclick="goToProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="recommended-item-image">
            <div class="recommended-item-info">
                <div class="recommended-item-name">${product.name}</div>
                <div class="recommended-item-price">¥${product.price}</div>
            </div>
        </div>
    `).join('');
    
    recommendedContainer.innerHTML = recommended;
}

// 数量修改功能
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    const currentValue = parseInt(quantityInput.value) || 1;
    const newValue = Math.max(1, Math.min(99, currentValue + change));
    quantityInput.value = newValue;
}

// 结算功能
function checkout() {
    if (!currentUser) {
        showSuccessMessage('请先登录后再结算');
        showLoginModal();
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
        // 这里可以加载订单信息到模态框
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
}

function confirmOrder() {
    // 简化处理
    showSuccessMessage('订单提交成功！');
    closeCheckoutModal();
    
    // 清空购物车
    if (window.supabaseManager && currentUser) {
        window.supabaseManager.clearCart();
    } else {
        cart = [];
        saveCart();
    }
    
    // 跳转到订单页面
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// 优惠码功能
function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value;
    
    if (promoCode === 'SAVE10') {
        showSuccessMessage('优惠码应用成功！');
        // 这里应该重新计算价格
    } else {
        showSuccessMessage('无效的优惠码');
    }
}

// 购物车项目数量更新（占位函数）
function updateCartItemQuantity(itemId, change) {
    showSuccessMessage('更新数量功能开发中...');
}

function updateCartItemQuantityFromInput(itemId, value) {
    showSuccessMessage('更新数量功能开发中...');
}

function removeFromCart(itemId) {
    showSuccessMessage('删除功能开发中...');
}