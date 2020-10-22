# govern.js

> The JavaScript client API for the Govern server

## Usage

**Usage with default config**

> The default config uses the Govern servers deployed by Aragon

``` javascript
import { dao } from '@aragon/govern'

const response = await dao('0x0...');

console.log(response)
```

**Usage with custom config**
``` javascript
import { dao, configure } from '@aragon/govern'

configure({governURL: 'https://myOwnGovernServer.io'});

const response = await dao('0x0...');

console.log(response)
```

## Documentation

> TBD
