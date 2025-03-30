import { useMemo, useState, useEffect, useRef } from "react";
import {
  Typography,
  Divider,
  Card,
  Button,
  Alert,
  Space,
  Input,
  List,
  Tag,
  Switch,
} from "antd";
import React from "react";

const { Title, Paragraph, Text } = Typography;

// 模拟昂贵计算的函数
const calculateFactorial = (n: number): number => {
  console.log(`计算 ${n} 的阶乘...`);
  if (n <= 1) return 1;

  // 人为延迟，模拟复杂计算
  const start = Date.now();
  while (Date.now() - start < 100) {
    /** 延迟 */
  }

  return n * calculateFactorial(n - 1);
};

// 模拟复杂的过滤函数
const filterItems = (items: string[], filter: string): string[] => {
  console.log("过滤项目...");

  // 人为延迟，模拟复杂计算
  const start = Date.now();
  while (Date.now() - start < 200) {
    /** 延迟 */
  } // 增加延迟使差异更明显

  return items.filter((item) => item.includes(filter));
};

const UseMemo = () => {
  // 示例1: 基本用法 - 缓存昂贵计算
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 示例2: 缓存派生状态
  const [number, setNumber] = useState(5); // 用于阶乘计算

  // 示例3: 缓存对象引用
  const [name, setName] = useState("张三");
  const [age, setAge] = useState(25);

  // 示例4: 条件性缓存
  const [items] = useState<string[]>([
    "苹果手机",
    "苹果电脑",
    "苹果手表",
    "苹果耳机",
    "苹果平板",
    "华为手机",
    "华为平板",
    "华为笔记本",
    "华为耳机",
    "华为手表",
    "小米手机",
    "小米电视",
    "小米空调",
    "小米平板",
    "小米耳机",
    "魅族手机",
    "OPPO手机",
    "vivo手机",
    "三星手机",
    "联想电脑",
    "戴尔电脑",
    "惠普电脑",
    "华硕电脑",
    "索尼电视",
    "创维电视",
  ]);
  const [filter, setFilter] = useState("");
  const [enableCache, setEnableCache] = useState(true);

  // 示例5: 跟踪渲染次数
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount((c) => c + 1);
  }, []);

  // 使用useRef跟踪执行时间和计数，避免无限渲染循环
  const withCacheTimeRef = useRef(0);
  const withoutCacheTimeRef = useRef(0);
  const cacheCallCountRef = useRef(0);
  const nonCacheCallCountRef = useRef(0);

  // 示例1: 基本缓存计算 - 仅在count变化时重新计算
  const doubledCount = useMemo(() => {
    console.log("计算doubled count...");
    return count * 2;
  }, [count]);

  // 示例2: 缓存昂贵计算 - 阶乘
  // const factorial = calculateFactorial(number); // 当父组件改变则子组件自动计算
  const factorial = useMemo(() => {
    return calculateFactorial(number);
  }, [number]);

  // 示例3: 缓存对象引用 - 避免不必要的重新渲染
  const userProfile = useMemo(() => {
    console.log("创建用户资料对象...");
    return { name, age, lastUpdated: new Date().toLocaleTimeString() };
  }, [name, age]);

  // 示例4: 条件性缓存 - 过滤列表
  const cachedItems = useMemo(() => {
    cacheCallCountRef.current += 1;
    console.log("执行useMemo缓存计算", cacheCallCountRef.current);

    const startTime = performance.now();
    const result = filterItems(items, filter);
    const endTime = performance.now();

    withCacheTimeRef.current = endTime - startTime;
    return result;
  }, [items, filter]);

  // 直接计算，不使用缓存
  const getNonCachedItems = () => {
    nonCacheCallCountRef.current += 1;
    console.log("执行非缓存计算", nonCacheCallCountRef.current);

    const startTime = performance.now();
    const result = filterItems(items, filter);
    const endTime = performance.now();

    withoutCacheTimeRef.current = endTime - startTime;
    return result;
  };

  // 根据当前模式选择使用哪个结果
  const filteredItems = enableCache ? cachedItems : getNonCachedItems();

  // 显示上次更新时间
  const userInfoString = JSON.stringify(userProfile, null, 2);

  // 每次渲染都创建新对象引用
  const userInfo = { name, role: "管理员" };
  // 使用useMemo缓存对象引用
  // const userInfo = useMemo(() => {
  //   return { name, role: "管理员" };
  // }, [name]); // 仅当name变化时创建新对象

  return (
    <div className="p-24">
      <Title level={2}>useMemo Hook</Title>
      <Paragraph>
        useMemo 用于缓存计算结果，避免在每次渲染时重复执行昂贵的计算。
        它接收一个创建函数和依赖项数组，仅在依赖项变化时重新计算值。
      </Paragraph>

      <Divider orientation="left">基础用法</Divider>
      <Card title="缓存计算结果" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Text>Count: {count}</Text>
          <Text>Doubled Count: {doubledCount}</Text>
          <div className="my-12">
            <Button onClick={() => setCount(count + 1)} type="primary">
              增加计数
            </Button>
          </div>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入文本不会触发重新计算"
            className="mb-8"
          />
          <Text type="secondary">当前输入: {text}</Text>
          <Alert
            className="mt-12"
            message="依赖性缓存"
            description="只有当count变化时，doubledCount才会重新计算。修改text不会触发重新计算。"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">性能优化</Divider>
      <Card title="缓存昂贵计算" className="mb-16">
        <Space direction="vertical" className="w-full">
          <div className="flex items-center gap-12 mb-12">
            <Text className="mr-12">数字:</Text>
            <Input
              type="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              style={{ width: 100 }}
              min={0}
              max={10}
            />
            <Text className="ml-12" type="secondary">
              (建议不要超过10，以避免计算过慢)
            </Text>
          </div>
          <div className="mb-12">
            <Text>
              {number}的阶乘 = {factorial}
            </Text>
          </div>
          <Alert
            message="昂贵计算缓存"
            description="阶乘计算是一个耗时操作，使用useMemo避免每次渲染时重新计算"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">引用相等性</Divider>
      <Card title="缓存对象引用" className="mb-16">
        <Space direction="vertical" className="w-full">
          <div className="flex items-center gap-12 mb-12">
            <Text className="mr-12">姓名:</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <div className="flex items-center gap-12 mb-12">
            <Text className="mr-12">年龄:</Text>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{ width: 100 }}
            />
          </div>
          <div className="mb-12">
            <pre className="p-12 bg-gray-100 rounded">{userInfoString}</pre>
          </div>
          <Button onClick={() => setCount(count + 1)}>点击次数：{count}</Button>
          <MemoizedChildComponent userInfo={userInfo} />
          <Alert
            message="对象引用缓存"
            description="useMemo确保对象引用在依赖项未变化时保持不变，这对于避免子组件不必要的重新渲染很重要"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">实际应用</Divider>
      <Card title="条件过滤列表" className="mb-16">
        <Space direction="vertical">
          <div className="mb-12">
            <Input
              value={filter}
              className="mb-12"
              onChange={(e) => setFilter(e.target.value)}
              placeholder="输入关键字过滤项目"
              style={{ width: 200 }}
            />
            <div className="flex items-center gap-2">
              <Text className="mr-12">启用缓存:</Text>
              <Switch checked={enableCache} onChange={setEnableCache} />
            </div>
          </div>
          <div className="mb-12">
            <Space direction="vertical" className="w-full">
              <div>
                <Text className="mr-4">过滤结果:</Text>
                <Text strong>{filteredItems.length} 项</Text>
              </div>

              {enableCache ? (
                <Alert
                  message={
                    <div>
                      <Tag color="green">使用useMemo缓存</Tag>
                      <Text className="ml-2">
                        执行次数:
                        <Tag className="ml-4" color="blue">
                          {cacheCallCountRef.current}
                        </Tag>
                      </Text>
                      <Text className="ml-16">
                        耗时:
                        <Tag className="ml-4" color="blue">
                          {withCacheTimeRef.current.toFixed(2)}
                        </Tag>
                        ms
                      </Text>
                    </div>
                  }
                  description="输入相同关键词多次，计算只会执行一次"
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message={
                    <div>
                      <Tag color="red">不使用缓存</Tag>
                      <Text className="ml-2">
                        执行次数:
                        <Tag className="ml-4" color="blue">
                          {nonCacheCallCountRef.current}
                        </Tag>
                      </Text>
                      <Text className="ml-16">
                        耗时:
                        <Tag className="ml-4" color="blue">
                          {withoutCacheTimeRef.current.toFixed(2)}
                        </Tag>
                        ms
                      </Text>
                    </div>
                  }
                  description="每次渲染都会重新计算，不管输入是否变化"
                  type="warning"
                  showIcon
                />
              )}

              <Text type="secondary">
                尝试方法:
                输入"手机"后不断点击启用缓存开关，观察两种模式下的执行次数差异
              </Text>

              <List
                className="mt-8"
                size="small"
                bordered
                dataSource={filteredItems}
                renderItem={(item) => (
                  <List.Item>
                    <Tag
                      color={
                        item.includes("苹果")
                          ? "blue"
                          : item.includes("华为")
                          ? "green"
                          : "orange"
                      }
                    >
                      {item}
                    </Tag>
                  </List.Item>
                )}
              />
            </Space>
          </div>
        </Space>
      </Card>

      <Divider orientation="left">useMemo注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Text className="mb-12">组件已渲染 {renderCount} 次</Text>

          <Alert
            message="不要过度使用"
            description="useMemo本身有开销，对于简单的计算可能比重新计算更昂贵"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="依赖项必须正确"
            description="确保所有在memoized函数中使用的响应式值都包含在依赖数组中"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="仅用于性能优化"
            description="useMemo不应该用于副作用或异步操作，这些应该在useEffect中处理"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="初始化不保证"
            description="React可能在某些情况下（如内存压力）忽略之前的缓存并重新计算，因此不要依赖它来存储关键信息"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

// 使用memo优化的子组件
const MemoizedChildComponent = React.memo(
  ({ userInfo }: { userInfo: { name: string; role: string } }) => {
    console.log("子组件渲染"); // 每次父组件渲染都会执行
    return (
      <Text>
        {userInfo.name} - {userInfo.role}
      </Text>
    );
  }
);

export default UseMemo;
