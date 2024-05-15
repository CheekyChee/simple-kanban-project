import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusIcon } from '../icons/plus-icon';
import { Column, Task } from '../types/type';
import { ColumnContainer } from './column-container';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { TaskCard } from './task-card';

const KanbanBoard = () => {
  const [columns, setColumns] = React.useState<Array<Column>>([]);

  const [tasks, setTasks] = React.useState<Array<Task>>([]);

  const columnId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function addColumn() {
    const columnToAdd: Column = {
      id: uuidv4(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function createTask(columnId: string) {
    const taskToAdd: Task = {
      id: uuidv4(),
      content: `Task ${tasks.length + 1}`,
      columnId,
    };

    setTasks([...tasks, taskToAdd]);
  }

  function deleteColumn(id: string) {
    const newColumn = columns.filter((col) => col.id !== id);
    setColumns(newColumn);
    setTasks((tasks) => tasks.filter((task) => task.columnId !== id));
  }

  function onDragStart(event: DragStartEvent) {
    console.log('drag start', event);

    if (
      event.active.data.current &&
      event.active.data.current.type === 'Column'
    ) {
      const column = event.active.data.current.column;
      setActiveColumn(column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    const activeColumnId = active.id;
    const overColumnId = over?.id;

    if (activeColumnId === overColumnId) {
      return;
    }
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    const activeColumnId = active.id;
    const overColumnId = over?.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    // dropping a task over another task
    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over?.data.current?.type === 'Task';

    if (!isActiveATask) {
      return;
    }

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((t) => t.id === active.id);

        const overTaskIndex = tasks.findIndex((t) => t.id === over.id);

        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over?.data.current?.type === 'Column';

    // dropping a Task over a Column

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((t) => t.id === active.id);

        tasks[activeTaskIndex].columnId = over.id as string;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  }

  function updateColumnTitle(id: string, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }

  function deleteTask(id: string) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: string, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-2">
            <SortableContext items={columnId}>
              {columns.map((col) => {
                return (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumnTitle={updateColumnTitle}
                    createTask={createTask}
                    task={tasks.filter((task) => task.columnId === col.id)}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                );
              })}
            </SortableContext>
          </div>
          <button
            onClick={addColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg
          flex gap-2
       bg-columnBackground border-2 border-columnBackground p-4 ring-orange-500 hover:ring-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumnTitle={updateColumnTitle}
                createTask={createTask}
                task={tasks.filter((task) => task.columnId === activeColumn.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
