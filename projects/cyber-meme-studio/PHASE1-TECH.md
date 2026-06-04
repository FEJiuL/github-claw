# Phase 1 技术方案文档

**项目**：赛博梗王内容工作台  
**阶段**：Phase 1 - 极简流水线 MVP  
**周期**：Week 1-2  
**核心Vibe**：一键出稿的爽感  
**目标用户**：运营/内容创作者  

---

## 一、Phase 1 概览

### 交付目标
做出一个"单机版"的工作台，让运营完成"输入金句 → 生成多版本文案 → 复制使用"的完整闭环，并且使用起来觉得"比我自己想的有意思"。

### 核心功能卡片
| 卡片 | 功能 | 周期 |
|------|------|------|
| **C01** | 文本反鸡汤生成器 | Day 1-3 |
| **C02** | 基础文案库 | Day 3-4 |
| **C03** | 简易草稿箱 | Day 4-5 |

### 技术栈选型

#### 前端
```
框架：Vue 3 (Composition API)
构建：Vite
UI库：shadcn/vue 或 Naive UI
状态管理：Pinia
HTTP客户端：axios
部署：Vercel
```

**选型理由**：
- Vue 3相比React学习曲线平缓，开发速度快
- Vite热更新体验好，适合快速迭代
- shadcn/vue可复制粘贴组件，快速调整样式
- 本地存储用LocalStorage，无需后端DB

#### 后端
```
框架：Node.js + Express (或 FastAPI)
LLM API：OpenAI GPT-4
环境配置：dotenv
部署：Render / Railway / Vercel Serverless
```

**选型理由**：
- Express足够轻量，快速搭建API
- OpenAI官方SDK稳定可靠
- 无需数据库（Phase 1），减少复杂度
- Serverless部署，按使用付费

#### 数据存储
- **前端临时数据**：LocalStorage（生成结果、草稿）
- **配置数据**：JSON文件 (文案库模板)
- **后端临时缓存**：内存 (LLM调用结果)

---

## 二、详细开发方案

### 2.1 C01 - 文本反鸡汤生成器

#### 需求描述
输入一句鸡汤金句，系统调用LLM生成3个不同风格的"反向拆解"文案。

#### 产品设计

**页面布局**：
```
┌─────────────────────────────────────┐
│  赛博梗王 · 反鸡汤生成器            │
├─────────────────────────────────────┤
│ 输入你的鸡汤金句                    │
│ ┌──────────────────────────┐        │
│ │ 人生就像一杯茶，不会苦一│        │
│ │ 辈子                     │        │
│ └──────────────────────────┘        │
│                                     │
│ 风格选择 [毒性指数] [文案长度]    │
│ ○ 现实暴击型  ○ 经济学视角        │
│ ○ 社会观察者  ○ 哲学碎碎念        │
│                                     │
│ 毒性等级 ━━●━━ (中毒)            │
│                                     │
│ [✨ 生成文案]  [🎬 高级选项]      │
├─────────────────────────────────────┤
│ 📋 生成结果                         │
│                                     │
│ ✓ 版本1 [复制] [收藏]               │
│ ┌──────────────────────────┐        │
│ │ 人生就像一杯茶，但如果    │        │
│ │ 你喝了三十年还在苦，那    │        │
│ │ 问题可能不在茶，而在你    │        │
│ │ 的舌头。                  │        │
│ └──────────────────────────┘        │
│                                     │
│ ✓ 版本2 [复制] [收藏]               │
│ ┌──────────────────────────┐        │
│ │ 人生就像一杯茶，而大多    │        │
│ │ 数人喝的是速溶，苦不苦    │        │
│ │ 取决于你愿意付多少钱。    │        │
│ └──────────────────────────┘        │
│                                     │
│ ✓ 版本3 [复制] [收藏]               │
│ ┌──────────────────────────┐        │
│ │ 人生就像一杯茶，但不是    │        │
│ │ 所有人都能喝茶文化。有     │        │
│ │ 人喜欢喝茶，有人就是想    │        │
│ │ 喝可乐。                  │        │
│ └──────────────────────────┘        │
└─────────────────────────────────────┘
```

#### 技术实现

