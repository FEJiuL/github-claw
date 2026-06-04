# Phase 1 启动工具包

**项目**：赛博梗王内容工作台 - Phase 1 MVP启动  
**启动日期**：2026-06-04  
**目标完成日期**：2026-06-18  
**团队规模**：3人（产品PM + 全栈开发 + 前端工程师）  

---

## 一、项目初始化（30分钟）

### 1.1 快速启动脚本

将以下脚本保存为 `init-phase1.sh`，运行即可自动创建目录结构。

```bash
#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 赛博梗王 Phase 1 项目初始化${NC}"
echo ""

# 创建前端项目
echo -e "${GREEN}[1/5] 创建前端项目...${NC}"
npm create vite@latest cyber-meme-frontend -- --template vue
cd cyber-meme-frontend
npm install vue@3.3.0 pinia@2.1.0 axios@1.4.0
cd ..

# 创建后端项目
echo -e "${GREEN}[2/5] 创建后端项目...${NC}"
mkdir cyber-meme-backend
cd cyber-meme-backend
npm init -y
npm install express@4.18.0 cors@2.8.5 dotenv@16.3.0 openai@4.0.0 express-rate-limit@7.0.0
npm install -D nodemon@3.0.0
cd ..

# 创建前端目录结构
echo -e "${GREEN}[3/5] 创建前端目录结构...${NC}"
mkdir -p cyber-meme-frontend/src/{components,services,stores,data}
touch cyber-meme-frontend/src/components/{TextGenerator.vue,TemplateLibrary.vue,DraftBox.vue,Layout.vue}
touch cyber-meme-frontend/src/services/{api.js,draftService.js}
touch cyber-meme-frontend/src/stores/index.js
touch cyber-meme-frontend/src/data/templates.json

# 创建后端目录结构
echo -e "${GREEN}[4/5] 创建后端目录结构...${NC}"
mkdir -p cyber-meme-backend/src/{routes,services,middleware,config}
touch cyber-meme-backend/src/routes/{generate.js,health.js}
touch cyber-meme-backend/src/services/openai.js
touch cyber-meme-backend/src/middleware/{auth.js,rateLimit.js}
touch cyber-meme-backend/src/config/constants.js
touch cyber-meme-backend/src/index.js
touch cyber-meme-backend/.env.example

# 创建文档
echo -e "${GREEN}[5/5] 创建项目文档...${NC}"
mkdir -p docs
touch docs/开发指南.md
touch docs/API文档.md

echo ""
echo -e "${BLUE}✅ 初始化完成！${NC}"
echo ""
echo "后续步骤："
echo "1. cd cyber-meme-frontend && npm run dev"
echo "2. cd cyber-meme-backend && npm run dev"
echo "3. 打开 http://localhost:5173"
echo ""
```

### 1.2 运行初始化

```bash
chmod +x init-phase1.sh
./init-phase1.sh
```

完成后的目录结构：
```
.
├── cyber-meme-frontend/
│   ├── src/
│   │   ├── components/ (4个Vue文件)
│   │   ├── services/ (2个JS文件)
│   │   ├── stores/ (1个JS文件)
│   │   ├── data/ (templates.json)
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── cyber-meme-backend/
│   ├── src/
│   │   ├── routes/ (2个JS文件)
│   │   ├── services/ (1个JS文件)
│   │   ├── middleware/ (2个JS文件)
│   │   ├── config/ (1个JS文件)
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── docs/
    ├── 开发指南.md
    └── API文档.md
```

---

## 二、团队协作框架

### 2.1 每日Standup会议（15分钟）

**时间**：每天上午9:30  
**参与者**：PM + 全栈开发 + 前端  
**格式**：

```markdown
# Daily Standup - YYYY-MM-DD

## 产品PM
- 昨天完成：[任务1] [任务2]
- 今天计划：[任务3] [任务4]
- 阻塞项：[如有]

## 全栈开发
- 昨天完成：[后端API] [配置]
- 今天计划：[前后端联调] [错误处理]
- 阻塞项：[如有]

## 前端工程师
- 昨天完成：[组件1] [样式]
- 今天计划：[组件2] [集成]
- 阻塞项：[如有]

## 决议
- [如有重要决定，记录在这里]
```

### 2.2 每日进度日报

每个人在Slack/钉钉/飞书的固定频道发送（建议16:00）：

```
🎯 Day X 进度报告

✅ 完成：
- [ ] 任务A (预计2h，实际2.5h)
- [ ] 任务B (预计3h，实际3h)

⏳ 进行中：
- [ ] 任务C (进度50%)

❌ 阻塞：
- 任务D 因为XXX无法进行

📊 代码行数：+250行
📝 关键提交：commit message
```

### 2.3 周五复盘会（30分钟）

**时间**：每周五16:00  
**内容**：

