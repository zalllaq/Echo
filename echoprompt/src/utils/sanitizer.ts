export function sanitizeInput(input: string): string {
  return input.trim();
}

export function isEmpty(input: string): boolean {
  return input.trim().length === 0;
}
