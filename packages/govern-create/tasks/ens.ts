import { task, types } from 'hardhat/config'
import { Ens } from '../utils/ens'
import { constants, utils } from 'ethers'

/*
*  This task is used to set the ENS address record
*  To run it:
*  yarn set-ens --name governbasefactory.aragon.eth --address 0xB75290E69F83b52BfbF9C99B4Ae211935E75A851 --network rinkeby
*
*  See https://github.com/aragon/govern/tree/develop/packages/govern-create on how to setup .env file with account mnemonic
*/

task('ens:set-addr', 'Set the ENS address record')
.addParam("name", "The ENS name to set")
.addParam("address", "The address to set to")
.setAction(async ({name, address}, env) => {
  const { network } = env
  const ens = await Ens.createEns(network.provider)
  let from = '';

  try {
    const tx = await ens.setAddr(name, address)
    if( !tx ) {
      console.log(`INFO: The ens name has already been set to the given address`)
      return
    }

    from = tx.from
    console.log('transaction')
    console.log(' hash:', tx.hash)
    console.log(' from:', tx.from)
    console.log(' to:', tx.to)
    console.log(' value:', tx.value.toString())
    console.log(' data:', tx.data)

    const receipt = await tx.wait()
    console.log('Success?', Boolean(receipt.status))

  } catch (err) {
    console.log('')
    console.log('=== ERROR ===')

    const authorisedAddress = await ens.getOwner(name)
    if( authorisedAddress !== from && authorisedAddress != constants.AddressZero ) {
      console.log('The account may not have the authorisation to set the address record')
      console.log(`Try using the account: ${authorisedAddress}`)
    }

    console.log(err.message)
  }
})

/*
 * Reclaim the ownership of an ENS name. By default, it only prints the transaction data
 * to be run by a multisig wallet contract.
 *
 * To print the transaction data for reclaiming aragon.eth (note that label == aragon, not aragon.eth)
 *  yarn reclaim-ens --network rinkeby --label aragon --controller 0xb5BdAa442BB34F27e793861C456CD5bDC527Ac8C
 *
 * To run the transaction directly, use the `--print false` flag
 *  yarn reclaim-ens --network rinkeby --print false --label aragon --controller 0xb5BdAa442BB34F27e793861C456CD5bDC527Ac8C
 *
 * Since the contract address (transaction.to value) is the same for both testnet and mainnet enviornment in ENS system,
 * it's fine to run this command in rinkeby network to print the transaction data
*/
task('ens:reclaim', 'Reclaim the ownership of an ENS name')
.addParam("label", "The ENS label, without .eth")
.addParam("controller", "The controller of the ENS")
.addOptionalParam('print', 'Print the transaction data only', true, types.boolean)
.setAction(async ({label, controller, print}, env) => {
  const { network, ethers } = env
  const ens = await Ens.createEns(network.provider)

  try {
    const [ signer ] = print? await ethers.getSigners() : []
    const registrar = await ens.getEthRegistrar(signer)
    const id = utils.id(label)
    const tx = print?
      await registrar.populateTransaction.reclaim(id, controller) :
      await registrar.reclaim(id, controller)

    console.log('transaction')
    console.log(' to:', tx.to)
    console.log(' value:', tx.value?.toString() || '0')
    console.log(' data:', tx.data)

    if( !print ){
      console.log(' from: ', tx.from)
      console.log(' transaction hash: ', tx.hash)
      const receipt = await tx.wait()
      console.log('Success?', Boolean(receipt.status))
    }

  } catch (err) {
    console.log(err.message)
  }
})


/*
 * Create ENS subdomain and set the resolver
 *
 * To create a subdomain, deploy.aragon.eth, you would pass parent = aragon.eth, label = deploy
 * Similarily, to create a subdomain, govern.deploy.aragon.eth, use parent = deploy.aragon.eth, label = govern
 *
 * To run create the subdomain directly, not just printing the transaction data, use the `--print false` flag
 *  yarn ens-subdomain --network rinkeby --label deploy --parent aragon.eth --controller 0xb5BdAa442BB34F27e793861C456CD5bDC527Ac8C --print false
 *
 * To run the command without sending the transaction to the network, just print the transaction data, omit the --print flag
*/
task('ens:subdomain', 'Create a new ENS subdomain and set the resolver')
.addParam("parent", "The parent domain name")
.addParam("label", "The subdomain label")
.addParam("controller", "The controller address of the subdomain")
.addOptionalParam("resolver", "The resolver address, default to resolver.eth")
.addOptionalParam('print', 'Print the transaction data only', true, types.boolean)
.addOptionalParam('gas', 'The maximum gas to use, default will estimate')
.setAction(async ({parent, label, controller, resolver, gas, print}, env) => {
  const { network, ethers } = env
  const ens = await Ens.createEns(network.provider, print)

  try {
    const [ signer ] = print? await ethers.getSigners() : []

    // use default resolver
    const resolverOrDefault = controller === constants.AddressZero? constants.AddressZero :
                             resolver || await ethers.provider.resolveName('resolver.eth')
    const nodehash = utils.namehash(parent)
    const labelhash = utils.id(label)
    const ttl = 0
    const overrides = { gasLimit: gas }

    console.log('nodehash', nodehash)
    console.log('labelhash', labelhash)

    const tx = print?
      await ens.ens.populateTransaction.setSubnodeRecord(nodehash, labelhash, controller, resolverOrDefault, ttl) :
      await ens.ens.setSubnodeRecord(nodehash, labelhash, controller, resolverOrDefault, ttl, overrides)

    console.log('transaction')
    console.log(' to:', tx.to)
    console.log(' value:', tx.value?.toString() || '0')
    console.log(' data:', tx.data)

    if( !print ){
      console.log(' from: ', tx.from)
      console.log(' transaction hash: ', tx.hash)
      const receipt = await tx.wait()
      console.log('Success?', Boolean(receipt.status))
    }

  } catch (err) {
    console.log(err.message)
  }
})