```markdown
# Week X 复盘 (Day 1-5)

## 📊 数据总结
- 代码总行数：X行
- 功能完成度：Y%
- Bug修复：Z个

## ✅ 亮点
- [做得特别好的事]
- [用户反馈最好的功能]

## ❌ 不足
- [遗留的问题]
- [时间估计不准的地方]

## 🎯 下周计划
- [下周Day 1-5的重点]

## 💡 经验教训
- [学到的东西]
```

---

## 三、分角色任务分配

### 3.1 产品PM职责

**Day 1-2**：
- [ ] 组织项目kickoff会（30分钟）
- [ ] 分配任务给开发和前端
- [ ] 准备Figma设计稿或UI指南
- [ ] 建立Slack/钉钉协作频道

**Day 2-5**：
- [ ] 每日Standup主持人
- [ ] 收集运营端的需求变动
- [ ] 跟进部署前准备（域名、服务器等）
- [ ] 准备上线清单

**Day 5-10**：
- [ ] 协调运营测试
- [ ] 收集反馈
- [ ] 快速迭代Prompt或功能

**Day 10+**：
- [ ] 准备Phase 1总结报告
- [ ] 规划Phase 2

### 3.2 全栈开发职责

**Day 1-2**：
- [ ] 后端项目初始化
- [ ] Express服务器搭建
- [ ] 环境变量配置

**Day 2-3**：
- [ ] 实现 `/api/generate` 端点
- [ ] 集成OpenAI SDK
- [ ] 实现MOCK_MODE降级

**Day 3-4**：
- [ ] 实现速率限制中间件
- [ ] 健康检查端点
- [ ] 错误处理

**Day 4-5**：
- [ ] 与前端联调测试
- [ ] API文档编写
- [ ] 部署前准备

### 3.3 前端工程师职责

**Day 1-2**：
- [ ] 前端项目初始化
- [ ] Vite配置
- [ ] 全局样式搭建

**Day 2-3**：
- [ ] 实现TextGenerator.vue
- [ ] API调用集成
- [ ] 本地数据服务

**Day 3-4**：
- [ ] 实现TemplateLibrary.vue
- [ ] 实现DraftBox.vue
- [ ] LocalStorage集成

**Day 4-5**：
- [ ] 全局布局（Layout.vue）
- [ ] UI细节调整
- [ ] 埋点集成

**Day 5+**：
- [ ] 部署测试
- [ ] 性能优化
- [ ] 浏览器兼容性测试

---

## 四、关键检查点（Gates）

### Gate 1: Day 3 - 后端API可用

**检查清单**：
- [ ] `/api/generate` 端点可调用
- [ ] MOCK_MODE下返回样本数据
- [ ] 错误处理完善
- [ ] CORS配置正确

**签核**：全栈开发 + PM确认

### Gate 2: Day 5 - 前后端联调通过

**检查清单**：
- [ ] C01完整流程可用
- [ ] 能生成3个版本文案
- [ ] 复制功能正常
- [ ] LocalStorage保存草稿

**签核**：前端 + 全栈开发 + PM确认

### Gate 3: Day 7 - 代码质量检查

**检查清单**：
- [ ] 无console.log
- [ ] Linting通过
- [ ] 注释完整
- [ ] 无硬编码密钥

**签核**：PM确认

### Gate 4: Day 10 - 部署准备

**检查清单**：
- [ ] Vercel前端部署文件准备
- [ ] Render后端部署配置准备
- [ ] 环境变量已设置
- [ ] 域名已解析

**签核**：全栈开发 + PM确认

### Gate 5: Day 14 - 上线前最终检查

**检查清单**：
- [ ] 所有功能在生产环境可用
- [ ] 埋点数据正常上报
- [ ] 运营反馈满意度≥4/5
- [ ] 无P0级Bug

**签核**：全体团队确认

---

## 五、快速参考卡片

### 前端开发快速查

| 任务 | 文件 | 关键代码 |
|------|------|--------|
| API调用 | src/services/api.js | `fetch('/api/generate', ...)` |
| 本地存储 | src/services/draftService.js | `localStorage.setItem(...)` |
| 状态管理 | src/stores/index.js | `defineStore(...)` |
| 文本生成组件 | src/components/TextGenerator.vue | `<textarea>` + 按钮 |
| 文案库 | src/components/TemplateLibrary.vue | 列表 + 搜索 |
| 草稿箱 | src/components/DraftBox.vue | 排序 + 删除 |

### 后端开发快速查

| 任务 | 文件 | 关键代码 |
|------|------|--------|
| 服务器 | src/index.js | `app.listen(3001)` |
| 生成API | src/routes/generate.js | `router.post('/api/generate')` |
| LLM调用 | src/services/openai.js | `openai.chat.completions.create()` |
| 速率限制 | src/middleware/rateLimit.js | `express-rate-limit` |
| 常量 | src/config/constants.js | `STYLE_PROMPTS` 定义 |

