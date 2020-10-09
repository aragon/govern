### 2020-10-09 Review

#### Usage
- who would you say it is a target user?
- what about providing an optional extending including a settlement period?
- how do we expect people to be able to submit proposals to govern in terms of tools?

#### Documentation
- add inline doc and natspec descriptions, also inline comments could help in some cases
- would be good to have a state-machine diagram showing the actions lifecycle
- we can also add a funds diagram to show how the money flow in the system  

#### Security
- Possible attack vector submit action and challenge it immediately to avoid being vetoed
- AFAIK there is nothing that can't be executed by the executors right?  

#### Repos

#### SC
- use `_` prefix for internal functions
- use a consistent function ordering
- use different naming strategy for scope-declared variables and function params
- unused declared return variables

##### ERC3k JS
- outdated abi, it is probably better to point to the exported ABIs directly
- not exactly sure how this library should be used

##### Subgraph
- outdated abi, it is probably better to point to the exported ABIs directly
- rename entities following the current naming strategy 
