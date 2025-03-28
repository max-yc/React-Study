import { useReducer, useState } from "react";
import {
  Typography,
  Divider,
  Card,
  Button,
  Alert,
  Space,
  Input,
  Tabs,
  Switch,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// 简单计数器 reducer
type CounterState = {
  count: number;
};

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "incrementBy"; payload: number };

const counterInitialState: CounterState = { count: 0 };

function counterReducer(
  state: CounterState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return counterInitialState;
    case "incrementBy":
      return { count: state.count + action.payload };
    default:
      return state;
  }
}

// 复杂表单 reducer
type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAgree: boolean;
  errors: {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    isAgree?: string;
  };
  isSubmitting: boolean;
  isValid: boolean;
};

type FormAction =
  | { type: "updateField"; field: string; value: string | boolean }
  | { type: "validateForm" }
  | { type: "resetForm" }
  | { type: "setSubmitting"; value: boolean };

const formInitialState: FormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  isAgree: false,
  errors: {},
  isSubmitting: false,
  isValid: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "updateField":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "validateForm": {
      const errors: FormState["errors"] = {};

      // 用户名验证
      if (!state.username.trim()) {
        errors.username = "用户名不能为空";
      } else if (state.username.length < 3) {
        errors.username = "用户名长度至少为3个字符";
      }

      // 邮箱验证
      if (!state.email.trim()) {
        errors.email = "邮箱不能为空";
      } else if (!/\S+@\S+\.\S+/.test(state.email)) {
        errors.email = "邮箱格式不正确";
      }

      // 密码验证
      if (!state.password) {
        errors.password = "密码不能为空";
      } else if (state.password.length < 6) {
        errors.password = "密码长度至少为6个字符";
      }

      // 确认密码验证
      if (state.password !== state.confirmPassword) {
        errors.confirmPassword = "两次输入的密码不一致";
      }

      // 协议验证
      if (!state.isAgree) {
        errors.isAgree = "请同意使用条款";
      }

      const isValid = Object.keys(errors).length === 0;

      return {
        ...state,
        errors,
        isValid,
      };
    }

    case "resetForm":
      return formInitialState;

    case "setSubmitting":
      return {
        ...state,
        isSubmitting: action.value,
      };

    default:
      return state;
  }
}

// 任务列表 reducer
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodosState = {
  todos: Todo[];
  nextId: number;
  filter: "all" | "active" | "completed";
};

type TodosAction =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "delete"; id: number }
  | { type: "clearCompleted" }
  | { type: "setFilter"; filter: "all" | "active" | "completed" };

const todosInitialState: TodosState = {
  todos: [],
  nextId: 1,
  filter: "all",
};

function todosReducer(state: TodosState, action: TodosAction): TodosState {
  switch (action.type) {
    case "add":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: state.nextId, text: action.text, completed: false },
        ],
        nextId: state.nextId + 1,
      };

    case "toggle":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        ),
      };

    case "delete":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };

    case "clearCompleted":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    case "setFilter":
      return {
        ...state,
        filter: action.filter,
      };

    default:
      return state;
  }
}

