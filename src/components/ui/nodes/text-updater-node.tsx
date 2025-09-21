import { useCallback } from "react";

import { Handle } from "@xyflow/react";

export function TextUpdaterNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="bg-card border p-2 rounded-lg">
      <div className="flex gap-2">
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
        <Handle type="target" position="top" />
        <Handle type="source" position="bottom" />
      </div>
    </div>
  );
}
