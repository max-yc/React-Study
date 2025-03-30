import { useState, useDeferredValue, useMemo, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  List,
  Space,
  Spin,
  Tabs,
  Typography,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const UseDeferredValue = () => {
  // 示例1: 基本列表搜索
  const [input, setInput] = useState("");
  const deferredInput = useDeferredValue(input);
  const isStale = input !== deferredInput;

  // 示例2: 计算密集型场景
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [calculating, setCalculating] = useState(false);

  // 示例3: 对比防抖
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // 模拟防抖效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 模拟一个耗时的列表渲染
  const list = useMemo(() => {
    console.log("生成列表，使用值:", deferredInput);
    const items = [];
    for (let i = 0; i < 10000; i++) {
      if (deferredInput && i.toString().includes(deferredInput)) {
        items.push(i);
      }
    }
    return items.slice(0, 100); // 只显示前100个匹配项
  }, [deferredInput]);

  // 更复杂的模拟计算
  const complexResults = useMemo(() => {
    console.log("执行复杂计算，使用值:", deferredQuery);
    setCalculating(true);
    
    // 模拟耗时计算
    const startTime = performance.now();
    const results = [];
    
    for (let i = 0; i < 50; i++) {
      if (!deferredQuery) {
        results.push(`项目 ${i}`);
        continue;
      }
      
      // 故意添加一些计算延迟
      let temp = 0;
      for (let j = 0; j < 100000; j++) {
        temp += j;
      }
      
      if (i.toString().includes(deferredQuery)) {
        results.push(`匹配项 ${i} (得分: ${temp % 100})`);
      }
    }
    
    // 使用setTimeout模拟异步计算完成
    setTimeout(() => {
      setCalculating(false);
    }, 100);
    
    const endTime = performance.now();
    console.log(`计算耗时: ${endTime - startTime}ms`);
    
    return results;
  }, [deferredQuery]);

  // 用于对比的结果
  const comparisonResults = useMemo(() => {
    // 模拟两种不同方式的结果
    const deferredResults = [];
    const debouncedResults = [];
    
    for (let i = 0; i < 100; i++) {
      if (deferredSearchTerm && i.toString().includes(deferredSearchTerm)) {
        deferredResults.push(i);
      }
      
      if (debouncedSearchTerm && i.toString().includes(debouncedSearchTerm)) {
        debouncedResults.push(i);
      }
    }
    
    return { deferredResults, debouncedResults };
  }, [deferredSearchTerm, debouncedSearchTerm]);

  // 生成随机数
  const generateRandomInput = () => {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    setInput(randomNum.toString());
  };

  // 清除输入
  const clearInput = () => {
    setInput("");
  };

  // 触发计算密集型示例
  const triggerComplexCalculation = () => {
    const randomNum = Math.floor(Math.random() * 5);
    setQuery(randomNum.toString());
  };

  return (
    <div className="p-24">
      <Title level={2}>useDeferredValue Hook</Title>
      <Paragraph>
        useDeferredValue 是 React 的一个 Hook，用于延迟更新 UI 的某些部分，从而提高用户界面的响应性。
        它可以在保持应用响应性的同时处理大量数据渲染的场景。
      </Paragraph>

      <Divider orientation="left">基础用法与实例</Divider>
      <Card title="useDeferredValue 的典型应用场景" className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本列表搜索" key="1">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                输入数字查找包含该数字的项（从0到10000中）。使用 useDeferredValue 可以保证输入流畅。
              </Paragraph>
              
              <Input 
                placeholder="输入数字..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              
              <Space>
                <Button type="primary" onClick={generateRandomInput}>
                  生成随机数字
                </Button>
                <Button onClick={clearInput}>
                  清除输入
                </Button>
              </Space>
              
              <div className="mt-8">
                <Text strong>输入值:</Text> {input}
                <br />
                <Text strong>延迟值:</Text> {deferredInput}
                <br />
                <Text strong>是否延迟:</Text> {isStale ? "是" : "否"}
              </div>
              
              <div style={{ position: 'relative', marginTop: 16 }}>
                <List
                  header={<div>匹配的数字 (最多显示 100 个)</div>}
                  bordered
                  dataSource={list}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
                
                {isStale && list.length > 50 && (
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(255, 255, 255, 0.5)', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                    <Spin tip="渲染中..." />
                  </div>
                )}
              </div>
            </Space>
          </TabPane>
          
          <TabPane tab="计算密集型场景" key="2">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                此示例模拟了一个计算密集型操作，展示了 useDeferredValue 如何保持 UI 响应。
              </Paragraph>
              
              <Input 
                placeholder="输入数字 (0-4)..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              
              <Button type="primary" onClick={triggerComplexCalculation}>
                触发计算
              </Button>
              
              <div className="mt-8">
                <Text strong>查询值:</Text> {query}
                <br />
                <Text strong>延迟值:</Text> {deferredQuery}
                <br />
                <Text strong>状态:</Text> {calculating ? (
                  <Text type="warning">计算中...</Text>
                ) : (
                  <Text type="success">计算完成</Text>
                )}
              </div>
              
              <div style={{ position: 'relative', marginTop: 16 }}>
                <List
                  header={<div>计算结果</div>}
                  bordered
                  dataSource={complexResults}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
                
                {calculating && (
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(255, 255, 255, 0.5)', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                    <Spin tip="执行复杂计算中..." />
                  </div>
                )}
              </div>
              
              <Alert
                className="mt-12"
                message="性能提示"
                description="useDeferredValue 通过在较低优先级下更新计算密集型结果，确保用户输入等交互保持流畅。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="对比防抖" key="3">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                本示例对比 useDeferredValue 和传统的防抖 (debounce) 技术。
              </Paragraph>
              
              <Input 
                placeholder="输入数字..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              
              <div className="mt-8 mb-8">
                <Text strong>输入值:</Text> {searchTerm}
                <br />
                <Text strong>useDeferredValue:</Text> {deferredSearchTerm}
                <br />
                <Text strong>防抖值 (500ms):</Text> {debouncedSearchTerm}
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <Card title="useDeferredValue 结果">
                    <List
                      size="small"
                      bordered
                      dataSource={comparisonResults.deferredResults.slice(0, 10)}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                      locale={{ emptyText: "无匹配项" }}
                    />
                    <div style={{ marginTop: 8 }}>
                      {comparisonResults.deferredResults.length > 10 && 
                        `...还有 ${comparisonResults.deferredResults.length - 10} 个结果`}
                    </div>
                  </Card>
                </div>
                
                <div style={{ flex: 1 }}>
                  <Card title="防抖结果">
                    <List
                      size="small"
                      bordered
                      dataSource={comparisonResults.debouncedResults.slice(0, 10)}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                      locale={{ emptyText: "无匹配项" }}
                    />
                    <div style={{ marginTop: 8 }}>
                      {comparisonResults.debouncedResults.length > 10 && 
                        `...还有 ${comparisonResults.debouncedResults.length - 10} 个结果`}
                    </div>
                  </Card>
                </div>
              </div>
              
              <Alert
                className="mt-12"
                message="useDeferredValue vs 防抖"
                description="防抖会等待一段时间后才更新，而 useDeferredValue 可以立即开始更新，但以低优先级进行。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      <Divider orientation="left">实现原理</Divider>
      <Card title="useDeferredValue 工作原理" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            useDeferredValue 使用 React 的并发特性，将某些更新标记为低优先级。这与传统的防抖节流不同：
          </Paragraph>
          
          <Alert
            message="并发渲染"
            description="React 可以开始渲染，然后在需要时暂停并恢复，优先处理更紧急的任务。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="自动适应"
            description="延迟的时间不是固定的，而是根据用户设备性能和当前负载动态调整。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="不阻塞主线程"
            description="即使在计算大量数据时，用户界面也保持响应，不会感到卡顿。"
            type="info"
            showIcon
          />
          
          <Paragraph className="mt-12">
            <pre>
{`// useDeferredValue 基本实现示例
import { useState, useDeferredValue, useMemo } from 'react';

function SearchResults() {
  // 用户输入
  const [query, setQuery] = useState('');
  
  // 创建延迟值
  const deferredQuery = useDeferredValue(query);
  
  // 基于延迟值的计算密集型操作
  const results = useMemo(() => {
    // 耗时计算使用 deferredQuery 而不是 query
    return performExpensiveCalculation(deferredQuery);
  }, [deferredQuery]);
  
  // 是否正在使用旧值
  const isStale = query !== deferredQuery;
  
  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      
      {isStale && <p>加载中...</p>}
      
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
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
                message="大型列表或表格渲染"
                description="当用户输入需要触发大量数据的重新计算或渲染时。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="实时搜索和过滤"
                description="在用户输入实时搜索词时，保持输入框流畅响应，同时在后台处理搜索结果。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="复杂数据可视化"
                description="如图表、数据网格等需要大量计算的可视化组件。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="并发模式配合"
                description="与 React 的并发特性（如 Suspense）结合使用时，效果更佳。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="最佳实践" key="2">
            <Space direction="vertical" className="w-full">
              <Alert
                message="配合 useMemo 使用"
                description="确保耗时计算只在 deferredValue 变化时重新执行，而不是每次组件重新渲染。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="提供加载指示器"
                description="当 deferredValue 与当前值不同时，显示加载状态，提升用户体验。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="避免嵌套延迟值"
                description="不要创建依赖于其他延迟值的延迟值，这可能导致更新顺序问题。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="优先使用 useMemo 和 useCallback"
                description="对于简单的性能优化，优先考虑 useMemo 和 useCallback，它们的用途更明确。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
          
          <TabPane tab="注意事项" key="3">
            <Space direction="vertical" className="w-full">
              <Alert
                message="不会优化初始渲染"
                description="useDeferredValue 只能优化更新，对首次渲染没有帮助。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="不同于传统防抖节流"
                description="useDeferredValue 不会简单地延迟固定时间，而是利用 React 的并发特性动态调整优先级。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="并发模式依赖"
                description="为了获得最佳效果，应在启用了并发特性的 React 应用中使用。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              
              <Alert
                message="小心过度使用"
                description="不要对所有状态使用 useDeferredValue，只用于真正需要延迟更新的重量级计算。"
                type="warning"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      <Divider orientation="left">与其他 API 对比</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="useTransition vs useDeferredValue"
            description="useTransition 标记整个更新为低优先级，而 useDeferredValue 只为特定值创建低优先级副本。当无法修改触发更新的事件处理程序时，useDeferredValue 特别有用。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="节流/防抖 vs useDeferredValue"
            description="传统的节流和防抖会延迟处理本身，而 useDeferredValue 立即开始处理但以低优先级进行，可以被更高优先级的任务打断。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />
          
          <Alert
            message="React.memo vs useDeferredValue"
            description="React.memo 缓存整个组件渲染结果，避免不必要的重新渲染；useDeferredValue 则是为了保持 UI 响应性，同时处理耗时更新。"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseDeferredValue; 