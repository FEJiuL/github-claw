<template>
  <div class="library-container">
    <div class="library-card">
      <h2>📚 文案库</h2>

      <!-- 搜索和筛选 -->
      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文案..."
          class="search-input"
        />
        <select v-model="filterCategory" class="filter-select">
          <option value="">全部分类</option>
          <option value="工作观">工作观</option>
          <option value="爱情观">爱情观</option>
          <option value="人生观">人生观</option>
        </select>
      </div>

      <!-- 文案列表 -->
      <div v-if="filteredTemplates.length" class="templates-list">
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
              v-for="(variation, idx) in template.variations"
              :key="idx"
              class="variation"
            >
              <p>{{ variation.text }}</p>
              <div class="var-meta">
                <span class="style-tag">{{ getStyleLabel(variation.style) }}</span>
                <span class="toxicity-tag">毒性: {{ variation.toxicity }}</span>
                <button @click="copyText(variation.text)" class="copy-mini">复制</button>
              </div>
            </div>
          </div>

          <div class="tags">
            <span v-for="tag in template.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <p>还没有文案库数据</p>
        <p>运营添加Phase 0的素材后会出现在这里</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const templates = ref([])
const searchQuery = ref('')
const filterCategory = ref('')

const styleLabels = {
  'reality-hit': '🎯 现实暴击',
  'economics': '💰 经济学',
  'social': '👥 社会观察',
  'philosophy': '🤔 哲学'
}

const filteredTemplates = computed(() => {
  return templates.value.filter(t => {
    const matchesSearch =
      t.original.includes(searchQuery.value) ||
      t.variations.some(v => v.text.includes(searchQuery.value))
    const matchesCategory = !filterCategory.value || t.category === filterCategory.value
    return matchesSearch && matchesCategory
  })
})

function getStyleLabel(style) {
  return styleLabels[style] || style
}

function copyText(text) {
  navigator.clipboard.writeText(text)
  alert('✅ 已复制')
}

onMounted(() => {
  loadTemplates()
})

function loadTemplates() {
  // 先尝试从localStorage加载
  const stored = localStorage.getItem('cyber_meme_templates')
  if (stored) {
    templates.value = JSON.parse(stored)
  }

  // 尝试从服务器加载
  fetch('/data/templates.json')
    .then(res => res.json())
    .then(data => {
      templates.value = data.templates || []
    })
    .catch(err => {
      console.log('无法加载文案库:', err)
      // 加载默认数据
      templates.value = [
        {
          id: 't001',
          category: '工作观',
          original: '工作就是折磨',
          variations: [
            {
              text: '工作确实会让人痛苦，但失业会让人更痛苦。',
              style: 'reality-hit',
              toxicity: 3
            }
          ],
          tags: ['工作', '人生'],
          popularity: 0,
          createdAt: '2026-06-04'
        }
      ]
    })
}
</script>

<style scoped>
.library-container {
  max-width: 800px;
  margin: 0 auto;
}

.library-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input,
.filter-select {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.templates-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-item {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
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
  font-size: 16px;
}

.category-badge {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
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

.variation p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.5;
}

.var-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.style-tag,
.toxicity-tag {
  background: #eee;
  padding: 2px 6px;
  border-radius: 3px;
}

.copy-mini {
  margin-left: auto;
  padding: 2px 6px;
  background: white;
  border: 1px solid #667eea;
  color: #667eea;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.copy-mini:hover {
  background: #667eea;
  color: white;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin: 8px 0;
}
</style>
