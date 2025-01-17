import { createPersistedState } from "pinia-plugin-persistedstate"
// 加密key
import { crypt } from "@/utils/crypto/crypto-sha256"
// 把数据进行加密与解密
import { aes_encrypt, aes_decrypt } from "@/utils/crypto/crypto-aes"
const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: crypt,
    serializer: {
      deserialize: aes_decrypt,
      serialize: aes_encrypt,
    },
  })
)
export default pinia
