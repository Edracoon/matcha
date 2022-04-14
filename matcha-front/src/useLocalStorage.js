import { useState, useEffect } from "react";

const useLocalStorage = (key, defaultValue) => {
  const hook = useState(() => {
    const saved = localStorage.getItem(key);
    try {
      const initialValue = JSON.parse(saved);
      return initialValue || defaultValue;
    } catch (e) {}

    return saved || defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(hook[0]));
  }, [hook[0]]);

  return hook;
};

export default useLocalStorage;
