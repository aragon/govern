# Smart contracts breakdown

Reference implementation of ERC3000, and the core set of contracts for Aragon Optimistic DAOs.

## ERC3000Registry.sol

[📜Current Implementation](https://github.com/aragon/govern/blob/master/packages/erc3k/contracts/ERC3000Registry.sol)

The `ERC3000Registry` contract serves as the **central registry for all Govern DAOs**. Every DAO spawned through a properly-implemented `GovernFactory` will register the new DAO in the "official" registry. The registry takes care of doing these things:

* keep track\* of every Govern &lt;&gt; GovernQueue pair assigning it a name on the blockchain. This means that instead of needing an ENS name, this is left to the user, as the name itself will be saved on the contract's storage.
* Setting metadata, which means you can include an IPFS CID to talk about your DAO, and include relevant links.

**Think of it as...**

A book which keeps track of every DAO and its core relevant info, which will be accesible through a subgraph.

\*_Due to the stateless nature of these contracts, it actually only emits an event, and registers the DAO name to the contract's storage so it cannot be overwritten. We rely on the subgraph to get this information._

## GovernFactory.sol & GovernQueueFactory.sol

[🏭Reference implementation](https://github.com/aragon/govern/blob/master/packages/govern-create/contracts/GovernBaseFactory.sol)

`GovernFactory` and `GovernQueueFactory` produce their respective contract instances: `Govern` and `GovernQueue`. The intended usage is to create a new GovernQueue, and feed the resulting address, along with an `ERC3000Registry` address to GovernFactory. The latter will then produce a new `Govern` contract, register it to the desired `ERC3000Registry` with the chosen name, and set up a standard set of permissions.

**Think of it as...**

As **templates**; these could be modified and extended to set up more specific permissions and change the collateral needed to execute actions. This would be easy to do even for solidity beginners, considering these contracts don't inherit from other ones, and all permissions are already laid out.

## Govern.sol

[🐣Reference implementation](https://github.com/aragon/govern/blob/master/packages/govern-core/contracts/Govern.sol)

`Govern` is the DAO's Agent. It's much leaner though, with the differences being:

* It is **NOT** a vault. It can only hold ETH and ERC20 tokens for now. More token standars will be supported in future versions.
* It does not implement ERC 1271 yet.

The initial usage will be to receive actions from `GovernQueue` and execute them. It's possible to have more complex use cases, and so will be devised later or come up organically.

## GovernQueue.sol

[✨Reference implementation](https://github.com/aragon/govern/blob/master/packages/govern-core/contracts/pipelines/GovernQueue.sol)

`GovernQueue` is by far the most critical contract to understand, as it's the main point of interaction with the DAO and the Aragon Protocol. It bundle several concepts in the same contract:

* **Disputable Delay Actions**: `GovernQueue` has a workflow of pushing the actions to be executed on a queue, that after some time will be available to be executed. During this time window, they can be disputed.

  `GovernQueue` **can be configured**, meaning you can change these parameters:

```text
struct Config {
  uint256 executionDelay;
  Collateral scheduleDeposit;
  Collateral challengeDeposit;
  Collateral vetoDeposit;
  address resolver;
  bytes rules;
}

struct Collateral {
  address token;
  uint256 amount;
}
```

The intended workflow for actions would be as follows, assuming the action was sent on chain to the optimistic queue \(note that we're able to do this through `GovernQueue` only\):

1. The action is scheduled. A time window opens for disputing this action.
   1. If the action is challenged, the execution is paused and the action is sent to the arbitrator \(Aragon Protocol\) to resolve the dispute
   2. If it is disputed in favor of the submitter, it will release the collateral to the submitter and execute the action\(s\).
   3. If it is disputed in favor of the challenger, it will cancel the execution of the action\(s\) and release the collateral to the challenger.
2. The action has successfully passed the time window for challenges, and can be executed.
3. Anyone with the necessary permissions calls the execute method and GovernQueue will make the Govern contract execute the actions.

Actions can be **vetoed**, which might be useful for projects which are venturing into further decentralizing but still desire a multisig for the time being.

## ACL.sol

[🚦Reference implementation](https://github.com/aragon/govern/blob/master/packages/govern-contract-utils/contracts/acl/ACL.sol)

The ACL from govern is a much leaner implementation of the original ACL from aragonOS, but still very powerful, having the ability to grant, revoke, and freeze roles. There are a couple of differences though:

* Is devised to be as an **inheritable** contract. Instead of being a single contract that binds the whole organization together, **both GovernQueue.sol and Govern.sol have their own ACLs**.
* It doesn't have any oracles yet, and no fancy fluff. It's simple and to the point with the 3 functions defined above. Due to this, reasoning about permissions, which is usually a friction point with aragonOS, is greatly simplified.
* It has a handy **bulk** function to set multiple permissions at once.

