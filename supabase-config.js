// Supabase 配置文件
// 请将以下配置替换为您的实际 Supabase 项目配置

const SUPABASE_CONFIG = {
    // 从 Supabase 项目设置中获取这些值
    url: 'https://mttizdeqmqvpmnwqrfgw.supabase.co', // 例如: https://your-project-id.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dGl6ZGVxbXF2cG1ud3FyZmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzU4MjMsImV4cCI6MjA3OTIxMTgyM30.3h-YKDqf8umJIO93cNKe0Lzb-VWibQTL8t9smFoZ3D8', // 匿名密钥
    
    // 可选：如果需要服务端权限
    serviceRoleKey: 'YOUR_SUPABASE_SERVICE_ROLE_KEY',
    
    // 数据库配置
    database: {
        // 表名常量
        tables: {
            USERS: 'users',
            PRODUCTS: 'products',
            CATEGORIES: 'categories',
            ORDERS: 'orders',
            ORDER_ITEMS: 'order_items',
            CART_ITEMS: 'cart_items',
            USER_ADDRESSES: 'user_addresses',
            REVIEWS: 'reviews',
            COUPONS: 'coupons',
            COUPON_USAGES: 'coupon_usages'
        },
        
        // 默认分页配置
        pagination: {
            defaultLimit: 20,
            maxLimit: 100
        }
    },
    
    // 认证配置
    auth: {
        // 会话持续时间（毫秒）
        sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7天
        
        // 重定向URL（用于OAuth登录）
        redirectTo: window.location.origin,
        
        // 支持的认证提供者
        providers: ['email', 'google', 'github', 'facebook']
    },
    
    // 存储配置
    storage: {
        // 产品图片存储桶
        productImages: 'product-images',
        // 用户头像存储桶
        avatars: 'avatars',
        // 评价图片存储桶
        reviewImages: 'review-images'
    },
    
    // 功能开关
    features: {
        // 是否启用实时订阅
        realtime: true,
        // 是否启用缓存
        cache: true,
        // 是否启用离线支持
        offline: false
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
} else {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}