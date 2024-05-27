export function toSnakecase(value: string) {
  return value.toLowerCase().replace(/\s/g, "-");
}
