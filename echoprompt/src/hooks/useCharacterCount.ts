import { useState, useEffect } from "react";

export function useCharacterCount(value: string): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(value.trim().length);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return count;
}
