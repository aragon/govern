# Govern.js API

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

### dao(name) ⇒ ``Promise<Dao>``

Returns details about a DAO by his address.

| Param  | Type                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| name   | <code>string</code>   | The name of the DAO                       |

Example:
``` typescript 
import { dao } from '@aragon/govern'

const response = await dao('0x0...');
```

### daos() ⇒ ``Promise<Dao[]>``

Returns all DAOs.


Example:
``` typescript 
import { daos } from '@aragon/govern'

const response = await daos();
```

### query(query, args) ⇒ ``Promise<object>``

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

### createDao(args, options) ⇒ ``Promise<TransactionResponse>``

Create

| Param    | Type                            | Description                             |
| -------- | ------------------------------- | --------------------------------------- |
| args     | <code>CreateDaoParams</code>    | Dao name, Dao token, useProxies option  |
| options  | <code>CreateDaoOptions</code>   | EIP 1193 provider, Dao factory address  |

Examples:

For Node.js:
``` typescript
import { createDao } from '@aragon/govern'

const result = await createDao(args, options);
```

For ES6 in the Web Browser:
``` typescript
<script type="module">
    import { createDao } from './dist/esm/public/govern-esm.min.js'
    const btn = document.getElementById('btn-umd')
    btn.onclick = async (e) => {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed!');
            return;
        }

        const tx = await createDao({name: "hello", token: { name: 'hello', symbol: 'HLO'}, useProxis: false})
    }
</script>
```

For ES3 (UMD) in the Browser:
``` typescript
<script type="application/javascript" src="./dist/umd/public/govern-umd.min.js"></script>
<script type="application/javascript">
    const btn = document.getElementById('btn-esm')
    btn.onclick = async (e) => {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask is not installed!');
            return;
        }

        const tx = await govern.createDao({name: "world", token: { name: 'world', symbol: 'WLD'}, useProxis: false})
    }
</script>
```


### configure(config) ⇒ ``void``

Overwrites the default configuration of govern.

| Param  | Type                                                    | Description                                          |
| ------ | ------------------------------------------------------- | ---------------------------------------------------- |
| config | <code>[ConfigurationObject][ConfigurationObject]</code> | Object with all [config options][ConfigurationObject]|

Example:
``` typescript 
import { configure } from '@aragon/govern'

configure({governURL: 'https://myOwnGovernServer.io'});
```

[ConfigurationObject]: https://github.com/aragon/govern/tree/master/packages/govern/internal/configuration/Configuration.ts#L4
