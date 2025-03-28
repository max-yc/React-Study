import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  Typography,
  Card,
  Button,
  Divider,
  Alert,
  Space,
  Select,
  Radio,
  Input,
  ColorPicker,
} from "antd";
import {
  SettingOutlined,
  UserOutlined,
  BgColorsOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// 1. 基础主题上下文
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// 2. 多上下文组合
interface UserContextType {
  username: string;
  role: "admin" | "user" | "guest";
  setUsername: (name: string) => void;
  setRole: (role: "admin" | "user" | "guest") => void;
}

const UserContext = createContext<UserContextType>({
  username: "",
  role: "guest",
  setUsername: () => {},
  setRole: () => {},
});

// 3. 多级上下文传递
interface AppSettingsContextType {
  language: "zh" | "en";
  fontSize: number;
  colorMode: string;
  setLanguage: (lang: "zh" | "en") => void;
  setFontSize: (size: number) => void;
  setColorMode: (color: string) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType>({
  language: "zh",
  fontSize: 14,
  colorMode: "#1890ff",
  setLanguage: () => {},
  setFontSize: () => {},
  setColorMode: () => {},
});

// 基础主题按钮组件
const ThemedButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      type="primary"
      style={{
        backgroundColor: theme === "dark" ? "#333" : undefined,
        borderColor: theme === "dark" ? "#333" : undefined,
      }}
      onClick={toggleTheme}
    >
      当前是{theme === "dark" ? "深色" : "浅色"}主题，点击切换
    </Button>
  );
};

// 主题包装的卡片组件
const ThemedCard = ({ children }: { children: ReactNode }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Card
      style={{
        backgroundColor: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        border: `1px solid ${theme === "dark" ? "#444" : "#eee"}`,
      }}
    >
      {children}
    </Card>
  );
};

// 用户信息组件
const UserProfile = () => {
  const { username, role, setUsername, setRole } = useContext(UserContext);
  const { theme } = useContext(ThemeContext); // 同时使用多个上下文

  return (
    <Space direction="vertical" className="w-full">
      <div className="flex items-center gap-12 mb-8">
        <Text>当前用户: </Text>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="设置用户名"
          prefix={<UserOutlined />}
          style={{ width: 200 }}
        />
      </div>

      <div className="flex items-center gap-12">
        <Text>当前角色: </Text>
        <Select value={role} onChange={setRole} style={{ width: 200 }}>
          <Option value="admin">管理员</Option>
          <Option value="user">普通用户</Option>
          <Option value="guest">访客</Option>
        </Select>
      </div>

      <Alert
        className="mt-12"
        message={`用户: ${username || "未设置"}, 角色: ${role}, 主题: ${theme}`}
        type="info"
      />
    </Space>
  );
};

// 多层嵌套组件
const Header = () => {
  const { theme } = useContext(ThemeContext);
  const { username, role } = useContext(UserContext);

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: theme === "dark" ? "#333" : "#f0f2f5",
        color: theme === "dark" ? "#fff" : "#000",
      }}
      className="mb-16"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Title
            level={4}
            style={{ margin: 0, color: theme === "dark" ? "#fff" : undefined }}
          >
            应用标题
          </Title>
        </div>
        <div>
          {username ? (
            <Text style={{ color: theme === "dark" ? "#fff" : undefined }}>
              欢迎, {username} ({role})
            </Text>
          ) : (
            <Text style={{ color: theme === "dark" ? "#fff" : undefined }}>
              未登录
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

// 设置面板组件
const SettingsPanel = () => {
  const {
    language,
    fontSize,
    colorMode,
    setLanguage,
    setFontSize,
    setColorMode,
  } = useContext(AppSettingsContext);
  const { theme } = useContext(ThemeContext);

  return (
    <Card
      title={
        <>
          <SettingOutlined /> 应用设置
        </>
      }
      style={{
        backgroundColor: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      }}
    >
      <Space direction="vertical" className="w-full">
        <div className="flex items-center justify-between">
          <Space>
            <GlobalOutlined />
            <Text style={{ color: theme === "dark" ? "#fff" : undefined }}>
              语言:
            </Text>
          </Space>
          <Radio.Group
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <Radio.Button value="zh">中文</Radio.Button>
            <Radio.Button value="en">English</Radio.Button>
          </Radio.Group>
        </div>

        <Divider
          style={{
            margin: "12px 0",
            borderColor: theme === "dark" ? "#444" : undefined,
          }}
        />

        <div className="flex items-center justify-between">
          <Text style={{ color: theme === "dark" ? "#fff" : undefined }}>
            字体大小:
          </Text>
          <Select
            value={fontSize}
            onChange={setFontSize}
            style={{ width: 120 }}
          >
            <Option value={12}>小 (12px)</Option>
            <Option value={14}>中 (14px)</Option>
            <Option value={16}>大 (16px)</Option>
            <Option value={18}>超大 (18px)</Option>
          </Select>
        </div>

        <Divider
          style={{
            margin: "12px 0",
            borderColor: theme === "dark" ? "#444" : undefined,
          }}
        />

        <div className="flex items-center justify-between">
          <Space>
            <BgColorsOutlined />
            <Text style={{ color: theme === "dark" ? "#fff" : undefined }}>
              主题色:
            </Text>
          </Space>
          <ColorPicker
            value={colorMode}
            onChange={(color) => setColorMode(color.toHexString())}
          />
        </div>
      </Space>
    </Card>
  );
};

// 内容区域组件
const Content = () => {
  const { language, fontSize, colorMode } = useContext(AppSettingsContext);
  const { theme } = useContext(ThemeContext);

  const content = {
    zh: "这是一段示例文本，展示上下文中的设置如何影响UI。",
    en: "This is a sample text to demonstrate how context settings affect the UI.",
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
        fontSize: `${fontSize}px`,
        borderLeft: `4px solid ${colorMode}`,
        margin: "16px 0",
      }}
    >
      {content[language]}
    </div>
  );
};

