import { createPersistedState } from "pinia-plugin-persistedstate"
import { crypt } from "@/utils/crypto-sha256"
// 把数据进行加密与解密
import { aes_encrypt, aes_decrypt } from "@/utils/crypto-aes"
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
