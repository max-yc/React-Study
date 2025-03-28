import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Typography,
  Card,
  Button,
  Divider,
  Alert,
  Space,
  Input,
  Tabs,
  InputRef,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

// 基础示例部分
// 定义子组件引用类型
type BasicChildRef = {
  focus: () => void;
  setValue: (value: string) => void;
};

// 子组件
const BasicChildInput = forwardRef<BasicChildRef, { placeholder?: string }>(
  (props, ref) => {
    const inputRef = useRef<InputRef>(null);
    const [value, setValue] = useState("");

    // 使用useImperativeHandle向父组件暴露指定的方法
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      setValue: (newValue: string) => {
        setValue(newValue);
      },
    }));

    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={props.placeholder || "请输入..."}
      />
    );
  }
);

// 函数防抖示例
type DebouncedInputRef = {
  focus: () => void;
  clear: () => void;
  getValue: () => string;
};

const DebouncedInput = forwardRef<
  DebouncedInputRef,
  {
    onChange: (value: string) => void;
    debounceTime?: number;
  }
>((props, ref) => {
  const { onChange, debounceTime = 500 } = props;
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清除旧的定时器
  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 组件销毁时清除定时器
  useEffect(() => {
    return () => clearTimer();
  }, []);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    clearTimer();

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceTime);
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      setValue("");
      onChange("");
    },
    getValue: () => value,
  }));

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      placeholder="防抖输入 (输入停止后触发回调)"
    />
  );
});

// 带验证逻辑的表单元素
type ValidatedInputRef = {
  focus: () => void;
  validate: () => boolean;
  getValue: () => string;
  reset: () => void;
};

const ValidatedInput = forwardRef<
  ValidatedInputRef,
  {
    label: string;
    rules?: {
      required?: boolean;
      minLength?: number;
      pattern?: RegExp;
      message?: string;
    };
  }
>((props, ref) => {
  const { label, rules } = props;
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // 验证逻辑
  const validate = (): boolean => {
    if (!rules) return true;

    if (rules.required && !value) {
      setError(`${label}不能为空`);
      return false;
    }

    if (rules.minLength && value.length < rules.minLength) {
      setError(`${label}长度不能少于${rules.minLength}个字符`);
      return false;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      setError(rules.message || `${label}格式不正确`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleBlur = () => {
    setTouched(true);
    validate();
  };

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    validate,
    getValue: () => value,
    reset: () => {
      setValue("");
      setError(null);
      setTouched(false);
    },
  }));

  return (
    <div className="mb-16">
      <div className="mb-4">{label}:</div>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        status={touched && error ? "error" : ""}
      />
      {touched && error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
});

// 复杂组件 - 自定义视频播放器
type VideoPlayerRef = {
  play: () => void;
  pause: () => void;
  restart: () => void;
  setVolume: (volume: number) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  seek: (time: number) => void;
};

const VideoPlayer = forwardRef<VideoPlayerRef, { src: string }>(
  (props, ref) => {
    const { src } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // 处理视频事件
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("ended", handleEnded);
      };
    }, []);

    // 内部方法
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    };

    const pauseVideo = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    const restartVideo = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        playVideo();
      }
    };

    const changeVolume = (value: number) => {
      if (videoRef.current) {
        videoRef.current.volume = value;
        setVolumeState(value);
      }
    };

    const seekTo = (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    };

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      play: playVideo,
      pause: pauseVideo,
      restart: restartVideo,
      setVolume: changeVolume,
      getDuration: () => duration,
      getCurrentTime: () => currentTime,
      seek: seekTo,
    }));

    return (
      <div>
        <video
          ref={videoRef}
          src={src}
          style={{ width: "100%", maxHeight: "200px", backgroundColor: "#000" }}
          onClick={() => (isPlaying ? pauseVideo() : playVideo())}
        />
        <div className="mt-8 flex gap-8">
          <Button onClick={() => (isPlaying ? pauseVideo() : playVideo())}>
            {isPlaying ? "暂停" : "播放"}
          </Button>
          <Button onClick={restartVideo}>重新开始</Button>
        </div>
        <div className="mt-4">
          <Text>
            当前时间: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </Text>
        </div>
      </div>
    );
  }
);

