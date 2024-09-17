const CRYPTO_KEY =
  '60c07bfddbf5f82a4d41caff7927f8a403fb7802ec9a9f5f8b2f1a6f6bcaad70' //TODO: tranformar em constante

const hexToUint8Array = (secret: string): Uint8Array => {
  if (secret.length % 2 !== 0) {
    throw new Error('String hexadecimal inválida')
  }

  const byteArray = new Uint8Array(secret.length / 2)
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(secret.substr(i * 2, 2), 16)
  }

  return byteArray
}

// Importa a chave no formato esperado pelo navegador
const importKey = async (): Promise<CryptoKey> => {
  const keyBytes = hexToUint8Array(CRYPTO_KEY)

  return await crypto?.subtle?.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

export const encrypt = async (data: string): Promise<string> => {
  const key = await importKey() // Importa a chave
  const encoder = new TextEncoder()
  const encodedText = encoder.encode(data)

  const iv = crypto?.getRandomValues(new Uint8Array(12))

  const encryptedData = await crypto?.subtle?.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encodedText
  )

  const combinedBuffer = new Uint8Array(iv.length + encryptedData.byteLength)
  combinedBuffer.set(iv)
  combinedBuffer.set(new Uint8Array(encryptedData), iv.length)

  return encodeBase64UrlSafe(String.fromCharCode(...combinedBuffer))
}

export const decrypt = async (encryptedData: string): Promise<string> => {
  const key = await importKey()
  const binaryString = decodeBase64UrlSafe(encryptedData)

  const combinedBuffer = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    combinedBuffer[i] = binaryString.charCodeAt(i)
  }

  const iv = combinedBuffer.slice(0, 12)
  const encryptedContent = combinedBuffer.slice(12)

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encryptedContent
  )

  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}

const decodeBase64UrlSafe = (encodedData: string): string => {
  let base64String = encodedData.replace(/-/g, '+').replace(/_/g, '/')

  const padLength = base64String.length % 4
  if (padLength > 0) {
    base64String += '='.repeat(4 - padLength)
  }

  return atob(base64String)
}

const encodeBase64UrlSafe = (data: string): string => {
  let base64String = btoa(data)

  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