**前端组件** (`src/components/TextGenerator.vue`):
```vue
<template>
  <div class="generator-container">
    <h1>反鸡汤生成器</h1>
    
    <!-- 输入框 -->
    <textarea 
      v-model="input" 
      placeholder="输入鸡汤金句..."
      @keydown.enter="generateWithModifier"
    />
    
    <!-- 风格选择 -->
    <div class="controls">
      <select v-model="selectedStyle">
        <option value="reality-hit">现实暴击型</option>
        <option value="economics">经济学视角</option>
        <option value="social">社会观察者</option>
        <option value="philosophy">哲学碎碎念</option>
      </select>
      
      <input 
        v-model="toxicity" 
        type="range" 
        min="1" 
        max="5"
        label="毒性等级"
      />
    </div>
    
    <!-- 生成按钮 -->
    <button 
      @click="generate"
      :disabled="loading"
    >
      {{ loading ? '生成中...' : '✨ 生成文案' }}
    </button>
    
    <!-- 结果展示 -->
    <div v-if="results.length" class="results">
      <div 
        v-for="(result, idx) in results" 
        :key="idx"
        class="result-card"
      >
        <div class="result-text">{{ result.text }}</div>
        <div class="result-actions">
          <button @click="copyToClipboard(result.text)">📋 复制</button>
          <button @click="saveToFavorites(result)">❤️ 收藏</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const selectedStyle = ref('reality-hit')
const toxicity = ref(3)
const results = ref([])
const loading = ref(false)

async function generate() {
  if (!input.value.trim()) return
  
  loading.value = true
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: input.value,
        style: selectedStyle.value,
        toxicity: toxicity.value,
        count: 3
      })
    })
    
    const data = await response.json()
    results.value = data.results
    
    // 保存到草稿箱
    saveToDrafts({
      input: input.value,
      style: selectedStyle.value,
      results: data.results,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('生成失败:', error)
  } finally {
    loading.value = false
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  // 显示"已复制"提示
}

function saveToFavorites(result) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  favorites.push({...result, savedAt: new Date()})
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

function saveToDrafts(draft) {
  const drafts = JSON.parse(localStorage.getItem('drafts') || '[]')
  drafts.push(draft)
  localStorage.setItem('drafts', JSON.stringify(drafts))
}
</script>

<style scoped>
.generator-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
}

.controls {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}

select, input[type="range"] {
  flex: 1;
  padding: 8px;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.results {
  margin-top: 24px;
}

.result-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.result-text {
  line-height: 1.6;
  margin-bottom: 12px;
  color: #333;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.result-actions button {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  background: #fff;
  color: #667eea;
  border: 1px solid #667eea;
}
</style>
```

**后端API** (`src/routes/generate.js`):
```javascript
const express = require('express')
const OpenAI = require('openai')
const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const STYLE_PROMPTS = {
  'reality-hit': '从现实且有点�扎心的角度拆解这句话',
  'economics': '从经济学角度分析这句话的逻辑漏洞',
  'social': '作为社会观察者评价这句话',
  'philosophy': '从哲学角度反思这句话的假设'
}

const TOXICITY_TEMPLATE = {
  1: '温和，不刺激，适合大众',
  2: '有点犀利，但还可以接受',
  3: '中毒，让人想到自己的问题',
  4: '高毒性，很扎心',
  5: '极毒，可能引发共鸣也可能冒犯'
}

router.post('/api/generate', async (req, res) => {
  const { input, style, toxicity, count } = req.body
  
  if (!input || !style) {
    return res.status(400).json({ error: '缺少必要参数' })
  }
  
  try {
    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS['reality-hit']
    const toxicityDesc = TOXICITY_TEMPLATE[toxicity] || '中等毒性'
    
    const prompt = `
你是一个"反向鸡汤"文案大师。用户输入了一句鸡汤，你要用${stylePrompt}拆解它。

要求：
1. 生成${count}个版本的反向文案
2. 毒性等级：${toxicityDesc}
3. 每个版本30-50字
4. 要有洞察、有趣、让人想转发的质感
5. 不要骂人，要聪明地拆解

原始鸡汤："${input}"

