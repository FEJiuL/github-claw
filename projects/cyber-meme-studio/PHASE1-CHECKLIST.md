# Phase 1 项目初始化清单

**项目**：赛博梗王内容工作台 - Phase 1 MVP  
**发起日期**：2026-06-04  
**目标完成日期**：2026-06-18  
**团队**：产品PM + 全栈开发 + 前端工程师  

---

## 一、基础设施初始化 (Day 1-2)

### 前端项目初始化

- [ ] 创建前端项目目录
  ```bash
  npm create vite@latest cyber-meme-frontend -- --template vue
  cd cyber-meme-frontend
  npm install
  ```

- [ ] 安装核心依赖
  ```bash
  npm install vue@3.3.0 pinia@2.1.0 axios@1.4.0
  npm install -D vite@4.4.0 @vitejs/plugin-vue@4.3.0
  ```

- [ ] 配置项目结构
  ```
  src/
  ├── components/
  │   ├── TextGenerator.vue
  │   ├── TemplateLibrary.vue
  │   ├── DraftBox.vue
  │   └── Layout.vue
  ├── services/
  │   ├── api.js
  │   └── draftService.js
  ├── stores/
  │   └── index.js
  ├── App.vue
  ├── main.js
  └── style.css
  ```

- [ ] 创建 `vite.config.js`
  ```javascript
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  
  export default defineConfig({
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  })
  ```

- [ ] 配置 `.env.example`
  ```
  VITE_API_BASE_URL=http://localhost:3001
  VITE_APP_TITLE=赛博梗王
  ```

### 后端项目初始化

- [ ] 创建后端项目目录
  ```bash
  mkdir cyber-meme-backend
  cd cyber-meme-backend
  npm init -y
  ```

- [ ] 安装核心依赖
  ```bash
  npm install express@4.18.0 cors@2.8.5 dotenv@16.3.0 openai@4.0.0 express-rate-limit@7.0.0
  npm install -D nodemon@3.0.0
  ```

- [ ] 配置项目结构
  ```
  src/
  ├── index.js
  ├── routes/
  │   ├── generate.js
  │   └── health.js
  ├── services/
  │   └── openai.js
  ├── middleware/
  │   ├── auth.js
  │   └── rateLimit.js
  └── config/
      └── constants.js
  .env.example
  package.json
  README.md
  ```

- [ ] 创建 `package.json` 脚本
  ```json
  {
    "scripts": {
      "start": "node src/index.js",
      "dev": "nodemon src/index.js",
      "test": "jest"
    }
  }
  ```

- [ ] 配置 `.env.example`
  ```
  OPENAI_API_KEY=sk-your-key-here
  OPENAI_MODEL=gpt-4
  NODE_ENV=development
  PORT=3001
  MOCK_MODE=true
  RATE_LIMIT_WINDOW=60000
  RATE_LIMIT_MAX=10
  ```

---

## 二、核心功能开发 (Day 2-4)

### C01 - 文本反鸡汤生成器

#### 前端
- [ ] 创建 `src/components/TextGenerator.vue`
  - [ ] 输入框组件
  - [ ] 风格选择器 (4个风格)
  - [ ] 毒性等级滑块 (1-5)
  - [ ] 生成按钮 + 加载状态
  - [ ] 结果展示区 (3个版本)
  - [ ] 复制 + 收藏按钮

- [ ] 创建 `src/services/api.js`
  ```javascript
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  
  export const generateText = async (params) => {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  }
  ```

- [ ] 创建 `src/services/draftService.js`
  ```javascript
  export const draftService = {
    saveDraft(draft) { /* ... */ },
    getDrafts() { /* ... */ },
    updateDraft(id, updates) { /* ... */ },
    deleteDraft(id) { /* ... */ }
  }
  ```

#### 后端
- [ ] 创建 `src/routes/generate.js`
  - [ ] 接收请求参数 (input, style, toxicity, count)
  - [ ] 调用OpenAI API
  - [ ] 返回格式化结果
  - [ ] 错误处理 (超时/配额)

- [ ] 创建 `src/services/openai.js`
  ```javascript
  const OpenAI = require('openai')
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  
  exports.generateTexts = async (prompt) => {
    // 调用GPT-4
  }
  ```

- [ ] 创建 `src/config/constants.js`
  ```javascript
  exports.STYLE_PROMPTS = {
    'reality-hit': '从现实角度拆解...',
    'economics': '从经济学角度分析...',
    'social': '作为社会观察者评价...',
    'philosophy': '从哲学角度反思...'
  }
  
  exports.TOXICITY_LEVELS = { /* ... */ }
  ```

