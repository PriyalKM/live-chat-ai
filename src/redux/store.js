import { configureStore } from "@reduxjs/toolkit";
import agentReducer from "./slice/agent.slice";

const store = configureStore({
    reducer: {
        agent: agentReducer,
    },
});

export default store;