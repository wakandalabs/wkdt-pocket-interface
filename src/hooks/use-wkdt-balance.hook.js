import {atomFamily, selectorFamily, useRecoilState} from "recoil";
import {fetchWkdtBalance} from "../flow/script.fetch-wkdt-balance";
import {ERROR, IDLE, IDLE_DELAY, PROCESSING, SUCCESS} from "../global/constants";
import {txTransferWkdt} from "../flow/tx.transfer-wkdt";
import {sleep} from "../util/sleep";

export const valueAtom = atomFamily({
  key: "wkdt-balance::state",
  default: selectorFamily({
    key: "wkdt-balance::default",
    get: address => async () => fetchWkdtBalance(address),
  }),
})

export const statusAtom = atomFamily({
  key: "wkdt-balance::status",
  default: IDLE,
})

export const txAtom = atomFamily({
  key: "wkdt-balance::tx",
  default: null,
})

export function useWkdtBalanceHook(address) {
  const [balance, setBalance] = useRecoilState(valueAtom(address))
  const [status, setStatus] = useRecoilState(statusAtom(address))
  const [tx, setTx] = useRecoilState(txAtom(address))

  async function refresh() {
    setStatus(PROCESSING)
    await fetchWkdtBalance(address).then(setBalance)
    setStatus(IDLE)
  }

  return {
    balance,
    status,
    tx,
    refresh,
    async transfer(amount, to) {
      const tx = await txTransferWkdt(
        {amount: amount, to: to},
        {
          onStart() {
            setStatus(PROCESSING)
          },
          async onSuccess() {
            await refresh()
            setStatus(SUCCESS)
          },
          async onComplete() {
            await sleep(IDLE_DELAY)
            setStatus(IDLE)
          },
          async onError() {
            setStatus(ERROR)
          },
        }
      )
      setTx(tx)
    },
    resetTx(){
      setTx(null)
    }
  }
}