请返回JSON格式：
{
  "results": [
    { "text": "...", "insight": "..." },
    { "text": "...", "insight": "..." },
    { "text": "...", "insight": "..." }
  ]
}
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一个文案大师，创意十足，懂得反向思考。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })
    
    const content = response.choices[0].message.content
    const results = JSON.parse(content).results
    
    // 返回前端
    res.json({
      success: true,
      results: results.map(r => ({
        text: r.text,
        insight: r.insight,
        style: style,
        toxicity: toxicity
      }))
    })
    
  } catch (error) {
    console.error('生成失败:', error)
    res.status(500).json({ 
      error: '生成失败，请重试',
      message: error.message 
    })
  }
})

module.exports = router
```

#### 验收标准

✅ **Vibe Check**：
- 运营输入"人生就像一杯茶，不会苦一辈子"
- 3秒内（实际：1-2秒）看到3条不同风格的拆解文案
- 运营的反馈是"比我自己想的有意思"

✅ **技术验收**：
- [ ] 前端表单能正常提交
- [ ] 后端API调用OpenAI成功
- [ ] 返回结果格式正确（JSON）
- [ ] 错误处理完善（超时/配额）
- [ ] 响应时间<5秒
- [ ] 支持3种风格以上

---

### 2.2 C02 - 基础文案库

#### 需求描述
展示一个历史生成的好文案列表，运营可以快速浏览、复制和二次编辑。

#### 数据结构

**文案库JSON** (`src/data/templates.json`):
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
        },
        {
          "text": "工作是成本，薪水才是目标。搞反了的人会永远痛苦",
          "style": "economics",
          "toxicity": 3
        }
      ],
      "tags": ["工作", "人生", "心态"],
      "popularity": 127,
      "createdAt": "2026-06-01"
    },
    {
      "id": "t002",
      "category": "爱情观",
      "original": "爱情会拯救你",
      "variations": [
        {
          "text": "爱情确实能拯救你，一般拯救到地狱",
          "style": "reality-hit",
          "toxicity": 4
        }
      ],
      "tags": ["爱情", "关系"],
      "popularity": 89,
      "createdAt": "2026-06-02"
    }
  ]
}
```

#### 前端组件 (`src/components/TemplateLibrary.vue`):
```vue
<template>
  <div class="library-container">
    <h2>文案库</h2>
    
    <!-- 搜索和筛选 -->
    <div class="filters">
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="搜索文案..."
      />
      <select v-model="filterCategory">
        <option value="">全部分类</option>
        <option value="工作观">工作观</option>
        <option value="爱情观">爱情观</option>
        <option value="人生观">人生观</option>
      </select>
    </div>
    
    <!-- 文案列表 -->
    <div class="templates-list">
      <div 
        v-for="template in filteredTemplates" 
        :key="template.id"
        class="template-item"
      >
        <div class="template-header">
          <h3>{{ template.original }}</h3>
          <span class="category-badge">{{ template.category }}</span>
          <span class="popularity">👍 {{ template.popularity }}</span>
        </div>
        
        <div class="variations">
          <div 
            v-for="(var_, idx) in template.variations"
            :key="idx"
            class="variation"
          >
            <p>{{ var_.text }}</p>
            <div class="var-meta">
              <span class="style-tag">{{ var_.style }}</span>
              <span class="toxicity-tag">毒性: {{ var_.toxicity }}</span>
              <button @click="copyText(var_.text)">复制</button>
              <button @click="editVariation(var_, template)">编辑</button>
            </div>
          </div>
        </div>
        
        <div class="tags">
          <span 
            v-for="tag in template.tags"
            :key="tag"
            class="tag"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const templates = ref([])
const searchQuery = ref('')
const filterCategory = ref('')

const filteredTemplates = computed(() => {
  return templates.value.filter(t => {
    const matchesSearch = t.original.includes(searchQuery.value) ||
                         t.variations.some(v => v.text.includes(searchQuery.value))
    const matchesCategory = !filterCategory.value || t.category === filterCategory.value
    return matchesSearch && matchesCategory
  })
})

function copyText(text) {
  navigator.clipboard.writeText(text)
}

function editVariation(variation, template) {
  // 打开编辑对话框
}

// 加载模板库
async function loadTemplates() {
  const response = await fetch('/data/templates.json')
  const data = await response.json()
  templates.value = data.templates
}

loadTemplates()
</script>

<style scoped>
.library-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filters input,
.filters select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.template-item {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.template-header h3 {
  margin: 0;
  flex: 1;
}

.category-badge {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.popularity {
  color: #666;
  font-size: 12px;
}

.variations {
  margin: 12px 0;
}

.variation {
  background: white;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 3px solid #667eea;
  border-radius: 4px;
}

.var-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  margin-top: 8px;
}

.style-tag,
.toxicity-tag {
  background: #eee;
  padding: 2px 6px;
  border-radius: 3px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tag {
  color: #667eea;
  font-size: 12px;
}
</style>
```