const UseReducer = () => {
  // 简单计数器示例
  const [counterState, counterDispatch] = useReducer(
    counterReducer,
    counterInitialState
  );
  const [incrementAmount, setIncrementAmount] = useState(5);

  // 表单示例
  const [formState, formDispatch] = useReducer(formReducer, formInitialState);

  // 任务列表示例
  const [todosState, todosDispatch] = useReducer(
    todosReducer,
    todosInitialState
  );
  const [newTodo, setNewTodo] = useState("");

  // 表单处理函数
  const handleFieldChange = (field: string, value: string | boolean) => {
    formDispatch({ type: "updateField", field, value });
  };

  // 表单提交
  const handleSubmitForm = () => {
    formDispatch({ type: "validateForm" });
    formDispatch({ type: "setSubmitting", value: true });

    // 模拟表单提交
    setTimeout(() => {
      formDispatch({ type: "setSubmitting", value: false });
      if (formState.isValid) {
        alert("表单提交成功！");
        formDispatch({ type: "resetForm" });
      }
    }, 1000);
  };

  // 任务列表处理函数
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      todosDispatch({ type: "add", text: newTodo });
      setNewTodo("");
    }
  };

  const filteredTodos = todosState.todos.filter((todo) => {
    if (todosState.filter === "active") return !todo.completed;
    if (todosState.filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="p-24">
      <Title level={2}>useReducer Hook</Title>
      <Paragraph>
        useReducer 是 useState
        的替代方案，适用于复杂的状态逻辑，特别是当下一个状态依赖于前一个状态，或者状态更新逻辑比较复杂时。
      </Paragraph>

      <Divider orientation="left">基础用法</Divider>
      <Card title="简单计数器" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Text className="text-xl mb-8">计数: {counterState.count}</Text>
          <Space>
            <Button onClick={() => counterDispatch({ type: "decrement" })}>
              减少
            </Button>
            <Button
              onClick={() => counterDispatch({ type: "increment" })}
              type="primary"
            >
              增加
            </Button>
            <Button onClick={() => counterDispatch({ type: "reset" })} danger>
              重置
            </Button>
          </Space>

          <div className="mt-12 flex items-center gap-8">
            <Input
              className="mr-10"
              type="number"
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(Number(e.target.value))}
              style={{ width: 100 }}
            />
            <Button
              onClick={() =>
                counterDispatch({
                  type: "incrementBy",
                  payload: incrementAmount,
                })
              }
            >
              增加指定数量
            </Button>
          </div>

          <Alert
            className="mt-12"
            message="基础reducer模式"
            description="使用action type和reducer函数来处理状态更新。与Redux类似，但仅在组件内部使用。"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">复杂状态管理</Divider>
      <Card title="表单处理" className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="表单" key="1">
            <form
              className="mb-12"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
            >
              <div className="mb-12">
                <label className="block mb-2">用户名:</label>
                <Input
                  value={formState.username}
                  onChange={(e) =>
                    handleFieldChange("username", e.target.value)
                  }
                  status={formState.errors.username ? "error" : ""}
                />
                {formState.errors.username && (
                  <Text type="danger">{formState.errors.username}</Text>
                )}
              </div>

              <div className="mb-12">
                <label className="block mb-2">电子邮件:</label>
                <Input
                  value={formState.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  status={formState.errors.email ? "error" : ""}
                />
                {formState.errors.email && (
                  <Text type="danger">{formState.errors.email}</Text>
                )}
              </div>

              <div className="mb-12">
                <label className="block mb-2">密码:</label>
                <Input.Password
                  value={formState.password}
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value)
                  }
                  status={formState.errors.password ? "error" : ""}
                />
                {formState.errors.password && (
                  <Text type="danger">{formState.errors.password}</Text>
                )}
              </div>

              <div className="mb-12">
                <label className="block mb-2">确认密码:</label>
                <Input.Password
                  value={formState.confirmPassword}
                  onChange={(e) =>
                    handleFieldChange("confirmPassword", e.target.value)
                  }
                  status={formState.errors.confirmPassword ? "error" : ""}
                />
                {formState.errors.confirmPassword && (
                  <Text type="danger">{formState.errors.confirmPassword}</Text>
                )}
              </div>

              <div className="mb-12">
                <Switch
                  checked={formState.isAgree}
                  onChange={(checked) => handleFieldChange("isAgree", checked)}
                />
                <span className="ml-8">我同意使用条款</span>
                {formState.errors.isAgree && (
                  <div>
                    <Text type="danger">{formState.errors.isAgree}</Text>
                  </div>
                )}
              </div>

              <div className="mt-16">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={formState.isSubmitting}
                >
                  提交
                </Button>
                <Button
                  onClick={() => formDispatch({ type: "resetForm" })}
                  className="ml-8"
                >
                  重置
                </Button>
              </div>
            </form>
          </TabPane>
          <TabPane tab="状态" key="2">
            <pre className="p-12 bg-gray-100 rounded overflow-auto max-h-96">
              {JSON.stringify(formState, null, 2)}
            </pre>
          </TabPane>
        </Tabs>

        <Alert
          className="mt-12"
          message="复杂表单处理"
          description="使用useReducer管理表单状态、验证和提交，使代码更加组织化和可维护"
          type="info"
          showIcon
        />
      </Card>

      <Card title="任务列表" className="mb-16">
        <Tabs defaultActiveKey="1">
          <TabPane tab="任务列表" key="1">
            <div className="mb-12 flex">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="添加新任务..."
                onPressEnter={handleAddTodo}
              />
              <Button onClick={handleAddTodo} type="primary" className="ml-8">
                添加
              </Button>
            </div>

            <div className="mb-12">
              <Space>
                <Button
                  type={todosState.filter === "all" ? "primary" : "default"}
                  onClick={() =>
                    todosDispatch({ type: "setFilter", filter: "all" })
                  }
                >
                  全部 ({todosState.todos.length})
                </Button>
                <Button
                  type={todosState.filter === "active" ? "primary" : "default"}
                  onClick={() =>
                    todosDispatch({ type: "setFilter", filter: "active" })
                  }
                >
                  进行中 ({todosState.todos.filter((t) => !t.completed).length})
                </Button>
                <Button
                  type={
                    todosState.filter === "completed" ? "primary" : "default"
                  }
                  onClick={() =>
                    todosDispatch({ type: "setFilter", filter: "completed" })
                  }
                >
                  已完成 ({todosState.todos.filter((t) => t.completed).length})
                </Button>
                <Button
                  danger
                  onClick={() => todosDispatch({ type: "clearCompleted" })}
                  disabled={!todosState.todos.some((t) => t.completed)}
                >
                  清除已完成
                </Button>
              </Space>
            </div>

            {filteredTodos.length > 0 ? (
              <ul className="pl-0">
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className="flex-between mb-4 p-4">
                    <div className="flex">
                      <Switch
                        checked={todo.completed}
                        onChange={() =>
                          todosDispatch({ type: "toggle", id: todo.id })
                        }
                      />
                      <span
                        className={`ml-8 ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      size="small"
                      danger
                      onClick={() =>
                        todosDispatch({ type: "delete", id: todo.id })
                      }
                    >
                      删除
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Text className="text-gray-500">暂无任务</Text>
            )}
          </TabPane>
          <TabPane tab="状态" key="2">
            <pre className="p-12 bg-gray-100 rounded overflow-auto max-h-96">
              {JSON.stringify(todosState, null, 2)}
            </pre>
          </TabPane>
        </Tabs>

        <Alert
          className="mt-12"
          message="TodoList示例"
          description="使用useReducer实现具有筛选、切换和删除功能的TodoList，展示了如何处理更复杂的UI状态"
          type="info"
          showIcon
        />
      </Card>

      <Divider orientation="left">useReducer注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="与useState对比"
            description="当状态逻辑复杂或状态之间有依赖关系时，使用useReducer更合适；而对于简单的状态管理，useState更为简洁"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="模式与Redux"
            description="useReducer使用与Redux相同的reducer模式，但仅局限于组件内部的状态管理，不提供全局状态存储"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="性能优化"
            description="使用useReducer可以避免在一个事件处理函数中调用多个setState，有助于性能优化和避免意外的渲染"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="dispatch稳定性"
            description="dispatch函数引用永远是稳定的，不会在重新渲染时改变，可以安全地传递给子组件而无需使用useCallback"
            type="success"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseReducer;
