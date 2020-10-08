function defineNonEnumerable(instance: object, name: string, value: any) {
    Object.defineProperty(instance, name, { value, enumerable: false })
  }
  
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
      defineNonEnumerable(this, 'name', name)
      defineNonEnumerable(this, 'code', code)
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
  
  export class ErrorInvalidEthereum extends ErrorInvalid {
    constructor(
      message = 'The Ethereum provider doesn’t seem to be valid.',
      {
        code = 'ErrorInvalidEthereum',
        name = 'ErrorInvalidEthereum',
      }: ErrorOptions = {}
    ) {
      super(message, { code, name })
    }
  }
  
  export class ErrorInvalidLocation extends ErrorInvalid {
    constructor(
      message = 'The Ethereum address or ENS domain doesn’t seem to be valid.',
      {
        code = 'ErrorInvalidLocation',
        name = 'ErrorInvalidLocation',
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
  
  export class ErrorInvalidConnector extends ErrorInvalid {
    constructor(
      message = 'The connector doesn’t seem to be valid.',
      {
        code = 'ErrorInvalidConnector',
        name = 'ErrorInvalidConnector',
      }: ErrorOptions = {}
    ) {
      super(message, { code, name })
    }
  }
  
  export class ErrorInvalidApp extends ErrorInvalid {
    constructor(
      message = 'The value doesn’t seem to be an app.',
      { code = 'ErrorInvalidApp', name = 'ErrorInvalidApp' }: ErrorOptions = {}
    ) {
      super(message, { code, name })
    }
  }
  
  export class ErrorUnsufficientBalance extends ErrorException {
    constructor(
      message = 'Unsufficient balance on the account.',
      {
        code = 'ErrorUnsufficientBalance',
        name = 'ErrorUnsufficientBalance',
      }: ErrorOptions = {}
    ) {
      super(message, { code, name })
    }
  }
  