#### 验收标准

✅ **Vibe Check**：
- 运营能在一个列表里看到5+条之前生成的好文案
- 快速找到需要的文案并复制
- 感觉"之前的创意积累没有浪费"

---

### 2.3 C03 - 简易草稿箱

#### 需求描述
生成的结果和收藏的文案可保存到浏览器LocalStorage，关闭网页再打开，之前的草稿还在。

#### 实现方案

**草稿管理Service** (`src/services/draftService.js`):
```javascript
export const draftService = {
  // 保存草稿
  saveDraft(draft) {
    const drafts = this.getDrafts()
    const newDraft = {
      id: Date.now().toString(),
      ...draft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    drafts.push(newDraft)
    localStorage.setItem('drafts', JSON.stringify(drafts))
    return newDraft
  },
  
  // 获取所有草稿
  getDrafts() {
    const drafts = localStorage.getItem('drafts')
    return drafts ? JSON.parse(drafts) : []
  },
  
  // 更新草稿
  updateDraft(id, updates) {
    const drafts = this.getDrafts()
    const idx = drafts.findIndex(d => d.id === id)
    if (idx !== -1) {
      drafts[idx] = {
        ...drafts[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('drafts', JSON.stringify(drafts))
      return drafts[idx]
    }
    return null
  },
  
  // 删除草稿
  deleteDraft(id) {
    let drafts = this.getDrafts()
    drafts = drafts.filter(d => d.id !== id)
    localStorage.setItem('drafts', JSON.stringify(drafts))
  },
  
  // 清空所有草稿
  clearAllDrafts() {
    localStorage.removeItem('drafts')
  }
}
```

