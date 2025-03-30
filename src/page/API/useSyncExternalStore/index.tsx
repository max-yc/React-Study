import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  Space,
  Statistic,
  Switch,
  Tabs,
  Typography,
} from "antd";
import { useSyncExternalStore, useEffect, useState } from "react";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// 定义Store的状态类型
interface CounterState {
  count: number;
  autoIncrement: boolean;
}

// 定义主题状态类型
interface ThemeState {
  isDark: boolean;
}

// 定义用户状态类型
interface UserState {
  username: string;
  isLoggedIn: boolean;
}

// 创建一个简单的外部存储
const createStore = <T extends object>(initialState: T) => {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (newState: T | ((prevState: T) => T)) => {
      if (typeof newState === 'function') {
        state = (newState as (prevState: T) => T)(state);
      } else {
        state = newState;
      }
      listeners.forEach(listener => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

// 全局计数器存储
const counterStore = createStore<CounterState>({ count: 0, autoIncrement: false });

// 全局主题存储
const themeStore = createStore<ThemeState>({ isDark: false });

// 全局用户存储
const userStore = createStore<UserState>({ username: '', isLoggedIn: false });

// 定时器间隔（毫秒）
const INTERVAL = 1000;

// 媒体查询存储示例
const createMediaQueryStore = (query: string) => {
  // 创建媒体查询
  const mediaQuery = window.matchMedia(query);
  
  // 获取当前状态
  const getSnapshot = () => mediaQuery.matches;
  
  // 订阅变化
  const subscribe = (callback: () => void) => {
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  };
  
  return { getSnapshot, subscribe };
};

const UseSyncExternalStore = () => {
  // 示例1: 基本计数器
  const { count, autoIncrement } = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getState
  );
  
  // 示例2: 主题切换
  const { isDark } = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getState
  );
  
  // 示例3: 用户登录状态
  const { username, isLoggedIn } = useSyncExternalStore(
    userStore.subscribe,
    userStore.getState
  );
  
  // 示例4: 响应式设计 - 媒体查询
  const [mediaQueryStore] = useState(() => 
    createMediaQueryStore('(max-width: 768px)')
  );
  
  const isMobile = useSyncExternalStore(
    mediaQueryStore.subscribe,
    mediaQueryStore.getSnapshot
  );
  
  // 更新函数
  const increment = () => {
    counterStore.setState((state) => ({
      ...state,
      count: state.count + 1
    }));
  };

  const decrement = () => {
    counterStore.setState((state) => ({
      ...state,
      count: state.count - 1
    }));
  };

  const reset = () => {
    counterStore.setState((state) => ({
      ...state,
      count: 0
    }));
  };

  const toggleAutoIncrement = () => {
    counterStore.setState((state) => ({
      ...state,
      autoIncrement: !state.autoIncrement
    }));
  };
  
  const toggleTheme = () => {
    themeStore.setState((state) => ({
      isDark: !state.isDark
    }));
  };
  
  const login = () => {
    userStore.setState({
      username: 'TestUser',
      isLoggedIn: true
    });
  };
  
  const logout = () => {
    userStore.setState({
      username: '',
      isLoggedIn: false
    });
  };
  
  const changeUsername = (newName: string) => {
    userStore.setState((state) => ({
      ...state,
      username: newName
    }));
  };

  // 模拟外部数据源的自动更新
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoIncrement) {
      intervalId = setInterval(() => {
        counterStore.setState((state) => ({
          ...state,
          count: state.count + 1
        }));
      }, INTERVAL);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoIncrement]);

  return (
    <div className="p-24">
      <Title level={2}>useSyncExternalStore Hook</Title>
      <Paragraph>
        useSyncExternalStore 是 React 的一个 Hook，用于订阅外部数据源，确保在并发渲染中组件显示的数据始终一致。
        它主要用于连接 React 与外部状态管理系统，避免在并发模式下出现不一致的状态。
      </Paragraph>
      
      <Divider orientation="left">基础用法与实例</Divider>
      <Card title="useSyncExternalStore 的典型应用场景" className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="计数器示例" key="1">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                此示例演示了如何使用 useSyncExternalStore 从自定义存储中读取状态。
                这个计数器可以在任何组件中共享状态，并保持同步。
              </Paragraph>
              
              <div className="mb-8">
                <Statistic 
                  title="当前计数" 
                  value={count} 
                  style={{ marginBottom: 24 }}
                />
                
                <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                  <Space>
                    <Button onClick={decrement}>减少</Button>
                    <Button onClick={increment} type="primary">增加</Button>
                    <Button onClick={reset} danger>重置</Button>
                  </Space>
                  
                  <div className="flex items-center gap-4 mt-8">
                    <Switch 
                      checked={autoIncrement} 
                      onChange={toggleAutoIncrement}
                    />
                    <span>自动递增（每秒）</span>
                  </div>
                  
                  {autoIncrement && (
                    <Alert
                      message="外部更新中"
                      description={`外部存储每 ${INTERVAL}ms 自动更新一次，React 组件保持同步。`}
                      type="info"
                      showIcon
                      style={{ marginTop: 16 }}
                    />
                  )}
                </Space>
              </div>
              
              <Alert
                className="mt-12"
                message="外部状态管理"
                description="这个计数器状态存储在组件之外，可以被任何组件访问和修改，而所有订阅的组件都会保持同步。"
                type="success"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="主题切换" key="2">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                这个示例展示了如何使用 useSyncExternalStore 管理全局主题状态。
              </Paragraph>
              
              <div className={`p-16 mb-8 rounded transition-all ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black border'}`} style={{ minHeight: '150px' }}>
                <Title level={4} style={{ color: isDark ? 'white' : 'black' }}>
                  当前主题: {isDark ? '深色' : '浅色'}
                </Title>
                <Paragraph style={{ color: isDark ? 'white' : 'black' }}>
                  这个容器的样式基于外部存储中的主题状态。切换主题按钮可以改变外部存储中的状态。
                </Paragraph>
                <Button 
                  type={isDark ? "default" : "primary"} 
                  onClick={toggleTheme}
                >
                  切换到{isDark ? '浅色' : '深色'}主题
                </Button>
              </div>
              
              <Alert
                className="mt-12"
                message="全局主题管理"
                description="使用外部存储管理主题状态，可以轻松实现应用级的主题切换，而无需使用上下文或属性传递。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="用户状态" key="3">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                此示例演示使用 useSyncExternalStore 管理用户登录状态和信息。
              </Paragraph>
              
              <Card 
                title="用户状态" 
                className="mb-8" 
                style={{ width: '100%' }}
              >
                <div style={{ marginBottom: 16 }}>
                  <Text strong>登录状态:</Text> {isLoggedIn ? '已登录' : '未登录'}
                </div>
                
                {isLoggedIn ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>用户名:</Text> {username}
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Input 
                        placeholder="修改用户名" 
                        value={username}
                        onChange={(e) => changeUsername(e.target.value)}
                        style={{ marginBottom: 8 }}
                      />
                      <Button 
                        danger 
                        onClick={logout}
                      >
                        退出登录
                      </Button>
                    </Space>
                  </>
                ) : (
                  <Button 
                    type="primary" 
                    onClick={login}
                  >
                    登录
                  </Button>
                )}
              </Card>
              
              <Alert
                className="mt-12"
                message="用户状态管理"
                description="useSyncExternalStore 可用于管理用户状态，使每个使用该状态的组件都能实时更新。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="响应式设计" key="4">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                此示例展示如何使用 useSyncExternalStore 订阅浏览器媒体查询，实现响应式设计。
              </Paragraph>
              
              <Card title="媒体查询状态" className="mb-8">
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Title level={3}>
                    当前设备类型: {isMobile ? '移动设备' : '桌面设备'}
                  </Title>
                  <div style={{ fontSize: isMobile ? '14px' : '24px', margin: '20px 0' }}>
                    {isMobile 
                      ? '这是为移动设备优化的UI' 
                      : '这是为桌面设备优化的UI'
                    }
                  </div>
                  <Alert
                    message="媒体查询状态"
                    description="调整浏览器窗口大小查看变化 (阈值: 768px)"
                    type="info"
                    showIcon
                  />
                </div>
              </Card>
              
              <Alert
                className="mt-12"
                message="响应式设计"
                description="useSyncExternalStore 可以订阅媒体查询，让组件感知视窗变化并作出响应，无需使用窗口事件监听器。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>
      
      <Divider orientation="left">实现原理</Divider>
      <Card title="useSyncExternalStore 工作原理" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            useSyncExternalStore 是一种安全地从外部数据源读取数据的方式，特别适用于并发渲染的场景：
          </Paragraph>
          
          <Alert
            message="内置订阅机制"
            description="提供统一的订阅接口，确保在数据变化时组件能够更新。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="一致性快照"
            description="即使在渲染被中断和恢复的情况下，也能保证组件使用一致的数据。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="内置撕裂防护"
            description="防止在并发渲染期间使用不一致的外部状态，避免 UI 撕裂问题。"
            type="info"
            showIcon
          />
          
          <Paragraph className="mt-12">
            <pre>
{`// useSyncExternalStore 基本实现示例
import { useSyncExternalStore } from 'react';

// 创建一个简单的存储
function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = typeof newState === 'function' ? newState(state) : newState;
      listeners.forEach(listener => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

// 创建全局存储
const store = createStore({ count: 0 });

function Counter() {
  // 使用 useSyncExternalStore 订阅外部存储
  const state = useSyncExternalStore(
    store.subscribe,    // 订阅函数
    store.getState      // 获取状态快照的函数
  );

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => store.setState(s => ({ count: s.count + 1 }))}>
        Increment
      </button>
    </div>
  );
}`}
            </pre>
          </Paragraph>
        </Space>
      </Card>
      
      <Divider orientation="left">使用场景与最佳实践</Divider>
      <Card className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="适用场景" key="1">
            <Space direction="vertical" className="w-full">
              <Alert
                message="第三方状态管理集成"
                description="与 Redux、MobX、Zustand 等外部状态管理库集成。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="浏览器 API 订阅"
                description="订阅 localStorage、sessionStorage、URL 变化或浏览器历史记录。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="响应式设计"
                description="订阅媒体查询、视窗大小、设备方向等变化。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="实时数据源"
                description="WebSocket、Server-Sent Events、长轮询等实时数据源的订阅。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="最佳实践" key="2">
            <Space direction="vertical" className="w-full">
              <Alert
                message="提供清理函数"
                description="subscribe 函数必须返回一个清理函数，用于在组件卸载时取消订阅。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="保持快照不可变"
                description="getSnapshot 函数返回的数据应该是不可变的，或者每次返回相同引用(如果数据未变化)。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="服务器渲染支持"
                description="在使用服务器渲染时，提供 getServerSnapshot 参数以支持 SSR。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="细粒度订阅"
                description="只订阅组件需要的部分状态，避免因不相关状态更新导致的重新渲染。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="注意事项" key="3">
            <Space direction="vertical" className="w-full">
              <Alert
                message="同步快照"
                description="getSnapshot 必须是同步的，不能是异步函数或返回 Promise。"
                type="error"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="内存泄漏风险"
                description="确保 subscribe 返回的清理函数能正确移除监听器，避免内存泄漏。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="避免过度通知"
                description="确保外部存储在状态实际变化时才通知订阅者，避免不必要的渲染。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="不适用于异步数据"
                description="useSyncExternalStore 设计用于同步数据源，对于异步数据获取应使用其他方法。"
                type="warning"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>
      
      <Divider orientation="left">与其他API对比</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="useContext vs useSyncExternalStore"
            description="useContext 适用于内部状态共享，而 useSyncExternalStore 适用于外部数据源订阅。useContext 状态更改会导致所有消费组件重新渲染，而 useSyncExternalStore 可以更细粒度地控制哪些组件需要更新。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="useEffect + useState vs useSyncExternalStore"
            description="过去我们常用 useEffect + useState 订阅外部数据源，但这种方式在并发渲染中可能导致状态不一致。useSyncExternalStore 提供了内置的撕裂防护，确保在任何时候读取的状态都是一致的。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="useReducer vs useSyncExternalStore"
            description="useReducer 用于管理组件内的复杂状态，而 useSyncExternalStore 用于连接组件外的状态源。对于跨组件的状态管理，可以结合使用 useReducer 创建外部存储，然后通过 useSyncExternalStore 订阅。"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseSyncExternalStore; 