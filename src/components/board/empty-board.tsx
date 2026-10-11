import { IconPlus } from '@tabler/icons-react';

type EmptyBoardProps = {
  onAddColumn: () => void;
};

export const EmptyBoard = ({ onAddColumn }: EmptyBoardProps) => (
  <div className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
      <IconPlus size={22} />
    </div>
    <h3 className="font-medium">Начните с колонки</h3>
    <p className="mt-1 max-w-sm text-sm text-gray-500">
      Добавьте этап работы, затем создавайте карточки и наводите порядок.
    </p>
    <button
      type="button"
      onClick={onAddColumn}
      className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
    >
      Создать первую колонку
    </button>
  </div>
);
