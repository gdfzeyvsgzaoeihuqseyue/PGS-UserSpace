export const getGreetingKey = (): string => {
  const hour = new Date().getHours()
  let timeOfDay = 'morning'

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning'
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon'
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening'
  } else {
    timeOfDay = 'night'
  }

  // Randomly select a variation (1-3)
  const variation = Math.floor(Math.random() * 3) + 1
  return `greetings.${timeOfDay}.${variation}`
}
