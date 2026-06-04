exports.STYLE_PROMPTS = {
  'reality-hit': '从现实且有点扎心的角度拆解这句话，指出它忽视的现实因素',
  'economics': '从经济学角度分析这句话的逻辑漏洞，用成本收益模型来看',
  'social': '作为社会观察者评价这句话，从社会学角度分析它的成因和影响',
  'philosophy': '从哲学角度反思这句话的基本假设，质疑其前提条件'
}

exports.TOXICITY_LEVELS = {
  1: '温和，不刺激，适合大众传播',
  2: '有点犀利，但还可以接受，有一定深度',
  3: '中毒，让人想到自己的问题，引发思考',
  4: '高毒性，很扎心，可能让某些人不适',
  5: '极毒，可能引发共鸣也可能冒犯，需谨慎'
}

exports.MOCK_TEMPLATES = [
  {
    id: 't001',
    category: '工作观',
    original: '工作就是折磨',
    variations: [
      {
        text: '工作确实会让人痛苦，但失业会让人更痛苦。问题不在工作本身，而在你对工作的期待。',
        style: 'reality-hit',
        toxicity: 3
      }
    ],
    tags: ['工作', '人生'],
    popularity: 127,
    createdAt: '2026-06-01'
  },
  {
    id: 't002',
    category: '爱情观',
    original: '爱情会拯救你',
    variations: [
      {
        text: '爱情确实能拯救你，一般拯救到地狱。更扎心的是，你会为此感谢对方。',
        style: 'reality-hit',
        toxicity: 4
      }
    ],
    tags: ['爱情', '关系'],
    popularity: 89,
    createdAt: '2026-06-02'
  }
]
