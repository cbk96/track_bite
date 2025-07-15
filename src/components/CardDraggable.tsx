import { FC, PropsWithChildren } from "react";
import { Draggable } from "@hello-pangea/dnd";

export type CardDraggableProps = {
  draggableId: string;
  index: number;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export const CardDraggable: FC<PropsWithChildren<CardDraggableProps>> = ({
  draggableId,
  index,
  children,
  onMouseOver,
  onMouseLeave,
}) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};
