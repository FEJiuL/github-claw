const express = require('express')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: process.env.MOCK_MODE === 'true' ? 'MOCK' : 'LIVE',
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  })
})

router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    api: true,
    timestamp: new Date().toISOString()
  })
})

module.exports = router