// 父组件
const UseImperativeHandle = () => {
  // 基础示例
  const basicChildRef = useRef<BasicChildRef>(null);

  const handleFocus = () => {
    basicChildRef.current?.focus();
  };

  const handleSetValue = () => {
    basicChildRef.current?.setValue("通过父组件设置的值");
  };

  // 防抖输入示例
  const debouncedInputRef = useRef<DebouncedInputRef>(null);
  const [debouncedValue, setDebouncedValue] = useState("");

  const handleDebouncedInputChange = (value: string) => {
    setDebouncedValue(value);
  };

  const handleGetDebouncedValue = () => {
    if (debouncedInputRef.current) {
      alert(`当前值: ${debouncedInputRef.current.getValue()}`);
    }
  };

  // 表单验证示例
  const usernameRef = useRef<ValidatedInputRef>(null);
  const emailRef = useRef<ValidatedInputRef>(null);
  const passwordRef = useRef<ValidatedInputRef>(null);

  const handleValidateForm = () => {
    const isUsernameValid = usernameRef.current?.validate() || false;
    const isEmailValid = emailRef.current?.validate() || false;
    const isPasswordValid = passwordRef.current?.validate() || false;

    if (isUsernameValid && isEmailValid && isPasswordValid) {
      const formData = {
        username: usernameRef.current?.getValue(),
        email: emailRef.current?.getValue(),
        password: passwordRef.current?.getValue(),
      };

      alert(`表单验证通过!\n${JSON.stringify(formData, null, 2)}`);
    } else {
      alert("表单验证失败，请检查输入!");
    }
  };

  const handleResetForm = () => {
    usernameRef.current?.reset();
    emailRef.current?.reset();
    passwordRef.current?.reset();
  };

  // 视频播放器示例
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const handleVideoPlay = () => {
    videoPlayerRef.current?.play();
  };

  const handleVideoPause = () => {
    videoPlayerRef.current?.pause();
  };

  const handleVideoRestart = () => {
    videoPlayerRef.current?.restart();
  };

  const handleVideoSeek = () => {
    if (videoPlayerRef.current) {
      const duration = videoPlayerRef.current.getDuration();
      videoPlayerRef.current.seek(duration / 2); // 跳转到视频中间
    }
  };

  return (
    <div className="p-24">
      <Title level={2}>useImperativeHandle Hook</Title>
      <Paragraph>
        useImperativeHandle 允许父组件通过 ref
        调用子组件中的特定函数，同时保持组件的封装性，只暴露必要的功能。
      </Paragraph>

      <Divider orientation="left">基础用法</Divider>
      <Card title="暴露子组件方法" className="mb-16">
        <Space direction="vertical" className="w-full">
          <Paragraph>
            最基本的用法是让父组件可以访问子组件的某些方法，同时保持良好的封装性。
          </Paragraph>

          <BasicChildInput
            ref={basicChildRef}
            placeholder="点击按钮聚焦或设置值"
          />

          <div className="mt-8">
            <Space>
              <Button onClick={handleFocus} type="primary">
                聚焦输入框
              </Button>
              <Button onClick={handleSetValue}>设置输入框的值</Button>
            </Space>
          </div>

          <Alert
            className="mt-12"
            message="基本使用模式"
            description={
              <ol className="mb-0 mt-0 pl-16">
                <li>使用 forwardRef 创建接收 ref 的组件</li>
                <li>
                  在子组件内部使用 useImperativeHandle
                  自定义暴露给父组件的实例值
                </li>
                <li>父组件通过 ref.current 访问这些方法</li>
              </ol>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Divider orientation="left">实际应用</Divider>
      <Tabs defaultActiveKey="1">
        <TabPane tab="防抖输入框" key="1">
          <Card className="mb-16">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                构建一个带防抖功能的输入框，只暴露必要的API给父组件。
              </Paragraph>

              <DebouncedInput
                ref={debouncedInputRef}
                onChange={handleDebouncedInputChange}
                debounceTime={800}
              />

              <div className="mt-8">
                <Text>防抖后的值: {debouncedValue}</Text>
              </div>

              <div className="mt-8">
                <Space>
                  <Button onClick={() => debouncedInputRef.current?.focus()}>
                    聚焦
                  </Button>
                  <Button onClick={() => debouncedInputRef.current?.clear()}>
                    清空
                  </Button>
                  <Button onClick={handleGetDebouncedValue}>获取当前值</Button>
                </Space>
              </div>

              <Alert
                className="mt-12"
                message="实用功能封装"
                description="useImperativeHandle 可以将复杂逻辑隐藏在组件内部，只暴露简洁的API，如防抖逻辑"
                type="info"
                showIcon
              />
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="表单验证" key="2">
          <Card className="mb-16">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                通过 useImperativeHandle
                实现的自定义表单验证组件，父组件可以触发验证。
              </Paragraph>

              <div className="py-8">
                <ValidatedInput
                  ref={usernameRef}
                  label="用户名"
                  rules={{ required: true, minLength: 3 }}
                />

                <ValidatedInput
                  ref={emailRef}
                  label="邮箱"
                  rules={{
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "请输入有效的邮箱地址",
                  }}
                />

                <ValidatedInput
                  ref={passwordRef}
                  label="密码"
                  rules={{ required: true, minLength: 6 }}
                />
              </div>

              <Space>
                <Button type="primary" onClick={handleValidateForm}>
                  验证表单
                </Button>
                <Button onClick={handleResetForm}>重置表单</Button>
              </Space>

              <Alert
                className="mt-12"
                message="复杂验证逻辑"
                description="父组件可以触发子组件的验证方法，而不需要了解具体的验证细节，保持了关注点分离"
                type="success"
                showIcon
              />
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="媒体控制" key="3">
          <Card className="mb-16">
            <Space direction="vertical" className="w-full">
              <Paragraph>
                通过 useImperativeHandle 控制视频播放器，暴露丰富的媒体控制API。
              </Paragraph>

              <VideoPlayer
                ref={videoPlayerRef}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              />

              <div className="mt-16">
                <Space>
                  <Button onClick={handleVideoPlay}>播放</Button>
                  <Button onClick={handleVideoPause}>暂停</Button>
                  <Button onClick={handleVideoRestart}>重新播放</Button>
                  <Button onClick={handleVideoSeek}>跳到中间</Button>
                  <Button
                    onClick={() => videoPlayerRef.current?.setVolume(0.2)}
                  >
                    降低音量
                  </Button>
                </Space>
              </div>

              <Alert
                className="mt-12"
                message="媒体控制案例"
                description="父组件可以通过简单的API控制复杂的媒体播放器，而不需要直接操作DOM或了解内部实现"
                type="info"
                showIcon
              />
            </Space>
          </Card>
        </TabPane>
      </Tabs>

      <Divider orientation="left">注意事项</Divider>
      <Card className="mb-16">
        <Space direction="vertical" className="w-full">
          <Alert
            message="避免过度使用"
            description="不要通过 useImperativeHandle 暴露过多方法。React 推荐使用自上而下的数据流，尽量减少使用 ref 操作组件。"
            type="warning"
            showIcon
            className="mb-8"
          />
          <Alert
            message="性能考虑"
            description="useImperativeHandle 的第二个参数（工厂函数）如果每次渲染都创建新对象，可能导致不必要的重渲染。可以使用 useCallback 优化。"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="使用场景"
            description="适合用于需要命令式API的场景，如表单元素控制、媒体播放器、动画触发等，避免在普通组件交互中过度使用。"
            type="info"
            showIcon
            className="mb-8"
          />
          <Alert
            message="依赖项更新"
            description="useImperativeHandle 接受第三个参数作为依赖数组，类似于 useEffect，只有当依赖项变化时才会更新暴露的方法。"
            type="success"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default UseImperativeHandle;
