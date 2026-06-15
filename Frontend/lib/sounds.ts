export const playSound = (soundName: 'select' | 'yummy' | 'satisfied' | 'save' | 'jump') => {
  if (typeof window !== 'undefined') {
    const audio = new Audio(`/sounds/${soundName}.wav`)
    audio.volume = 0.5
    audio.play().catch((err) => {
      console.warn("Could not play sound:", err)
    })
  }
}
