import { Suspense, useEffect, useState } from "react";
import "./App.scss";
import { ConfigProvider } from "antd";
import type { ThemeConfig } from "antd/es/config-provider/context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FullPageErrorFallback from "@/components/FullPageErrorFallback";
import FullPageLoading from "@/components/FullPageLoading";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { useAppSelector } from "@/hooks/redux";
import { selectColor } from "@/store/reducers/color";

interface ColorItem {
  value: string;
  color: string;
  label: string;
}

/**
 * 应用根组件
 * @returns React组件
 */
const App: React.FC = () => {
  // 从Redux获取颜色配置
  const color = useAppSelector(selectColor);
  // 存储处理后的颜色集合
  const [colorCollection, setColorCollection] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    // 将颜色数组转换为对象格式
    setColorCollection(
      color.reduce((acc: Record<string, string>, item: ColorItem) => {
        acc[item.value] = item.color;
        return acc;
      }, {})
    );
  }, [color]);

  // 主题配置
  const themeConfig: ThemeConfig = {
    token: {
      colorPrimary: colorCollection.colorPrimary,
      borderRadius: 10,
      colorBgContainer: colorCollection.colorBgContainer,
      colorText: colorCollection.colorText,
      colorTextLightSolid: colorCollection.colorTextLightSolid,
      colorTextBase: colorCollection.colorTextBase,
    },
  };

  return (
    // 错误边界
    <ErrorBoundary fallbackRender={FullPageErrorFallback}>
      {/* 配置主题 */}
      <ConfigProvider locale={zhCN} theme={themeConfig}>
        {/* 懒加载 */}
        <Suspense fallback={<FullPageLoading />}>
          {/* 路由 */}
          <RouterProvider router={router} />
        </Suspense>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
