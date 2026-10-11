import { Card } from '#/components/card';
import type { ICard } from '#/model/card';
import type { IColumn } from '#/model/column';
import { useBoardStore } from '#/store/board';
import { useDroppable } from '@dnd-kit/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type ColumnProps = {
  column: IColumn;
  searchQuery: string;
  onAddCard: (columnId: string) => void;
  onEditCard: (cardId: string, columnId: string) => void;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
};

export const Column = ({
  column,
  searchQuery,
  onAddCard,
  onEditCard,
  onEditColumn,
  onDeleteColumn,
}: ColumnProps) => {
  const cardsMap = useBoardStore((state) => state.cards);
  const columnsCount = useBoardStore((state) => state.columns.length);
  const { isOver, setNodeRef } = useDroppable({
    id: `column:${column.id}`,
    data: { type: 'column', columnId: column.id },
  });

  const cards = column.cardIds
    .map((cardId): ICard | undefined => cardsMap[cardId])
    .filter((card): card is ICard => card !== undefined)
    .filter((card) =>
      `${card.title} ${card.description ?? ''}`
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()),
    );

  const isFiltering = searchQuery.trim().length > 0;

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full max-h-full w-[min(21rem,calc(100vw-2rem))] shrink-0 flex-col gap-3 rounded-xl border p-3 transition-colors ${
        isOver ? 'border-blue-400 bg-gray-900' : 'border-white/5 bg-gray-900/80'
      }`}
    >
      <header className="flex items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate font-semibold">{column.title}</h2>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">
            {column.cardIds.length}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onAddCard(column.id)}
            aria-label={`Добавить карточку в «${column.title}»`}
            title="Добавить карточку"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <IconPlus size={16} />
          </button>
          <button
            type="button"
            onClick={() => onEditColumn(column.id)}
            aria-label={`Переименовать «${column.title}»`}
            title="Переименовать колонку"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <IconPencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteColumn(column.id)}
            aria-label={`Удалить «${column.title}»`}
            title={
              column.cardIds.length > 0
                ? 'Сначала переместите или удалите карточки из колонки'
                : 'Удалить пустую колонку'
            }
            disabled={column.cardIds.length > 0 || columnsCount <= 1}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconTrash size={15} />
          </button>
        </div>
      </header>
      <div className="flex min-h-20 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              dragDisabled={isFiltering}
              onEdit={() => onEditCard(card.id, column.id)}
            />
          ))}
        </SortableContext>
        {cards.length === 0 &&
          (isFiltering ? (
            <div className="flex min-h-20 flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 px-3 text-sm text-gray-500">
              Ничего не найдено
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddCard(column.id)}
              className="flex min-h-20 flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 px-3 text-sm text-gray-500 transition hover:border-blue-400/50 hover:text-blue-300"
            >
              Перетащите карточку сюда или добавьте новую
            </button>
          ))}
      </div>
      <button
        type="button"
        onClick={() => onAddCard(column.id)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-400 transition hover:bg-white/5 hover:text-gray-100"
      >
        <IconPlus size={16} />
        Добавить карточку
      </button>
    </div>
  );
};