- [ ] 创建 `src/index.js`
  ```javascript
  const express = require('express')
  const cors = require('cors')
  require('dotenv').config()
  
  const app = express()
  app.use(cors())
  app.use(express.json())
  
  // 路由
  app.use(require('./routes/generate'))
  
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
  ```

#### 联调测试
- [ ] 前后端CORS配置验证
- [ ] API调用成功流程测试
- [ ] 错误处理流程测试
- [ ] 响应时间验证 (<5秒)

**验收标准**：
- ✅ 输入"人生就像一杯茶，不会苦一辈子"
- ✅ 3秒内显示3条不同风格的文案
- ✅ 运营反馈："比我自己想的有意思"

---

### C02 - 基础文案库

- [ ] 创建 `src/data/templates.json`
  ```json
  {
    "templates": [
      {
        "id": "t001",
        "category": "工作观",
        "original": "工作就是折磨",
        "variations": [ /* ... */ ],
        "tags": ["工作", "人生"],
        "popularity": 127,
        "createdAt": "2026-06-01"
      }
    ]
  }
  ```

- [ ] 创建 `src/components/TemplateLibrary.vue`
  - [ ] 搜索框
  - [ ] 分类筛选器
  - [ ] 文案列表展示
  - [ ] 复制按钮
  - [ ] 热度排序

- [ ] 创建 `src/stores/index.js` (Pinia)
  ```javascript
  import { defineStore } from 'pinia'
  import { ref } from 'vue'
  
  export const useTemplateStore = defineStore('templates', () => {
    const templates = ref([])
    
    const loadTemplates = async () => {
      const response = await fetch('/data/templates.json')
      templates.value = await response.json()
    }
    
    return { templates, loadTemplates }
  })
  ```

**验收标准**：
- ✅ 显示5+条之前生成的好文案
- ✅ 快速搜索和复制功能正常
- ✅ 运营反馈："之前的创意没有浪费"

---

### C03 - 简易草稿箱

- [ ] 创建 `src/components/DraftBox.vue`
  - [ ] 展示所有LocalStorage中的草稿
  - [ ] 按时间排序
  - [ ] 按热度排序
  - [ ] 删除单条草稿
  - [ ] 清空全部草稿
  - [ ] 导出为JSON

- [ ] 完善 `draftService.js`
  ```javascript
  export const draftService = {
    saveDraft(draft) {
      const drafts = this.getDrafts()
      drafts.push({
        id: Date.now(),
        ...draft,
        createdAt: new Date()
      })
      localStorage.setItem('drafts', JSON.stringify(drafts))
    },
    
    getDrafts() {
      return JSON.parse(localStorage.getItem('drafts') || '[]')
    }
  }
  ```

- [ ] 在TextGenerator中集成草稿保存
  ```javascript
  // 生成成功后
  draftService.saveDraft({
    input: input.value,
    style: selectedStyle.value,
    results: results.value,
    timestamp: new Date()
  })
  ```

**验收标准**：
- ✅ 关闭网页再打开，草稿还在
- ✅ 可以按时间排序、删除、导出
- ✅ 运营反馈："我的创意被安全保存了"

---

## 三、集成与优化 (Day 4-5)

### 整体UI/UX

- [ ] 创建主布局 `src/components/Layout.vue`
  ```vue
  <template>
    <div class="layout">
      <header class="header">
        <h1>🤖 赛博梗王 · 内容工作台</h1>
        <nav>
          <button @click="activeTab = 'generator'">生成器</button>
          <button @click="activeTab = 'library'">文案库</button>
          <button @click="activeTab = 'drafts'">草稿箱</button>
        </nav>
      </header>
      
      <main class="content">
        <TextGenerator v-if="activeTab === 'generator'" />
        <TemplateLibrary v-if="activeTab === 'library'" />
        <DraftBox v-if="activeTab === 'drafts'" />
      </main>
      
      <footer class="footer">
        <p>Phase 1 MVP · 2026-06-04</p>
      </footer>
    </div>
  </template>
  ```

- [ ] 设计全局样式 `src/style.css`
  ```css
  :root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #48bb78;
    --danger: #f56565;
    --border: #e2e8f0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f7fafc;
  }
  
  .header {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 20px;
  }
  ```

- [ ] 配置 `src/App.vue`
  ```vue
  <template>
    <Layout />
  </template>
  
  <script setup>
  import Layout from './components/Layout.vue'
  </script>
  ```

