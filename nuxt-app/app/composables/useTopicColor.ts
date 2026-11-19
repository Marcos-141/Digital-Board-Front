const PALETTE = [
  '#a1c1be',
  '#e0a96d',
  '#7bb0a6',
  '#74a2be',
  '#b08ebb',
  '#d98c8c',
  '#9fb67a',
  '#c7a27c',
] as const

// Darker variants for high text contrast (>= 4.5:1 on white surfaces)
const TEXT_PALETTE = [
  '#2d504d',
  '#784c17',
  '#2a5a51',
  '#26536e',
  '#593863',
  '#7a2a2a',
  '#435728',
  '#634727',
] as const

export function useTopicColor() {
  function getTopicColor(topicId: number | null | undefined): string {
    if (topicId === null || topicId === undefined || isNaN(topicId)) {
      return PALETTE[0]
    }
    const safeIndex = Math.abs(topicId) % PALETTE.length
    return PALETTE[safeIndex] ?? PALETTE[0]
  }

  function getTopicTextColor(topicId: number | null | undefined): string {
    if (topicId === null || topicId === undefined || isNaN(topicId)) {
      return TEXT_PALETTE[0]
    }
    const safeIndex = Math.abs(topicId) % TEXT_PALETTE.length
    return TEXT_PALETTE[safeIndex] ?? TEXT_PALETTE[0]
  }

  return {
    getTopicColor,
    getTopicTextColor,
  }
}
