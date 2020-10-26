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

### dao(address) ⇒ <code>Promise<Dao></code>

Returns details about a DAO by his address.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| address | <code>[Address][address]</code> | [Address][address] of the DAO  |

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

### game(name) ⇒ <code>Promise<OptimisticGame></code>

Returns game details by his name.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| name   | string                | The name of the game                      |


Example:
``` typescript 
import { game } from '@aragon/govern'

const response = await game('name');
```

### games(address) ⇒ <code>Promise<OptimisticGame[]></code>

Returns all games of a DAO.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| address | <code>[Address][address]</code> | [Address][address] of the DAO  |

Example:
``` typescript 
import { games } from '@aragon/govern'

const response = await games('0x0...');
```

### queue(id) ⇒ <code>Promise<OptimisticQueue></code>

Returns a queue by his ID.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| id     | string                | The if of the queue                       |

Example:
``` typescript 
import { queue } from '@aragon/govern'

const response = await queue('ID');
```

### queuesForDao(address) ⇒ <code>Promise<OptimisticQueue[]></code>

Returns a queue by his ID.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| address | <code>[Address][address]</code> | [Address][address] of the DAO  |

Example:
``` typescript 
import { queuesForDao } from '@aragon/govern'

const response = await queuesForDao('0x0...');
```

### query(query) ⇒ <code>Promise<OperationResult></code>

Returns the desired data.

| Param  | Type                      | Description                               |
| ------ | ------------------------- | ----------------------------------------- |
| query  | <code>DocumentNode</code> | GraphQL query                             |
| args   | <code>object</code>       | [Address][address] of the DAO             |

Example:
``` typescript 
import { query } from '@aragon/govern'

const query = await query(node, {...});
```

[Address]: https://github.com/aragon/govern/tree/master/packages/govern/internal/configuration/Configuration.ts#L4
[ConfigurationObject]: https://github.com/aragon/govern/tree/master/packages/govern/internal/configuration/Configuration.ts#L4
