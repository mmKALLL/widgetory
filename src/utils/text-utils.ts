export function getRandomMantra(): string {
  const index = Math.floor(Math.random() * mantras.length);
  return mantras[index];
}

export function getInitialMantra(): string {
  return mantras[0]
}

const mantras: string[] = [
  "Build the future.",
  "Create your destiny.",
  "You can do this.",
  "You can be successful.",
  "You have what it takes.",
  "Proceed with a kind heart.",
  "You can create anything.",
  "No problem, it's ok.",
  "One widget at a time.",
  "Keep things simple.",
  "Do your best.",
  "がんばってください。",
  "Stay creative.",
  "Stay true to your goal.",
  "I love you.",
  "Forge on.",
  "Never yield to failure.",
  "Success awaits.",
  "You will evolve.",
  "Compile true love.",
  "Free your mind.",
  "Appreciate everything.",
  "You have profound wisdom.",
  "Just one more widget.",
  "Assembly guides you."
]
