<template>
  <div class="layout">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>🤖 赛博梗王</h1>
          <p class="tagline">反鸡汤内容工作台</p>
        </div>
        <nav class="nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </nav>
      </div>
    </header>

    <main class="content">
      <div v-if="activeTab === 'generator'" class="tab-content">
        <TextGenerator />
      </div>
      <div v-if="activeTab === 'library'" class="tab-content">
        <TemplateLibrary />
      </div>
      <div v-if="activeTab === 'drafts'" class="tab-content">
        <DraftBox />
      </div>
    </main>

    <footer class="footer">
      <p>Phase 1 MVP · 赛博梗王 2026 | <a href="#">问题反馈</a></p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TextGenerator from './TextGenerator.vue'
import TemplateLibrary from './TemplateLibrary.vue'
import DraftBox from './DraftBox.vue'

const activeTab = ref('generator')

const tabs = [
  { id: 'generator', label: '生成器', icon: '✨' },
  { id: 'library', label: '文案库', icon: '📚' },
  { id: 'drafts', label: '草稿箱', icon: '📝' }
]
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7fafc;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
}

.tagline {
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.8;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 600;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn.active {
  background: white;
  color: #667eea;
}

.content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.tab-content {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.footer {
  background: white;
  border-top: 1px solid #eee;
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 12px;
}

.footer a {
  color: #667eea;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .nav {
    width: 100%;
  }

  .nav-btn {
    flex: 1;
  }
}
</style>
