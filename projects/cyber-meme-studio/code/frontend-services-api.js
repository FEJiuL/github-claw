const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const apiClient = {
  async generateTexts(params) {
    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API调用失败')
      }

      return await response.json()
    } catch (error) {
      console.error('API调用失败:', error)
      throw error
    }
  },

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE}/api/health`)
      return await response.json()
    } catch (error) {
      console.error('健康检查失败:', error)
      return { status: 'error' }
    }
  }
}