// 主应用
const UseContext = () => {
  // 主题状态
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // 用户状态
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<"admin" | "user" | "guest">("guest");

  // 应用设置状态
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [fontSize, setFontSize] = useState<number>(14);
  const [colorMode, setColorMode] = useState<string>("#1890ff");

  // 回调函数
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  // 创建提供者值
  const themeContextValue = {
    theme: currentTheme,
    toggleTheme,
  };

  const userContextValue = {
    username,
    role,
    setUsername,
    setRole: (newRole: "admin" | "user" | "guest") => setRole(newRole),
  };

  const settingsContextValue = {
    language,
    fontSize,
    colorMode,
    setLanguage: (lang: "zh" | "en") => setLanguage(lang),
    setFontSize: (size: number) => setFontSize(size),
    setColorMode: (color: string) => setColorMode(color),
  };

  return (
    <div className="p-24">
      <Title level={2}>useContext Hook</Title>
      <Paragraph>
        useContext 可以帮助组件获取由父组件提供的上下文数据，避免通过 props
        层层传递。
      </Paragraph>

      <Divider orientation="left">基础用法</Divider>
      <Card title="简单主题上下文" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            最基本的 useContext 用法是创建一个上下文并在组件树中共享状态。
          </Paragraph>

          <ThemeContext.Provider value={themeContextValue}>
            <div className="py-16">
              <ThemedCard>
                <Paragraph
                  style={{ color: currentTheme === "dark" ? "#fff" : "#000" }}
                >
                  这是一个使用 ThemeContext 的卡片，样式会随着主题变化。
                </Paragraph>
                <ThemedButton />
              </ThemedCard>
            </div>
          </ThemeContext.Provider>

          <Alert
            message="Context 的基本用法"
            description="1. 使用 createContext 创建上下文 2. 使用 Provider 提供值 3. 使用 useContext 在子组件中获取值"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">多上下文组合</Divider>
      <Card title="组合多个上下文" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            在实际应用中，我们通常需要多个上下文来管理不同类型的状态。
          </Paragraph>

          <ThemeContext.Provider value={themeContextValue}>
            <UserContext.Provider value={userContextValue}>
              <div className="py-16">
                <UserProfile />
                <Divider dashed />
                <div className="mt-16">
                  <Button onClick={toggleTheme}>
                    切换主题 (当前: {currentTheme})
                  </Button>
                </div>
              </div>
            </UserContext.Provider>
          </ThemeContext.Provider>

          <Alert
            message="多个 Context 的组合使用"
            description="一个组件可以同时使用多个 Context，只需要调用多次 useContext"
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">复杂应用示例</Divider>
      <Card title="多层次上下文传递" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            在大型应用中，Context 可以用于在深层组件树中共享全局状态和设置。
          </Paragraph>

          <div className="border rounded overflow-hidden">
            <ThemeContext.Provider value={themeContextValue}>
              <UserContext.Provider value={userContextValue}>
                <AppSettingsContext.Provider value={settingsContextValue}>
                  <Header />
                  <div className="px-16 pb-16">
                    <div className="flex gap-16">
                      <div className="w-1/3">
                        <SettingsPanel />
                      </div>
                      <div className="w-2/3">
                        <Card
                          title="内容区域"
                          style={{
                            backgroundColor:
                              currentTheme === "dark" ? "#222" : "#fff",
                            color: currentTheme === "dark" ? "#fff" : "#000",
                          }}
                        >
                          <Content />
                          <Paragraph
                            style={{
                              color:
                                currentTheme === "dark" ? "#fff" : undefined,
                            }}
                          >
                            在这个示例中，多个上下文协同工作，影响整个应用的各个部分。
                          </Paragraph>
                        </Card>
                      </div>
                    </div>
                  </div>
                </AppSettingsContext.Provider>
              </UserContext.Provider>
            </ThemeContext.Provider>
          </div>

          <Alert
            message="复杂应用中的 Context 用法"
            description="在复杂应用中可以嵌套多个 Context Provider，并在各层级的组件中获取需要的上下文数据"
            type="success"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="性能考虑"
            description="当 Context 值变化时，使用该 Context 的所有子组件都会重新渲染。对于频繁变化的值，考虑拆分 Context 或使用状态提升。"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="默认值"
            description="createContext 的默认值只在组件无法找到匹配的 Provider 时使用。不要指望用它来传递更新。"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="Provider 嵌套"
            description="内层的 Provider 会覆盖外层的同类型 Provider 的值，可利用这一特性实现不同层级的默认值。"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="避免过度使用"
            description="Context 主要用于共享全局或半全局的状态，不要用它来替代所有的 props 传递，这会使组件失去复用性。"
            type="warning"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseContext;
