export const draftService = {
  saveDraft(draft) {
    const drafts = this.getDrafts()
    const newDraft = {
      id: Date.now().toString(),
      ...draft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    drafts.push(newDraft)
    localStorage.setItem('cyber_meme_drafts', JSON.stringify(drafts))
    return newDraft
  },

  getDrafts() {
    const drafts = localStorage.getItem('cyber_meme_drafts')
    return drafts ? JSON.parse(drafts) : []
  },

  updateDraft(id, updates) {
    const drafts = this.getDrafts()
    const idx = drafts.findIndex(d => d.id === id)
    if (idx !== -1) {
      drafts[idx] = {
        ...drafts[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('cyber_meme_drafts', JSON.stringify(drafts))
      return drafts[idx]
    }
    return null
  },

  deleteDraft(id) {
    let drafts = this.getDrafts()
    drafts = drafts.filter(d => d.id !== id)
    localStorage.setItem('cyber_meme_drafts', JSON.stringify(drafts))
  },

  clearAllDrafts() {
    localStorage.removeItem('cyber_meme_drafts')
  },

  exportDrafts() {
    return JSON.stringify(this.getDrafts(), null, 2)
  }
}
