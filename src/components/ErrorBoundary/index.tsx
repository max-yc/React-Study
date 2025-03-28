import React from "react";

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

// https://github.com/bvaughn/react-error-boundary (github错误边界组件)
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  constructor(
    props: React.PropsWithChildren<{ fallbackRender: FallbackRender }>
  ) {
    super(props);
    this.state = {
      error: null,
    };
  }

  // 当子组件抛出异常，这里会接收异常
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    const { fallbackRender, children } = this.props;
    const { error } = this.state;
    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
