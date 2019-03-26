// milk peace ten assume extend penalty rally dizzy kingdom talent capital concert cradle capable cream immense ivory ignore sibling utility sleep rotate window net

const { helper } = require('./build/main')
// const helper = require('./build/module').helper

console.log(helper.Account.privateToPublicKey('aa55981863b0ebeb1163a35c0738f22d2d12bac1bbf73ba8f6d29af77bfbe980'))

// const chainstack = new Chainstack('http://10.200.0.139:10002')

// chainstack.cs.requestManager.send(
//   {
//     jsonrpc: '2.0',
//     id: '1',
//     method: 'chainstack_subscribe',
//     params: ['subscribeBlock']
//   },
//   (_, id) => {
//     chainstack.cs.requestManager.addSubscription(
//       id,
//       'subscribeBlock',
//       'subscribeBlock',
//       (err, res) => {
//         // chainstack.cs.requestManager.removeSubscription(id, console.log)
//         console.log(err, res)
//       }
//     )
//   }
// )

// const subscribe = chainstack.cs.subscribeBlock().on('data', (err, res) => {
//   console.log(err)
// })

// setTimeout(() => {
//   console.log('unsubscribe')
//   subscribe.unsubscribe(console.log)
// }, 10000)

// let json = {
//   coin_base: "",
//   hash: "",
//   number: 1,
//   timestamp: 1,

//   transactions: [
//     {
//       fee: 1,
//       from: "",
//       input: "",
//       nonce: "",
//       to: "",
//       tx_id: "",
//       value: 1
//     }
//   ]
// }

// chainstack.net.isConnecting().then(console.log)
// chainstack.cs.getBalance('0x0000d28Eb0154A96F4af6E631766939593554c7E5577').then(console.log)
// chainstack.cs.getTransaction('0x060c6b530bb7aac625293a162bbfe694bcdd779b0d21eafb92a56f07c8ddac82').then(console.log)

// chainstack.cs.setMineCoinbase('0x0000E64007dC67b1eaEbd36FD917187c9FF79FF87B6a').then(console.log)

// 0xd34bf665782ffc0dcb63c028f2c25c7a6259a1d4e5e3406d65bd6f71d04eefbe

// 0x9fb27a8baf443e7c511f8dd26edb670635bef7facd6099d5b898c05cb7f9a9a3

// console.log(
//   Accounts.signTransaction(
//     {
//       nonce: '7',
//       extraData: 'fsaf',
//       value: '10000000000',
//       hashLock: '',
//       from: '0x0000aAd7f203b5C1DB0E57CDBc4808f8d1958210e186',
//       to: '0x0000CAa23741F3aC28E3134420E5E313e6452A7dbEDA',
//       fee: '92'
//     },
//     '0x132865d183fad20d1091b9ad0e81696ef601d3fb01a009b1bdc32890c8efc6f4'
//   )
// )

// chainstack.cs.getTransaction('0x3de896d68da75cb7cb51479e5f1abe0329cc441d9af48bc59af7720154deefae').then(console.log)
