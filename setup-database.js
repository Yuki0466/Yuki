// 数据库设置和验证工具
// 在浏览器控制台中运行这个脚本来检查和设置数据库

// 首先确保 Supabase 已加载
if (typeof createClient === 'undefined' || typeof SUPABASE_CONFIG === 'undefined') {
    console.error('请先加载 Supabase 库和配置文件');
} else {
    const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    
    // 检查表是否存在
    async function checkTables() {
        const tables = ['products', 'categories', 'users', 'orders', 'cart_items'];
        console.log('🔍 检查数据库表...');
        
        for (const table of tables) {
            try {
                const { data, error, count } = await supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });
                
                if (error) {
                    console.log(`❌ 表 ${table}: ${error.message}`);
                } else {
                    console.log(`✅ 表 ${table}: 存在 (${count} 条记录)`);
                }
            } catch (e) {
                console.log(`❌ 表 ${table}: 检查失败`);
            }
        }
    }
    
    // 创建基础表结构（如果表不存在）
    async function createBasicTables() {
        console.log('🔧 创建基础表结构...');
        
        const createTablesSQL = `
        -- 创建扩展
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- 产品分类表
        CREATE TABLE IF NOT EXISTS categories (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            name varchar(255) NOT NULL,
            slug varchar(255) UNIQUE NOT NULL,
            description text,
            sort_order integer DEFAULT 0,
            is_active boolean DEFAULT true,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        
        -- 产品表
        CREATE TABLE IF NOT EXISTS products (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            name varchar(255) NOT NULL,
            description text,
            price decimal(10,2) NOT NULL,
            original_price decimal(10,2),
            sku varchar(100) UNIQUE NOT NULL,
            category_id uuid REFERENCES categories(id),
            brand varchar(100),
            model varchar(100),
            color varchar(100),
            size varchar(100),
            weight decimal(8,2),
            stock_quantity integer DEFAULT 0,
            images jsonb DEFAULT '[]'::jsonb,
            tags text[] DEFAULT '{}',
            is_featured boolean DEFAULT false,
            is_active boolean DEFAULT true,
            rating decimal(3,2) DEFAULT 0,
            review_count integer DEFAULT 0,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        
        -- 用户表
        CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY,
            email varchar(255) UNIQUE NOT NULL,
            username varchar(100),
            first_name varchar(100),
            last_name varchar(100),
            phone varchar(20),
            avatar_url text,
            role varchar(50) DEFAULT 'customer',
            is_active boolean DEFAULT true,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        
        -- 购物车表
        CREATE TABLE IF NOT EXISTS cart_items (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id uuid REFERENCES users(id) ON DELETE CASCADE,
            product_id uuid REFERENCES products(id) ON DELETE CASCADE,
            quantity integer NOT NULL DEFAULT 1,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now(),
            UNIQUE(user_id, product_id)
        );
        
        -- 订单表
        CREATE TABLE IF NOT EXISTS orders (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_number varchar(100) UNIQUE NOT NULL,
            user_id uuid REFERENCES users(id),
            status varchar(50) DEFAULT 'pending',
            total_amount decimal(10,2) NOT NULL,
            shipping_address jsonb,
            payment_method varchar(50),
            payment_status varchar(50) DEFAULT 'pending',
            notes text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
        
        -- 订单详情表
        CREATE TABLE IF NOT EXISTS order_items (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
            product_id uuid REFERENCES products(id),
            product_name varchar(255) NOT NULL,
            product_price decimal(10,2) NOT NULL,
            quantity integer NOT NULL,
            subtotal decimal(10,2) NOT NULL,
            product_snapshot jsonb,
            created_at timestamptz DEFAULT now()
        );
        `;
        
        console.log('📋 请在 Supabase SQL 编辑器中运行以下 SQL：');
        console.log(createTablesSQL);
        
        console.log('💡 或者访问：');
        console.log('https://supabase.com/dashboard/project/mttizdeqmqvpmnwqrfgw/sql/new');
    }
    
    // 添加基础数据
    async function addBasicData() {
        console.log('📦 添加基础数据...');
        
        const basicDataSQL = `
        -- 插入分类数据
        INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
        ('数码电子', 'electronics', '智能手机、平板电脑、笔记本电脑等电子设备', 1, true),
        ('服装配饰', 'clothing', '时尚服装、鞋帽、箱包等配饰用品', 2, true),
        ('家居生活', 'home', '家具、家纺、厨具、生活用品等', 3, true)
        ON CONFLICT (slug) DO NOTHING;
        
        -- 插入产品数据
        INSERT INTO products (name, description, price, original_price, sku, category_id, brand, stock_quantity, images, is_featured) VALUES
        ('iPhone 15 Pro', '苹果最新旗舰手机', 8999, 9999, 'IPHONE15', (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 50, '[\"https://picsum.photos/400/400?random=1\"]'::jsonb, true),
        ('小米空气净化器', '高效除甲醛空气净化器', 1299, 1599, 'MIAIR', (SELECT id FROM categories WHERE slug = 'home'), '小米', 30, '[\"https://picsum.photos/400/400?random=2\"]'::jsonb, false),
        ('运动T恤', '透气舒适运动T恤', 199, 299, 'SPORTSHIRT', (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike', 100, '[\"https://picsum.photos/400/400?random=3\"]'::jsonb, false)
        ON CONFLICT (sku) DO NOTHING;
        `;
        
        console.log('📋 请在 Supabase SQL 编辑器中运行以下 SQL：');
        console.log(basicDataSQL);
    }
    
    // 测试数据查询
    async function testData() {
        console.log('🧪 测试数据查询...');
        
        try {
            // 查询产品
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*, categories(name)')
                .limit(5);
            
            if (productsError) {
                console.error('产品查询失败:', productsError);
            } else {
                console.log('✅ 产品查询成功:', products);
            }
            
            // 查询分类
            const { data: categories, error: categoriesError } = await supabase
                .from('categories')
                .select('*');
            
            if (categoriesError) {
                console.error('分类查询失败:', categoriesError);
            } else {
                console.log('✅ 分类查询成功:', categories);
            }
            
        } catch (error) {
            console.error('测试失败:', error);
        }
    }
    
    // 将函数暴露到全局
    window.dbSetup = {
        checkTables,
        createBasicTables,
        addBasicData,
        testData
    };
    
    console.log('🚀 数据库设置工具已加载！');
    console.log('可用的命令：');
    console.log('- dbSetup.checkTables() // 检查表是否存在');
    console.log('- dbSetup.createBasicTables() // 显示创建表的SQL');
    console.log('- dbSetup.addBasicData() // 显示插入数据的SQL');
    console.log('- dbSetup.testData() // 测试数据查询');
    
    // 自动检查表
    checkTables();
}