import React, { FC, useMemo } from 'react';
import TrashIcon from '../icons/trash-icon';
import { Column, Task } from '../types/type';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon } from '../icons/plus-icon';
import { TaskCard } from './task-card';
export interface ColumnContainerProps {
  column: Column;
  task: Task[];
  deleteColumn: (id: string) => void;
  updateColumnTitle: (id: string, title: string) => void;
  createTask: (columnId: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
}

export const ColumnContainer: FC<ColumnContainerProps> = (props) => {
  const {
    column,
    task,
    deleteColumn,
    updateColumnTitle,
    createTask,
    deleteTask,
    updateTask,
  } = props;

  const taskId = useMemo(() => task.map((task) => task.id), [task]);

  const [editMode, setEditMode] = React.useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
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
        className="bg-columnBackground w-[350px] h-[500px] max-h-[500px] rounded-md opacity-40 border-2 border-orange-500
    flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackground w-[350px] h-[500px] max-h-[500px] rounded-md 
    flex flex-col"
    >
      {/* title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="flex items-center justify-between bg-mainBackground text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackground border-4"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackground px-2 py-1 text-sm rounded-full">
            0
          </div>

          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-orange-500 border rounded outline-none px-2"
              autoFocus
              value={column.title}
              onBlur={() => setEditMode(false)}
              onChange={(e) => updateColumnTitle(column.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') {
                  return;
                } else {
                  setEditMode(false);
                }
              }}
            />
          )}
        </div>
        <div
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500
         hover:stroke-white hover:bg-columnBackground 
         rounded px-1 py-1"
        >
          <TrashIcon />
        </div>
      </div>
      {/* task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskId}>
          {task.map((task) => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>

      {/* footer */}
      <button
        className="flex gap-2 items-center border-columnBackground 
      border-2 rounded-md p-4 border-x-columnBackground hover:text-orange-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon /> Add Task
      </button>
    </div>
  );
};
