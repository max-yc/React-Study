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
  Badge,
  Avatar,
  Tag,
  message,
} from "antd";
import { useState, useEffect } from "react";
import {
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface OptimisticTodo extends Todo {
  isOptimistic?: boolean;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  likes: number;
  isLiked: boolean;
  isOptimistic?: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  inCart: boolean;
  isOptimistic?: boolean;
}

// 模拟的初始待办事项
const initialTodos: Todo[] = [
  { id: 1, text: "学习 React", completed: false },
  { id: 2, text: "学习 Hooks", completed: true },
  { id: 3, text: "构建项目", completed: false },
];

// 模拟评论数据
const initialComments: Comment[] = [
  {
    id: 1,
    author: "张三",
    content: "这篇文章很有帮助！",
    likes: 5,
    isLiked: false,
  },
  {
    id: 2,
    author: "李四",
    content: "学到了很多知识",
    likes: 3,
    isLiked: false,
  },
  {
    id: 3,
    author: "王五",
    content: "希望看到更多类似的内容",
    likes: 7,
    isLiked: false,
  },
];

// 模拟产品数据
const initialProducts: Product[] = [
  { id: 1, name: "React高级教程", price: 99, rating: 4, inCart: false },
  { id: 2, name: "TypeScript实战", price: 89, rating: 5, inCart: false },
  { id: 3, name: "现代JavaScript指南", price: 79, rating: 3, inCart: false },
];

const UseOptimistic = () => {
  // 示例1: 待办事项列表
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [optimisticTodos, setOptimisticTodos] =
    useState<OptimisticTodo[]>(initialTodos);

  // 示例2: 社交媒体点赞
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [optimisticComments, setOptimisticComments] =
    useState<Comment[]>(initialComments);

  // 示例3: 电商加入购物车
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [optimisticProducts, setOptimisticProducts] =
    useState<Product[]>(initialProducts);
  const [cartCount, setCartCount] = useState<number>(0);

  // 模拟API请求延迟
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // 模拟新任务的输入
  const [newTodoText, setNewTodoText] = useState("");

  // 同步实际状态到乐观状态
  useEffect(() => {
    setOptimisticTodos(todos);
  }, [todos]);

  // 同步评论状态
  useEffect(() => {
    setOptimisticComments(comments);
  }, [comments]);

  // 同步产品状态
  useEffect(() => {
    setOptimisticProducts(products);
    setCartCount(products.filter((p) => p.inCart).length);
  }, [products]);

  // 选项卡切换处理
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 示例1: 待办事项操作
  const addTodo = async () => {
    if (!newTodoText.trim()) return;

    // 创建新的待办事项
    const newTodo: OptimisticTodo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
      isOptimistic: true,
    };

    // 立即展示乐观更新的UI
    setOptimisticTodos([...optimisticTodos, newTodo]);

    // 清空输入
    setNewTodoText("");

    // 模拟API请求
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模拟失败概率 (20%)
    const shouldFail = Math.random() < 0.5;

    if (shouldFail && activeTab === "1") {
      // 操作失败，恢复原状态
      setIsLoading(false);
      setOptimisticTodos(todos);
      message.error("添加任务失败");
      return;
    }

    // 更新实际状态
    setTodos((currentTodos) => [
      ...currentTodos,
      { ...newTodo, id: Date.now(), isOptimistic: false },
    ]);
    setIsLoading(false);
  };

  const toggleTodo = async (id: number) => {
    // 乐观更新UI
    setOptimisticTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, isOptimistic: true }
          : todo
      )
    );

    // 模拟API请求
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // 模拟失败概率 (20%)
    const shouldFail = Math.random() < 0.5;

    if (shouldFail && activeTab === "1") {
      // 操作失败，恢复原状态
      setIsLoading(false);
      setOptimisticTodos(todos);
      message.error("操作失败");
      return;
    }

    // 更新实际状态
    setTodos((currentTodos) => {
      return currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
    });
    setIsLoading(false);
  };

  // 示例2: 评论点赞操作
  const toggleLike = async (id: number) => {
    // 查找当前评论
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    // 乐观更新UI
    setOptimisticComments((currentComments) =>
      currentComments.map((c) =>
        c.id === id
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              isOptimistic: true,
            }
          : c
      )
    );

    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 更新实际状态
    setComments((currentComments) =>
      currentComments.map((c) =>
        c.id === id
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  // 示例3: 商品操作
  const toggleCart = async (id: number) => {
    // 乐观更新UI
    setOptimisticProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === id ? { ...p, inCart: !p.inCart, isOptimistic: true } : p
      )
    );

    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 更新实际状态
    setProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === id ? { ...p, inCart: !p.inCart } : p
      )
    );
  };

  // 商品评分
  const rateProduct = async (id: number, newRating: number) => {
    // 乐观更新UI
    setOptimisticProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === id ? { ...p, rating: newRating, isOptimistic: true } : p
      )
    );

    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 更新实际状态
    setProducts((currentProducts) =>
      currentProducts.map((p) =>
        p.id === id ? { ...p, rating: newRating } : p
      )
    );
  };

  return (
    <div className="p-24">
      <Title level={2}>useOptimistic Hook</Title>
      <Paragraph>
        useOptimistic 是 React 的一个
        Hook，用于实现乐观更新模式，特别适用于需要提高用户体验的网络请求场景。
        它允许在等待异步操作（如API请求）完成的同时，立即更新UI以响应用户操作，提供更流畅的用户体验。
      </Paragraph>

      <Divider orientation="left">乐观更新实例</Divider>
      <Card title="乐观更新的典型应用场景" className="mb-16">
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
          <TabPane tab="待办事项列表" key="1">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                下面的待办事项列表演示了乐观更新模式。添加或切换任务状态时，UI会立即更新，同时发送后台请求。
                有20%的概率操作会失败，失败时会恢复到原始状态。
              </Paragraph>

              <div className="mb-8">
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="输入新任务..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onPressEnter={addTodo}
                  />
                  <Button
                    type="primary"
                    onClick={addTodo}
                    disabled={!newTodoText.trim() || isLoading}
                  >
                    添加任务
                  </Button>
                </Space.Compact>
              </div>

              {isLoading && (
                <Alert
                  message="正在处理..."
                  description="后台请求正在处理中，但UI已经乐观地更新了。有20%的概率操作会失败！"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              <List
                header={<div>待办事项列表 (乐观更新)</div>}
                bordered
                dataSource={optimisticTodos}
                renderItem={(todo) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => toggleTodo(todo.id)}>
                        {todo.completed ? "标记为未完成" : "标记为已完成"}
                      </Button>,
                    ]}
                  >
                    <div
                      style={{
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                        opacity: todo.completed ? 0.5 : 1,
                      }}
                    >
                      {todo.text}
                      {todo.isOptimistic && (
                        <Spin size="small" style={{ marginLeft: 8 }} />
                      )}
                    </div>
                  </List.Item>
                )}
              />

              <Alert
                className="mt-12"
                message="乐观更新与用户体验"
                description="乐观更新使界面立即响应用户操作，避免了等待网络请求完成的延迟感，大大提升了用户体验。"
                type="success"
                showIcon
              />
            </Space>
          </TabPane>

          <TabPane tab="社交媒体点赞" key="2">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                此示例模拟社交媒体平台的点赞功能。点击喜欢按钮，计数会立即更新，无需等待网络请求完成。
              </Paragraph>

              <List
                header={<div>评论列表</div>}
                bordered
                itemLayout="vertical"
                dataSource={optimisticComments}
                renderItem={(comment) => (
                  <List.Item
                    key={comment.id}
                    actions={[
                      <Space
                        onClick={() => toggleLike(comment.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {comment.isLiked ? (
                          <HeartFilled style={{ color: "#ff4d4f" }} />
                        ) : (
                          <HeartOutlined />
                        )}
                        <span>
                          {comment.likes}
                          {comment.isOptimistic && (
                            <Spin size="small" style={{ marginLeft: 4 }} />
                          )}
                        </span>
                      </Space>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={comment.author}
                      description={comment.content}
                    />
                  </List.Item>
                )}
              />

              <Alert
                className="mt-12"
                message="社交媒体互动"
                description="在社交媒体应用中，乐观更新对提升用户体验至关重要。用户点赞、评论或分享后立即看到反馈，使交互感觉更快速、流畅。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>

          <TabPane tab="电商购物车" key="3">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                此示例模拟电商平台的购物车功能。点击"加入购物车"按钮，状态会立即更新，无需等待后端响应。
              </Paragraph>

              <div style={{ textAlign: "right", marginBottom: 16 }}>
                <Badge count={cartCount}>
                  <Button icon={<ShoppingCartOutlined />} size="large">
                    购物车
                  </Button>
                </Badge>
              </div>

              <List
                header={<div>商品列表</div>}
                bordered
                dataSource={optimisticProducts}
                renderItem={(product) => (
                  <List.Item
                    key={product.id}
                    actions={[
                      <Space>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => rateProduct(product.id, star)}
                            style={{ cursor: "pointer" }}
                          >
                            {star <= product.rating ? (
                              <StarFilled style={{ color: "#faad14" }} />
                            ) : (
                              <StarOutlined />
                            )}
                          </span>
                        ))}
                        {product.isOptimistic && product.rating > 0 && (
                          <Spin size="small" />
                        )}
                      </Space>,
                      <Button
                        type={product.inCart ? "default" : "primary"}
                        onClick={() => toggleCart(product.id)}
                      >
                        {product.inCart ? (
                          <Space>
                            <CheckCircleOutlined />
                            已加入购物车
                          </Space>
                        ) : (
                          <Space>
                            <ShoppingCartOutlined />
                            加入购物车
                          </Space>
                        )}
                        {product.isOptimistic && (
                          <Spin size="small" style={{ marginLeft: 4 }} />
                        )}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={product.name}
                      description={<Tag color="green">¥{product.price}</Tag>}
                    />
                  </List.Item>
                )}
              />

              <Alert
                className="mt-12"
                message="电商应用"
                description="在电商应用中，乐观更新可以使加入购物车、收藏商品等操作立即反馈，增强用户购物体验。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      <Divider orientation="left">实现原理</Divider>
      <Card title="乐观更新的工作原理" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            乐观更新是一种UI模式，它假设网络请求很可能会成功，因此先更新UI，再异步处理实际请求：
          </Paragraph>

          <Alert
            message="立即响应用户"
            description="不等待网络请求完成，立即更新界面，给用户即时反馈。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />

          <Alert
            message="后台处理请求"
            description="同时在后台发送实际请求，更新服务器状态。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />

          <Alert
            message="错误处理和回滚"
            description="如果请求失败，可以回滚到之前的状态并通知用户。"
            type="info"
            showIcon
          />

          <Paragraph className="mt-12">
            <pre>
              {`// 在React 18+中，useOptimistic是一个新的Hook
import { useOptimistic, useState } from 'react';

function TodoList() {
  // 实际状态
  const [todos, setTodos] = useState([
    { id: 1, text: '学习React', completed: false }
  ]);
  
  // 乐观状态 - 用于UI显示
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => {
      // 根据操作类型更新状态
      if (newTodo.action === 'add') {
        return [...currentTodos, { ...newTodo.todo, id: Date.now() }];
      } else if (newTodo.action === 'toggle') {
        return currentTodos.map(todo => 
          todo.id === newTodo.id 
            ? { ...todo, completed: !todo.completed } 
            : todo
        );
      }
      return currentTodos;
    }
  );
  
  async function handleAddTodo(text) {
    // 创建新任务对象
    const newTodo = { text, completed: false };
    
    // 乐观更新UI
    addOptimisticTodo({ action: 'add', todo: newTodo });
    
    try {
      // 发送网络请求
      const savedTodo = await saveTodoToServer(newTodo);
      
      // 更新实际状态
      setTodos(todos => [...todos, savedTodo]);
    } catch (error) {
      // 处理错误 - 可能需要通知用户并回滚状态
      alert('添加任务失败');
      setTodos(currentTodos => [...currentTodos]); // 触发重新同步
    }
  }

  // 组件其余部分...
}`}
            </pre>
          </Paragraph>

          <Paragraph>
            在目前版本的React中，可以使用useState和useEffect模拟实现乐观更新模式：
          </Paragraph>

          <pre>
            {`// 不使用useOptimistic的实现方式
import { useState, useEffect } from 'react';

function TodoList() {
  // 实际状态
  const [todos, setTodos] = useState([
    { id: 1, text: '学习React', completed: false }
  ]);
  
  // 乐观状态
  const [optimisticTodos, setOptimisticTodos] = useState(todos);
  
  // 同步实际状态到乐观状态
  useEffect(() => {
    setOptimisticTodos(todos);
  }, [todos]);
  
  async function handleAddTodo(text) {
    // 创建新任务对象
    const newTodo = { 
      id: Date.now(), // 临时ID
      text, 
      completed: false,
      isOptimistic: true // 标记为乐观更新
    };
    
    // 乐观更新UI
    setOptimisticTodos([...optimisticTodos, newTodo]);
    
    try {
      // 发送网络请求
      const savedTodo = await saveTodoToServer(newTodo);
      
      // 更新实际状态
      setTodos(todos => [...todos, savedTodo]);
    } catch (error) {
      // 处理错误 - 回滚到之前的状态
      setOptimisticTodos(todos);
      alert('添加任务失败');
    }
  }

  // 组件渲染显示optimisticTodos...
}`}
          </pre>
        </Space>
      </Card>

      <Divider orientation="left">使用场景与最佳实践</Divider>
      <Card className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="适用场景" key="1">
            <Space direction="vertical" className="w-full">
              <Alert
                message="社交媒体互动"
                description="点赞、评论、关注等社交互动功能，用户希望看到即时反馈。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="表单提交"
                description="提交表单后显示成功消息，同时在后台处理实际请求。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="电商操作"
                description="加入购物车、收藏商品、修改数量等操作，需要即时反馈。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="任务管理"
                description="创建、完成、删除任务等操作，用户希望立即看到结果。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>

          <TabPane tab="最佳实践" key="2">
            <Space direction="vertical" className="w-full">
              <Alert
                message="标记乐观状态"
                description="使用标志(如isOptimistic)标记乐观更新的项目，可以添加加载指示器或视觉提示。"
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="实现错误处理"
                description="始终处理网络请求失败的情况，提供回滚机制并通知用户。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="管理并发更新"
                description="处理多个乐观更新同时发生的情况，确保状态一致性。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="使用唯一标识符"
                description="为乐观创建的项分配临时ID，确保可以正确更新或回滚特定项。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>

          <TabPane tab="注意事项" key="3">
            <Space direction="vertical" className="w-full">
              <Alert
                message="并非所有操作都适合"
                description="对于关键操作(如付款)或成功率低的操作，应避免使用乐观更新或提供明确的加载状态。"
                type="error"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="数据一致性"
                description="在复杂应用中，多个乐观更新可能导致数据不一致，需要谨慎设计状态管理。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="误导用户风险"
                description="如果操作经常失败但UI先显示成功，可能会误导用户，应权衡使用。"
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />

              <Alert
                message="网络状态检测"
                description="考虑检测用户网络状态，在离线时提供更明确的反馈或禁用某些操作。"
                type="info"
                showIcon
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      <Divider orientation="left">与其他模式对比</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="乐观更新 vs 悲观更新"
            description="悲观更新在网络请求完成后才更新UI，安全但体验较差；乐观更新先更新UI再发送请求，体验好但需要处理失败情况。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />

          <Alert
            message="乐观更新 vs 加载状态"
            description="使用加载状态时，用户必须等待操作完成；乐观更新则立即反馈，同时可以用微妙的指示器表明后台仍在处理。"
            type="info"
            showIcon
            style={{ marginBottom: 8 }}
          />

          <Alert
            message="乐观更新 vs 本地缓存"
            description="本地缓存存储数据以减少网络请求；乐观更新仍执行网络请求，但不阻塞UI更新。两者可以结合使用，提供更好的离线体验。"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseOptimistic;
