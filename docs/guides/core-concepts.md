# Core concepts

## Optimistic by design

Govern builds on the "Optimistic" concept, in which we assume actors are acting rationally and with good intentions, until proven otherwise. Actors with permissions in the DAO can submit actions, which can get executed after a defined time window. These can also be disputed with the chosen mechanism for resolving these challenge/response games, most likely a [subjective oracle](https://aragon.org/blog/snapshot), such as Aragon Protocol. These actions can also be vetoed by an actor with the corresponding permissions as long as they haven't been executed.

With the shift towards operating a DAO in an optimistic way, economic and social incentives are introduced for people to act rationally: any malicious actions that get submitted can get challenged, resulting in the malicious actor losing money and the challenger earning the actor's collateral. Unnecessary challenges are also disincentivized due to the need to lock collateral to do so and potential loss of reputation if a subjective oracle is used and fails in favor of the submitter.

To date, acceptable actions and behavioral boundaries within DAOs are rigidly defined in code, and strictly enforced by machines alone. However, many concerns cannot or should not be so rigidly defined in code and must be augmented with more subjective judgements. The rules that dictate these subjective constraints to which actors are subjected to are defined through the DAO's agreement, which is part of its configuration from the start. This gives all actors a clear set of rules to which they must abide to engage with the organization and avoid losing collateral.

## Anatomy of a Govern DAO

A Govern DAO, in its most normal and basic form has two key pieces:

* An Action Queue
* An Executor

Govern's Action Queue is what most users will interact with directly—it holds the DAOs configuration parameters, and its where actors can schedule, execute, veto and challenge actions. It's also flexible, meaning that actions can be introduced to tweak its own parameters on the fly.

Through the Executor, Govern DAOs can also hold funds and interact with any arbitrary protocol. This makes it equivalent to **aragonOS's Agent** and **Moloch's Minion.** This allows for complex user flows such as a community deciding through a Snapshot vote to use pooled funds in the Executor to gain interest through lending protocols like Compound or AAVE and also fund a Balancer liquidity pool, all in one transaction.

Learn more about the [smart contract system here]().

Govern will also have first class support with Snapshot, in which a space will be able to be configured so that every proposal can attach an on-chain action to the corresponding options to vote for. With these tools, we have everything we need to allow a project, to fully and progressively decentralize and take decisions over its future in a community-oriented manner.

