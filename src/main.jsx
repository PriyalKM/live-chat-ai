import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import AgentProvider from "./context/AgentContext";
import WebSocketProvider from "./context/WebSocketContext";
import QueryProvider from "./provider/QueryProvider";
import { Toaster } from "sonner";
import SearchProvider from "./context/SearchContext";

createRoot(document.getElementById("root")).render(
  <QueryProvider>
    <SearchProvider>
      <WebSocketProvider>
        <Provider store={store}>
          <AgentProvider>
            <Toaster />
            <App />
          </AgentProvider>
        </Provider>
      </WebSocketProvider>
    </SearchProvider>
  </QueryProvider>
);
