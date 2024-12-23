import { createPersistedState } from "pinia-plugin-persistedstate"
import { crypt } from "@/utils/crypto-sha256"
const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: crypt,
  })
)
export default pinia
