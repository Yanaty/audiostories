export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function adjacent(queue: readonly string[], current: string, direction: number, repeat: boolean): string | undefined {
  const index = queue.indexOf(current) + direction;
  return repeat ? queue[(index + queue.length) % queue.length] : queue[index];
}
