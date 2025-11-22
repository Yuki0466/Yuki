-- =====================================================
-- 电商网站数据库表结构创建脚本
-- 在 Supabase SQL 编辑器中运行此脚本
-- =====================================================

-- 1. 创建必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 创建产品分类表
CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    slug varchar(255) UNIQUE NOT NULL,
    description text,
    image_url text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. 创建产品表
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    description text,
    price decimal(10,2) NOT NULL,
    original_price decimal(10,2),
    sku varchar(100) UNIQUE NOT NULL,
    category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    brand varchar(100),
    model varchar(100),
    color varchar(100),
    size varchar(100),
    weight decimal(8,2),
    dimensions varchar(100),
    stock_quantity integer DEFAULT 0,
    images jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT '{}',
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    rating decimal(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    username varchar(100) UNIQUE,
    first_name varchar(100),
    last_name varchar(100),
    phone varchar(20),
    avatar_url text,
    role varchar(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
    is_active boolean DEFAULT true,
    email_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5. 创建用户地址表
CREATE TABLE IF NOT EXISTS user_addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    type varchar(50) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
    recipient_name varchar(255) NOT NULL,
    phone varchar(20),
    province varchar(100),
    city varchar(100),
    district varchar(100),
    street_address text NOT NULL,
    postal_code varchar(20),
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6. 创建购物车表
CREATE TABLE IF NOT EXISTS cart_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    quantity integer NOT NULL CHECK (quantity > 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- 7. 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number varchar(100) UNIQUE NOT NULL,
    user_id uuid REFERENCES users(id),
    status varchar(50) DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    ),
    total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
    shipping_fee decimal(10,2) DEFAULT 0 CHECK (shipping_fee >= 0),
    tax_amount decimal(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount decimal(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    shipping_address jsonb,
    billing_address jsonb,
    payment_method varchar(50),
    payment_status varchar(50) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'failed', 'refunded')
    ),
    transaction_id varchar(100),
    notes text,
    shipped_at timestamptz,
    delivered_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 8. 创建订单详情表
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id),
    product_name varchar(255) NOT NULL,
    product_price decimal(10,2) NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    subtotal decimal(10,2) NOT NULL,
    product_snapshot jsonb, -- 存储产品快照信息，防止产品信息变更影响历史订单
    created_at timestamptz DEFAULT now()
);

-- 9. 创建产品评价表
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title varchar(255),
    content text,
    images jsonb DEFAULT '[]'::jsonb,
    is_verified_purchase boolean DEFAULT false,
    is_approved boolean DEFAULT true,
    helpful_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(product_id, user_id) -- 每个用户对每个产品只能评价一次
);

-- 10. 创建优惠券表
CREATE TABLE IF NOT EXISTS coupons (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code varchar(50) UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    description text,
    type varchar(50) DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
    value decimal(10,2) NOT NULL CHECK (value >= 0),
    minimum_amount decimal(10,2) DEFAULT 0 CHECK (minimum_amount >= 0),
    usage_limit integer,
    usage_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    starts_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 11. 创建优惠券使用记录表
CREATE TABLE IF NOT EXISTS coupon_usages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount decimal(10,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 创建索引以提高查询性能
-- =====================================================

-- 产品表索引
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_name_gin ON products USING gin(to_tsvector('english', name));

-- 分类表索引
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 购物车表索引
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- 订单表索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- 订单详情表索引
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- 评价表索引
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- 优惠券表索引
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at);

-- =====================================================
-- 创建触发器函数
-- =====================================================

-- 更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 创建行级安全策略 (RLS)
-- =====================================================

-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 用户地址表策略
CREATE POLICY "Users can manage own addresses" ON user_addresses
    FOR ALL USING (auth.uid() = user_id);

-- 购物车表策略
CREATE POLICY "Users can manage own cart items" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- 订单表策略
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- 订单详情表策略
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM orders WHERE id = order_items.order_id
        )
    );

-- 评价表策略
CREATE POLICY "Users can manage own reviews" ON reviews
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- 优惠券使用记录表策略
CREATE POLICY "Users can view own coupon usages" ON coupon_usages
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- 添加注释
-- =====================================================

COMMENT ON TABLE categories IS '产品分类表';
COMMENT ON TABLE products IS '产品信息表';
COMMENT ON TABLE users IS '用户表';
COMMENT ON TABLE user_addresses IS '用户地址表';
COMMENT ON TABLE cart_items IS '购物车表';
COMMENT ON TABLE orders IS '订单表';
COMMENT ON TABLE order_items IS '订单详情表';
COMMENT ON TABLE reviews IS '产品评价表';
COMMENT ON TABLE coupons IS '优惠券表';
COMMENT ON TABLE coupon_usages IS '优惠券使用记录表';

-- =====================================================
-- 创建视图
-- =====================================================

-- 产品详情视图（包含分类信息）
CREATE OR REPLACE VIEW product_details AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- 购物车详情视图（包含产品信息）
CREATE OR REPLACE VIEW cart_details AS
SELECT 
    ci.*,
    p.name as product_name,
    p.price as product_price,
    p.images as product_images,
    p.stock_quantity as product_stock
FROM cart_items ci
JOIN products p ON ci.product_id = p.id;

-- 订单详情视图（包含用户和商品信息）
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.*,
    u.username,
    u.email,
    json_agg(
        json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'product_price', oi.product_price,
            'quantity', oi.quantity,
            'subtotal', oi.subtotal,
            'product_snapshot', oi.product_snapshot
        )
    ) as items
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.username, u.email;

-- =====================================================
-- 数据库设置完成
-- =====================================================

-- 输出成功信息
DO $$
BEGIN
    RAISE NOTICE '✅ 数据库表结构创建完成！';
    RAISE NOTICE '📊 已创建 11 个表：categories, products, users, user_addresses, cart_items, orders, order_items, reviews, coupons, coupon_usages';
    RAISE NOTICE '🔍 已创建必要的索引和触发器';
    RAISE NOTICE '🔐 已启用行级安全策略';
    RAISE NOTICE '📈 已创建有用的视图';
END $$;