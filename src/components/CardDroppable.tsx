import React, { FC, PropsWithChildren } from "react";
import { Droppable } from "@hello-pangea/dnd";

export type CardDroppableProps = {
  droppableId: string;
  direction: "horizontal" | "vertical";
  className?: string;
};

export const CardDroppable: FC<PropsWithChildren<CardDroppableProps>> = ({
  droppableId = "default-droppable-id",
  children,
  direction,
  className,
}) => {
  //vertical horizontal
  const flexDirection = direction !== "vertical" ? "flex-row" : "flex-col";
  return (
    <Droppable droppableId={droppableId} direction={direction}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`flex ${flexDirection} ${className}`}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default React.memo(CardDroppable);
