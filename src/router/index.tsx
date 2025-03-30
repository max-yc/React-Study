// 导入创建路由的函数
import { lazy } from "react";
import { createHashRouter } from "react-router-dom";

const Layout = lazy(() => import("@/page/Layout"));
const Home = lazy(() => import("@/page/Home"));
const NotFound = lazy(() => import("@/components/NotFound"));

// API组件
const Demo = lazy(() => import("@/page/API/demo"));
const UseState = lazy(() => import("@/page/API/useState"));
const UseEffect = lazy(() => import("@/page/API/useEffect"));
const UseCallback = lazy(() => import("@/page/API/useCallback"));
const UseMemo = lazy(() => import("@/page/API/useMemo"));
const UseRef = lazy(() => import("@/page/API/useRef"));
const UseReducer = lazy(() => import("@/page/API/useReducer"));
const UseContext = lazy(() => import("@/page/API/useContext"));
const UseImperativeHandle = lazy(() => import("@/page/API/useImperativeHandle"));
const UseLayoutEffect = lazy(() => import("@/page/API/useLayoutEffect"));
const UseDeferredValue = lazy(() => import("@/page/API/useDeferredValue"));
const UseOptimistic = lazy(() => import("@/page/API/useOptimistic"));
const UseSyncExternalStore = lazy(() => import("@/page/API/useSyncExternalStore"));

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "api",
        children: [
          {
            path: "demo",
            element: <Demo />,
          },
          {
            path: "useState",
            element: <UseState />,
          },
          {
            path: "useEffect",
            element: <UseEffect />,
          },
          {
            path: "useCallback",
            element: <UseCallback />,
          },
          {
            path: "useMemo",
            element: <UseMemo />,
          },
          {
            path: "useRef",
            element: <UseRef />,
          },
          {
            path: "useReducer",
            element: <UseReducer />,
          },
          {
            path: "useContext",
            element: <UseContext />,
          },
          {
            path: "useImperativeHandle",
            element: <UseImperativeHandle />,
          },
          {
            path: "useLayoutEffect",
            element: <UseLayoutEffect />,
          },
          {
            path: "useDeferredValue",
            element: <UseDeferredValue />,
          },
          {
            path: "useOptimistic",
            element: <UseOptimistic />,
          },
          {
            path: "useSyncExternalStore",
            element: <UseSyncExternalStore />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
