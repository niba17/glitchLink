export function mapFieldErrors(
  errors: { path: string | string[]; message: string }[]
): Record<string, string> {
  const mapped: Record<string, string> = {};
  errors.forEach((e) => {
    const key = Array.isArray(e.path) ? e.path.join(".") : e.path;
    mapped[key] = e.message;
  });
  return mapped;
}
