import {withPrefix} from "@onflow/fcl"
import {useParams} from "react-router-dom"

export function useAddress() {
  const {address} = useParams()
  console.log(address)
  return withPrefix(address)
}
