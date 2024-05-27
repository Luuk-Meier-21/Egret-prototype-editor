import hotkeys, {HotkeysEvent, KeyHandler} from "hotkeys-js";
import {useEffect} from "react";

export function useHotkeys(key: string, handler: KeyHandler) {
  useEffect(() => {
    const method = (event: KeyboardEvent, handle: HotkeysEvent) => {
      event.preventDefault();
      handler(event, handle);
      return false;
    };

    hotkeys(key, method);

    return () => {
      hotkeys.unbind(key, method);
    };
  }, [key, handler]);
}