### 常用npm命令

```bash
# 前端
cd cyber-meme-frontend
npm run dev          # 本地开发 (http://localhost:5173)
npm run build        # 生产构建
npm run preview      # 预览生产版本

# 后端
cd cyber-meme-backend
npm run dev          # 本地开发 (http://localhost:3001)
npm start            # 生产启动
```

---

## 六、运营数据准备

### 6.1 素材数据格式

运营应该按以下格式提供Phase 0收集的素材：

```json
{
  "templates": [
    {
      "id": "t001",
      "category": "工作观",
      "original": "工作就是折磨",
      "variations": [
        {
          "text": "工作确实会让人痛苦，但失业会让人更痛苦",
          "style": "reality-hit",
          "toxicity": 3
        }
      ],
      "tags": ["工作", "人生"],
      "popularity": 0,
      "createdAt": "2026-06-01"
    }
  ]
}
```

保存到：`cyber-meme-frontend/src/data/templates.json`

### 6.2 反馈收集表单

Day 5-10期间，运营使用MVP后填写：

```markdown
# Phase 1 MVP 反馈表

## 基础评分 (1-5)
- 界面是否直观？ __/5
- 生成文案质量如何？ __/5
- 速度是否满意？ __/5
- 整体满意度？ __/5

## 开放反馈
1. 最喜欢的功能是什么？
2. 最希望改进的地方是什么？
3. 最想要的新功能是什么？
4. 其他建议？

## 数据统计（自动填写）
- 使用天数：_天
- 平均日使用时长：_分钟
- 生成总次数：_次
- 复制成功次数：_次
```

---

## 七、应急联系方式

### 技术问题快速解决流程

**问题分类**：

| 问题类型 | 负责人 | 响应时间 |
|---------|--------|---------|
| 前端Bug | 前端工程师 | <30分钟 |
| 后端Bug | 全栈开发 | <30分钟 |
| API问题 | 全栈开发 | <30分钟 |
| 部署问题 | 全栈开发 + PM | <1小时 |
| 产品需求变更 | PM | <2小时 |

### 重要链接

```
项目仓库：[GitHub链接]
Figma设计：[设计链接]
Slack频道：#cyber-meme-phase1
部署地址（前）：[待部署]
部署地址（后）：[待部署]
OpenAI API文档：https://platform.openai.com/docs
```

---

## 八、启动清单（立刻行动）

### 🔴 今天必须完成

- [ ] **PM**：组织kickoff会（30分钟）
  - 参与者：PM + 全栈 + 前端
  - 内容：过一遍PHASE1-CHECKLIST.md，分配任务
  - 签核：全体确认理解

- [ ] **全栈开发**：运行初始化脚本
  ```bash
  chmod +x init-phase1.sh
  ./init-phase1.sh
  ```
  - 签核：目录结构完整

- [ ] **前端工程师**：运行初始化脚本
  - 签核：npm run dev可成功启动

- [ ] **PM**：建立协作频道
  - Slack/钉钉频道创建
  - 邀请所有成员
  - 发送项目概览

### 🟡 明天必须完成

- [ ] **全栈**：Express服务器搭建 + CORS配置
- [ ] **前端**：Vite配置 + 目录结构完整
- [ ] **PM**：准备UI设计稿或色彩规范
- [ ] **PM**：收集运营的Phase 0素材数据

### 🟢 Day 3必须达到

- [ ] **全栈**：`/api/generate` 端点可调用（MOCK模式）
- [ ] **前端**：TextGenerator.vue 基础框架完成
- [ ] **PM**：Gate 1检查（后端API可用）

---

## 九、关键文件速查

| 文件 | 来源 | 用途 |
|------|------|------|
| PHASE1-TECH.md | projects/cyber-meme-studio/ | 技术细节和完整代码 |
| PHASE1-CHECKLIST.md | projects/cyber-meme-studio/ | 逐日任务分解 |
| init-phase1.sh | 本文件 | 自动化初始化 |
| templates.json | 运营提供 | 初始文案库数据 |

---

## 十、成功标志

**Day 5 检查点**：
- ✅ 前后端都能本地运行
- ✅ API调用可成功获得3条样本文案
- ✅ LocalStorage能保存草稿

**Day 10 检查点**：
- ✅ 三个功能都可用
- ✅ 代码质量检查通过
- ✅ 部署配置准备完毕

**Day 14-18 检查点**：
- ✅ 生产环境上线
- ✅ 运营使用反馈≥4/5
- ✅ 埋点数据正常上报
- ✅ 完整文档准备好

---

**文档所有者**：产品PM  
**创建日期**：2026-06-04  
**版本**：1.0  
**状态**：🟢 **立刻可执行**
