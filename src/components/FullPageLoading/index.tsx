import { Spin } from "antd";
import "./index.scss";

const FullPageLoading = () => (
  <div className="full-page-loading">
    <Spin size={"large"} />
  </div>
);

export default FullPageLoading;
