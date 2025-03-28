import { Typography } from "antd";

const ErrorBox: React.FC<{ error: unknown }> = ({ error }) => {
  // 类型守卫
  const isError = (value: unknown): value is Error =>
    typeof value === "object" && value !== null && "message" in value;

  if (isError(error)) {
    return <Typography.Text type={"danger"}>{error.message}</Typography.Text>;
  }
  return null;
};

export default ErrorBox;
