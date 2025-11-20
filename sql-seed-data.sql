-- Supabase 数据库初始化脚本
-- 在 Supabase SQL 编辑器中运行此脚本来创建初始数据

-- 1. 插入产品分类数据
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('数码电子', 'electronics', '智能手机、平板电脑、笔记本电脑等电子设备', 1, true),
('服装配饰', 'clothing', '时尚服装、鞋帽、箱包等配饰用品', 2, true),
('家居生活', 'home', '家具、家纺、厨具、生活用品等', 3, true),
('美妆护肤', 'beauty', '护肤品、彩妆、个人护理等美妆产品', 4, true),
('运动户外', 'sports', '运动装备、户外用品、健身器材等', 5, true),
('图书音像', 'books', '图书、音乐、影视等文化产品', 6, true),
('食品生鲜', 'food', '零食、饮料、生鲜食品等', 7, true),
('母婴用品', 'baby', '婴幼儿用品、孕妇用品、玩具等', 8, true);

-- 2. 插入产品数据
INSERT INTO products (name, description, price, original_price, sku, category_id, brand, model, color, size, weight, stock_quantity, images, tags, is_featured, rating, review_count) VALUES
-- 数码电子类
('iPhone 15 Pro Max', '苹果最新旗舰手机，搭载A17 Pro芯片，支持5G网络', 9999, 10999, 'IPHONE15PM', (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'iPhone 15 Pro Max', '钛金属', '6.7英寸', '221g', 50, 
'["https://via.placeholder.com/400x400/2c3e50/ffffff?text=iPhone+15+Pro+Max"]', 
'["智能手机", "苹果", "5G", "拍照"]', true, 4.8, 156),

('华为MatePad Pro', '华为高端平板电脑，11英寸OLED屏幕，支持手写笔', 3999, 4499, 'HWMATEPADPRO', (SELECT id FROM categories WHERE slug = 'electronics'), '华为', 'MatePad Pro 11', '深空灰', '11英寸', '449g', 30,
'["https://via.placeholder.com/400x400/3498db/ffffff?text=Huawei+MatePad+Pro"]',
'["平板电脑", "华为", "手写笔", "办公"]', false, 4.6, 89),

('索尼WH-1000XM5', '索尼旗舰降噪耳机，业界领先降噪技术，30小时续航', 2499, 2999, 'SONYXM5', (SELECT id FROM categories WHERE slug = 'electronics'), '索尼', 'WH-1000XM5', '黑色', '头戴式', '250g', 80,
'["https://via.placeholder.com/400x400/e74c3c/ffffff?text=Sony+WH-1000XM5"]',
'["降噪耳机", "索尼", "蓝牙", "Hi-Res"]', true, 4.7, 234),

-- 服装配饰类
('优衣库羽绒服', '优衣库轻薄羽绒服，保暖透气，多色可选', 299, 399, 'UNIQLOJACKET', (SELECT id FROM categories WHERE slug = 'clothing'), 'UNIQLO', 'Ultra Light Down', '藏青色', 'M/L/XL', '280g', 120,
'["https://via.placeholder.com/400x300/9b59b6/ffffff?text=UNIQLO+羽绒服"]',
'["羽绒服", "优衣库", "轻薄", "保暖"]', false, 4.3, 67),

('Nike Air Max 270', 'Nike经典跑鞋，Max Air气垫，舒适缓震', 899, 1099, 'NIKEAIRMAX270', (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike', 'Air Max 270', '黑白配色', '36-45码', '320g', 200,
'["https://via.placeholder.com/400x400/16a085/ffffff?text=Nike+Air+Max+270"]',
'["运动鞋", "Nike", "气垫", "跑步"]', true, 4.5, 189),

-- 家居生活类
('小米空气净化器', '小米空气净化器Pro，高效除甲醛，智能控制', 1299, 1499, 'MIAIRPURIFIER', (SELECT id FROM categories WHERE slug = 'home'), '小米', 'Air Purifier Pro', '白色', '52×28×73cm', '9.7kg', 60,
'["https://via.placeholder.com/400x400/27ae60/ffffff?text=小米+空气净化器"]',
'["空气净化器", "小米", "智能", "除甲醛"]', true, 4.4, 312),

('宜家折叠餐桌', '宜家简约折叠餐桌，节省空间，适合小户型', 599, 799, 'IKEATABLE', (SELECT id FROM categories WHERE slug = 'home'), 'IKEA', 'Foldable Table', '原木色', '120×80×75cm', '15kg', 40,
'["https://via.placeholder.com/400x400/d35400/ffffff?text=宜家+折叠餐桌"]',
'["餐桌", "宜家", "折叠", "小户型"]', false, 4.2, 45),

-- 美妆护肤类
('SK-II神仙水', 'SK-II护肤精华露，改善肌肤质地，提亮肤色', 1450, 1699, 'SKII', (SELECT id FROM categories WHERE slug = 'beauty'), 'SK-II', 'Facial Treatment Essence', '透明', '230ml', '350g', 85,
'["https://via.placeholder.com/400x400/f39c12/ffffff?text=SK-II神仙水"]',
'["精华", "SK-II", "护肤", "美白"]', true, 4.8, 567),

('雅诗兰黛小棕瓶', '雅诗兰黛特润修护肌透精华露，抗老修护', 880, 980, 'ESTEELAUDER', (SELECT id FROM categories WHERE slug = 'beauty'), '雅诗兰黛', 'Advanced Night Repair', '琥珀色', '50ml', '120g', 120,
'["https://via.placeholder.com/400x400/e67e22/ffffff?text=雅诗兰黛小棕瓶"]',
'["精华", "雅诗兰黛", "抗老", "修护"]', true, 4.7, 423),

-- 运动户外类
('迪卡侬瑜伽垫', '迪卡侬TPE瑜伽垫，防滑环保，加厚设计', 159, 199, 'DECATHLONMAT', (SELECT id FROM categories WHERE slug = 'sports'), '迪卡侬', 'TPE Yoga Mat', '紫色', '183×61×0.8cm', '1.2kg', 300,
'["https://via.placeholder.com/400x400/8e44ad/ffffff?text=迪卡侬瑜伽垫"]',
'["瑜伽垫", "迪卡侬", "防滑", "TPE"]', false, 4.1, 89),

('北面冲锋衣', '北面户外冲锋衣，防水透气，适合登山徒步', 1299, 1599, 'NORTHFACE', (SELECT id FROM categories WHERE slug = 'sports'), 'The North Face', 'DryVent Jacket', '黑色', 'S/L/XL', '450g', 70,
'["https://via.placeholder.com/400x400/2c3e50/ffffff?text=北面冲锋衣"]',
'["冲锋衣", "北面", "防水", "户外"]', true, 4.6, 178),

-- 图书音像类
('人类简史', '尤瓦尔·赫拉利畅销书，从认知革命到人工智能', 68, 88, 'SAPIENS', (SELECT id FROM categories WHERE slug = 'books'), '中信出版社', '人类简史', '精装', '16开', '500g', 500,
'["https://via.placeholder.com/400x500/34495e/ffffff?text=人类简史"]',
'["历史", "人类学", "畅销书", "科普"]', false, 4.5, 234),

('小王子', '安托万·德·圣埃克苏佩里经典童话，全彩插图版', 39, 49, 'LITTLEPRINCE', (SELECT id FROM categories WHERE slug = 'books'), '人民文学出版社', '小王子', '精装', '32开', '300g', 800,
'["https://via.placeholder.com/400x500/e74c3c/ffffff?text=小王子"]',
'["童话", "经典", "插图", "文学"]', false, 4.8, 456),

-- 食品生鲜类
('三只松鼠坚果礼盒', '三只松鼠混合坚果礼盒，营养健康，送礼佳品', 128, 158, 'SANSONGSHU', (SELECT id FROM categories WHERE slug = 'food'), '三只松鼠', '坚果礼盒', '彩盒', '1.5kg', '1.8kg', 200,
'["https://via.placeholder.com/400x400/27ae60/ffffff?text=三只松鼠礼盒"]',
'["坚果", "礼盒", "零食", "健康"]', true, 4.4, 567),

('农夫山泉矿泉水', '农夫山泉天然矿泉水，源自千岛湖，甘甜清冽', 45, 55, 'NONGFUSPRING', (SELECT id FROM categories WHERE slug = 'food'), '农夫山泉', '天然矿泉水', '透明', '550ml×24瓶', '15kg', 1000,
'["https://via.placeholder.com/400x400/3498db/ffffff?text=农夫山泉"]',
'["矿泉水", "农夫山泉", "天然", "饮用水"]', false, 4.2, 189),

-- 母婴用品类
('美德乐吸奶器', '美德乐电动吸奶器，双边吸乳，静音设计', 2888, 3288, 'MEDELA', (SELECT id FROM categories WHERE slug = 'baby'), '美德乐', 'Swing Maxi', '白色', '18×10×23cm', '800g', 50,
'["https://via.placeholder.com/400x400/f39c12/ffffff?text=美德乐吸奶器"]',
'["吸奶器", "美德乐", "电动", "母婴"]', true, 4.7, 234),

('帮宝适纸尿裤', '帮宝适超薄干爽纸尿裤，透气不闷红，超长吸收', 159, 189, 'PAMPERS', (SELECT id FROM categories WHERE slug = 'baby'), '帮宝适', 'Dry Max', '白色', 'L/XL', '1.2kg', 300,
'["https://via.placeholder.com/400x400/9b59b6/ffffff?text=帮宝适纸尿裤"]',
'["纸尿裤", "帮宝适", "超薄", "透气"]', false, 4.3, 678);

-- 3. 插入优惠券数据
INSERT INTO coupons (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, user_usage_limit, starts_at, expires_at, is_active) VALUES
('NEWUSER', '新用户专享', '新用户首单满200减30优惠券', 'fixed', 30, 200, 30, 1000, 1, NOW(), NOW() + INTERVAL '30 days', true),
('SAVE20', '满减优惠', '满500立减20元优惠券', 'fixed', 20, 500, 20, 5000, 5, NOW(), NOW() + INTERVAL '60 days', true),
('DISCOUNT10', '折扣优惠', '全场商品9折优惠券', 'percentage', 10, 100, 100, 2000, 3, NOW(), NOW() + INTERVAL '45 days', true),
('FLASHSALE', '限时特惠', '限时秒杀8折优惠', 'percentage', 20, 299, 150, 800, 2, NOW(), NOW() + INTERVAL '7 days', true),
('FREESHIP', '包邮优惠', '满99元包邮优惠券', 'fixed', 15, 99, 15, 10000, 10, NOW(), NOW() + INTERVAL '90 days', true);

-- 4. 插入示例用户地址
-- 注意：这需要实际的用户UUID，在实际使用时需要替换

-- 5. 创建视图（可选）
-- 产品详情视图
CREATE OR REPLACE VIEW product_details AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    CASE 
        WHEN p.stock_quantity > p.min_stock_level THEN '有货'
        WHEN p.stock_quantity > 0 THEN '库存紧张'
        ELSE '缺货'
    END as stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- 订单统计视图
CREATE OR REPLACE VIEW order_stats AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    COUNT(DISTINCT user_id) as unique_customers
FROM orders
WHERE status NOT IN ('cancelled', 'pending')
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 用户购物车汇总视图
CREATE OR REPLACE VIEW cart_summary AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(ci.id) as item_count,
    SUM(ci.quantity) as total_quantity,
    SUM(ci.quantity * p.price) as total_value
FROM users u
LEFT JOIN cart_items ci ON u.id = ci.user_id
LEFT JOIN products p ON ci.product_id = p.id
GROUP BY u.id, u.email;

-- 6. 创建存储过程（可选）
-- 更新产品库存的存储过程
CREATE OR REPLACE FUNCTION update_product_stock(
    p_product_id UUID,
    p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - p_quantity,
        updated_at = NOW()
    WHERE id = p_product_id;
    
    -- 如果库存低于最小值，可以触发补货提醒
    IF (SELECT stock_quantity FROM products WHERE id = p_product_id) <= 
       (SELECT min_stock_level FROM products WHERE id = p_product_id) THEN
        -- 这里可以添加补货提醒逻辑
        RAISE NOTICE 'Product % stock is low', p_product_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. 插入一些示例评价数据
-- 注意：这需要实际的用户UUID，在实际使用时需要替换

-- 创建触发器函数自动更新产品评分
CREATE OR REPLACE FUNCTION update_product_rating_trigger()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE product_id = NEW.product_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE product_id = NEW.product_id
        ),
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_product_rating
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating_trigger();

-- 8. 设置 RLS（行级安全）策略的示例
-- 注意：这些需要在 Supabase 仪表板中设置或通过 SQL 执行

-- 以下是创建 RLS 策略的 SQL，需要在 Supabase 中启用 RLS 后执行

-- ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 购物车 RLS 策略
-- CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Users can delete own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- 订单 RLS 策略
-- CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户地址 RLS 策略
-- CREATE POLICY "Users can view own addresses" ON user_addresses FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own addresses" ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own addresses" ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Users can delete own addresses" ON user_addresses FOR DELETE USING (auth.uid() = user_id);

-- 评价 RLS 策略
-- CREATE POLICY "Users can view reviews" ON reviews FOR SELECT USING (true);
-- CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- 提交所有更改
COMMIT;