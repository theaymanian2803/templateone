const KEY = "arcshield_showcase_video_v1";

export const getShowcaseVideo = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY) ?? "";
};

export const setShowcaseVideo = (url: string) => {
  localStorage.setItem(KEY, url);
  window.dispatchEvent(new Event("video:updated"));
};

export const clearShowcaseVideo = () => {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("video:updated"));
};

import { useEffect, useState } from "react";

export const useShowcaseVideo = (): string => {
  const [url, setUrl] = useState<string>(() => getShowcaseVideo());
  useEffect(() => {
    const sync = () => setUrl(getShowcaseVideo());
    window.addEventListener("video:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("video:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return url;
};
