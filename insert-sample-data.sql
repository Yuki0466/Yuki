-- =====================================================
-- 电商网站示例数据插入脚本
-- 在创建表结构后运行此脚本
-- =====================================================

-- 1. 插入产品分类数据
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('数码电子', 'electronics', '智能手机、平板电脑、笔记本电脑等电子设备', 1, true),
('服装配饰', 'clothing', '时尚服装、鞋帽、箱包等配饰用品', 2, true),
('家居生活', 'home', '家具、家纺、厨具、生活用品等', 3, true),
('美妆护肤', 'beauty', '护肤品、彩妆、个人护理等美妆产品', 4, true),
('运动户外', 'sports', '运动装备、户外用品、健身器材等', 5, true),
('图书音像', 'books', '图书、音乐、影视等文化产品', 6, true),
('食品生鲜', 'food', '零食、饮料、生鲜食品等', 7, true),
('母婴用品', 'baby', '婴幼儿用品、孕妇用品、玩具等', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. 插入产品数据
INSERT INTO products (name, description, price, original_price, sku, category_id, brand, model, color, size, stock_quantity, images, tags, is_featured, rating, review_count) VALUES
-- 数码电子类
('iPhone 15 Pro Max', '苹果最新旗舰手机，搭载A17 Pro芯片，支持5G网络，钛金属设计', 9999, 10999, 'IPHONE15PM', (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'iPhone 15 Pro Max', '钛金属', '6.7英寸', 50, 
'["https://picsum.photos/400/400?random=1", "https://picsum.photos/400/400?random=2"]', 
'["智能手机", "苹果", "5G", "拍照"]', true, 4.8, 156),

('华为MatePad Pro', '华为高端平板电脑，11英寸OLED屏幕，支持手写笔', 3999, 4499, 'HWMATEPADPRO', (SELECT id FROM categories WHERE slug = 'electronics'), '华为', 'MatePad Pro 11', '深空灰', '11英寸', 30,
'["https://picsum.photos/400/400?random=3", "https://picsum.photos/400/400?random=4"]',
'["平板电脑", "华为", "手写笔", "办公"]', false, 4.6, 89),

('索尼WH-1000XM5', '索尼旗舰降噪耳机，业界领先降噪技术，30小时续航', 2499, 2999, 'SONYXM5', (SELECT id FROM categories WHERE slug = 'electronics'), '索尼', 'WH-1000XM5', '黑色', '头戴式', 80,
'["https://picsum.photos/400/400?random=5", "https://picsum.photos/400/400?random=6"]',
'["降噪耳机", "索尼", "蓝牙", "Hi-Res"]', true, 4.7, 234),

('小米智能手表', '小米手表S3，1.43英寸AMOLED屏幕，支持GPS定位', 899, 1099, 'MIWATCHS3', (SELECT id FROM categories WHERE slug = 'electronics'), '小米', 'Watch S3', '黑色', '46mm', 150,
'["https://picsum.photos/400/400?random=7"]',
'["智能手表", "小米", "GPS", "健康监测"]', false, 4.4, 78),

-- 服装配饰类
('优衣库羽绒服', '优衣库轻薄羽绒服，保暖透气，多色可选', 299, 399, 'UNIQLOJACKET', (SELECT id FROM categories WHERE slug = 'clothing'), 'UNIQLO', 'Ultra Light Down', '藏青色', 'M/L/XL', 120,
'["https://picsum.photos/400/400?random=8", "https://picsum.photos/400/400?random=9"]',
'["羽绒服", "优衣库", "轻薄", "保暖"]', false, 4.3, 67),

('Nike Air Max 270', 'Nike经典跑鞋，Max Air气垫，舒适缓震', 899, 1099, 'NIKEAIRMAX270', (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike', 'Air Max 270', '黑白配色', '36-45码', 200,
'["https://picsum.photos/400/400?random=10", "https://picsum.photos/400/400?random=11"]',
'["运动鞋", "Nike", "气垫", "跑步"]', true, 4.5, 189),

('阿迪达斯运动背包', '阿迪达斯多功能运动背包，大容量防水设计', 299, 399, 'ADIDASBAG', (SELECT id FROM categories WHERE slug = 'clothing'), 'Adidas', 'Sports Bag', '黑色', '30L', 85,
'["https://picsum.photos/400/400?random=12"]',
'["背包", "阿迪达斯", "运动", "防水"]', false, 4.2, 45),

-- 家居生活类
('小米空气净化器', '小米空气净化器Pro，高效除甲醛，智能控制', 1299, 1499, 'MIAIRPURIFIER', (SELECT id FROM categories WHERE slug = 'home'), '小米', 'Air Purifier Pro', '白色', '52×28×73cm', 60,
'["https://picsum.photos/400/400?random=13", "https://picsum.photos/400/400?random=14"]',
'["空气净化器", "小米", "智能", "除甲醛"]', true, 4.4, 312),

('宜家折叠餐桌', '宜家简约折叠餐桌，节省空间，适合小户型', 599, 799, 'IKEATABLE', (SELECT id FROM categories WHERE slug = 'home'), 'IKEA', 'Foldable Table', '原木色', '120×80×75cm', 40,
'["https://picsum.photos/400/400?random=15"]',
'["餐桌", "宜家", "折叠", "小户型"]', false, 4.2, 45),

('戴森吸尘器', '戴森V12无绳吸尘器，激光探测技术，60分钟续航', 3499, 3999, 'DYSONV12', (SELECT id FROM categories WHERE slug = 'home'), 'Dyson', 'V12 Detect', '蓝色', '手持式', 35,
'["https://picsum.photos/400/400?random=16", "https://picsum.photos/400/400?random=17"]',
'["吸尘器", "戴森", "无绳", "激光探测"]', true, 4.8, 156),

-- 美妆护肤类
('SK-II神仙水', 'SK-II护肤精华露，改善肌肤质地，提亮肤色', 1450, 1699, 'SKII', (SELECT id FROM categories WHERE slug = 'beauty'), 'SK-II', 'Facial Treatment Essence', '透明', '230ml', 85,
'["https://picsum.photos/400/400?random=18", "https://picsum.photos/400/400?random=19"]',
'["精华液", "SK-II", "护肤", "美白"]', true, 4.7, 234),

('雅诗兰黛小棕瓶', '雅诗兰黛特润修护肌活精华露，抗衰老神器', 680, 880, 'ELASTEE', (SELECT id FROM categories WHERE slug = 'beauty'), 'Estée Lauder', 'Advanced Night Repair', '琥珀色', '50ml', 120,
'["https://picsum.photos/400/400?random=20"]',
'["精华液", "雅诗兰黛", "抗衰老", "修护"]', false, 4.6, 189),

('资生堂红腰子', '资生堂红腰子精华，增强肌肤免疫力', 590, 790, 'SHISEIDO', (SELECT id FROM categories WHERE slug = 'beauty'), '资生堂', 'Ultimune Power Infusing Concentrate', '红色', '50ml', 95,
'["https://picsum.photos/400/400?random=21"]',
'["精华液", "资生堂", "免疫力", "修护"]', false, 4.5, 167),

-- 运动户外类
('迪卡侬帐篷', '迪卡侬双人露营帐篷，防风雨设计，快速搭建', 299, 399, 'DECATHLON', (SELECT id FROM categories WHERE slug = 'sports'), '迪卡侬', 'Tent 2P', '橙色', '2人', 65,
'["https://picsum.photos/400/400?random=22", "https://picsum.photos/400/400?random=23"]',
'["帐篷", "迪卡侬", "露营", "防风雨"]', false, 4.3, 89),

('Keep健身垫', 'Keep专业瑜伽垫，加厚防滑设计，多种颜色可选', 199, 299, 'KEEPYOGA', (SELECT id FROM categories WHERE slug = 'sports'), 'Keep', 'Yoga Mat Pro', '紫色', '6mm', 200,
'["https://picsum.photos/400/400?random=24"]',
'["瑜伽垫", "Keep", "防滑", "健身"]', true, 4.4, 278),

('佳明运动手表', '佳明Forerunner 245专业跑步手表，GPS定位，心率监测', 1899, 2199, 'GARMIN245', (SELECT id FROM categories WHERE slug = 'sports'), 'Garmin', 'Forerunner 245', '黑色', '42mm', 75,
'["https://picsum.photos/400/400?random=25", "https://picsum.photos/400/400?random=26"]',
'["运动手表", "佳明", "跑步", "GPS"]', false, 4.6, 123),

-- 图书音像类
('人类简史', '尤瓦尔·赫拉利经典著作，从石器时代到21世纪的人类发展史', 68, 88, 'HISTORY001', (SELECT id FROM categories WHERE slug = 'books'), '中信出版社', '平装版', '蓝色', '16开', 500,
'["https://picsum.photos/400/400?random=27"]',
'["历史", "人类学", "科普", "畅销书"]', true, 4.8, 456),

('三体全集', '刘慈欣科幻巨著，雨果奖获奖作品', 128, 168, 'THREEBODY', (SELECT id FROM categories WHERE slug = 'books'), '重庆出版社', '套装', '彩色', '精装', 300,
'["https://picsum.photos/400/400?random=28"]',
'["科幻", "刘慈欣", "雨果奖", "宇宙"]', true, 4.9, 789),

-- 食品生鲜类
('星巴克咖啡豆', '星巴克首选咖啡豆，中度烘焙，口感醇厚', 98, 128, 'STARBUCKS', (SELECT id FROM categories WHERE slug = 'food'), 'Starbucks', 'Premium Beans', '棕色', '1kg', 150,
'["https://picsum.photos/400/400?random=29"]',
'["咖啡豆", "星巴克", "进口", "醇厚"]', false, 4.5, 234),

('进口红酒', '法国波尔多红酒，AOC级别，2018年酿造', 268, 368, 'REDWINE', (SELECT id FROM categories WHERE slug = 'food'), '波尔多酒庄', 'AOC 2018', '红色', '750ml', 80,
'["https://picsum.photos/400/400?random=30"]',
'["红酒", "法国", "进口", "AOC"]', false, 4.3, 67),

-- 母婴用品类
('惠氏奶粉', '惠氏启赋有机奶粉，荷兰原装进口', 398, 458, 'WYETHMILK', (SELECT id FROM categories WHERE slug = 'baby'), '惠氏', '启赋有机', '金色', '3段', 120,
'["https://picsum.photos/400/400?random=31"]',
'["奶粉", "惠氏", "有机", "进口"]', true, 4.7, 189),

('乐高积木', '乐高城市系列消防局套装，适合6-12岁儿童', 299, 359, 'LEGO', (SELECT id FROM categories WHERE slug = 'baby'), '乐高', 'City Fire Station', '红色', '适合6-12岁', 95,
'["https://picsum.photos/400/400?random=32", "https://picsum.photos/400/400?random=33"]',
'["积木", "乐高", "益智", "消防"]', false, 4.8, 267)
ON CONFLICT (sku) DO NOTHING;

-- 3. 插入一些优惠券
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, is_active, starts_at, expires_at) VALUES
('WELCOME10', '新用户专享优惠券', '新用户注册即可获得', 'percentage', 10, 100, 1000, true, now(), now() + interval '30 days'),
('SAVE50', '满500减50', '订单满500元可使用', 'fixed', 50, 500, 500, true, now(), now() + interval '60 days'),
('FREESHIP', '免运费券', '满199元免运费', 'free_shipping', 0, 199, 2000, true, now(), now() + interval '90 days'),
('FLASH20', '限时八折优惠', '限时特惠，全场8折', 'percentage', 20, 200, 300, true, now(), now() + interval '7 days')
ON CONFLICT (code) DO NOTHING;

-- 4. 插入一些示例评价
INSERT INTO reviews (product_id, user_id, rating, title, content, images, is_verified_purchase, is_approved) VALUES
-- iPhone 15 Pro Max 的评价
((SELECT id FROM products WHERE sku = 'IPHONE15PM'), (SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1), 5, '非常满意的购买体验', '手机性能很强，拍照效果出色，电池续航也很好。钛金属手感很好，就是价格有点贵。', '["https://picsum.photos/200/200?random=100"]', true, true),
((SELECT id FROM products WHERE sku = 'IPHONE15PM'), (SELECT id FROM users WHERE email = 'jane.smith@example.com' LIMIT 1), 4, '整体不错', '用了两周了，各方面都很满意，就是充电器需要另外购买有点不方便。', '[]', true, true),

-- 索尼耳机的评价
((SELECT id FROM products WHERE sku = 'SONYXM5'), (SELECT id FROM users WHERE email = 'mike.wilson@example.com' LIMIT 1), 5, '降噪效果惊人', '索尼的降噪技术确实厉害，在地铁上几乎听不到噪音，音质也很好。', '["https://picsum.photos/200/200?random=101"]', true, true),

-- 小米空气净化器的评价
((SELECT id FROM products WHERE sku = 'MIAIRPURIFIER'), (SELECT id FROM users WHERE email = 'sarah.johnson@example.com' LIMIT 1), 4, '性价比很高', '净化效果明显，噪音也可以接受，APP控制很方便。', '[]', true, true)

ON CONFLICT (product_id, user_id) DO NOTHING;

-- =====================================================
-- 更新统计信息
-- =====================================================

-- 更新产品评价统计
UPDATE products p SET
    review_count = (
        SELECT COUNT(*) 
        FROM reviews r 
        WHERE r.product_id = p.id AND r.is_approved = true
    ),
    rating = COALESCE(
        (
            SELECT AVG(rating) 
            FROM reviews r 
            WHERE r.product_id = p.id AND r.is_approved = true
        ), 0
    );

-- =====================================================
-- 输出统计信息
-- =====================================================

DO $$
DECLARE
    category_count INTEGER;
    product_count INTEGER;
    coupon_count INTEGER;
    review_count INTEGER;
BEGIN
    -- 获取统计信息
    SELECT COUNT(*) INTO category_count FROM categories WHERE is_active = true;
    SELECT COUNT(*) INTO product_count FROM products WHERE is_active = true;
    SELECT COUNT(*) INTO coupon_count FROM coupons WHERE is_active = true;
    SELECT COUNT(*) INTO review_count FROM reviews WHERE is_approved = true;
    
    -- 输出统计信息
    RAISE NOTICE '🎉 示例数据插入完成！';
    RAISE NOTICE '📊 统计信息：';
    RAISE NOTICE '   - 产品分类: % 个', category_count;
    RAISE NOTICE '   - 产品数量: % 个', product_count;
    RAISE NOTICE '   - 优惠券: % 个', coupon_count;
    RAISE NOTICE '   - 产品评价: % 个', review_count;
    RAISE NOTICE '';
    RAISE NOTICE '💡 提示：';
    RAISE NOTICE '   - 如需添加用户数据，请通过网站注册功能';
    RAISE NOTICE '   - 可以通过网站管理功能添加更多产品';
    RAISE NOTICE '   - 评价数据会随着用户购买和评价自动增加';
END $$;