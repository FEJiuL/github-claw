export const analytics = {
  trackEvent(eventId, data) {
    const event = {
      eventId,
      timestamp: new Date().toISOString(),
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    console.log(`[${eventId}]`, event.data)

    // 后续可对接第三方分析平台
    // 如：Google Analytics、Mixpanel、Amplitude等
    // ga('send', 'event', eventId, JSON.stringify(data))

    // 本地存储用于调试
    const events = JSON.parse(localStorage.getItem('cyber_meme_events') || '[]')
    events.push(event)
    if (events.length > 100) events.shift() // 只保留最近100条
    localStorage.setItem('cyber_meme_events', JSON.stringify(events))
  },

  // 事件ID定义
  EVENTS: {
    GENERATE_START: 'EVT_001',
    GENERATE_SUCCESS: 'EVT_002',
    GENERATE_ERROR: 'EVT_003',
    RESULT_COPY: 'EVT_004',
    RESULT_FAVORITE: 'EVT_005'
  }
}
