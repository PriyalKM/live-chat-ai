import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EMAIL_ICON, NO_DATA_IMAGE } from "@/lib/images";
import { useFollowUps } from "@/hooks/followups/useFollowUps";
import Loader from "@/components/common/Loader";
import useSearch from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";

const colors = {
  "In Progress": "bg-[#CFE2FF] border-[#CFE2FF]",
  Done: "bg-[#E5FFD2] border-[#E5FFD2]",
  "Not Started": "bg-[#FFCFCF] border-[#FFCFCF]",
};
const indicatorColors = {
  "In Progress": "#1455D2",
  Done: "#34C759",
  "Not Started": "#FF3B30",
};

function KanbanCard({ title, content }) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 border text-base lg:text-[17px] cursor-pointer space-y-2",
        colors[title]
      )}
    >
      <div>{content}</div>
      <div className="flex items-center gap-2">
        <img src={EMAIL_ICON} alt="email" />
      </div>
    </div>
  );
}

function DraggableCard({ title, task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <KanbanCard title={title} content={task.actionItem} />
    </div>
  );
}

function KanbanColumn({ title, tasks }) {
  const { setNodeRef } = useDroppable({ id: `column-${title}` });
  return (
    <ScrollArea className="flex flex-col px-5 pb-5 rounded-[16px] border border-[#F6F6F6] bg-[#FAFAFA] lg:h-[calc(100vh-190px)]">
      <div className="py-4 border-b sticky top-0 left-0 border-[#E9E9E9]  bg-[#FAFAFA] flex items-center gap-2">
        <div
          style={{ backgroundColor: indicatorColors[title] }}
          className={cn("w-2 h-2 rounded-full")}
        ></div>
        <h2 className="text-xl text-[#3B4753] font-semibold">{title}</h2>
        <span className="text-primary font-semibold">({tasks.length})</span>
      </div>
      <div ref={setNodeRef} className="rounded-xl space-y-4 pt-5 flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableCard title={title} key={task._id} task={task} />
          ))
        ) : (
          <div className=" py-4 h flex-1 flex-col items-center justify-center gap-2">
            <div className="flex justify-center">
              <img src={NO_DATA_IMAGE} alt="" />
            </div>
            <p className="text-lg text-center text-secondary/60">
              {" "}
              No Data Available
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default function FollowUpsBoard() {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);
  const { followups, isLoading } = useFollowUps({ search: debouncedSearch });

  const filteredFollowups = useMemo(() => {
    if (isLoading || !followups)
      return {
        "Not Started": [],
        "In Progress": [],
        Done: [],
      };
    return {
      "Not Started": followups.filter(
        (followup) => followup.currentStatus === "Not Started"
      ),
      "In Progress": followups.filter(
        (followup) => followup.currentStatus === "In Progress"
      ),
      Done: followups.filter((followup) => followup.currentStatus === "Done"),
    };
  }, [followups, isLoading]);

  const [columns, setColumns] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const [activeTitle, setActiveTitle] = useState("");

  const findTaskById = (id) => {
    for (const [colTitle, tasks] of Object.entries(columns)) {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setActiveTitle(colTitle);
        return task;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    const task = findTaskById(event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveTask(null);
      return;
    }

    const sourceCol = activeTitle;
    const destCol = over.id.replace("column-", "");

    if (!sourceCol || !destCol || sourceCol === destCol) {
      setActiveTask(null);
      return;
    }

    const sourceItems = [...columns[sourceCol]];
    const movedTask = sourceItems.find((t) => t.id === active.id);
    const destItems = [...columns[destCol], movedTask];

    setColumns({
      ...columns,
      [sourceCol]: sourceItems.filter((t) => t.id !== active.id),
      [destCol]: destItems,
    });

    setActiveTask(null);
  };

  useEffect(() => {
    if (isLoading) return;
    setColumns(filteredFollowups);
  }, [filteredFollowups, isLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 flex-1">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        {Object.entries(columns).map(([title, tasks], i) => (
          <KanbanColumn key={i} title={title} tasks={tasks} />
        ))}
        <DragOverlay>
          {activeTask ? (
            <KanbanCard title={activeTitle} content={activeTask.content} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
