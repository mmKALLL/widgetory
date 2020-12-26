// General use

// Restrict a number between a min/max
export const clamp = (number: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, number))
}

export const sum = (array: number[]): number => {
  return array.reduce((a, b) => a + b)
}

// Explicitly check that all inferred types are used - see e.g. game-loop.ts
export function assertNever(x: never): never {
  throw new Error(`Unexpected object in assertNever:\n  ${x}`)
}

export const typedObjectKeys = Object.keys as <T>(o: T) => Extract<keyof T, string>[]
export const typedObjectEntries = Object.entries as <O, V>(o: O) => [Extract<keyof O, string>, V][]
