import Secp256k1 from 'secp256k1'
import Bytes from './bytes'
import Hash from './hash'
import Nat from './nat'
import cryp from 'crypto'

const { keccak256 } = Hash
const ADDRESS_PREFIX = '0000'
const CONTRACT_ADDRESS_PREFIX_ERC20 = '0010'

const CONTRACT_TYPE_ERC20 = 'ERC20'

/**
 *
 */
export const getAddressPrefix = (type: string): string => {
  if (type === CONTRACT_TYPE_ERC20) {
    return CONTRACT_ADDRESS_PREFIX_ERC20
  }
  return ADDRESS_PREFIX
}

/**
 * Transfrom address to check sum address
 *
 * @param address
 * @return Check sum address
 */
export const toChecksum = (address: string): string => {
  const addressHash = keccak256(address.slice(2))
  let checksumAddress = ''
  for (let i = 0; i < 44; i++) {
    checksumAddress +=
      parseInt(addressHash[i + 2], 16) > 7
        ? address[i + 2].toUpperCase()
        : address[i + 2]
  }
  return `0x${checksumAddress}`
}

export const genContractAddress = (): string => {
  const innerHex = keccak256(cryp.randomBytes(64))

  const middleHex = Bytes.concat(
    Bytes.concat(cryp.randomBytes(32).toString('hex'), innerHex),
    cryp.randomBytes(32).toString('hex')
  )
  const outerHex = keccak256(middleHex)
  return fromPrivate(outerHex, CONTRACT_TYPE_ERC20)
}

/**
 * Returns the check sum address of a given private key
 *
 * @param privateKey A private key must be 256 bits wide
 * @return Address
 */
export const fromPrivate = (privateKey: string, type?: string): string => {
  const publicHash = keccak256(
    Buffer.from(privateToPublicKey(privateKey, false).slice(2), 'hex')
  )
  return toChecksum(`0x${getAddressPrefix(type)}${publicHash.slice(-40)}`)
}

/**
 * Returns the check sum address of a given public key
 *
 * @param publicKey The two points of an uncompressed key or one point of an compressed key
 * @return Address
 */
export const fromPublic = (publicKey: string, type?: string): string => {
  let buffer = Buffer.from(publicKey.replace('0x', ''), 'hex')

  if (buffer.length !== 64) {
    buffer = Secp256k1.publicKeyConvert(buffer, false).slice(1)
  }

  const publicHash = keccak256(buffer)
  return toChecksum(`0x${getAddressPrefix(type)}${publicHash.slice(-40)}`)
}

/**
 * Returns the public key of a given private key
 *
 * @param privateKey
 * @param compress Return the compressed public key or uncompressed public key, default false
 */
export const privateToPublicKey = (
  privateKey: string,
  compress: boolean = false
): string => {
  const buffer = Buffer.from(privateKey.replace('0x', ''), 'hex')
  return Secp256k1.publicKeyCreate(buffer, compress).toString('hex')
}

/**
 * Transfrom a compressed public key to uncompressed public key
 *
 * @param publicKey Compressed key
 * @return Uncompressed key
 */
export const compressToUncompressPublicKey = (publicKey: string): string => {
  return Secp256k1.publicKeyConvert(
    Buffer.from(publicKey.replace('0x', ''), 'hex'),
    false
  ).toString('hex')
}

/**
 * Encode signature r s v to signature string
 *
 * @param param0
 * @return signature string
 */
export const encodeSignature = ([v, r, s]: string[]): string =>
  Bytes.flatten([r, s, v])

/**
 * Decode signature string to r s v
 *
 * @param param0
 * @return [v, r, s]
 */
export const decodeSignature = (hex: string): string[] => [
  Bytes.slice(64, Bytes.length(hex), hex),
  Bytes.slice(0, 32, hex),
  Bytes.slice(32, 64, hex)
]
// 0x56152e3f9ea2d36392dd3e0fd6a9f0658b8d2647fe6b8aa8a29f2e570a49eede3d2a0ab15e047b53c603e8b3bfc0f9a7abfb77e433deb8bdaf8a260c2f0280f6

/**
 * Make a signer method
 *
 * @param addToV A value add to v
 * @return A signer method
 */
export const makeSigner = (addToV: number) => (
  hash: string,
  privateKey: string
): string => {
  const sigResult = Secp256k1.sign(
    Buffer.from(hash.slice(2), 'hex'),
    Buffer.from(privateKey.slice(2), 'hex')
  )
  return encodeSignature([
    Nat.fromString(Bytes.fromNumber(addToV + sigResult.recovery)),
    Bytes.pad(
      32,
      Bytes.fromNat('0x' + sigResult.signature.slice(0, 32).toString('hex'))
    ),
    Bytes.pad(
      32,
      Bytes.fromNat('0x' + sigResult.signature.slice(32).toString('hex'))
    )
  ])
}

export const sign = makeSigner(0)

/**
 * Recover an address from signature
 *
 * @param hash
 * @param signature
 */
export const recover = (hash: string, signature: string): string => {
  const vals = decodeSignature(signature)
  const vrs = {
    r: vals[1].slice(2),
    s: vals[2].slice(2),
    v: Bytes.toNumber(vals[0])
  }
  const senderPublicKey = Secp256k1.recover(
    Buffer.from(hash.slice(2), 'hex'),
    Buffer.concat([Buffer.from(vrs.r, 'hex'), Buffer.from(vrs.s, 'hex')], 64),
    vrs.v < 2 ? vrs.v : vrs.v % 2
  )
  const publicKey = Secp256k1.publicKeyConvert(senderPublicKey, false).slice(1)
  const address = fromPublic(publicKey.toString('hex'))
  return address
}

export default {
  compressToUncompressPublicKey,
  decodeSignature,
  encodeSignature,
  fromPrivate,
  fromPublic,
  makeSigner,
  privateToPublicKey,
  genContractAddress,
  recover,
  sign,
  toChecksum
}
