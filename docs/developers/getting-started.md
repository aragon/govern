# Smart contracts breakdown

## Concepts to keep in mind

### Stateless contracts

Aragon Govern's contracts hold very little state; this is to keep gas costs as low as possible and to keep the architecture lean. Akin to [Stateless Ethereum](https://blog.ethereum.org/2020/01/28/eth1x-files-the-stateless-ethereum-tech-tree/), to witness all state transitions and ensure all data is forever available for querying and retrieval in an easy manner, we rely on our subgraph, which stores all actions and executions regarding Govern DAOs. Please refer to the [subgraph docs](https://github.com/aragon/govern/tree/master/packages/govern-subgraph) to have more insight on which events are we tracking, and how.

## Govern Smart Contracts

{% hint style="info" %}
ERC3000 specific contracts haven't been included here. To browse them, go to the [corresponding package](https://github.com/aragon/govern/tree/master/packages/erc3k).
{% endhint %}

### GovernRegistry.sol

[📜 Implementation](https://github.com/aragon/govern/blob/master/packages/erc3k/contracts/ERC3000Registry.sol)

The `ERC3000Registry` contract serves as the **central registry for all Govern DAOs**. Every DAO spawned through a properly-implemented `GovernFactory` will register the new DAO in the "official" registry. The registry takes care of doing these things:

* keep track\* of every Govern &lt;&gt; GovernQueue pair assigning it a name on the blockchain. This means that instead of needing an ENS name, this is left to the user, as the name itself will be saved on the contract's storage.
* Setting metadata, which means you can include an IPFS CID to talk about your DAO, and include relevant links.

**Think of it as...**

A book which keeps track of every DAO and its core relevant info, which will be accessible through a subgraph.

{% hint style="info" %}
\*Due to the stateless nature of these contracts, it actually only emits an event, and registers the DAO name to the contract's storage so it cannot be overwritten. We rely on the subgraph to get this information.
{% endhint %}

### GovernFactory.sol & GovernQueueFactory.sol

[🏭 Implementation](https://github.com/aragon/govern/blob/master/packages/govern-create/contracts/GovernBaseFactory.sol)

`GovernFactory` and `GovernQueueFactory` produce their respective contract instances: `Govern` and `GovernQueue`. The intended usage is to create a new GovernQueue, and feed the resulting address, along with an `ERC3000Registry` address to GovernFactory. The latter will then produce a new `Govern` contract, register it to the desired `ERC3000Registry` with the chosen name, and set up a standard set of permissions.

**Think of it as...**

**templates**; these could be modified and extended to set up more specific permissions and change the collateral needed to execute actions. This would be easy to do even for solidity beginners, considering these contracts don't inherit from other ones, and all permissions are already laid out.

### Govern.sol

[🐣 ****Implementation](https://github.com/aragon/govern/blob/master/packages/govern-core/contracts/Govern.sol)

`Govern` is the DAO's executor _and_ vault of the organization. It will be responsible for executing the actions that have been scheduled through the queue and holding the organization's funds. While the smart contract is extremely simple \(&lt;80 LOC\), it can effectively call any external smart contract, which means it's basically a smart account which is governed by the DAO. 

### GovernQueue.sol

[✨ Implementation](https://github.com/aragon/govern/blob/master/packages/govern-core/contracts/pipelines/GovernQueue.sol)

`GovernQueue` is by far the most critical contract to understand, as it's the main point of interaction with the DAO and the Aragon Protocol. This is what most users will interact with directly—it holds the DAOs configuration parameters, and its where actors can schedule, execute, veto and challenge actions.

* `GovernQueue` **can be configured**, meaning you can change these parameters:

```text
struct Config {
  uint256 executionDelay;
  Collateral scheduleDeposit;
  Collateral challengeDeposit;
  address resolver;
  bytes rules;
}

struct Collateral {
  address token;
  uint256 amount;
}
```

The intended workflow for actions would be as follows, assuming the action was sent on chain to the optimistic queue \(note that we're able to do this through `GovernQueue` only\):

1. The action is **scheduled**. **A time window opens** for disputing this action.
   1. If the action is **challenged**, the execution is paused and the action is sent to the arbitrator \(Aragon Protocol\) to resolve the dispute
   2. If it is disputed in favor of the **submitter**, it will release the collateral to the submitter and execute the action\(s\).
   3. If it is disputed in favor of the **challenger**, it will cancel the execution of the action\(s\) and release the collateral to the challenger.
2. The action has successfully passed the time window for challenges, and can be **executed**.
3. Anyone with the necessary permissions calls the `execute` method and `GovernQueue` will make the Govern contract execute the actions.

Actions can be **vetoed**, which might be useful for projects which are venturing into further decentralizing but still desire a multisig for the time being, or want a way for its community to cancel a vote.

### ACL.sol

[🚦Reference implementation](https://github.com/aragon/govern/blob/master/packages/govern-contract-utils/contracts/acl/ACL.sol)

The ACL from govern is a much leaner implementation of the original ACL from aragonOS, but still very powerful, having the ability to grant, revoke, and freeze roles. There are a couple of differences are:

* Is devised to be as an **inheritable** contract. Instead of being a single contract that binds the whole organization together, **both `GovernQueue` and `Govern` have their own ACLs**.
* It has a handy **bulk** function to set multiple permissions at once.
* The address for freezing a role is `0x0000000000000000000000000000000000000001`.
* The address for giving the permission to everyone is`0xffffffffffffffffffffffffffffffffffffffff`

