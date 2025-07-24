import { RouterProvider } from "react-router";
import "./assets/scss/style.css";
import router from "./routes/Router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
