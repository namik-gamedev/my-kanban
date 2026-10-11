import { IconPencil, IconPlus, IconSearch } from '@tabler/icons-react';

type BoardHeaderProps = {
  title: string;
  cardCount: number;
  canCreateCard: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRenameBoard: () => void;
  onCreateCard: () => void;
};

const pluralizeCards = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'карточка';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'карточки';
  }
  return 'карточек';
};

export const BoardHeader = ({
  title,
  cardCount,
  canCreateCard,
  searchQuery,
  onSearchChange,
  onRenameBoard,
  onCreateCard,
}: BoardHeaderProps) => (
  <header className="border-b border-white/5 bg-gray-950 px-4 py-4 sm:px-6">
    <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-lg font-bold text-blue-300">
          K
        </div>
        <div className="min-w-0">
          <button
            type="button"
            onClick={onRenameBoard}
            className="group flex max-w-full items-center gap-2 text-left"
            title="Переименовать доску"
          >
            <h1 className="truncate text-lg font-semibold sm:text-xl">
              {title}
            </h1>
            <IconPencil
              size={15}
              className="shrink-0 text-gray-500 opacity-0 transition group-hover:opacity-100"
            />
          </button>
          <p className="text-xs text-gray-500">
            {cardCount} {pluralizeCards(cardCount)} · Ваша доска, ваш порядок
          </p>
        </div>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <label className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
          <IconSearch
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            aria-label="Поиск карточек"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-blue-400"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск карточек..."
            value={searchQuery}
          />
        </label>
        <button
          type="button"
          disabled={!canCreateCard}
          onClick={onCreateCard}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
        >
          <IconPlus size={17} />
          <span className="hidden sm:inline">Новая карточка</span>
          <span className="sm:hidden">Карточка</span>
        </button>
      </div>
    </div>
  </header>
);
