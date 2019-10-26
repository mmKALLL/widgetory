export function getRandomMantra(): string {
  const index = Math.floor(Math.random() * mantras.length);
  return mantras[index];
}

export function getInitialMantra(): string {
  return mantras[0]
}

const mantras: string[] = [
  "Follow your destiny.",
  "You can do this.",
  "Be honest.",
  "You have what it takes.",
  "Proceed without fear.",
  "You can achieve anything.",
  "No worries.",
  "One step at a time.",
  "Take it easy.",
  "Do your best.",
  "がんばってください。",
  "There are no limits.",
  "Stay true to yourself.",
  "I love you.",
  "Stay strong.",
  "Never yield to failure.",
  "Success awaits.",
  "Destiny will guide you.",
  "Love the road.",
  "Free your mind.",
  "Appreciate everything.",
  "You have profound wisdom.",
  "Just one more step."
]
