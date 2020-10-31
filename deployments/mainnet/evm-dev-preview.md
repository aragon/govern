# Developer Preview (EVM, Mainnet)

---
- Deployer: [@izqui](https://github.com/izqui) ([`0x1111a5f9decc25927037de55d2013d7ad30f1af0`](https://etherscan.io/address/0x1111a5f9decc25927037de55d2013d7ad30f1af0)
- Commit hash: [`a26d0f07`](https://github.com/aragon/govern/commit/a26d0f073b70839f5182abbace2aef1dd1918b51)
---

## Registry

```sh
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ rm -rf artifacts
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ rm -rf cache
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ yarn compile
yarn run v1.22.4
$ buidler compile --force
Compiling...
Compiled 32 contracts successfully
✨  Done in 8.08s.
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ yarn buidler deploy-registry --network mainnet
- GovernRegistry: https://etherscan.io/address/0x9dDC0BAB6aCCa5F374E2C21708b3107e5E973601
```

## Factory

```sh
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ env MAINNET=true yarn deploy-factory --network mainnet
yarn run v1.22.4
$ yarn compile && buidler deploy-factory --network mainnet
$ buidler compile --force
Compiling...
Compiled 32 contracts successfully
- GovernFactory: https://etherscan.io/address/0x634821AD9E62A5f7dB92471ccae1a91Cbaefa33A
- GovernQueueFactory: https://etherscan.io/address/0xEEc0860A6673Bd82940f1F1f094E6D7AeE0188F2
- GovernTokenFactory: https://etherscan.io/address/0x874E22352098748504C8a8644b1492436CB73E52
- GovernBaseFactory: https://etherscan.io/address/0x3B02e7C7Af1be87BBEc071f5DFfcdD8613154bA9
✨  Done in 15.15s.
```

## Factory test

```sh
[~/a/g/p/govern-create] git:(deployment-preview) ✗ $ env MAINNET=true yarn deploy-govern --network mainnet --name M
yarn run v1.22.4
$ buidler deploy-govern --network mainnet --name M
----
A wild new Govern named *M* appeared 🦅
- Govern: https://etherscan.io/address/0x24319B199e9E3867Ede90eAf0faD56168C54d077
- Queue: https://etherscan.io/address/0x498CbF401DF68196dc41b4Bf53817088cB70B815
✨  Done in 61.40s.
```


