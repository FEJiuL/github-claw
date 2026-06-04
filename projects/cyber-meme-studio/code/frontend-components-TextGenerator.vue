<template>
  <div class="generator-container">
    <div class="generator-card">
      <h1>✨ 反鸡汤生成器</h1>
      <p class="subtitle">输入鸡汤金句，一键生成反向文案</p>

      <!-- 输入框 -->
      <div class="input-section">
        <label for="input">输入鸡汤金句</label>
        <textarea
          id="input"
          v-model="input"
          placeholder="例如：人生就像一杯茶，不会苦一辈子"
          @keydown.enter.ctrl="generate"
        />
        <div class="input-hint">💡 Ctrl+Enter 快速生成</div>
      </div>

      <!-- 控制面板 -->
      <div class="controls">
        <div class="control-group">
          <label for="style">风格选择</label>
          <select id="style" v-model="selectedStyle">
            <option value="reality-hit">🎯 现实暴击型</option>
            <option value="economics">💰 经济学视角</option>
            <option value="social">👥 社会观察者</option>
            <option value="philosophy">🤔 哲学碎碎念</option>
          </select>
        </div>

        <div class="control-group">
          <label for="toxicity">毒性等级</label>
          <div class="toxicity-slider">
            <input
              id="toxicity"
              v-model="toxicity"
              type="range"
              min="1"
              max="5"
            />
            <span class="toxicity-label">{{ toxicityLabel }}</span>
          </div>
        </div>
      </div>

      <!-- 生成按钮 -->
      <button
        class="generate-btn"
        :disabled="loading || !input.trim()"
        @click="generate"
      >
        <span v-if="loading" class="spinner">⏳</span>
        <span v-else>✨ 生成文案</span>
      </button>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        ❌ {{ error }}
      </div>

      <!-- 生成结果 -->
      <div v-if="results.length" class="results">
        <h2>📋 生成结果</h2>
        <div
          v-for="(result, idx) in results"
          :key="idx"
          class="result-card"
        >
          <div class="result-number">版本 {{ idx + 1 }}</div>
          <div class="result-text">{{ result.text }}</div>
          <div v-if="result.insight" class="result-insight">💡 {{ result.insight }}</div>
          <div class="result-actions">
            <button class="action-btn copy-btn" @click="copyToClipboard(result.text)">
              📋 复制
            </button>
            <button class="action-btn favorite-btn" @click="saveToFavorites(result)">
              ❤️ 收藏
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <p>输入一句鸡汤，让AI来拆解它 →</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { apiClient } from '@/services/api'
import { draftService } from '@/services/draftService'
import { analytics } from '@/services/analytics'

const input = ref('')
const selectedStyle = ref('reality-hit')
const toxicity = ref(3)
const results = ref([])
const loading = ref(false)
const error = ref('')

const toxicityLabels = ['', '温和', '犀利', '中毒', '高毒', '极毒']
const toxicityLabel = computed(() => toxicityLabels[parseInt(toxicity.value)])

async function generate() {
  if (!input.value.trim()) return

  error.value = ''
  loading.value = true
  results.value = []

  const startTime = Date.now()

  try {
    // 埋点：开始生成
    analytics.trackEvent(analytics.EVENTS.GENERATE_START, {
      input_length: input.value.length,
      style: selectedStyle.value,
      toxicity: toxicity.value
    })

    const response = await apiClient.generateTexts({
      input: input.value,
      style: selectedStyle.value,
      toxicity: toxicity.value,
      count: 3
    })

    const duration = Date.now() - startTime

    if (response.success) {
      results.value = response.results || []

      // 埋点：生成成功
      analytics.trackEvent(analytics.EVENTS.GENERATE_SUCCESS, {
        duration_ms: duration,
        result_count: results.value.length,
        mode: response.mode
      })

      // 保存到草稿
      draftService.saveDraft({
        input: input.value,
        style: selectedStyle.value,
        toxicity: toxicity.value,
        results: results.value,
        timestamp: new Date()
      })
    }
  } catch (err) {
    error.value = err.message || '生成失败，请重试'

    // 埋点：生成失败
    analytics.trackEvent(analytics.EVENTS.GENERATE_ERROR, {
      error: err.message,
      input_length: input.value.length
    })
  } finally {
    loading.value = false
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // 埋点：复制结果
    analytics.trackEvent(analytics.EVENTS.RESULT_COPY, {
      text_length: text.length
    })
    alert('✅ 已复制到剪贴板')
  })
}

function saveToFavorites(result) {
  const favorites = JSON.parse(localStorage.getItem('cyber_meme_favorites') || '[]')
  favorites.push({
    ...result,
    savedAt: new Date().toISOString()
  })
  localStorage.setItem('cyber_meme_favorites', JSON.stringify(favorites))

  // 埋点：收藏结果
  analytics.trackEvent(analytics.EVENTS.RESULT_FAVORITE, {
    text_length: result.text.length
  })

  alert('❤️ 已收藏')
}
</script>

<style scoped>
.generator-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.generator-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  margin: 0 0 24px 0;
  font-size: 14px;
}

.input-section {
  margin-bottom: 24px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  font-size: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
}

.input-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
}

select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

select:focus {
  outline: none;
  border-color: #667eea;
}

.toxicity-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

input[type='range'] {
  flex: 1;
  cursor: pointer;
}

.toxicity-label {
  min-width: 50px;
  font-size: 12px;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.generate-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 12px;
  margin: 16px 0;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 14px;
}

.results {
  margin-top: 32px;
}

.results h2 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.result-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-left: 3px solid #667eea;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.result-number {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.result-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 8px;
}

.result-insight {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.favorite-btn:hover {
  border-color: #f56565;
  color: #f56565;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

@media (max-width: 600px) {
  .generator-card {
    padding: 16px;
  }

  .controls {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
