import { useBoardStore } from '#/store/board';
import {
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  closestCorners,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import type {
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';

const collisionDetection: CollisionDetection = (args) => {
  const containers = args.droppableContainers.filter(
    (container) => container.id !== args.active.id,
  );

  if (!args.pointerCoordinates) {
    return closestCorners({ ...args, droppableContainers: containers });
  }

  const collisions = pointerWithin({
    ...args,
    droppableContainers: containers,
  });
  const cardCollision = collisions.find((collision) =>
    containers.some(
      (container) =>
        container.id === collision.id &&
        container.data.current?.type === 'card',
    ),
  );

  if (cardCollision) return [cardCollision];

  const columnCollision = collisions.find((collision) =>
    containers.some(
      (container) =>
        container.id === collision.id &&
        container.data.current?.type === 'column',
    ),
  );
  const targetColumnId = containers.find(
    (container) =>
      container.id === columnCollision?.id &&
      container.data.current?.type === 'column',
  )?.data.current?.columnId;

  if (!columnCollision || typeof targetColumnId !== 'string') {
    return collisions;
  }

  const cardsInColumn = containers.filter(
    (container) =>
      container.data.current?.type === 'card' &&
      container.data.current.columnId === targetColumnId,
  );

  if (cardsInColumn.length === 0) return [columnCollision];

  const cardsBottom = Math.max(
    ...cardsInColumn.map((container) => container.rect.current?.bottom ?? 0),
  );
  if (args.pointerCoordinates.y >= cardsBottom) return [columnCollision];

  const nearestCard = closestCenter({
    ...args,
    droppableContainers: cardsInColumn,
  });

  return nearestCard.length > 0 ? nearestCard : [columnCollision];
};

const getInsertionIndex = (event: DragEndEvent, targetIndex: number) => {
  const { active, over, delta, activatorEvent } = event;
  if (!over) return targetIndex;

  const pointerY =
    'clientY' in activatorEvent && typeof activatorEvent.clientY === 'number'
      ? activatorEvent.clientY + delta.y
      : undefined;
  const initialRect = active.rect.current.initial;
  const activeRect = active.rect.current.translated;
  const activeCenterY = activeRect
    ? activeRect.top + activeRect.height / 2
    : initialRect
      ? initialRect.top + delta.y + initialRect.height / 2
      : over.rect.top;
  const dropY = pointerY ?? activeCenterY;

  return targetIndex + (dropY > over.rect.top + over.rect.height / 2 ? 1 : 0);
};

export const useBoardDrag = () => {
  const columns = useBoardStore((state) => state.columns);
  const cards = useBoardStore((state) => state.cards);
  const moveCard = useBoardStore((state) => state.moveCard);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveCardId(String(active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const sourceColumnId = active.data.current?.columnId;
    const target = over.data.current;

    if (target?.type === 'card') {
      const targetColumnId = String(target.columnId);
      const overId = String(over.id);
      if (cardId === overId) {
        return;
      }

      const targetColumn = columns.find(
        (column) => column.id === targetColumnId,
      );
      const baseIndex = targetColumn?.cardIds.indexOf(overId);
      if (baseIndex === undefined || baseIndex < 0) return;

      let targetIndex = getInsertionIndex(event, baseIndex);

      // После удаления карточки из своей колонки индексы сдвигаются:
      // сброс после карточки, которая была ниже перетаскиваемой, означает -1.
      if (sourceColumnId === targetColumnId) {
        const sourceColumn = columns.find(
          (column) => column.id === sourceColumnId,
        );
        const sourceIndex = sourceColumn?.cardIds.indexOf(cardId) ?? -1;
        if (sourceIndex >= 0 && sourceIndex < targetIndex) {
          targetIndex -= 1;
        }
      }

      moveCard(cardId, targetColumnId, targetIndex);
      return;
    }

    if (target?.type === 'column') {
      const targetColumnId = String(target.columnId);
      const targetColumn = columns.find(
        (column) => column.id === targetColumnId,
      );
      if (!targetColumn) return;
      // Сброс на пустое место колонки или под последнюю карточку.
      if (targetColumn.cardIds.length === 0) {
        moveCard(cardId, targetColumnId);
      } else if (sourceColumnId === targetColumnId) {
        // Вернули в свою же колонку: переместить в конец.
        moveCard(cardId, targetColumnId, targetColumn.cardIds.length);
      } else if (sourceColumnId !== targetColumnId) {
        moveCard(cardId, targetColumnId);
      }
    }
  };

  return {
    activeCard: activeCardId ? cards[activeCardId] : null,
    collisionDetection,
    handleDragCancel: () => setActiveCardId(null),
    handleDragEnd,
    handleDragStart,
    measuring: { droppable: { strategy: MeasuringStrategy.Always } },
    sensors,
  };
};
