interface BackgroundState {
  // 根据实际需要的状态属性定义接口
  [key: string]: unknown;
}

const updateBackgroundState = async (newState: BackgroundState) => {
  try {
    await chrome.runtime.sendMessage({
      type: "UPDATE_STATE",
      payload: newState,
    });
  } catch (error) {
    console.error("更新状态失败:", error);
  }
};

const getBackgroundState = async () => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "GET_STATE",
    });
    return response.state;
  } catch (error) {
    console.error("获取状态失败:", error);
    return null;
  }
};

export { updateBackgroundState, getBackgroundState };
