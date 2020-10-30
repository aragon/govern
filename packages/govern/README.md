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

### configure(config) ⇒ <code>void</code>

Overwrites the default configuration of govern.

| Param  | Type                                                    | Description                                          |
| ------ | ------------------------------------------------------- | ---------------------------------------------------- |
| config | <code>[ConfigurationObject][ConfigurationObject]</code> | Object with all [config options][ConfigurationObject]|

Example:
``` typescript 
import { configure } from '@aragon/govern'

configure({governURL: 'https://myOwnGovernServer.io'});
```

### dao(name) ⇒ <code>Promise<Dao></code>

Returns details about a DAO by his address.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| name   | <code>string</code>   | The name of the DAO                       |

Example:
``` typescript 
import { dao } from '@aragon/govern'

const response = await dao('0x0...');
```

### daos() ⇒ <code>Promise<Dao[]</code>

Returns all DAOs.


Example:
``` typescript 
import { daos } from '@aragon/govern'

const response = await daos();
```

### query(query) ⇒ <code>Promise<object></code>

Returns the desired data.

| Param  | Type                      | Description                               |
| ------ | ------------------------- | ----------------------------------------- |
| query  | <code>string</code>       | GraphQL query                             |
| args   | <code>object</code>       | Object with parameters                    |

Example:
``` typescript 
import { query } from '@aragon/govern'

const query = await query(myQuery, {...});
```

[Address]: https://github.com/aragon/govern/tree/master/packages/govern/internal/configuration/Configuration.ts#L4
[ConfigurationObject]: https://github.com/aragon/govern/tree/master/packages/govern/internal/configuration/Configuration.ts#L4
