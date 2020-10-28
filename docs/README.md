# Aragon Govern

Welcome to Aragon Govern's documentation.

Aragon Govern is software for creating and governing organizations such as clubs, companies, gaming guilds, cooperatives, nonprofits, open source projects, and any other type of organization you can imagine. It's Aragon's implementation of ERC-3000, the standard for binding off-chain voting.

Along with off-chain voting solutions like [Snapshot](https://snapshot.page/#/) it allows you to *govern* all parts of your project, even if not completely decentralized, in an easy manner. also allowing for flexibility and extensions when needed.

## High level overview

Govern builds on the "Optimistic" concept, in which we assume actors are acting rationally and with good intentions, until proven otherwise. Actors with permissions in the DAO can submit actions, which can get executed after a defined time window, which will allow for these to be disputed with the chosen  subjective oracle (e.g Aragon Protocol).  These actions can also be vetoed by an actor with the corresponding permissions.

Govern DAOs can also hold funds and interact with any protocol on the corresponding network through its corresponding *executor*, which is equivalent to the aragonOS **Agent** and Moloch's **Minion**. This allows for completely decentralized actions such as the pooling of funds in a common vault and interaction with lending protocols like Compound to obtain interest over these.

Govern will also have first class support with Snapshot, in which a space will be able to be configured so that every proposal can attach an on-chain action to the corresponding options to vote for. With these tools, we have everything we need to allow a project, to fully and progressively decentralize and  take decisions over its future in a community-oriented manner.

