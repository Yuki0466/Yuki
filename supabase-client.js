// Supabase 客户端封装
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/module/index.js';

class SupabaseManager {
    constructor() {
        this.client = null;
        this.user = null;
        this.initialized = false;
        this.init();
    }

    // 初始化 Supabase 客户端
    async init() {
        try {
            if (typeof SUPABASE_CONFIG === 'undefined') {
                throw new Error('Supabase 配置未找到，请确保已加载 supabase-config.js');
            }

            this.client = createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    },
                    realtime: SUPABASE_CONFIG.features.realtime,
                    db: {
                        schema: 'public'
                    }
                }
            );

            // 获取当前用户
            const { data: { user }, error } = await this.client.auth.getUser();
            if (!error && user) {
                this.user = user;
                this.emit('userSignedIn', user);
            }

            // 监听认证状态变化
            this.client.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    this.user = session.user;
                    this.emit('userSignedIn', session.user);
                } else if (event === 'SIGNED_OUT') {
                    this.user = null;
                    this.emit('userSignedOut');
                }
            });

            this.initialized = true;
            console.log('Supabase 客户端初始化成功');
        } catch (error) {
            console.error('Supabase 初始化失败:', error);
            throw error;
        }
    }

    // 确保已初始化
    ensureInitialized() {
        if (!this.initialized) {
            throw new Error('Supabase 客户端未初始化');
        }
    }

    // 事件监听器
    listeners = {};

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // ==================== 认证相关方法 ====================

    // 用户注册
    async signUp(email, password, metadata = {}) {
        this.ensureInitialized();
        try {
            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

            if (error) throw error;

            // 创建用户资料记录
            if (data.user) {
                await this.createUserProfile(data.user, metadata);
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // 用户登录
    async signIn(email, password) {
        this.ensureInitialized();
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.user = data.user;
            this.emit('userSignedIn', data.user);

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // 用户登出
    async signOut() {
        this.ensureInitialized();
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;

            this.user = null;
            this.emit('userSignedOut');

            return { error: null };
        } catch (error) {
            return { error };
        }
    }

    // 重置密码
    async resetPassword(email) {
        this.ensureInitialized();
        try {
            const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: `${SUPABASE_CONFIG.auth.redirectTo}/reset-password`
            });

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // 创建用户资料
    async createUserProfile(user, metadata = {}) {
        this.ensureInitialized();
        try {
            const { data, error } = await this.client
                .from(SUPABASE_CONFIG.database.tables.USERS)
                .upsert({
                    id: user.id,
                    email: user.email,
                    username: metadata.username || user.email.split('@')[0],
                    first_name: metadata.first_name || '',
                    last_name: metadata.last_name || '',
                    phone: metadata.phone || '',
                    avatar_url: metadata.avatar_url || '',
                    role: metadata.role || 'customer'
                })
                .select()
                .single();

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // ==================== 数据库操作方法 ====================

    // 通用查询方法
    async select(table, options = {}) {
        this.ensureInitialized();
        try {
            let query = this.client
                .from(table)
                .select(options.columns || '*', { count: 'exact' });

            if (options.filters) {
                Object.entries(options.filters).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        query = query.in(key, value);
                    } else {
                        query = query.eq(key, value);
                    }
                });
            }

            if (options.search) {
                query = query.ilike('name', `%${options.search}%`);
            }

            if (options.orderBy) {
                const { column, ascending = true } = options.orderBy;
                query = query.order(column, { ascending });
            }

            if (options.range) {
                const { from, to } = options.range;
                query = query.range(from, to);
            }

            const { data, error, count } = await query;

            return { data, error, count };
        } catch (error) {
            return { data: null, error };
        }
    }

    // 插入数据
    async insert(table, data, options = {}) {
        this.ensureInitialized();
        try {
            const { data: result, error } = await this.client
                .from(table)
                .insert(data, options)
                .select(options.select || '*')
                .single();

            return { data: result, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // 更新数据
    async update(table, data, filter, options = {}) {
        this.ensureInitialized();
        try {
            let query = this.client
                .from(table)
                .update(data, options)
                .select(options.select || '*');

            if (filter.id) {
                query = query.eq('id', filter.id).single();
            } else {
                Object.entries(filter).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }

            const { data: result, error } = await query;

            return { data: result, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // 删除数据
    async delete(table, filter) {
        this.ensureInitialized();
        try {
            let query = this.client.from(table).delete();

            if (filter.id) {
                query = query.eq('id', filter.id);
            } else {
                Object.entries(filter).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }

            const { data, error } = await query.select('*');

            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    }

    // ==================== 产品相关方法 ====================

    // 获取产品列表
    async getProducts(options = {}) {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            sortBy = 'created_at',
            sortOrder = 'desc',
            page = 1,
            limit = SUPABASE_CONFIG.database.pagination.defaultLimit
        } = options;

        const filters = { is_active: true };

        if (category) {
            filters.category_id = category;
        }

        if (minPrice !== undefined) {
            filters.price = { gte: minPrice };
        }

        if (maxPrice !== undefined) {
            filters.price = { ...filters.price, lte: maxPrice };
        }

        const range = {
            from: (page - 1) * limit,
            to: page * limit - 1
        };

        return this.select(SUPABASE_CONFIG.database.tables.PRODUCTS, {
            filters,
            search,
            orderBy: { column: sortBy, ascending: sortOrder === 'asc' },
            range
        });
    }

    // 获取单个产品
    async getProduct(productId) {
        const { data, error } = await this.select(SUPABASE_CONFIG.database.tables.PRODUCTS, {
            filters: { id: productId, is_active: true }
        });

        return { data: data?.[0], error };
    }

    // ==================== 购物车相关方法 ====================

    // 获取购物车
    async getCart() {
        if (!this.user) {
            return { data: [], error: new Error('用户未登录') };
        }

        return this.select(SUPABASE_CONFIG.database.tables.CART_ITEMS, {
            filters: { user_id: this.user.id },
            orderBy: { column: 'created_at', ascending: false }
        });
    }

    // 添加到购物车
    async addToCart(productId, quantity = 1) {
        if (!this.user) {
            return { data: null, error: new Error('用户未登录') };
        }

        // 检查产品是否存在
        const { data: product, error: productError } = await this.getProduct(productId);
        if (productError || !product) {
            return { data: null, error: new Error('产品不存在') };
        }

        // 检查库存
        if (product.stock_quantity < quantity) {
            return { data: null, error: new Error('库存不足') };
        }

        // 使用 upsert 更新或插入购物车项目
        const { data, error } = await this.client
            .from(SUPABASE_CONFIG.database.tables.CART_ITEMS)
            .upsert({
                user_id: this.user.id,
                product_id: productId,
                quantity
            })
            .select(`
                *,
                products (
                    id,
                    name,
                    price,
                    images
                )
            `)
            .single();

        return { data, error };
    }

    // 更新购物车数量
    async updateCartItemQuantity(itemId, quantity) {
        if (!this.user) {
            return { data: null, error: new Error('用户未登录') };
        }

        if (quantity <= 0) {
            return this.removeFromCart(itemId);
        }

        return this.update(SUPABASE_CONFIG.database.tables.CART_ITEMS, 
            { quantity },
            { id: itemId, user_id: this.user.id }
        );
    }

    // 从购物车移除
    async removeFromCart(itemId) {
        if (!this.user) {
            return { data: null, error: new Error('用户未登录') };
        }

        return this.delete(SUPABASE_CONFIG.database.tables.CART_ITEMS, {
            id: itemId,
            user_id: this.user.id
        });
    }

    // 清空购物车
    async clearCart() {
        if (!this.user) {
            return { data: null, error: new Error('用户未登录') };
        }

        return this.delete(SUPABASE_CONFIG.database.tables.CART_ITEMS, {
            user_id: this.user.id
        });
    }

    // ==================== 订单相关方法 ====================

    // 创建订单
    async createOrder(orderData, items) {
        if (!this.user) {
            return { data: null, error: new Error('用户未登录') };
        }

        // 开始事务
        const { data: order, error: orderError } = await this.insert(
            SUPABASE_CONFIG.database.tables.ORDERS,
            {
                ...orderData,
                user_id: this.user.id,
                order_number: this.generateOrderNumber()
            }
        );

        if (orderError) {
            return { data: null, error: orderError };
        }

        // 插入订单项目
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity,
            subtotal: item.subtotal,
            product_snapshot: item.product_snapshot
        }));

        const { data: orderItemsData, error: itemsError } = await this.insert(
            SUPABASE_CONFIG.database.tables.ORDER_ITEMS,
            orderItems
        );

        if (itemsError) {
            // 回滚订单
            await this.delete(SUPABASE_CONFIG.database.tables.ORDERS, { id: order.id });
            return { data: null, error: itemsError };
        }

        // 清空购物车
        await this.clearCart();

        return { data: { ...order, items: orderItemsData }, error: null };
    }

    // 获取用户订单
    async getUserOrders(options = {}) {
        if (!this.user) {
            return { data: [], error: new Error('用户未登录') };
        }

        const { page = 1, limit = 20 } = options;
        const range = {
            from: (page - 1) * limit,
            to: page * limit - 1
        };

        return this.select(SUPABASE_CONFIG.database.tables.ORDERS, {
            filters: { user_id: this.user.id },
            orderBy: { column: 'created_at', ascending: false },
            range
        });
    }

    // 获取订单详情
    async getOrder(orderId) {
        if (!this.user) {
            return { data: null, error: new Error('用户未登录') };
        }

        const { data, error } = await this.client
            .from(SUPABASE_CONFIG.database.tables.ORDERS)
            .select(`
                *,
                order_items (
                    *,
                    products (
                        name,
                        images
                    )
                )
            `)
            .eq('id', orderId)
            .eq('user_id', this.user.id)
            .single();

        return { data, error };
    }

    // ==================== 工具方法 ====================

    // 生成订单号
    generateOrderNumber() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `ORD${timestamp}${random}`;
    }

    // 获取当前用户
    getCurrentUser() {
        return this.user;
    }

    // 检查是否已登录
    isLoggedIn() {
        return this.user !== null;
    }
}

// 创建全局实例
const supabaseManager = new SupabaseManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = supabaseManager;
} else {
    window.supabaseManager = supabaseManager;
}