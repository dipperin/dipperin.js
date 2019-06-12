import { isNil } from 'lodash'
import Helper, {
  SignedTransactionResult,
  TransactionResult,
  getTransactionFromRaw
} from '../../helper'

// const TRANSACTION_FEE_RATE = 100
// const WITNESS_PER_LENGTH = 105
class Transaction {
  /**
   * Unserialize rlp raw transaction to raw transaction object
   *
   * @param raw
   */
  static unserialize(raw: string): Transaction {
    const transactionResult = getTransactionFromRaw(raw)

    return new Transaction(transactionResult)
  }

  transactionResult: TransactionResult

  constructor(txResult: TransactionResult) {
    this.transactionResult = {
      ...txResult,
      witness: txResult.witness
        ? txResult.witness
        : {
            r: '',
            s: '',
            v: '',
            hashKey: ''
          }
    }
  }

  /**
   * Sign this transaction
   *
   * @param privateKeys
   */
  sign(privateKey: string, chainId?: string): void {
    if (isNil(privateKey)) {
      throw new Helper.Errors.InvalidPrivateKeyError(privateKey)
    }

    const sig = Helper.Tx.signTransaction(
      this.transactionResult.txData,
      privateKey,
      chainId
    )

    this.transactionResult.witness = {
      r: sig[1],
      s: sig[2],
      v: sig[0],
      hashKey: null
    }

    this.transactionResult.txData.from = Helper.Account.fromPrivate(privateKey)
  }

  /**
   * Serialize raw transaction object to rlp transaction
   *
   *
   */
  serialize(): string {
    return Helper.Tx.rlpSignedTx(this.transactionResult)
  }

  getTxHash(): string {
    return Helper.Tx.getTransactionId(this.transactionResult.txData)
  }

  /**
   * Return signed transaction
   */
  getSignedTransaction(): SignedTransactionResult {
    const raw = this.serialize()
    return {
      raw,
      hash: this.getTxHash(),
      tx: this.transactionResult
    }
  }

  recover(): string {
    const { r, s, v } = this.transactionResult.witness
    const chainId = Helper.Tx.getChainId(v)
    const hashRlpTx = Helper.Tx.hashRlpTx({
      txData: this.transactionResult.txData,
      chainId
    })

    return Helper.Account.recover(
      hashRlpTx,
      Helper.Account.encodeSignature([v, r, s])
    )
  }

  /**
   * without witness length byte length = raw.length/2 -1
   * witness length = 67
   */
  getFee(): string {
    const raw = this.serialize()
    let rawByte = raw.length / 2 - 1
    if (!this.transactionResult.witness.r) {
      rawByte += 67
    }
    if (this.transactionResult.txData.fee === '0') {
      rawByte += 6
    }
    return (rawByte * 100).toString()
  }
}

export default Transaction
