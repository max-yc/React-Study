import { useRef, useState, useEffect } from "react";
import {
  Typography,
  Divider,
  Card,
  Button,
  Alert,
  Space,
  Input,
  Tabs,
  InputRef,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const UseRef = () => {
  // 示例1: 引用DOM元素
  const inputRef = useRef<InputRef>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 示例2: 保存可变值（不会触发重新渲染）
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const renderCountRef = useRef(0);

  // 示例3: 保存上一个状态
  const [text, setText] = useState("");
  const prevTextRef = useRef("");

  // 示例4: 缓存计算结果
  const [items, setItems] = useState<number[]>([]);
  const sumRef = useRef(0);

  // 示例5: 处理定时器/动画帧ID
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // 示例6: 避免创建多余的回调函数
  const stableCallback = useRef(() => {
    console.log("这个函数引用在重新渲染之间保持稳定");
  }).current;

  // 计算渲染次数
  useEffect(() => {
    renderCountRef.current += 1;
  });

  // 保存上一个text值
  useEffect(() => {
    prevTextRef.current = text;
  }, [text]);

  // 累加items数组的值
  useEffect(() => {
    sumRef.current = items.reduce((sum, item) => sum + item, 0);
  }, [items]);

  // 处理定时器
  useEffect(() => {
    if (timerActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive]);

  // 处理函数
  const incrementCount = () => {
    setCount(count + 1);
    countRef.current += 1;
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const addRandomItem = () => {
    const newItem = Math.floor(Math.random() * 100);
    setItems([...items, newItem]);
  };

  const toggleTimer = () => {
    setTimerActive((active) => !active);
  };

  const resetTimer = () => {
    setSeconds(0);
  };

  return (
    <div className="p-24">
      <Title level={2}>useRef Hook</Title>
      <Paragraph>
        useRef 是一个用于创建可变引用的Hook，它的值在组件重新渲染之间保持不变。
        主要有两种用法：引用DOM元素和保存任意可变值。
      </Paragraph>

      <Divider orientation="left">引用DOM元素</Divider>
      <Card title="访问和操作DOM" className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="文本输入" key="1">
            <Space direction="vertical" className="w-full">
              <Input ref={inputRef} placeholder="这个输入框可以被引用访问" />
              <Button onClick={focusInput} type="primary">
                聚焦输入框
              </Button>
              <Alert
                className="mt-12"
                message="DOM引用"
                description="使用ref属性将元素与useRef创建的引用连接"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          <TabPane tab="视频控制" key="2">
            <Space direction="vertical" className="w-full">
              <video
                ref={videoRef}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                width="300"
                controls
              />
              <Space>
                <Button onClick={playVideo} type="primary">
                  播放
                </Button>
                <Button onClick={pauseVideo}>暂停</Button>
              </Space>
              <Alert
                className="mt-12"
                message="多媒体引用"
                description="useRef可用于控制视频、音频等媒体元素"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      <Divider orientation="left">保存可变值</Divider>
      <Card title="不触发重新渲染的更新" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            useState和useRef的主要区别是：修改ref的.current属性不会触发组件重新渲染。
          </Paragraph>
          <div className="mb-12">
            <Text className="mr-16">useState计数: {count}</Text>
            <Text>useRef计数: {countRef.current}</Text>
          </div>
          <div className="mb-12">
            <Text>组件渲染次数: {renderCountRef.current}</Text>
          </div>
          <Button onClick={incrementCount} type="primary">
            同时增加两个计数
          </Button>
          <Alert
            className="mt-12"
            message="可变引用"
            description="useRef创建的对象在组件的整个生命周期内保持相同的引用，修改.current不会导致重新渲染"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Card title="保存上一个状态值" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入一些文字"
          />
          <div className="mt-8">
            <Text>当前值: {text || "<空>"}</Text>
            <br />
            <Text>上一个值: {prevTextRef.current || "<空>"}</Text>
          </div>
          <Alert
            className="mt-12"
            message="保存前值"
            description="useRef可以用来记住组件重新渲染之间的值，比如前一个状态"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Card title="缓存计算结果" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Button onClick={addRandomItem} type="primary">
            添加随机数字
          </Button>
          <div className="mt-8">
            <Text>项目: {items.join(", ")}</Text>
            <br />
            <Text>总和: {sumRef.current}</Text>
          </div>
          <Alert
            className="mt-12"
            message="缓存计算"
            description="useRef可以用来存储计算结果或派生数据"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Card title="管理定时器ID" className="mb-16">
        <Space direction="vertical" className="w-full">
          <div className="mb-8">
            <Text className="text-xl">{seconds} 秒</Text>
          </div>
          <Space>
            <Button
              type={timerActive ? "default" : "primary"}
              onClick={toggleTimer}
            >
              {timerActive ? "停止计时器" : "启动计时器"}
            </Button>
            <Button onClick={resetTimer} danger>
              重置
            </Button>
          </Space>
          <Alert
            className="mt-12"
            message="资源管理"
            description="useRef适合存储定时器ID、动画帧ID等需要在清理时访问的资源标识符"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">useRef注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="修改.current不会触发重新渲染"
            description="如果需要响应式更新UI，应该使用useState"
            type="warning"
            showIcon
          />
          <Alert
            message="不要在渲染期间修改ref.current"
            description="这样做可能导致意外行为，因为React的渲染应该是纯函数"
            type="error"
            showIcon
          />
          <Alert
            message="DOM引用只在组件挂载后可用"
            description="在第一次渲染期间，DOM元素尚未创建，因此ref.current为null"
            type="info"
            showIcon
          />
          <Alert
            message="与useState搭配使用"
            description="对于既需要保存值又需要触发重新渲染的场景，可以同时使用useState和useRef"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseRef;
