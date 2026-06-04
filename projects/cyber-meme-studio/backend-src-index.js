require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const generateRouter = require('./routes/generate')
const healthRouter = require('./routes/health')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10,
  message: '请求过于频繁，请稍候'
})
app.use('/api/', limiter)

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
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📝 模式：${process.env.MOCK_MODE === 'true' ? 'MOCK' : 'LIVE'}`)
})