- [ ] 配置 `src/main.js`
  ```javascript
  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import App from './App.vue'
  
  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')
  ```

### 错误处理与加载态

- [ ] 前端错误处理
  - [ ] API调用失败提示
  - [ ] 网络超时重试
  - [ ] 用户友好的错误消息

- [ ] 后端错误处理
  - [ ] API key无效 → 降级到MOCK_MODE
  - [ ] 超时处理 (5秒内返回结果或失败)
  - [ ] 速率限制提示

- [ ] 加载状态优化
  - [ ] 生成按钮的loading动画
  - [ ] 骨架屏或加载提示
  - [ ] 进度反馈

### 性能优化

- [ ] 前端优化
  - [ ] Vite打包优化
  - [ ] LocalStorage数据限制 (最多100条草稿)
  - [ ] 图片懒加载 (如有)

- [ ] 后端优化
  - [ ] API响应缓存 (简单的内存缓存)
  - [ ] 请求去重

---

## 四、数据埋点 (Day 5)

### 埋点实现

- [ ] 创建 `src/services/analytics.js`
  ```javascript
  export const analytics = {
    trackEvent(eventId, data) {
      console.log(`[${eventId}]`, {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
      
      // 后续可对接第三方分析平台
      // 如：Google Analytics、Mixpanel等
    }
  }
  ```

- [ ] 在TextGenerator中埋点
  ```javascript
  import { analytics } from '@/services/analytics'
  
  async function generate() {
    analytics.trackEvent('EVT_001', {
      input_length: input.value.length,
      style: selectedStyle.value,
      toxicity: toxicity.value
    })
    
    // 生成成功
    analytics.trackEvent('EVT_002', {
      duration_ms: Date.now() - startTime,
      token_count: results.value.reduce((sum, r) => sum + r.text.length, 0)
    })
  }
  ```

- [ ] 在DraftBox中埋点
  ```javascript
  function copyText(text) {
    analytics.trackEvent('EVT_004', {
      result_index: idx,
      text_length: text.length
    })
    navigator.clipboard.writeText(text)
  }
  ```

### 埋点验证
- [ ] 打开浏览器控制台，检查是否有埋点日志
- [ ] 记录各个关键事件的触发情况

---

## 五、部署与上线 (Week 2, Day 1-2)

### 前端部署 (Vercel)

- [ ] 创建GitHub仓库 (或在现有仓库中创建分支)
- [ ] 推送前端代码
- [ ] 连接Vercel
  ```
  1. 登录 https://vercel.com
  2. Import project from GitHub
  3. 选择 cyber-meme-frontend 仓库
  4. 配置环境变量 (VITE_API_BASE_URL)
  5. Deploy
  ```

- [ ] 验证前端可访问

### 后端部署 (Render/Railway)

**选项A：Render**
- [ ] 创建 `render.yaml`
  ```yaml
  services:
    - type: web
      name: cyber-meme-backend
      env: node
      buildCommand: npm install
      startCommand: npm start
      envVars:
        - key: OPENAI_API_KEY
          value: ${OPENAI_API_KEY}
        - key: MOCK_MODE
          value: false
  ```

- [ ] 连接Render
  ```
  1. 登录 https://render.com
  2. New -> Web Service
  3. 选择GitHub仓库
  4. 选择 render.yaml
  5. 添加环境变量
  6. Deploy
  ```

**选项B：Railway**
- [ ] 连接Railway
  ```
  1. 登录 https://railway.app
  2. New Project -> GitHub repo
  3. 配置环境变量
  4. Deploy
  ```

### 域名与DNS

- [ ] 购买域名 (可选)
- [ ] 配置Vercel自定义域名
- [ ] 配置后端域名/IP

---

## 六、运营使用与反馈 (Week 2, Day 2-3)

### 运营培训

- [ ] 准备5分钟快速开始指南
- [ ] 演示C01生成流程
- [ ] 演示C02文案库使用
- [ ] 演示C03草稿箱功能

### 收集反馈

- [ ] 准备反馈表单
  ```
  1. 界面是否直观？ (1-5)
  2. 生成的文案质量如何？ (1-5)
  3. 速度是否满意？ (1-5)
  4. 最想要的新功能是什么？(开放)
  5. 有什么建议吗？(开放)
  ```

- [ ] 每日与运营同步
  - [ ] 解答使用问题
  - [ ] 记录痛点
  - [ ] 优先级排序改进项

### 快速迭代

