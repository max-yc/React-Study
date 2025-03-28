import { Button, Input, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const Demo = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([1]);
  const [data, setData] = useState(0);

  useEffect(() => {
    setLoading(true);
    setList([]);
    handleRequest();
  }, []);

  const handleRequest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setList((prev) => [...prev, prev.length + 1]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    setData(data + 1);
  };

  useEffect(() => {
    if (data > 10) {
      handleRequest();
    }
  }, [data]);

  useEffect(() => {
    console.log("🚀 ~ list:", list);
  }, [list]);

  return (
    <div>
      <Text>{data}</Text>
      <Text>{value}</Text>
      <Button onClick={handleClick}>点击</Button>
      <Input onChange={handleChange} />
      <Spin spinning={loading}>
        <div
          className="mt-20"
          style={{ width: "100%", height: "200px", backgroundColor: "blue" }}
        ></div>
      </Spin>
    </div>
  );
};

export default Demo;
