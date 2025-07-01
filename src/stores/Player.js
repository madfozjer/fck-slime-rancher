import { defineStore } from 'pinia'
import CryptoJS from 'crypto-js'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    coins: 0,
    bits: 0,
  }),
  actions: {
    init() {
      if (localStorage.getItem('coins')) this.coins = parseInt(localStorage.getItem('coins'))
      if (localStorage.getItem('bits')) this.bits = parseInt(localStorage.getItem('bits'))
    },
    decrementCoins(price) {
      if (this.coins > 0) {
        this.coins -= price
        localStorage.setItem('coins', this.coins)
        return true
      }
      console.warn('Not enough coins to decrement.')
      return false
    },
    decrementBits(price) {
      if (this.bits > 0) {
        this.bits -= parseInt(price)
        localStorage.setItem('bits', this.bits)
        return true
      }
      console.warn('Not enough bits to decrement.')
      return false
    },
    getCoins() {
      return this.coins
    },
    getBits() {
      return this.bits
    },
    addCoins(amount) {
      this.coins += amount
      localStorage.setItem('coins', this.coins)
    },
    addBits(amount) {
      this.bits += amount
      localStorage.setItem('bits', this.bits)
    },
    setActiveHunters(array) {
      console.log(array)
      localStorage.setItem('activeHunters', JSON.stringify(array))
    },
    resetSave() {
      localStorage.setItem('coins', 0)
      localStorage.setItem('bits', 0)
      localStorage.setItem('hunters', JSON.stringify([]))
      localStorage.setItem('weapons', JSON.stringify([]))
      localStorage.setItem('currentHunterID', null)
      localStorage.setItem('currentWeaponID', null)
      localStorage.setItem('activeHunters', JSON.stringify([]))
      alert('Data was reset!')
    },
    _encryptData(plaintext, secretKeyHex) {
      try {
        const stringifiedPlaintext = JSON.stringify(plaintext)
        const secretKeyWordArray = CryptoJS.enc.Hex.parse(secretKeyHex)

        if (
          !secretKeyWordArray ||
          secretKeyWordArray.words.length === 0 ||
          secretKeyWordArray.sigBytes !== 32
        ) {
          console.error(
            'Encryption failed: Invalid, empty, or incorrect size (not 32 bytes) for secret key.',
          )
          return null
        }

        const plaintextWordArray = CryptoJS.enc.Utf8.parse(stringifiedPlaintext)
        const iv = CryptoJS.lib.WordArray.random(16)

        const encrypted = CryptoJS.AES.encrypt(plaintextWordArray, secretKeyWordArray, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        })

        if (!encrypted || !encrypted.ciphertext || encrypted.ciphertext.sigBytes === 0) {
          console.error('Encryption resulted in empty or invalid ciphertext.')
          return null
        }

        const result = {
          iv: encrypted.iv.toString(CryptoJS.enc.Hex),
          ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
        }
        return result
      } catch (error) {
        console.error('Encryption failed:', error)
        return null
      }
    },

    _decryptData(encryptedObject, secretKeyHex) {
      try {
        if (
          !encryptedObject ||
          typeof encryptedObject.ciphertext !== 'string' ||
          typeof encryptedObject.iv !== 'string'
        ) {
          console.error('Decryption failed: Encrypted object is invalid or missing ciphertext/IV.')
          return null
        }

        const ciphertext = encryptedObject.ciphertext
        const ivHex = encryptedObject.iv

        const secretKeyWordArray = CryptoJS.enc.Hex.parse(secretKeyHex)

        if (
          !secretKeyWordArray ||
          secretKeyWordArray.words.length === 0 ||
          secretKeyWordArray.sigBytes !== 32
        ) {
          console.error(
            'Decryption failed: Invalid, empty, or incorrect size (not 32 bytes) for secret key.',
          )
          return null
        }

        const ivWordArray = CryptoJS.enc.Hex.parse(ivHex)

        if (!ivWordArray || ivWordArray.words.length === 0 || ivWordArray.sigBytes !== 16) {
          console.error('Decryption failed: IV WordArray is invalid, empty, or not 16 bytes.')
          return null
        }

        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKeyWordArray, {
          iv: ivWordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        })

        if (!bytes || !bytes.words || bytes.sigBytes === 0) {
          console.error(
            'Decryption produced no valid bytes. This often indicates an incorrect key or corrupted ciphertext.',
          )
          return null
        }

        const plaintext = bytes.toString(CryptoJS.enc.Utf8)
        try {
          return JSON.parse(plaintext)
        } catch (e) {
          console.warn('Decrypted data is not valid JSON, returning as plain string.')
          return plaintext
        }
      } catch (error) {
        console.error('Decryption failed:', error)
        return null
      }
    },

    _downloadTextFile(filename, text) {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },

    generateSecretKey() {
      return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex)
    },

    downloadSave(filenamePrefix = 'save') {
      const secretKey = this.generateSecretKey()
      if (!secretKey) {
        console.error('Export failed: A secret key could not be generated.')
        return false
      }

      const localStorageData = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        localStorageData[key] = localStorage.getItem(key)
      }

      let encryptedResult = null
      try {
        encryptedResult = this._encryptData(localStorageData, secretKey)
      } catch (e) {
        console.error('Encryption of localStorage data failed:', e)
      }

      if (!encryptedResult || !encryptedResult.ciphertext || !encryptedResult.iv) {
        console.error('Encryption failed, cannot download save file.')
        return false
      }

      const dataToDownload = `${secretKey}::${encryptedResult.iv}::${encryptedResult.ciphertext}`
      const dateStamp = new Date().toISOString().slice(0, 10)
      const filename = `${filenamePrefix}_${dateStamp}.fck`

      this._downloadTextFile(filename, dataToDownload)
      return true
    },

    async importSave(file) {
      if (!file) {
        console.error('Import failed: No file provided.')
        return false
      }

      try {
        const fileContent = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = (e) => reject(e)
          reader.readAsText(file)
        })

        const parts = fileContent.split('::')

        if (parts.length !== 3) {
          console.error('Invalid save file format. Expected "KEY::IV::DATA" structure.')
          return false
        }

        const secretKey = parts[0]
        const ivFromSave = parts[1]
        const encryptedContent = parts[2]

        const decryptedData = this._decryptData(
          { iv: ivFromSave, ciphertext: encryptedContent },
          secretKey,
        )

        if (!decryptedData) {
          console.error(
            'Decryption failed. The file might be corrupted or the key/IV is incorrect.',
          )
          return false
        }

        localStorage.clear()

        for (const key in decryptedData) {
          if (Object.prototype.hasOwnProperty.call(decryptedData, key)) {
            localStorage.setItem(key, decryptedData[key])
          }
        }
        return true
      } catch (error) {
        console.error('Error during import process:', error)
        return false
      }
    },
  },
})
