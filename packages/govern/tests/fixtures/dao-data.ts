const name = 'bitconnect'
const queueAddress = '0xf285a1227ba8f3cdb6d612d9cae125af62b951d1'
const daoData = {
   name,
   address: '0x0b834c0948491ad369d30fc1bff9bc299777632e',
   id: '0x0b834c0948491ad369d30fc1bff9bc299777632e',
   metadata: '0x',
   registryEntries: [{
      id: name,
      name,
      queue: {
         id: queueAddress,
         address: queueAddress,
         queued: true
      }
   }]
}

export default daoData;
