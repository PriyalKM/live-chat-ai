import { createSlice } from "@reduxjs/toolkit";

const agentSlice = createSlice({
    name: "agent",
    initialState: {
        active: false
    },
    reducers: {
        startCall: (state, action) => {
            const { toggle } = action.payload;
            toggle();
            //state.active = true;
        },
        endCall: (state, action) => {
            const { toggle } = action.payload;
            toggle();
            //state.active = false;
        },
    },
});

export const { startCall, endCall } = agentSlice.actions;

export default agentSlice.reducer;