**草稿箱组件** (`src/components/DraftBox.vue`):
```vue
<template>
  <div class="draft-box-container">
    <h2>
      📝 草稿箱 
      <span class="draft-count">({{ drafts.length }})</span>
    </h2>
    
    <!-- 操作栏 -->
    <div class="draft-actions">
      <button @click="sortByDate">按时间排序</button>
      <button @click="sortByPopular">按热度排序</button>
      <button @click="exportDrafts" class="export-btn">📥 导出全部</button>
      <button @click="clearAllDrafts" class="danger-btn">🗑️ 清空草稿</button>
    </div>
    
    <!-- 草稿列表 -->
    <div class="drafts-list">
      <div 
        v-for="draft in drafts"
        :key="draft.id"
        class="draft-item"
      >
        <div class="draft-header">
          <input 
            v-model="draft.title"
            type="text"
            class="draft-title"
            placeholder="给这个创意起个名字..."
            @blur="saveDraft(draft)"
          />
          <span class="draft-date">{{ formatDate(draft.createdAt) }}</span>
        </div>
        
        <!-- 生成的文案 -->
        <div v-if="draft.results" class="draft-results">
          <div 
            v-for="(result, idx) in draft.results"
            :key="idx"
            class="draft-result"
          >
            <p>{{ result.text }}</p>
            <button @click="copyText(result.text)">复制</button>
          </div>
        </div>
        
        <!-- 删除按钮 -->
        <button 
          @click="deleteDraft(draft.id)"
          class="delete-btn"
        >
          🗑️ 删除
        </button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!drafts.length" class="empty-state">
      <p>还没有任何草稿</p>
      <p>去生成器创建第一条吧 →</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { draftService } from '@/services/draftService'

const drafts = ref([])

onMounted(() => {
  loadDrafts()
})

function loadDrafts() {
  drafts.value = draftService.getDrafts()
}

function saveDraft(draft) {
  draftService.updateDraft(draft.id, draft)
}

function deleteDraft(id) {
  if (confirm('确认删除这个草稿吗？')) {
    draftService.deleteDraft(id)
    loadDrafts()
  }
}

function clearAllDrafts() {
  if (confirm('确认清空所有草稿吗？此操作不可恢复！')) {
    draftService.clearAllDrafts()
    loadDrafts()
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text)
}

function sortByDate() {
  drafts.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function sortByPopular() {
  // 按用户标记的热度排序
  drafts.value.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
}

function exportDrafts() {
  const dataStr = JSON.stringify(drafts.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `drafts-${new Date().toISOString().split('T')[0]}.json`
  link.click()
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.draft-box-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.draft-count {
  color: #666;
  font-size: 14px;
  font-weight: normal;
}

.draft-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.draft-actions button {
  padding: 8px 12px;
  font-size: 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.draft-actions button:hover {
  background: #e0e0e0;
}

.export-btn {
  background: #667eea;
  color: white;
  border: none;
}

.danger-btn {
  background: #ff6b6b;
  color: white;
  border: none;
}

.drafts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.draft-item {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
}

.draft-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.draft-title {
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 4px;
}

.draft-title:focus {
  border-bottom-color: #667eea;
  outline: none;
}

.draft-date {
  color: #999;
  font-size: 12px;
  margin-left: 12px;
}

.draft-results {
  margin: 12px 0;
}

.draft-result {
  background: #f9f9f9;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
}

.draft-result button {
  margin-top: 4px;
  padding: 4px 8px;
  font-size: 12px;
  background: white;
  border: 1px solid #667eea;
  color: #667eea;
  border-radius: 3px;
  cursor: pointer;
}

.delete-btn {
  width: 100%;
  padding: 8px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
</style>
```

#### 验收标准

✅ **Vibe Check**：
- 关闭网页，再打开
- 之前生成的文案还在
- 感觉"我的创意被保存下来了，不怕丢"

---

## 三、后端架构

### 3.1 项目结构

```
backend/
├── src/
│   ├── index.js              # 主入口
│   ├── routes/
│   │   ├── generate.js       # C01 API
│   │   └── health.js         # 健康检查
│   ├── services/
│   │   └── openai.js         # LLM服务
│   ├── middleware/
│   │   ├── auth.js           # 简单的API key验证
│   │   └── rateLimit.js      # 速率限制
│   └── config/
│       └── constants.js      # 常量和提示词
├── .env.example              # 环境变量示例
├── package.json
└── README.md
```

### 3.2 主入口 (`src/index.js`)

```javascript
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const generateRouter = require('./routes/generate')
const healthRouter = require('./routes/health')
const rateLimit = require('./middleware/rateLimit')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(rateLimit)

// 路由
app.use(generateRouter)
app.use(healthRouter)

// 错误处理
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    error: '服务器错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
```

### 3.3 速率限制中间件

```javascript
// src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit')

module.exports = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 10, // 最多10个请求
  message: '请求过于频繁，请稍候',
  standardHeaders: true,
  legacyHeaders: false
})
```

---

## 四、前端项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── TextGenerator.vue    # C01
│   │   ├── TemplateLibrary.vue  # C02
│   │   ├── DraftBox.vue         # C03
│   │   └── Layout.vue           # 公共布局
│   ├── services/
│   │   ├── api.js               # API调用
│   │   └── draftService.js      # 草稿管理
│   ├── stores/
│   │   └── index.js             # Pinia全局状态
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 五、数据埋点规范

### 埋点清单 (`docs/埋点规范.md`)

