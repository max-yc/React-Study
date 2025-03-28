import { useEffect, useRef, useState } from "react";
import {
  Typography,
  Divider,
  Card,
  Button,
  Alert,
  Space,
  Input,
  Spin,
  Switch,
  Affix,
} from "antd";

const { Title, Paragraph, Text } = Typography;

const UseEffect = () => {
  // 引用layout-content容器
  const layoutContentRef = useRef<HTMLElement | null>(null);

  // 在组件挂载后获取layout-content容器
  useEffect(() => {
    layoutContentRef.current = document.querySelector(".layout-content");
  }, []);

  // 示例1: 基础用法 - 更新文档标题
  const [count, setCount] = useState(0);

  // 示例2: 依赖项为空数组 - 仅在组件挂载时执行一次
  const [mountTime, setMountTime] = useState<string>("");

  // 示例3: 没有依赖项 - 每次渲染都执行
  const [renderCount, setRenderCount] = useState(0);

  // 示例4: 数据获取
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // 示例5: DOM操作
  const [inputValue, setInputValue] = useState("");
  const [autoFocus, setAutoFocus] = useState(false);

  // 示例6: 清除副作用
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // 示例1: 依赖项为 [count] - 当count变化时执行
  useEffect(() => {
    // 当count改变时，更新文档标题
    document.title = `点击了 ${count} 次`;
    console.log("文档标题已更新");
    return () => {
      console.log("🚀 ~ count:", count);
    };
  }, [count]);

  // 示例2: 依赖项为空数组 - 仅在组件挂载时执行一次
  useEffect(() => {
    console.log("组件已挂载 - 这个效果只会运行一次");
    const now = new Date().toLocaleTimeString();
    setMountTime(now);

    // 返回清除函数，这将在组件卸载时执行
    return () => {
      console.log("组件将卸载 - 清理操作");
    };
  }, []);

  // 示例3: 没有依赖项 - 每次渲染都执行
  useEffect(() => {
    console.log("组件已重新渲染");
    // setRenderCount(prev => prev + 1);
    // 注意：这会导致无限循环，因为我们在每次渲染后修改了状态，触发了新的渲染
    // 在实际应用中应避免这种模式
  });

  // 示例4: 数据获取
  useEffect(() => {
    if (fetchTrigger === 0) return; // 跳过初始渲染

    const fetchData = async () => {
      setLoading(true);
      try {
        // 模拟API请求
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData([
          "模拟数据1",
          "模拟数据2",
          "模拟数据3",
          `请求次数: ${fetchTrigger}`,
        ]);
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 清除函数 - 处理竞态条件
    return () => {
      console.log("数据获取已取消");
      // 在实际应用中，这里可能需要取消请求
    };
  }, [fetchTrigger]);

  // 示例5: DOM操作
  useEffect(() => {
    if (autoFocus) {
      // 查找输入框并聚焦
      const input = document.getElementById("effectInput");
      if (input) {
        (input as HTMLInputElement).focus();
      }
    }
  }, [autoFocus]);

  // 示例6: 清除副作用 (设置和清除定时器)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (timerActive) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    // 清除函数 - 在下一次effect运行之前或组件卸载时执行
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        console.log("定时器已清除");
      }
    };
  }, [timerActive]);

  // 处理器函数
  const incrementCount = () => setCount(count + 1);
  const triggerFetch = () => setFetchTrigger((prev) => prev + 1);
  const toggleAutoFocus = () => setAutoFocus((prev) => !prev);
  const toggleTimer = () => setTimerActive((prev) => !prev);
  const resetTimer = () => setTimer(0);

  return (
    <>
      {" "}
      <Affix offsetTop={250} target={() => layoutContentRef.current}>
        <div style={{ position: "fixed", left: "80px" }}>
          <Title level={2}>当前计数: {count}</Title>
          <Button onClick={() => setCount(0)}>重置</Button>
        </div>
      </Affix>
      <div className="p-24">
        <Title level={2}>useEffect Hook</Title>
        <Paragraph>
          useEffect
          用于执行副作用操作，如数据获取、订阅、手动操作DOM等。它在每次渲染后执行。
        </Paragraph>

        <Divider orientation="left">基础用法</Divider>
        <Card title="更新文档标题" className="mb-16">
          <Paragraph>
            当计数器值变化时，使用useEffect更新浏览器标签的标题。
          </Paragraph>
          <Button onClick={incrementCount} type="primary">
            增加计数
          </Button>
          <Alert
            className="mt-12"
            message="依赖项数组"
            description="提供 [count] 作为依赖项数组，确保effect只在count变化时运行"
            type="info"
            showIcon
          />
        </Card>

        <Divider orientation="left">执行时机</Divider>
        <Card title="组件挂载时执行一次" className="mb-16">
          <Paragraph>
            使用空依赖数组 [] 让effect只在组件挂载时执行一次。
          </Paragraph>
          <Text>组件挂载时间: {mountTime}</Text>
          <Alert
            className="mt-12"
            message="空依赖数组"
            description="提供空数组 [] 作为依赖项，使effect只在组件挂载时执行一次，并在卸载时清理"
            type="info"
            showIcon
          />
        </Card>

        <Card title="每次渲染后执行" className="mb-16">
          <Paragraph>不提供依赖数组会让effect在每次渲染后执行。</Paragraph>
          <Text>渲染次数: {renderCount}</Text>
          <Alert
            className="mt-12"
            message="谨慎使用"
            description="不提供依赖数组会在每次渲染后执行effect。要小心避免在这样的effect中更新状态，可能导致无限循环。"
            type="warning"
            showIcon
          />
        </Card>

        <Divider orientation="left">常见用例</Divider>
        <Card title="数据获取" className="mb-16">
          <Space direction="vertical" className="w-full">
            <Button onClick={triggerFetch} type="primary" loading={loading}>
              {loading ? "获取中..." : "获取数据"}
            </Button>

            <div className="mt-12">
              {loading ? (
                <Spin tip="加载中..." />
              ) : (
                data.length > 0 && (
                  <ul className="pl-24">
                    {data.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )
              )}
            </div>

            <Alert
              className="mt-12"
              message="数据获取模式"
              description="通过依赖项控制何时触发数据获取，并使用清除函数处理竞态条件"
              type="info"
              showIcon
            />
          </Space>
        </Card>

        <Card title="DOM操作" className="mb-16">
          <Space direction="vertical" className="w-full">
            <Input
              id="effectInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入框"
            />

            <div className="flex items-center gap-8 mt-8">
              <Text className="mr-16">自动聚焦:</Text>
              <Switch checked={autoFocus} onChange={toggleAutoFocus} />
            </div>

            <Alert
              className="mt-12"
              message="DOM操作"
              description="useEffect可以在渲染后操作DOM元素，如聚焦、滚动位置等"
              type="info"
              showIcon
            />
          </Space>
        </Card>

        <Card title="清除副作用" className="mb-16">
          <Space direction="vertical" className="w-full">
            <div className="flex items-center gap-8 mb-8">
              <Text className="text-xl">{timer} 秒</Text>
            </div>

            <Space>
              <Button
                type={timerActive ? "default" : "primary"}
                onClick={toggleTimer}
              >
                {timerActive ? "暂停计时器" : "启动计时器"}
              </Button>
              <Button danger onClick={resetTimer}>
                重置计时器
              </Button>
            </Space>

            <Alert
              className="mt-12"
              message="清除函数"
              description="通过从useEffect返回一个函数，可以在effect下次执行前或组件卸载时清理副作用（如定时器、订阅等）"
              type="warning"
              showIcon
            />
          </Space>
        </Card>

        <Divider orientation="left">useEffect注意事项</Divider>
        <Card className="mb-16">
          <Space direction="vertical" className="w-full">
            <Alert
              message="正确指定依赖项"
              description="依赖项数组应包含effect中使用的所有响应式值（props、state等）"
              type="info"
              showIcon
            />
            <Alert
              message="避免依赖项膨胀"
              description="当依赖项过多时，考虑将effect拆分或使用useReducer/useCallback/useMemo减少依赖"
              type="info"
              showIcon
            />
            <Alert
              message="避免在没有清除函数的useEffect中设置状态"
              description="在没有依赖项的useEffect中更新状态可能导致无限渲染循环"
              type="error"
              showIcon
            />
            <Alert
              message="清理重要资源"
              description="始终清理订阅、定时器、事件监听器等资源，避免内存泄漏"
              type="warning"
              showIcon
            />
          </Space>
        </Card>
      </div>
    </>
  );
};

export default UseEffect;
