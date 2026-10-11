import { IconPlus } from '@tabler/icons-react';

type BoardToolbarProps = {
  onAddColumn: () => void;
};

export const BoardToolbar = ({ onAddColumn }: BoardToolbarProps) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <div>
      <h2 className="text-sm font-medium text-gray-300">Доска</h2>
      <p className="mt-0.5 text-xs text-gray-500">
        Перетаскивайте карточки, чтобы работа двигалась
      </p>
    </div>
    <button
      type="button"
      onClick={onAddColumn}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
    >
      <IconPlus size={16} />
      Добавить колонку
    </button>
  </div>
);
