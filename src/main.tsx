import { createRoot } from "react-dom/client";
import "./index.scss";
import "./styles/global.scss";
import MotionRoot from "./components/MotionRoot/index.tsx";
import { ROOT_ELEMENT_ID } from "../constants.ts";
import "virtual:svg-icons-register";
import { Provider } from "react-redux";
import store from "./store/index.ts";

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  throw new Error(`找不到id为 ${ROOT_ELEMENT_ID} 的元素`);
}

createRoot(rootElement).render(
  <Provider store={store}>
    <MotionRoot />
  </Provider>
);
