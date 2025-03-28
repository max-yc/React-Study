import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Affix,
  Alert,
  Button,
  Card,
  Divider,
  Space,
  Switch,
  Typography,
} from "antd";
import { useState, useRef, useEffect } from "react";

const { Title, Text, Paragraph } = Typography;

const UseState: React.FC<any> = () => {
  // 引用layout-content容器
  const layoutContentRef = useRef<HTMLElement | null>(null);

  // 在组件挂载后获取layout-content容器
  useEffect(() => {
    layoutContentRef.current = document.querySelector(".layout-content");
  }, []);

  // 1. 基础用法 - 数字状态
  const [count, setCount] = useState(0);

  // 2. 使用函数作为初始值
  useState(() => {
    // 这个函数只会在组件初始渲染时执行一次
    console.log("昂贵的计算只执行一次");
    return 0;
  });

  // 3. 布尔值状态
  const [isOn, setIsOn] = useState(false);

  // 4. 对象状态
  const [user, setUser] = useState({
    name: "张三",
    age: 25,
  });

  // 5. 数组状态
  const [items, setItems] = useState<string[]>([]);

  // 基础用法 - 数字递增递减
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  // 函数式更新（解决闭包陷阱）
  const handleIncrementThreeTimes = () => {
    // 错误的方式 - 所有的setCount都在使用相同的count值
    // setCount(count + 1);
    // setCount(count + 1);
    // setCount(count + 1);

    // 正确的方式 - 使用函数式更新，基于最新的state值更新
    setCount(() => count + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
  };

  // 延迟更新示例
  const handleDelayedIncrement = () => {
    // 使用函数式更新确保使用最新的state
    // setTimeout(() => {
    //   setCount(count + 1);
    // }, 1000);
    // setTimeout(() => {
    //   setCount(() => count + 1);
    // }, 1000);
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);
  };

  // 切换布尔值
  const toggleSwitch = (checked: boolean) => {
    setIsOn(checked);
  };

  // 更新对象状态 - 错误方式会直接修改原对象
  const updateUserNameWrong = () => {
    // 错误：直接修改状态对象
    user.name = "李四"; // 这不会触发重新渲染
    setUser(user);
  };

  // 更新对象状态 - 正确方式是创建新对象
  const updateUserNameCorrect = () => {
    // 正确：创建新对象并保留其他属性
    setUser({ ...user, name: "李四" });
  };

  // 更新对象中的嵌套属性
  const updateUserAge = () => {
    setUser((prevUser) => ({
      ...prevUser,
      age: prevUser.age + 1,
    }));
  };

  // 处理数组 - 添加元素
  const addItem = () => {
    const newItem = `项目 ${items.length + 1}`;
    // 创建新数组
    setItems([...items, newItem]);
  };

  // 处理数组 - 删除元素
  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <>
      <Affix offsetTop={230} target={() => layoutContentRef.current}>
        <div style={{ position: "fixed", left: "80px" }}>
          <Title style={{ whiteSpace: "nowrap" }} level={2}>
            当前计数: {count}
          </Title>
          <Button onClick={() => setCount(0)}>重置</Button>
        </div>
      </Affix>
      <div className="p-24">
        <Title level={2}>useState Hook</Title>
        <Paragraph>
          useState是React中最基础的Hook，用于在函数组件中添加状态管理能力。
        </Paragraph>

        <Divider orientation="left">基础用法</Divider>
        <Card title="数字状态" className="mb-16">
          <Space>
            <Button onClick={handleDecrement} icon={<MinusOutlined />}>
              减少
            </Button>
            <Button onClick={handleIncrement} icon={<PlusOutlined />}>
              增加
            </Button>
          </Space>
        </Card>

        <Divider orientation="left">函数式更新</Divider>
        <Card title="连续更新状态" className="mb-16">
          <Paragraph>
            当多次更新依赖于前一个状态时，应该使用函数式更新而不是直接使用当前状态值。
          </Paragraph>
          <Space direction="vertical" className="w-full">
            <Button onClick={handleIncrementThreeTimes} type="primary">
              增加三次(函数式更新)
            </Button>
            <Alert
              message="函数式更新避免闭包陷阱"
              description="使用 setCount(prevCount => prevCount + 1) 而不是 setCount(count + 1) 可以确保基于最新状态更新"
              type="info"
              showIcon
            />
          </Space>
        </Card>

        <Card title="异步更新状态" className="mb-16">
          <Space direction="vertical" className="w-full">
            <Button onClick={handleDelayedIncrement}>延迟1秒增加</Button>
            <Alert
              message="在异步操作中更新状态"
              description="在setTimeout或网络请求回调中更新状态时，使用函数式更新确保使用最新的状态值"
              type="warning"
              showIcon
            />
          </Space>
        </Card>

        <Divider orientation="left">不同数据类型的状态</Divider>
        <Card title="布尔值状态" className="mb-16">
          <Space direction="vertical" className="w-full">
            <div className="flex items-center gap-8">
              <Text className="mr-16">当前状态: {isOn ? "开启" : "关闭"}</Text>
              <Switch checked={isOn} onChange={toggleSwitch} />
            </div>
          </Space>
        </Card>

        <Card title="对象状态" className="mb-16">
          <Space direction="vertical" className="mb-8">
            <Text>用户名: {user.name}</Text>
            <Text>年龄: {user.age}</Text>
          </Space>
          <br />
          <Space>
            <Button onClick={updateUserNameWrong} danger>
              错误的更新方式(直接修改)
            </Button>
            <Button onClick={updateUserNameCorrect} type="primary">
              正确的更新方式(创建新对象)
            </Button>
            <Button onClick={updateUserAge}>增加年龄</Button>
          </Space>
          <Alert
            className="mt-12"
            message="对象状态更新注意事项"
            description="React使用浅比较检测状态变化，直接修改对象不会触发重新渲染。必须创建新对象。"
            type="warning"
            showIcon
          />
        </Card>

        <Card title="数组状态" className="mb-16">
          <Space direction="vertical" className="w-full">
            <Button onClick={addItem} type="primary">
              添加项目
            </Button>
            {items.length > 0 ? (
              <ul className="pl-24">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between mb-4"
                  >
                    <span className="mr-8">{item}</span>
                    <Button
                      size="small"
                      danger
                      onClick={() => removeItem(index)}
                    >
                      删除
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Text className="text-gray-500">暂无项目，请添加</Text>
            )}
          </Space>
        </Card>

        <Divider orientation="left">useState注意事项</Divider>
        <Card className="mb-16">
          <Space direction="vertical" className="w-full">
            <Alert
              message="状态更新是异步的"
              description="React 可能会批量处理状态更新，因此设置状态后立即读取可能无法获取到最新值"
              type="info"
              showIcon
            />
            <Alert
              message="避免过多的状态"
              description="过多的useState会使代码难以维护，考虑使用useReducer合并相关状态"
              type="info"
              showIcon
            />
            <Alert
              message="惰性初始化"
              description="对于昂贵的初始化操作，使用useState(() => {...})函数形式"
              type="info"
              showIcon
            />
            <Alert
              message="不可变性原则"
              description="永远不要直接修改状态对象或数组，而是创建新的副本"
              type="warning"
              showIcon
            />
          </Space>
        </Card>
      </div>
    </>
  );
};

export default UseState;
