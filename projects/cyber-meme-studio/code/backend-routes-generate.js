const express = require('express')
const OpenAI = require('openai')
const router = express.Router()
const { STYLE_PROMPTS, TOXICITY_LEVELS } = require('../config/constants')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

router.post('/api/generate', async (req, res) => {
  const { input, style, toxicity, count } = req.body

  if (!input || !style) {
    return res.status(400).json({ error: '缺少必要参数' })
  }

  try {
    // MOCK模式 - 用于开发测试
    if (process.env.MOCK_MODE === 'true') {
      const mockResults = [
        {
          text: `"${input}"这个说法确实有问题。现实是，大多数人的痛苦不来自金句的真实性，而来自他们拒绝承认自己的无能。`,
          insight: '从现实角度看，痛苦的根源被归咎于外部而非内部',
          style: style,
          toxicity: toxicity
        },
        {
          text: `"${input}" 从经济学角度讲，这是典型的成本-收益失衡的陈述。生活成本一直在上升，而收益（快乐、意义）却难以量化。`,
          insight: '用经济学模型解释生活现象的局限性',
          style: style,
          toxicity: toxicity
        },
        {
          text: `"${input}" 作为社会观察者，我注意到这类金句通常出现在中产焦虑最严重的时期。它们是自我安慰的工具。`,
          insight: '从社会学角度分析金句存在的社会基础',
          style: style,
          toxicity: toxicity
        }
      ]
      return res.json({
        success: true,
        mode: 'MOCK',
        results: mockResults
      })
    }

    // 真实模式 - 调用OpenAI
    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS['reality-hit']
    const toxicityDesc = TOXICITY_LEVELS[toxicity] || '中等毒性'

    const prompt = `
你是一个"反向鸡汤"文案大师。用户输入了一句鸡汤，你要用${stylePrompt}拆解它。

要求：
1. 生成${count || 3}个版本的反向文案
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

    const startTime = Date.now()

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一个文案大师，创意十足，懂得反向思考，能够深度洞察现象。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })

    const duration = Date.now() - startTime
    const content = response.choices[0].message.content

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(jsonMatch[0])
      const results = parsed.results

      res.json({
        success: true,
        mode: 'LIVE',
        duration_ms: duration,
        results: results.map(r => ({
          text: r.text,
          insight: r.insight,
          style: style,
          toxicity: toxicity
        }))
      })
    } catch (parseError) {
      res.status(500).json({
        error: '解析响应失败',
        message: 'LLM返回的内容格式不正确'
      })
    }
  } catch (error) {
    console.error('生成失败:', error)

    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'API配额已用尽',
        message: '请检查OpenAI API余额',
        fallback: '已自动降级到MOCK模式'
      })
    }

    if (error.code === 'auth_error') {
      return res.status(401).json({
        error: '认证失败',
        message: '请检查OPENAI_API_KEY配置',
        hint: '可使用MOCK_MODE=true进行开发'
      })
    }

    res.status(500).json({
      error: '生成失败',
      message: error.message
    })
  }
})

module.exports = router
