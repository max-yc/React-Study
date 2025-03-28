import { motion } from "framer-motion";
import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.scss";

const List = [
  {
    title: "useState",
    path: "/api/useState",
  },
  {
    title: "useReducer",
    path: "/api/useReducer",
  },
  {
    title: "useRef",
    path: "/api/useRef",
  },
  {
    title: "useEffect",
    path: "/api/useEffect",
  },
  {
    title: "useLayoutEffect",
    path: "/api/useLayoutEffect",
  },
  {
    title: "useCallback",
    path: "/api/useCallback",
  },
  {
    title: "useMemo",
    path: "/api/useMemo",
  },
  {
    title: "useContext",
    path: "/api/useContext",
  },
  {
    title: "useImperativeHandle",
    path: "/api/useImperativeHandle",
  },
  {
    title: "useDebugValue",
    path: "/api/useDebugValue",
  },
  {
    title: "useDeferredValue",
    path: "/api/useDeferredValue",
  },
  {
    title: "useInsertionEffect",
    path: "/api/useInsertionEffect",
  },
  {
    title: "useOptimistic",
    path: "/api/useOptimistic",
  },
  {
    title: "useOptimized",
    path: "/api/useOptimized",
  },
  {
    title: "useSyncExternalStore",
    path: "/api/useSyncExternalStore",
  },
  {
    title: "useId",
    path: "/api/useId",
  },
];
const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home">
      <Flex vertical align="center" gap="large">
        {List.map((item, index) => (
          <motion.div
            key={index}
            className="feature-container"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <Button
              className="feature"
              type="primary"
              onClick={() => handleClick(item.path)}
            >
              {item.title}
            </Button>
          </motion.div>
        ))}
      </Flex>
    </div>
  );
};

export default Home;