- [ ] 根据反馈修复Bug
- [ ] 优化最常见的不爽点
- [ ] 准备Phase 2需求

---

## 七、文档与总结 (Week 2, Day 4-5)

### 用户文档

- [ ] 创建 `docs/用户指南.md`
  ```markdown
  # 赛博梗王使用指南
  
  ## C01 - 生成器使用
  1. 输入你的鸡汤金句
  2. 选择风格和毒性等级
  3. 点击生成
  4. 复制想要的版本
  
  ## C02 - 文案库查看
  ...
  ```

- [ ] 创建FAQ文档
- [ ] 录制3分钟demo视频

### 技术文档

- [ ] 更新 `PHASE1-TECH.md`
  - [ ] 实际实现的偏差记录
  - [ ] 性能指标总结
  - [ ] 已知问题列表

- [ ] 创建 `docs/埋点数据说明.md`
  ```markdown
  # Phase 1 埋点数据清单
  
  ## 关键指标
  - 日活跃用户数 (DAU)
  - 平均每日生成次数
  - 平均生成耗时
  - 复制率
  - ...
  ```

### 项目总结

- [ ] 制作Phase 1总结报告
  ```markdown
  # Phase 1 MVP 交付总结
  
  ## 目标达成情况
  ✅ 完成度：100%
  ✅ 时间：按计划完成
  ✅ Vibe Check：5/5
  
  ## 关键数据
  - 代码行数：8,500+
  - 功能卡片：3/3
  - Bug修复：X个
  
  ## 运营反馈亮点
  - "一键出稿真的很爽"
  - "比我自己想的有意思"
  - ...
  
  ## Phase 2计划
  - C04 图文海报生成
  - ...
  ```

- [ ] 记录到 `DAILY.md`
  ```markdown
  ## 2026-06-18 | Phase 1 完成
  
  ### ✅ 交付内容
  - 完整的MVP工作台
  - 3个核心功能卡片
  - 用户文档和API文档
  
  ### 🎯 Vibe Check 结果
  - 运营使用反馈：非常满意
  - 生成速度：平均2秒
  - 复制率：78%
  
  ### 📈 下一步
  - 启动Phase 2
  - 准备图文生成API集成
  ```

---

## 八、收尾清单

### Code Quality
- [ ] 代码格式化 (Prettier)
- [ ] Linting 通过 (ESLint)
- [ ] 代码注释完整
- [ ] 无console.log留存

### 测试
- [ ] 手动测试所有功能
- [ ] 跨浏览器测试 (Chrome/Safari/Firefox)
- [ ] 移动端适配测试
- [ ] 网络不稳定场景测试

### 安全
- [ ] API key未泄露到前端
- [ ] CORS配置正确
- [ ] 速率限制生效
- [ ] 输入验证完整

### 性能
- [ ] 前端首屏加载<3秒
- [ ] API响应<5秒
- [ ] LocalStorage数据量合理
- [ ] 无内存泄漏

### 部署
- [ ] 前端部署成功
- [ ] 后端部署成功
- [ ] 前后端联调通过
- [ ] 监控告警配置

---

## 九、关键日期与里程碑

| 日期 | 任务 | 状态 |
|------|------|------|
| 2026-06-04 | Phase 0 Kickoff | ✅ |
| 2026-06-05 | 基础设施初始化 | ⏳ |
| 2026-06-07 | C01 功能完成 | ⏳ |
| 2026-06-09 | C02 + C03 功能完成 | ⏳ |
| 2026-06-11 | 集成测试 & 部署 | ⏳ |
| 2026-06-13 | 运营使用反馈 | ⏳ |
| 2026-06-18 | Phase 1 完成 & 总结 | ⏳ |

---

## 十、应急预案

### 问题：API成本超预期
**解决方案**：
- 启用MOCK_MODE，返回样本数据
- 数据结构不变，前端无需修改
- 后续切换到真实API

### 问题：LLM生成质量差
**解决方案**：
- 调整prompt和temperature参数
- 增加few-shot examples
- 考虑更换模型或provider

### 问题：部署失败
**解决方案**：
- 回退到前一个提交
- 使用本地开发环境让运营用
- 并行修复部署问题

---

## 签核清单

- [ ] **产品PM** 已读，同意方案
- [ ] **开发团队** 已读，评估完成
- [ ] **运营负责人** 已读，准备数据
- [ ] **安全/合规** 已审核

---

**文档所有者**：产品经理  
**最后更新**：2026-06-04  
**版本**：1.0  
**状态**：⏳ 待执行
