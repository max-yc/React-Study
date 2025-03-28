declare global {
  interface Window {
    $broadcast: {
      broadcast: (event: string) => void;
    };
    env: string;
    eval: (code: string) => void;
  }
}

export {};
