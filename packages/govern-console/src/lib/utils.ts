export function log(...params: any[]) {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    console.log(...params)
  }
}