/*
*  Set the ENS resolver and ttl (time-to-live caching)
*    - name is the fully qualified ENS name, i.e. deploy.aragon.eth
*
*  This task was created for debugging purposes, so, would not add to the package.json
*
*  It can be run like this:
*  npx hardhat ens:setrecord --network rinkeby --name deploy.wonderful.eth --controller 0xb5BdAa442BB34F27e793861C456CD5bDC527Ac8C --resolver 0xf6305c19e814d2a75429Fd637d01F7ee0E77d615
*/
task('ens:setsubnode', 'Create a new ENS subdomain')
.addParam("parent", "The parent domain name")
.addParam("label", "The subdomain label")
.addParam("controller", "The controller address of the subdomain")
.addOptionalParam('print', 'Print the transaction data only', true, types.boolean)
.setAction(async ({parent, label, controller, print}, env) => {
  const { network, ethers } = env
  const ens = await Ens.createEns(network.provider, print)

  try {
    const [ signer ] = print? await ethers.getSigners() : []

    // use default resolver
    const resolver = await ethers.provider.resolveName('resolver.eth')
    const nodehash = utils.namehash(parent)
    const labelhash = utils.id(label)
    const ttl = 0

    const tx = print?
      await ens.ens.populateTransaction.setSubnodeOwner(nodehash, labelhash, controller) :
      await ens.ens.setSubnodeOwner(nodehash, labelhash, controller)

    console.log('transaction')
    console.log(' to:', tx.to)
    console.log(' value:', tx.value?.toString() || '0')
    console.log(' data:', tx.data)

    if( !print ){
      console.log(' from: ', tx.from)
      console.log(' transaction hash: ', tx.hash)
      const receipt = await tx.wait()
      console.log('Success?', Boolean(receipt.status))
    }

  } catch (err) {
    console.log(err.message)
  }
})


/*
*  Set the ENS resolver and ttl
*    - name is the fully qualified ENS name, i.e. deploy.aragon.eth
*    - ttl is the caching time-to-live of the name, default to 0
*          see https://docs.ens.domains/contract-api-reference/ens#get-ttl
*    - resolver is the address of the contract that does name resolution
*
*  This task was created for debugging purposes, so, would not add to the package.json
*
*  It can be run like this:
*  npx hardhat ens:setrecord --network rinkeby --name deploy.wonderful.eth --controller 0xb5BdAa442BB34F27e793861C456CD5bDC527Ac8C --resolver 0xf6305c19e814d2a75429Fd637d01F7ee0E77d615
*/
task('ens:setrecord', 'Create a new ENS subdomain')
.addParam("name", "The domain name")
.addParam("controller", "The controller address of the subdomain")
.addParam("resolver", "The resolver address")
.addOptionalParam("ttl", "The caching time-to-live of the ENS name", 0, types.int)
.addOptionalParam('print', 'Print the transaction data only', true, types.boolean)
.setAction(async ({name, controller, resolver, print}, env) => {
  const { network, ethers } = env
  const ens = await Ens.createEns(network.provider, print)

  try {
    const [ signer ] = print? await ethers.getSigners() : []

    const nodehash = utils.namehash(name)
    const ttl = 0

    const tx = print?
      await ens.ens.populateTransaction.setRecord(nodehash, controller, resolver, ttl) :
      await ens.ens.setRecord(nodehash, controller, resolver, ttl)

    console.log('transaction')
    console.log(' to:', tx.to)
    console.log(' value:', tx.value?.toString() || '0')
    console.log(' data:', tx.data)
    console.log(' namehash', nodehash)

    if( !print ){
      console.log(' from: ', tx.from)
      console.log(' transaction hash: ', tx.hash)
      const receipt = await tx.wait()
      console.log('Success?', Boolean(receipt.status))
    }

  } catch (err) {
    console.log(err.message)
  }
})
