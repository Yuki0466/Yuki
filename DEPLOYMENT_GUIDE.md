# 🚀 电商网站完整部署和使用指南

## 📋 目录

1. [项目概述](#项目概述)
2. [环境准备](#环境准备)
3. [数据库设置](#数据库设置)
4. [本地测试](#本地测试)
5. [Netlify 部署](#netlify-部署)
6. [功能测试](#功能测试)
7. [常见问题](#常见问题)
8. [后续优化](#后续优化)

---

## 🎯 项目概述

这是一个功能完整的电商网站，集成了 Supabase 作为后端服务，包含：

### 核心功能
- ✅ 用户注册/登录
- ✅ 产品展示和搜索
- ✅ 购物车管理
- ✅ 订单管理
- ✅ 产品评价
- ✅ 优惠券系统

### 技术栈
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **部署**: Netlify (静态网站托管)

### 文件结构
```
20251120/
├── index.html                 # 首页
├── products.html              # 产品列表页
├── product-detail.html         # 产品详情页
├── cart.html                  # 购物车页面
├── setup-database.html        # 数据库设置工具
├── styles.css                 # 样式文件
├── script.js                  # 主要JavaScript逻辑
├── supabase-config.js         # Supabase配置
├── supabase-client.js         # Supabase客户端封装
├── create-tables.sql          # 创建表SQL脚本
├── insert-sample-data.sql      # 插入示例数据SQL
├── DEPLOYMENT_GUIDE.md        # 本指南
└── README-SUPABASE.md         # Supabase集成说明
```

---

## 🛠️ 环境准备

### 1. 必需账号
- [GitHub](https://github.com) (代码托管)
- [Supabase](https://supabase.com) (数据库和认证)
- [Netlify](https://netlify.com) (网站部署)

### 2. 本地工具
- [Visual Studio Code](https://code.visualstudio.com) (推荐编辑器)
- [Git](https://git-scm.com) (版本控制)
- 现代浏览器 (Chrome, Firefox, Safari)

### 3. 项目获取
```bash
# 如果您已经有了项目代码
cd /path/to/project

# 或者克隆项目（如果有远程仓库）
git clone <your-repository-url>
cd 20251120
```

---

## 🗄️ 数据库设置

### 步骤 1: 打开数据库设置工具
1. 双击打开 `setup-database.html` 文件
2. 或者在浏览器中打开：`file:///path/to/project/setup-database.html`

### 步骤 2: 检查配置
1. 在设置工具中点击 **"检查配置"**
2. 确保 Supabase 配置正确
3. 如果有错误，检查 `supabase-config.js` 中的 URL 和密钥

### 步骤 3: 创建数据库表
1. 点击 **"显示创建表SQL"**
2. 点击 **"复制SQL"** 按钮
3. 访问 [Supabase SQL 编辑器](https://supabase.com/dashboard/project/mttizdeqmqvpmnwqrfgw/sql/new)
4. 粘贴 SQL 并点击 **"Run"** 执行

### 步骤 4: 插入示例数据
1. 点击 **"显示插入数据SQL"**
2. 点击 **"复制SQL"** 按钮
3. 在 Supabase SQL 编辑器中粘贴并执行
4. 这将创建产品分类、产品、优惠券等示例数据

### 步骤 5: 验证数据库
1. 点击 **"验证数据库"**
2. 确认所有表都存在且有数据
3. 如果有错误，检查 SQL 执行结果

---

## 🧪 本地测试

### 方法 1: 直接打开文件
```bash
# 在浏览器中打开首页
open index.html

# 或者使用双击打开文件
```

### 方法 2: 使用本地服务器
```bash
# 使用 Python (推荐)
python -m http.server 8000

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8000
```
然后访问: `http://localhost:8000`

### 测试功能清单

#### 基础功能
- [ ] 页面加载正常
- [ ] 导航链接工作正常
- [ ] 响应式设计（手机/平板/桌面）

#### 用户功能
- [ ] 用户注册
- [ ] 用户登录
- [ ] 密码重置
- [ ] 用户资料更新

#### 产品功能
- [ ] 产品列表显示
- [ ] 产品分类筛选
- [ ] 产品搜索
- [ ] 产品详情查看
- [ ] 产品评价查看

#### 购物车功能
- [ ] 添加到购物车
- [ ] 购物车数量修改
- [ ] 购物车商品删除
- [ ] 购物车总价计算

#### 订单功能
- [ ] 创建订单
- [ ] 订单列表查看
- [ ] 订单详情查看

---

## 🌐 Netlify 部署

### 步骤 1: 推送代码到 GitHub
```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit: E-commerce website with Supabase"

# 添加远程仓库
git remote add origin https://github.com/Yuki0466/Yuki.git
git branch -M main
git push -u origin main
```

### 步骤 2: 配置 Netlify
1. 访问 [Netlify](https://netlify.com) 并登录
2. 点击 **"New site from Git"**
3. 选择 **"GitHub"** 并授权
4. 选择您的仓库 `Yuki0466/Yuki`
5. 配置构建设置：
   - **Build command**: 留空（静态网站）
   - **Publish directory**: 留空（根目录）
   - **Node version**: 18（或默认）

### 步骤 3: 设置环境变量
在 Netlify 的 **Site settings → Environment variables** 中添加：

```
VITE_SUPABASE_URL = https://mttizdeqmqvpmnwqrfgw.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dGl6ZGVxbXF2cG1ud3FyZmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzU4MjMsImV4cCI6MjA3OTIxMTgyM30.3h-YKDqf8umJIO93cNKe0Lzb-VWibQTL8t9smFoZ3D8
```

### 步骤 4: 部署网站
1. 点击 **"Deploy site"**
2. 等待部署完成（约2-3分钟）
3. 获得网站 URL：`https://your-site-name.netlify.app`

### 步骤 5: 配置自定义域名（可选）
1. 在 Netlify 控制台中点击 **"Domain settings"**
2. 添加自定义域名
3. 配置 DNS 记录
4. 获取 SSL 证书

---

## 🧪 功能测试

### 测试用户流程

#### 完整购物流程
1. **注册新用户**
   - 访问首页
   - 点击登录 → 注册
   - 填写邮箱和密码
   - 验证邮箱（如果需要）

2. **浏览产品**
   - 浏览产品列表
   - 使用分类筛选
   - 搜索产品
   - 查看产品详情

3. **添加到购物车**
   - 在产品页面添加到购物车
   - 查看购物车
   - 修改数量
   - 删除商品

4. **创建订单**
   - 从购物车结算
   - 填写收货地址
   - 选择支付方式
   - 提交订单

5. **查看订单**
   - 在订单页面查看历史订单
   - 查看订单详情

### 数据验证
登录 Supabase 控制台，检查：
- **users 表**: 新注册用户
- **cart_items 表**: 购物车数据
- **orders 表**: 订单记录
- **order_items 表**: 订单详情

---

## ❓ 常见问题

### Q1: Supabase 连接失败
**症状**: 网页显示"无法连接到数据库"
**解决方案**:
1. 检查 `supabase-config.js` 中的 URL 和密钥
2. 确认 Supabase 项目是否运行
3. 检查网络连接和防火墙设置

### Q2: 数据库表不存在
**症状**: 查询时提示"relation does not exist"
**解决方案**:
1. 运行 `create-tables.sql` 脚本
2. 检查 SQL 执行是否有错误
3. 确认表名拼写正确

### Q3: 购物车数据不保存
**症状**: 刷新页面后购物车数据丢失
**解决方案**:
1. 确保用户已登录
2. 检查行级安全策略设置
3. 查看浏览器控制台错误信息

### Q4: 部署后页面空白
**症状**: Netlify 部署成功但页面空白
**解决方案**:
1. 检查浏览器控制台错误
2. 确认环境变量设置正确
3. 检查文件路径和引用

### Q5: 样式显示异常
**症状**: 页面布局错乱或样式缺失
**解决方案**:
1. 确认 CSS 文件路径正确
2. 检查 CDN 资源是否加载
3. 验证响应式设计

### Q6: 图片不显示
**症状**: 产品图片无法加载
**解决方案**:
1. 检查图片 URL 是否正确
2. 确认图片服务器可访问
3. 考虑使用 Supabase Storage

---

## 🔧 后续优化

### 性能优化
- [ ] 图片懒加载
- [ ] 代码分割
- [ ] CDN 加速
- [ ] 缓存策略

### 功能扩展
- [ ] 支付集成（支付宝/微信）
- [ ] 邮件通知
- [ ] 实时聊天
- [ ] 管理后台
- [ ] 移动 App

### 安全加固
- [ ] HTTPS 强制
- [ ] 输入验证加强
- [ ] 访问频率限制
- [ ] 数据备份策略

### SEO 优化
- [ ] Meta 标签优化
- [ ] 结构化数据
- [ ] 站点地图
- [ ] 页面加载速度优化

---

## 📞 获取帮助

### 资源链接
- [Supabase 文档](https://supabase.com/docs)
- [Netlify 文档](https://docs.netlify.com)
- [MDN Web 文档](https://developer.mozilla.org)

### 故障排除步骤
1. 查看浏览器控制台错误
2. 检查 Supabase 控制台日志
3. 验证网络连接
4. 逐步测试各个功能

### 联系方式
- 项目问题：在 GitHub 中创建 Issue
- 技术支持：查看项目文档和社区

---

## 🎉 恭喜！

如果您按照本指南完成了所有步骤，您现在拥有一个功能完整的电商网站！

### 🚀 下一步可以：
1. 开始测试和定制您的网站
2. 添加自己的产品数据
3. 配置支付系统
4. 推广您的网站

### 📚 继续学习：
- 学习更多 Supabase 功能
- 探索现代前端框架
- 了解电商运营知识

**祝您使用愉快！** 🎊