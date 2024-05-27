import { useEffect, useRef, useState } from "react";
import { useEditable } from "use-editable";

export function usePersistentEditable(
  id: string,
  defaultValue: string,
): [React.MutableRefObject<null>, string] {
  const initialValue = localStorage.getItem(id) || defaultValue;
  const [content, setContent] = useState(initialValue);

  const ref = useRef(null);

  useEditable(ref, setContent);

  useEffect(() => {
    localStorage.setItem(id, content);
  }, [content]);

  return [ref, content];
}
