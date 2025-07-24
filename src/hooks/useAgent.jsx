import { useContext } from "react"
import { AgentContext } from "@/context/AgentContext"

const useAgent = () => {
    return useContext(AgentContext)
}

export default useAgent