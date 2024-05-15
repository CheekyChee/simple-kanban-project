import React, { FC } from 'react';
import { Task } from '../types/type';
import TrashIcon from '../icons/trash-icon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
export interface TaskCardProps {
  task: Task;
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
}

export const TaskCard: FC<TaskCardProps> = ({
  task,
  deleteTask,
  updateTask,
}) => {
  const [mouseIsOver, setMouseIsOver] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackground p-2.5 h-[100px] min-h-[100px] 
        items-center flex text-left rounded-xl opacity-40 border-2 border-orange-500"
      >
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {task.content}
        </p>
      </div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackground p-2.5 h-[100px] min-h-[100px] 
  items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset
   hover:ring-orange-500 cursor-grab relative task"
      >
        <textarea
          className="h-[90px] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Type your task here..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value);
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackground p-2.5 h-[100px] min-h-[100px] 
    items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-orange-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute opacity-60 hover:opacity-100 right-4 top-1/2 -translate-y-1/2 bg-columnBackground p-2 rounded"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};
