"use client";

import { useEffect, useState } from "react";

export default function useFullPath() {
  const [mounted, setMounted] = useState(false);
  const fullPath =
    typeof window !== "undefined" && window.location.href
      ? window.location.href
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return fullPath;
}