```markdown
# 数据埋点规范 - Phase 1

## C01 - 文本反鸡汤生成器

### 事件清单
| 事件ID | 事件名 | 触发条件 | 上报数据 |
|--------|--------|--------|--------|
| EVT_001 | generate_start | 用户点击"生成"按钮 | input_length, style, toxicity |
| EVT_002 | generate_success | 生成成功 | duration_ms, token_count |
| EVT_003 | generate_error | 生成失败 | error_code, error_msg |
| EVT_004 | result_copy | 用户复制结果 | result_index, text_length |
| EVT_005 | result_favorite | 用户收藏结果 | result_index |

### 代码实现
```javascript
// src/services/analytics.js
export const analytics = {
  trackEvent(eventId, data) {
    console.log(`[${eventId}]`, data)
    // 后续对接分析平台
  }
}

// 在TextGenerator.vue中使用
async function generate() {
  analytics.trackEvent('EVT_001', {
    input_length: input.value.length,
    style: selectedStyle.value,
    toxicity: toxicity.value
  })
  // ...
}
```

---

## 六、环境配置

### .env.example

```
# 后端环境变量
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
NODE_ENV=development
PORT=3001

# 速率限制
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=10

# 前端API地址
VITE_API_BASE_URL=http://localhost:3001
```

---

## 七、开发时间线

### Week 1

**Day 1-2：项目初始化与基础设施**
- [ ] 创建前端Vite项目
- [ ] 创建后端Express项目
- [ ] 配置CORS、环保variables等
- [ ] 部署到Vercel/Render

**Day 2-3：C01 开发**
- [ ] 前端输入表单 ✓
- [ ] 风格选择器 ✓
- [ ] 后端生成API ✓
- [ ] 错误处理与重试 ✓
- [ ] 联调测试 ✓

**Day 3-4：C02 + C03 开发**
- [ ] C02 模板库界面 ✓
- [ ] C03 LocalStorage草稿管理 ✓
- [ ] 跨组件数据同步 ✓

**Day 5：测试与打磨**
- [ ] 端到端测试
- [ ] 性能优化
- [ ] UI细节调整
- [ ] 埋点验证

### Week 2

**Day 1-2：数据准备与上线**
- [ ] 运营提供Phase 0的素材
- [ ] 导入文案库数据
- [ ] 用户文档编写
- [ ] 上线部署

**Day 2-3：运营使用反馈**
- [ ] 运营开始使用MVP
- [ ] 收集反馈
- [ ] 快速迭代修复

**Day 4-5：数据看板与总结**
- [ ] 配置埋点数据收集
- [ ] 制作Phase 1总结报告
- [ ] 策划Phase 2

---

## 八、关键依赖

### 前端
```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "@vitejs/plugin-vue": "^4.3.0"
  }
}
```

### 后端
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "openai": "^4.0.0",
    "express-rate-limit": "^7.0.0"
  }
}
```

---

## 九、风险与降级

### 高成本问题
**风险**：OpenAI API调用费用高
**降级方案**：
- 实现"本地模式"，返回写死的3条样本文案
- 数据结构与真实API相同，前端无需修改
- 后续真实API稳定后切换

### 实现方式
```javascript
// src/routes/generate.js
if (process.env.MOCK_MODE === 'true') {
  // 返回模拟数据
  return res.json({
    success: true,
    results: [
      {
        text: '人生就像一杯茶，但如果你喝了三十年还在苦，问题可能不在茶。',
        insight: '从现实角度看，痛苦本身是对的...',
        style: style,
        toxicity: toxicity
      },
      // ... 更多模拟结果
    ]
  })
}

// 调用真实API
```

---

## 十、Vibe Check 清单

**Phase 1 完成时，运营应该能说出：**

- [ ] "一键生成，真的很爽"
- [ ] "这个文案比我自己想的有意思"
- [ ] "生成速度很快，不用等"
- [ ] "复制很方便，直接能用"
- [ ] "我之前的创意都保存下来了"
- [ ] "这个工作台让我工作效率提高了"

**如果做不到上面任何一点，Phase 1是失败的。**

---

## 附录：快速启动指南

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 后端启动
```bash
cd backend
npm install
cp .env.example .env
# 编辑.env，填入OPENAI_API_KEY
npm run dev
```

### 前后端联调
```bash
# 终端1
cd backend && npm run dev

# 终端2
cd frontend && npm run dev

# 打开 http://localhost:5173
```

---

**文档维护者**：产品经理  
**更新时间**：2026-06-04  
**版本**：1.0
