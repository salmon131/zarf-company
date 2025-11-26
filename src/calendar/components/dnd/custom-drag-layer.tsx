"use client";

// @ts-ignore - react-dnd v14에서 useDragLayer는 타입 정의가 불완전함
import { useDragLayer } from "react-dnd";
import type { DragLayerMonitor } from "react-dnd";

import type { IEvent } from "@/src/calendar/interfaces";

interface IDragItem {
  event: IEvent;
  children: React.ReactNode;
  width: number;
  height: number;
}

export function CustomDragLayer() {
  const { isDragging, item, currentOffset, initialOffset, initialClientOffset } = useDragLayer((monitor: DragLayerMonitor) => ({
    item: monitor.getItem() as IDragItem | null,
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }));

  if (!isDragging || !item || !currentOffset || !initialOffset || !initialClientOffset) {
    return null;
  }

  const offsetX = initialClientOffset.x - initialOffset.x;
  const offsetY = initialClientOffset.y - initialOffset.y;

  const layerStyles: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: currentOffset.x - offsetX,
    top: currentOffset.y - offsetY,
  };

  return (
    <div style={layerStyles}>
      <div
        className=""
        style={{
          width: item.width,
          height: item.height,
        }}
      >
        {item.children}
      </div>
    </div>
  );
}
