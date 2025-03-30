import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Divider,
  Alert,
  Space,
  Tabs,
  Switch,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const UseLayoutEffect = () => {
  // 基础比较示例
  const [showEffect, setShowEffect] = useState(false);
  const [showLayoutEffect, setShowLayoutEffect] = useState(false);

  const effectBoxRef = useRef<HTMLDivElement>(null);
  const layoutEffectBoxRef = useRef<HTMLDivElement>(null);

  // 使用 useEffect (异步执行)
  useEffect(() => {
    if (showEffect && effectBoxRef.current) {
      // 使用异步耗时操作
      effectBoxRef.current.style.backgroundColor = "orange"; // 设置中间过渡状态
      effectBoxRef.current.style.left = "0px";

      // 使用setTimeout代替while循环
      setTimeout(() => {
        if (effectBoxRef.current) {
          effectBoxRef.current.style.transition =
            "background-color 1s, left 1s";
          effectBoxRef.current.style.backgroundColor = "green";
          effectBoxRef.current.style.left = "300px";
        }
      }, 100); // 短暂延迟，确保用户能看到中间状态
    } else if (!showEffect && effectBoxRef.current) {
      effectBoxRef.current.style.transition = "none";
      effectBoxRef.current.style.left = "0px";
      effectBoxRef.current.style.backgroundColor = "blue";
    }
  }, [showEffect]);

  // 使用 useLayoutEffect (同步执行)
  useLayoutEffect(() => {
    if (showLayoutEffect && layoutEffectBoxRef.current) {
      // 在浏览器绘制前同步执行
      // 模拟耗时操作
      const start = Date.now();
      while (Date.now() - start < 100) {
        /* 减少阻塞时间 */
      }

      // 设置过渡效果 - 用户永远不会看到中间状态
      layoutEffectBoxRef.current.style.transition =
        "background-color 1s, left 1s";
      layoutEffectBoxRef.current.style.backgroundColor = "green";
      layoutEffectBoxRef.current.style.left = "300px";
    } else if (!showLayoutEffect && layoutEffectBoxRef.current) {
      layoutEffectBoxRef.current.style.transition = "none";
      layoutEffectBoxRef.current.style.left = "0px";
      layoutEffectBoxRef.current.style.backgroundColor = "blue";
    }
  }, [showLayoutEffect]);

  // 窗口大小调整示例
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [useLayoutForResize, setUseLayoutForResize] = useState(false);

  // 使用 useEffect 或 useLayoutEffect 根据用户选择
  useEffect(() => {
    if (!useLayoutForResize) {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [useLayoutForResize]);

  useLayoutEffect(() => {
    if (useLayoutForResize) {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [useLayoutForResize]);

  return (
    <div className="p-24">
      <Title level={2}>useLayoutEffect Hook</Title>
      <Paragraph>
        useLayoutEffect 与 useEffect
        的函数签名完全相同，但它在所有DOM变更之后、浏览器绘制之前同步触发。
        这对于读取DOM布局和同步重新渲染非常有用，可以防止视觉上的闪烁。
      </Paragraph>

      <Divider orientation="left">渲染时机对比</Divider>
      <Card title="useLayoutEffect vs useEffect 渲染比较" className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="可视化比较" key="1">
            <Space direction="vertical" className="w-full">
              <div className="mb-16">
                <Title level={4}>useEffect (异步执行)</Title>
                <Paragraph>
                  useEffect在浏览器绘制之后异步触发。在高负载操作时，你可能会看到中间状态。
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => setShowEffect((prev) => !prev)}
                >
                  {showEffect ? "重置" : "移动方块"}
                </Button>
                <div
                  ref={effectBoxRef}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "blue",
                    position: "relative",
                    left: "0px",
                    transition: "none",
                    marginTop: "16px",
                  }}
                />
                <Text type="warning">
                  你会看到方块先变为橙色（中间状态），然后才变为绿色并移动（先渲染，后执行效果）
                </Text>
              </div>

              <div>
                <Title level={4}>useLayoutEffect (同步执行)</Title>
                <Paragraph>
                  useLayoutEffect在浏览器绘制之前同步触发。用户不会看到中间状态。
                </Paragraph>
                <Button
                  type="primary"
                  onClick={() => setShowLayoutEffect((prev) => !prev)}
                >
                  {showLayoutEffect ? "重置" : "移动方块"}
                </Button>
                <div
                  ref={layoutEffectBoxRef}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "blue",
                    position: "relative",
                    left: "0px",
                    transition: "none",
                    marginTop: "16px",
                  }}
                />
                <Text type="success">
                  方块会直接变为绿色并移动到最终位置，不会显示任何中间状态（在用户看到界面前就完成了所有更新）
                </Text>
              </div>
            </Space>
          </TabPane>
          <TabPane tab="执行流程" key="2">
            <Card className="mb-16">
              <Title level={4}>useEffect 执行流程</Title>
              <ol>
                <li>组件函数执行，创建虚拟DOM</li>
                <li>React 更新实际DOM</li>
                <li>浏览器完成绘制（用户看到UI）</li>
                <li>React 异步执行 useEffect 中的回调函数</li>
                <li>如果依赖项变化，下次渲染前先执行清理函数</li>
                <li>状态更新会触发组件重新渲染</li>
              </ol>
              <Paragraph type="secondary" className="mt-4">
                适用场景：数据获取、订阅、定时器、日志记录等不阻塞UI渲染的操作
              </Paragraph>
            </Card>
            <Card>
              <Title level={4}>useLayoutEffect 执行流程</Title>
              <ol>
                <li>组件函数执行，创建虚拟DOM</li>
                <li>React 更新实际DOM</li>
                <li>
                  React <Text strong>同步</Text>执行 useLayoutEffect
                  中的回调函数
                </li>
                <li>如果依赖项变化，先执行上一次的清理函数</li>
                <li>浏览器绘制（用户看到UI）</li>
                <li>状态更新会触发组件重新渲染</li>
              </ol>
              <Paragraph type="secondary" className="mt-4">
                适用场景：需要DOM测量、防止闪烁、在用户看到UI前调整布局等操作
              </Paragraph>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <Divider orientation="left">实际应用场景</Divider>

      <Card title="精确 DOM 测量" className="mb-16">
        <Alert
          message="演示"
          description={
            <>
              <Button
                type="link"
                href="https://zh-hans.react.dev/reference/react/useLayoutEffect"
              >
                useLayoutEffect的演示
              </Button>
              <div>
                useEffect在浏览器绘制后执行，可能会导致页面闪烁（先渲染，后调整）。
              </div>
              <div>
                useLayoutEffect在浏览器绘制前执行，可以避免页面闪烁，让测量和调整在同一次渲染中完成
              </div>
            </>
          }
          type="success"
          showIcon
        />
      </Card>

      <Card title="窗口调整响应" className="mb-16">
        <Space direction="vertical" className="w-full">
          <div className="flex items-center gap-8 mb-8">
            <Text className="mr-14">使用:</Text>
            <Switch
              checked={useLayoutForResize}
              onChange={setUseLayoutForResize}
              checkedChildren="useLayoutEffect"
              unCheckedChildren="useEffect"
            />
          </div>

          <Card size="small">
            <Paragraph>当前窗口尺寸:</Paragraph>
            <Text>宽度: {windowSize.width}px</Text>
            <br />
            <Text>高度: {windowSize.height}px</Text>
          </Card>

          <Alert
            message={
              useLayoutForResize ? "使用 useLayoutEffect" : "使用 useEffect"
            }
            description={
              useLayoutForResize
                ? "窗口调整时，尺寸更新会在绘制前同步进行，可能在频繁调整时影响性能"
                : "窗口调整时，尺寸更新会在绘制后异步进行，对性能影响较小，但可能导致短暂的布局不匹配"
            }
            type={useLayoutForResize ? "warning" : "info"}
            showIcon
            className="mt-8"
          />
        </Space>
      </Card>

      <Divider orientation="left">注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="性能影响"
            description="useLayoutEffect 会阻塞浏览器绘制，过度使用会影响性能，特别是在进行复杂计算时"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="服务器端渲染兼容性"
            description="在SSR环境中，useLayoutEffect会产生警告，因为它在服务器上没有等效项。对于SSR应用，考虑使用useEffect或条件性使用useLayoutEffect"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="适用场景"
            description="仅在需要在DOM渲染前同步获取布局信息或进行视觉调整时使用useLayoutEffect，大多数情况下useEffect更合适"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="执行时机保证"
            description="useLayoutEffect保证在DOM更新后、浏览器绘制前同步执行，这对于测量DOM元素和避免闪烁很有用"
            type="success"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseLayoutEffect;
