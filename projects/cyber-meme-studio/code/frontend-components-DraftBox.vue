<template>
  <div class="draft-box-container">
    <div class="draft-box-card">
      <h2>
        📝 草稿箱
        <span class="draft-count">({{ drafts.length }})</span>
      </h2>

      <!-- 操作栏 -->
      <div v-if="drafts.length" class="draft-actions">
        <button @click="sortByDate" class="action-btn">按时间排序</button>
        <button @click="exportDrafts" class="action-btn export-btn">📥 ��出全部</button>
        <button v-if="drafts.length" @click="clearAllDrafts" class="action-btn danger-btn">🗑️ 清空</button>
      </div>

      <!-- 草稿列表 -->
      <div v-if="drafts.length" class="drafts-list">
        <div v-for="draft in drafts" :key="draft.id" class="draft-item">
          <div class="draft-header">
            <div class="draft-input">输入：{{ draft.input }}</div>
            <span class="draft-date">{{ formatDate(draft.createdAt) }}</span>
          </div>

          <!-- 生成的文案 -->
          <div v-if="draft.results" class="draft-results">
            <div v-for="(result, idx) in draft.results" :key="idx" class="draft-result">
              <p>{{ result.text }}</p>
              <button @click="copyText(result.text)" class="result-copy-btn">复制</button>
            </div>
          </div>

          <!-- 删除按钮 -->
          <button @click="deleteDraft(draft.id)" class="delete-btn">🗑️ ��除</button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <p>还没有任何草稿</p>
        <p>去生成器创建第一条吧 →</p>
      </div>
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
  alert('✅ 已复制')
}

function sortByDate() {
  drafts.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function exportDrafts() {
  const dataStr = draftService.exportDrafts()
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
  max-width: 800px;
  margin: 0 auto;
}

.draft-box-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
}

.draft-count {
  color: #666;
  font-size: 16px;
  font-weight: normal;
}

.draft-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 12px;
  font-size: 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e0e0e0;
}

.export-btn {
  background: #667eea;
  color: white;
  border: none;
}

.export-btn:hover {
  background: #5568d3;
}

.danger-btn {
  background: #ff6b6b;
  color: white;
  border: none;
}

.danger-btn:hover {
  background: #ff5252;
}

.drafts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.draft-item {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
}

.draft-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.draft-input {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
  margin-right: 12px;
  word-break: break-word;
}

.draft-date {
  color: #999;
  font-size: 12px;
  white-space: nowrap;
}

.draft-results {
  margin: 12px 0;
}

.draft-result {
  background: white;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
}

.draft-result p {
  margin: 0 0 6px 0;
}

.result-copy-btn {
  padding: 2px 6px;
  font-size: 11px;
  background: white;
  border: 1px solid #667eea;
  color: #667eea;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.result-copy-btn:hover {
  background: #667eea;
  color: white;
}

.delete-btn {
  width: 100%;
  padding: 8px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #ff5252;
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
