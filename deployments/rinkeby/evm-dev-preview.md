# Developer Preview (EVM)

---

---

## Registry

```sh
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ rm -rf cache
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ rm -rf artifacts
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ yarn compile
yarn run v1.22.4
$ buidler compile --force
Compiling...
Compiled 32 contracts successfully
✨  Done in 7.80s.
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ yarn buidler deploy-registry --network rinkeby
yarn run v1.22.4
$ /Users/jorge/aragon/govern/node_modules/.bin/buidler deploy-registry --network rinkeby
- GovernRegistry: https://rinkeby.etherscan.io/address/0x0cd3621EC403F26ad9F79c3d77B1dda1f8474c6f
✨  Done in 2.65s.
```

## Factory

```sh
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ yarn deploy-factory --network rinkeby
yarn run v1.22.4
$ yarn compile && buidler deploy-factory --network rinkeby
$ buidler compile --force
Compiling...
Compiled 32 contracts successfully
- GovernFactory: https://rinkeby.etherscan.io/address/0xE211F724817347566BAeAc82b8130763c3EE3650
- GovernQueueFactory: https://rinkeby.etherscan.io/address/0x918046dB1a2Cd799ecD85a2a582cE3BF4C092355
- GovernTokenFactory: https://rinkeby.etherscan.io/address/0xA6bf891Af527bCE1aE2a17435C64717fc7bB01cD
- GovernBaseFactory: https://rinkeby.etherscan.io/address/0xe071Fc0C53Be275cF7246D16373A74231fA5a585
✨  Done in 15.49s.
```

## Factory test

```sh
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ yarn deploy-govern --network rinkeby
----
A wild new Govern named *autonomous-olive* appeared 🦅
- Govern: https://rinkeby.etherscan.io/address/0xcb675E282AdcceA313d83867A76c077eF850612C
- Queue: https://rinkeby.etherscan.io/address/0x111b5feb00f7ce0fC1fD84E399cE4DCF695A0a08
✨  Done in 141.99s.
```


