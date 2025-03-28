import { v1, v3, v4, v5, v6, v7, NIL, MAX } from "uuid";
import { useState, useCallback } from "react";

type UUIDVersion = "nil" | "max" | "v1" | "v3" | "v4" | "v5" | "v6" | "v7";

interface UUIDOptions {
  version?: UUIDVersion;
  namespace?: string; // 用于 v3 和 v5
  name?: string; // 用于 v3 和 v5
}

/**
 * 生成并管理UUID的Hook
 * @param options - UUID 配置选项
 * @returns [string, () => void] - 返回当前UUID和重新生成UUID的函数
 */
export const useUUID = (options: UUIDOptions = {}): [string, () => void] => {
  const generateUUID = useCallback(() => {
    const { version = "v4", namespace, name } = options;

    switch (version) {
      case "nil":
        return NIL;
      case "max":
        return MAX;
      case "v1":
        return v1();
      case "v3":
        if (!namespace || !name)
          throw new Error("v3 需要 namespace 和 name 参数");
        return v3(name, namespace);
      case "v4":
        return v4();
      case "v5":
        if (!namespace || !name)
          throw new Error("v5 需要 namespace 和 name 参数");
        return v5(name, namespace);
      case "v6":
        return v6();
      case "v7":
        return v7();
      default:
        return v4();
    }
  }, [options]);

  const [uuid, setUUID] = useState<string>(generateUUID());

  const regenerateUUID = useCallback(() => {
    setUUID(generateUUID());
  }, [generateUUID]);

  return [uuid, regenerateUUID];
};
