import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ICard } from '#/model/card';
import type { IColumn } from '#/model/column';

type PersistedBoardState = Pick<BoardState, 'cards' | 'columns' | 'title'>;

export type CardInput = Pick<ICard, 'title' | 'columnId'> &
  Partial<Pick<ICard, 'description' | 'dateDue' | 'priority'>>;

export type BoardState = {
  cards: Record<string, ICard>;
  columns: IColumn[];
  title: string;
  addCard: (input: CardInput) => void;
  updateCard: (cardId: string, input: CardInput) => void;
  deleteCard: (cardId: string) => void;
  addColumn: (title: string) => void;
  renameColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  renameBoard: (title: string) => void;
  moveCard: (
    cardId: string,
    targetColumnId: string,
    targetIndex?: number,
  ) => void;
};

const initialCards: Record<string, ICard> = {
  card_1: {
    id: 'card_1',
    title: 'Ревью дизайн-системы',
    createdAt: new Date('2026-10-01T09:00:00.000Z'),
    columnId: 'todo',
    dateDue: new Date('2026-10-11T09:00:00.000Z'),
  },
  card_2: {
    id: 'card_2',
    title: 'Обновить API-контракт',
    createdAt: new Date('2026-10-03T09:00:00.000Z'),
    columnId: 'todo',
    dateDue: new Date('2026-10-12T09:00:00.000Z'),
  },
  card_3: {
    id: 'card_3',
    title: 'Допилить лендинг',
    createdAt: new Date('2026-10-02T09:00:00.000Z'),
    columnId: 'in_progress',
    dateDue: new Date('2026-10-13T09:00:00.000Z'),
  },
  card_4: {
    id: 'card_4',
    title: 'Маркетинговые материалы',
    createdAt: new Date('2026-10-04T09:00:00.000Z'),
    columnId: 'review',
    dateDue: new Date('2026-10-15T09:00:00.000Z'),
  },
};

const initialColumns: IColumn[] = [
  {
    id: 'todo',
    title: 'К выполнению',
    position: 0,
    cardIds: ['card_1', 'card_2'],
  },
  {
    id: 'in_progress',
    title: 'В работе',
    position: 1,
    cardIds: ['card_3'],
  },
  { id: 'review', title: 'На проверке', position: 2, cardIds: ['card_4'] },
  { id: 'done', title: 'Готово', position: 3, cardIds: [] },
];

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      cards: initialCards,
      columns: initialColumns,
      title: 'Моя доска',
      addCard: (input) =>
        set((state) => {
          if (!state.columns.some((column) => column.id === input.columnId)) {
            return state;
          }

          const id = crypto.randomUUID();
          const card: ICard = {
            ...input,
            id,
            createdAt: new Date(),
          };

          return {
            cards: { ...state.cards, [id]: card },
            columns: state.columns.map((column) =>
              column.id === input.columnId
                ? { ...column, cardIds: [...column.cardIds, id] }
                : column,
            ),
          };
        }),
      updateCard: (cardId, input) =>
        set((state) => {
          const existingCard = state.cards[cardId];

          if (
            !Object.hasOwn(state.cards, cardId) ||
            !state.columns.some((column) => column.id === input.columnId)
          ) {
            return state;
          }

          let nextColumns = state.columns;
          if (existingCard.columnId !== input.columnId) {
            nextColumns = state.columns.map((column) => ({
              ...column,
              cardIds: column.cardIds.filter((id) => id !== cardId),
            }));
            nextColumns
              .find((column) => column.id === input.columnId)
              ?.cardIds.push(cardId);
          }

          return {
            cards: {
              ...state.cards,
              [cardId]: { ...existingCard, ...input },
            },
            columns: nextColumns,
          };
        }),
      deleteCard: (cardId) =>
        set((state) => {
          if (!Object.hasOwn(state.cards, cardId)) {
            return state;
          }

          const cards = { ...state.cards };
          delete cards[cardId];

          return {
            cards,
            columns: state.columns.map((column) => ({
              ...column,
              cardIds: column.cardIds.filter((id) => id !== cardId),
            })),
          };
        }),
      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            {
              id: crypto.randomUUID(),
              title,
              position: state.columns.length,
              cardIds: [],
            },
          ],
        })),
      renameColumn: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === columnId ? { ...column, title } : column,
          ),
        })),
      deleteColumn: (columnId) =>
        set((state) => {
          const column = state.columns.find((item) => item.id === columnId);

          if (
            !column ||
            column.cardIds.length > 0 ||
            state.columns.length <= 1
          ) {
            return state;
          }

          return {
            columns: state.columns
              .filter((item) => item.id !== columnId)
              .map((item, position) => ({ ...item, position })),
          };
        }),
      renameBoard: (title) => set({ title }),
      moveCard: (cardId, targetColumnId, targetIndex) =>
        set((state) => {
          const card = state.cards[cardId];
          if (!Object.hasOwn(state.cards, cardId)) {
            return state;
          }

          const nextColumns = state.columns.map((column) => ({
            ...column,
            cardIds: [...column.cardIds],
          }));

          const sourceColumn = nextColumns.find((column) =>
            column.cardIds.includes(cardId),
          );
          const targetColumn = nextColumns.find(
            (column) => column.id === targetColumnId,
          );

          if (!sourceColumn || !targetColumn) {
            return state;
          }

          sourceColumn.cardIds.splice(sourceColumn.cardIds.indexOf(cardId), 1);

          const insertIndex = Math.max(
            0,
            Math.min(
              targetIndex ?? targetColumn.cardIds.length,
              targetColumn.cardIds.length,
            ),
          );
          targetColumn.cardIds.splice(insertIndex, 0, cardId);

          if (
            state.columns.every(
              (column, index) =>
                column.cardIds.length === nextColumns[index]?.cardIds.length &&
                column.cardIds.every(
                  (id, cardIndex) =>
                    id === nextColumns[index]?.cardIds[cardIndex],
                ),
            )
          ) {
            return state;
          }

          return {
            cards: {
              ...state.cards,
              [cardId]: {
                ...card,
                columnId: targetColumnId,
              },
            },
            columns: nextColumns,
          };
        }),
    }),
    {
      name: 'my-kanban-board',
      storage: createJSONStorage<PersistedBoardState>(() => localStorage, {
        reviver: (key, value) => {
          if (
            (key === 'createdAt' || key === 'dateDue') &&
            typeof value === 'string'
          ) {
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? value : date;
          }

          return value;
        },
      }),
      partialize: ({ cards, columns, title }) => ({ cards, columns, title }),
    },
  ),
);
