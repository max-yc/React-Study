import { useCallback, useState, useEffect, memo, useRef } from "react";
import { Typography, Divider, Card, Button, Alert, Space, Input } from "antd";

const { Title, Paragraph, Text } = Typography;

const UseCallback = () => {
  console.log("🚀 ~ 主组件渲染");
  // 基础状态
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [number, setNumber] = useState(5);

  // 跟踪子组件渲染次数
  const stableButtonRenderCount = useRef(0);
  const unstableButtonRenderCount = useRef(0);
  const dependentButtonRenderCount = useRef(0);

  // 稳定回调 - 不依赖任何值
  const stableCallback = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  // 不稳定回调 - 不使用useCallback
  const unstableCallback = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // 依赖特定值的回调
  const dependentCallback = useCallback(() => {
    setCount((prevCount) => prevCount + number);
  }, [number]);

  // 处理文本变化
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  return (
    <div className="p-24">
      <Title level={2}>useCallback Hook</Title>
      <Paragraph>
        useCallback 用于缓存函数引用，避免在每次渲染时创建新的函数实例。
        这对于作为props传递给React.memo()组件的回调函数特别有用。
      </Paragraph>

      <Divider orientation="left">基础用法</Divider>
      <Card title="组件渲染与回调函数" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Text>当前计数: {count}</Text>

          <div className="my-12">
            <Input
              value={text}
              onChange={handleTextChange}
              placeholder="输入文本触发渲染"
              className="mb-8"
            />
            <Text type="secondary">当前输入: {text}</Text>
          </div>

          <Alert
            className="mb-12"
            message="组件重新渲染"
            description="每次状态更新都会导致组件重新渲染。尝试在输入框中输入内容，观察组件和子组件的渲染次数。"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">性能优化</Divider>
      <Card title="优化子组件渲染" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            以下两个按钮功能相同，但上面的按钮接收稳定的回调函数（通过useCallback创建），下面的按钮接收每次渲染都会创建的新函数。
            输入文本框中输入内容，观察两个按钮组件的渲染次数差异。
          </Paragraph>

          <MemoizedButton
            onClick={stableCallback}
            text="稳定回调按钮"
            renderCount={stableButtonRenderCount}
          />

          <MemoizedButton
            onClick={unstableCallback}
            text="不稳定回调按钮"
            renderCount={unstableButtonRenderCount}
            color="red"
          />

          <Alert
            message="使用useCallback优化"
            description="稳定回调按钮仅在初次渲染时创建，因此React.memo可以阻止不必要的重新渲染。不稳定回调按钮在每次父组件渲染时都会接收新的函数引用。"
            type="success"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">依赖项</Divider>
      <Card title="带依赖项的回调" className="mb-16">
        <Space direction="vertical" className="w-full">
          <div className="flex-start-center gap-8 mb-8">
            <Text className="mr-8">增量值:</Text>
            <Input
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              style={{ width: 100 }}
            />
          </div>

          <DependentButton
            onClick={dependentCallback}
            number={number}
            renderCount={dependentButtonRenderCount}
          />

          <Alert
            message="依赖项更新"
            description="当依赖项(number)变化时，useCallback会返回新的函数引用，导致使用该回调的组件重新渲染"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">useCallback注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="不要过度使用"
            description="只有当回调函数传递给使用React.memo优化的子组件时，useCallback才有明显的性能好处"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="与函数式更新结合"
            description="使用setCount(prev => prev + 1)而不是setCount(count + 1)可以减少对外部变量的依赖"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="依赖项数组"
            description="确保列出回调函数内使用的所有响应式值(props、state等)作为依赖项"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="与useMemo的区别"
            description="useCallback(fn, deps)等同于useMemo(() => fn, deps)，前者专门用于缓存函数"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

// 子组件使用memo优化，只在props变化时重新渲染
const MemoizedButton = memo(
  ({
    onClick,
    text,
    renderCount,
    color = "blue",
  }: {
    onClick: () => void;
    text: string;
    renderCount: React.MutableRefObject<number>;
    color?: string;
  }) => {
    useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <div className="mb-8">
        <Button
          onClick={onClick}
          type={
            color === "blue"
              ? "primary"
              : color === "red"
              ? "default"
              : "default"
          }
          danger={color === "red"}
        >
          {text}
        </Button>
        <Text className="ml-8">渲染次数: {renderCount.current}</Text>
      </div>
    );
  }
);

// 另一个memo组件用于演示依赖项
const DependentButton = memo(
  ({
    onClick,
    number,
    renderCount,
  }: {
    onClick: () => void;
    number: number;
    renderCount: React.MutableRefObject<number>;
  }) => {
    useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <div className="mb-8">
        <Button onClick={onClick}>依赖于 {number} 的按钮</Button>
        <Text className="ml-8">渲染次数: {renderCount.current}</Text>
      </div>
    );
  }
);

export default UseCallback;
