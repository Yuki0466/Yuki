# ⚡ 快速开始指南

## 🎯 5分钟快速启动您的电商网站

### 步骤 1: 打开数据库设置工具
```
双击文件: setup-database.html
```

### 步骤 2: 创建数据库表
1. 点击 **"检查配置"** 
2. 点击 **"显示创建表SQL"** → **"复制SQL"**
3. 访问: https://supabase.com/dashboard/project/mttizdeqmqvpmnwqrfgw/sql/new
4. 粘贴SQL并运行

### 步骤 3: 添加示例数据
1. 点击 **"显示插入数据SQL"** → **"复制SQL"**
2. 在Supabase SQL编辑器中粘贴并运行
3. 点击 **"验证数据库"** 确认完成

### 步骤 4: 测试网站
```
双击文件: index.html
```

### 步骤 5: 部署到 Netlify
1. 访问: https://netlify.com
2. 连接您的GitHub仓库
3. 设置环境变量（看DEPLOYMENT_GUIDE.md）
4. 部署完成！

## 📁 重要文件说明

| 文件名 | 用途 |
|--------|------|
| `setup-database.html` | 数据库设置工具 🗄️ |
| `create-tables.sql` | 创建数据库表SQL 📊 |
| `insert-sample-data.sql` | 插入示例数据SQL 📦 |
| `index.html` | 网站首页 🏠 |
| `DEPLOYMENT_GUIDE.md` | 完整部署指南 📖 |

## 🚨 常见问题

**Q: 网站显示"无法连接数据库"**  
A: 运行数据库设置工具中的SQL脚本

**Q: 购物车不保存数据**  
A: 确保已登录用户

**Q: 图片不显示**  
A: 检查网络连接和图片URL

## 💡 需要帮助？

查看完整文档: `DEPLOYMENT_GUIDE.md`

---

**🎉 准备好了吗？开始您的电商之旅吧！**