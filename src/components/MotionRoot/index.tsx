import "./index.scss";
import App from "@/App.tsx";
import * as motion from "motion/react-client";

const MotionRoot: React.FC = () => {
  return (
    <motion.div
      className="motion-root"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <App />
    </motion.div>
  );
};

export default MotionRoot;
