import SVG from "@/components/SVG";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Divider } from "antd";
import { useState } from "react";
import "./index.scss";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("首页");

  const handleSetting = () => {
    navigate("/settings");
  };

  const handleLogo = () => {
    navigate("/");
  };

  const onMouseEnter = () => {
    if (location.pathname !== "/") {
      setTitle("返回");
    }
  };

  const onMouseLeave = () => {
    setTitle("首页");
  };

  return (
    <div className="layout">
      <div className="layout-header">
        <div className="layout-header-left">
          <div
            className="layout-header-left-logo"
            onClick={handleLogo}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {title}
          </div>
        </div>
        <div className="layout-header-right">
          <div className="layout-header-right-setting">
            <SVG name="settings" cursor="pointer" onClick={handleSetting} />
          </div>
        </div>
      </div>
      <Divider className="layout-header-divider" />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
