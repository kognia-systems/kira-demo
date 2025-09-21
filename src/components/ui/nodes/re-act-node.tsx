import { useCallback } from "react";

import { Handle } from "@xyflow/react";

export function ReActNode(props) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="bg-secondary border p-2 rounded">
      <div className="flex gap-2">
        <p className="text-sm">
          ReAct Agent
        </p>
        <Handle type="target" position="top" />
        <Handle type="source" position="bottom" id="flow" />
        <Handle type="source" position="right" id="tools" />
      </div>
    </div>
  );
}
