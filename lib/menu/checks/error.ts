import "server-only"

// A failed check stops the save. The API turns this error into a JSON response.
export class MenuCheckError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
  }
}
