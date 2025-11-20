# 电商网站 Supabase 集成指南

## 项目概述

本项目是一个功能完整的电商网站，集成了 Supabase 作为后端服务，提供了用户认证、数据存储、实时更新等功能。

## 项目结构

```
20251120/
├── index.html                 # 首页
├── products.html              # 产品列表页
├── product-detail.html         # 产品详情页
├── cart.html                  # 购物车页面
├── styles.css                 # 样式文件
├── script.js                  # 主要JavaScript逻辑
├── supabase-config.js         # Supabase配置文件
├── supabase-client.js         # Supabase客户端封装
├── database-schema.md         # 数据库表结构设计
├── sql-seed-data.sql          # 初始化数据脚本
└── README-SUPABASE.md         # 本文件
```

## 核心功能

### 🔐 用户认证
- 邮箱登录/注册
- 密码重置
- 用户状态管理
- 会话持久化

### 🛒 购物车管理
- 添加/删除商品
- 数量修改
- 实时价格计算
- 本地存储回退

### 📦 产品管理
- 产品分类筛选
- 价格区间筛选
- 搜索功能
- 评分系统

### 📋 订单系统
- 订单创建
- 订单状态跟踪
- 订单历史查看
- 支付集成准备

## 数据库表结构

### 核心表（必需）
1. **users** - 用户信息表
2. **products** - 产品信息表
3. **orders** - 订单表
4. **order_items** - 订单详情表

### 扩展表（推荐）
5. **categories** - 产品分类表
6. **cart_items** - 购物车表
7. **user_addresses** - 用户地址表
8. **reviews** - 产品评价表
9. **coupons** - 优惠券表
10. **coupon_usages** - 优惠券使用记录表

详细的表结构请参考 `database-schema.md` 文件。

## 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建账号
2. 创建新项目
3. 获取项目的 **URL** 和 **anon key**

### 2. 配置数据库

1. 在 Supabase 仪表板的 SQL 编辑器中
2. 运行 `sql-seed-data.sql` 中的 SQL 脚本
3. 这将创建所有必需的表和初始数据

### 3. 配置项目

1. 打开 `supabase-config.js` 文件
2. 替换以下配置：

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',           // 替换为你的项目URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY',   // 替换为你的anon key
    // ... 其他配置
};
```

### 4. 启用行级安全（RLS）

在 Supabase 仪表板中，为以下表启用 RLS 并设置策略：

```sql
-- 启用RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 购物车策略
CREATE POLICY "Users can view own cart" ON cart_items 
    FOR SELECT USING (auth.uid() = user_id);

-- 其他策略...
```

### 5. 运行项目

1. 将所有文件上传到 Web 服务器
2. 或使用本地服务器（如 Python 的 http.server）：
   ```bash
   python -m http.server 8000
   ```
3. 在浏览器中访问 `http://localhost:8000`

## 功能特性

### 🎨 用户界面
- 响应式设计，支持桌面、平板、手机
- 现代化UI设计，使用CSS Grid和Flexbox
- 平滑动画和过渡效果
- 深色/浅色主题支持（可扩展）

### 📱 用户体验
- 无刷新页面操作
- 实时购物车更新
- 智能搜索建议
- 个性化推荐

### 🔒 安全性
- 行级安全策略
- 输入验证和清理
- XSS防护
- CSRF保护

### ⚡ 性能优化
- 图片懒加载
- 代码分割
- 缓存策略
- CDN支持

## API 使用示例

### 用户注册
```javascript
const { data, error } = await supabaseManager.signUp(
    'user@example.com', 
    'password123', 
    { username: 'username' }
);
```

### 获取产品列表
```javascript
const { data, error } = await supabaseManager.getProducts({
    category: 'electronics',
    page: 1,
    limit: 20
});
```

### 添加到购物车
```javascript
const { data, error } = await supabaseManager.addToCart(
    productId, 
    quantity
);
```

### 创建订单
```javascript
const { data, error } = await supabaseManager.createOrder(
    orderData, 
    orderItems
);
```

## 部署选项

### 1. Vercel 部署
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify 部署
1. 拖拽项目文件夹到 Netlify 管理界面
2. 配置环境变量

### 3. GitHub Pages
1. 创建 GitHub 仓库
2. 启用 GitHub Pages
3. 部署主分支

### 4. 自定义服务器
```bash
# 使用 nginx
sudo apt-get install nginx
# 配置 nginx.conf
sudo systemctl start nginx
```

## 环境变量

在生产环境中，建议使用环境变量：

```bash
# .env 文件
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 监控和分析

### Supabase 监控
- 查看数据库查询性能
- 监控API调用
- 用户行为分析

### 自定义监控
```javascript
// 添加错误监控
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
    // 发送到监控服务
});

// 性能监控
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log('Page load time:', loadTime);
});
```

## 故障排除

### 常见问题

1. **CORS 错误**
   - 在 Supabase 仪表板中添加允许的域名
   - 检查 API 端点配置

2. **认证失败**
   - 确认 anon key 正确
   - 检查用户邮箱验证状态

3. **RLS 策略错误**
   - 确保所有必需的策略都已创建
   - 检查策略条件

4. **连接超时**
   - 检查网络连接
   - 增加超时时间

### 调试模式

启用调试日志：
```javascript
// 在 supabase-client.js 中
console.log('Supabase Debug:', data);
```

## 扩展功能

### 即时通讯
```javascript
// 实时订阅订单状态
const subscription = supabaseManager.client
    .channel('orders')
    .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders' 
    }, (payload) => {
        console.log('Order updated:', payload);
    })
    .subscribe();
```

### 文件上传
```javascript
// 上传产品图片
const { data, error } = await supabaseManager.client.storage
    .from('product-images')
    .upload(`product-${productId}.jpg`, file);
```

### 邮件通知
```javascript
// 使用 Supabase Edge Functions 发送邮件
const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Order Confirmation',
        message: 'Your order has been confirmed!'
    })
});
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请参考 LICENSE 文件。

## 支持

如遇问题，请：
1. 查看 FAQ 部分
2. 搜索 GitHub Issues
3. 创建新的 Issue

## 更新日志

### v2.0.0 (Supabase 集成版)
- ✨ 新增用户认证系统
- ✨ 集成 Supabase 数据库
- ✨ 实现实时购物车功能
- ✨ 添加订单管理系统
- 🐛 修复响应式布局问题
- 🎨 优化用户界面设计

### v1.0.0 (基础版)
- ✨ 基础电商网站功能
- ✨ 产品展示页面
- ✨ 购物车功能（本地存储）
- ✨ 响应式设计

---

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **样式**: Custom CSS (CSS Grid, Flexbox)
- **图标**: Font Awesome 6
- **构建**: 无需构建工具，直接运行

---

*最后更新: 2024年1月*