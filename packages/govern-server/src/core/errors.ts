type ErrorOptions = {
  code?: string
  name?: string
}

export class ErrorException extends Error {
  constructor(
    message = 'An unexpected error happened.',
    { code = 'ErrorException', name = 'ErrorException' }: ErrorOptions = {}
  ) {
    super(message)

    // We define these as non-enumarable to prevent them
    // from appearing with the error in the console.
    this.defineNonEnumerable('name', name)
    this.defineNonEnumerable('code', code)
  }

  private defineNonEnumerable(name: string, value: any) {
    Object.defineProperty(this, name, { value, enumerable: false })
  }
}

export class ErrorInvalid extends ErrorException {
  constructor(
    message = 'The resource doesn’t seem to be valid.',
    { code = 'ErrorInvalid', name = 'ErrorInvalid' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorUnsupported extends ErrorException {
  constructor(
    message = 'The resource is not supported.',
    { code = 'ErrorUnsupported', name = 'ErrorUnsupported' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorNotFound extends ErrorException {
  constructor(
    message = 'The resource couldn’t be found.',
    { code = 'ErrorNotFound', name = 'ErrorNotFound' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorConnection extends ErrorException {
  constructor(
    message = 'An error happened while communicating with a remote server.',
    { code = 'ErrorConnection', name = 'ErrorConnection' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorUnexpectedResult extends ErrorException {
  constructor(
    message = 'The resource doesn’t correspond to the expected result.',
    {
      code = 'ErrorUnexpectedResult',
      name = 'ErrorUnexpectedResult',
    }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorInvalidNetwork extends ErrorInvalid {
  constructor(
    message = 'The network doesn’t seem to be valid.',
    {
      code = 'ErrorInvalidNetwork',
      name = 'ErrorInvalidNetwork',
    }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}
