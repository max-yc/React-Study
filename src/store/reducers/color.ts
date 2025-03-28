import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

export const Color = [
  {
    label: "品牌主色",
    value: "colorPrimary",
    color: "#1677ff",
  },
  {
    label: "组件容器背景色",
    value: "colorBgContainer",
    color: "#ffffff",
  },
  {
    label: "组件文字颜色",
    value: "colorText",
    color: "rgba(0, 0, 0, 0.88)",
  },
  {
    label: "组件文字颜色（深色背景上的文字）",
    value: "colorTextLightSolid",
    color: "#fff",
  },
  {
    label: "组件文字颜色（次要按钮文字颜色）",
    value: "colorTextBase",
    color: "rgba(0, 0, 0, 0.88)",
  },
];

// 为 slice state 定义一个类型
interface ColorState {
  value: typeof Color;
}

// 使用该类型定义初始 state
const initialState: ColorState = {
  value: Color,
};

export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColor: (state, action) => {
      state.value = state.value.map((item) => {
        if (item.value === action.payload.value) {
          return { ...item, color: action.payload.color };
        }
        return item;
      });
    },
    updateColor: (state, action) => {
      state.value = action.payload;
    },
  },
});

// 每个 case reducer 函数会生成对应的 Action creators
export const { setColor, updateColor } = colorSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectColor = (state: RootState) => state.color.value;

export default colorSlice.reducer;
