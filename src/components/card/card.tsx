import type { ICard } from '#/model/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconClock, IconGripVertical } from '@tabler/icons-react';
import { format, isBefore, startOfDay } from 'date-fns';

type CardProps = {
  card: ICard;
  dragDisabled?: boolean;
  onEdit?: () => void;
};

export const Card = ({ card, dragDisabled, onEdit }: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: dragDisabled,
    data: { type: 'card', columnId: card.columnId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`group bg-gray-900 flex gap-2 relative rounded-lg p-3 overflow-hidden shrink-0 border border-white/5 shadow-sm transition ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <div
        className={`absolute w-1 h-full inset-y-0 left-0 ${getPriorityStripeClass(card.priority)}`}
      />
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`Перетащить: ${card.title}`}
        className="cursor-grab touch-none self-start text-gray-500 hover:text-gray-200 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical size={16} />
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-blue-400"
        aria-label={`Редактировать: ${card.title}`}
      >
        <CardContent card={card} />
      </button>
    </div>
  );
};

export const CardOverlay = ({ card }: CardProps) => (
  <div className="bg-gray-900 flex gap-2 relative rounded-lg p-3 overflow-hidden shrink-0 border border-blue-400 shadow-xl cursor-grabbing">
    <div
      className={`absolute w-1 h-full inset-y-0 left-0 ${getPriorityStripeClass(card.priority)}`}
    />
    <IconGripVertical size={16} className="text-gray-500" />
    <CardContent card={card} />
  </div>
);

const PRIORITY_META: Partial<
  Record<number, { className: string; label: string; stripeClass: string }>
> = {
  1: {
    className: 'bg-red-500/15 text-red-300',
    label: 'Высокий',
    stripeClass: 'bg-red-500',
  },
  2: {
    className: 'bg-amber-500/15 text-amber-300',
    label: 'Средний',
    stripeClass: 'bg-amber-500',
  },
  3: {
    className: 'bg-sky-500/15 text-sky-300',
    label: 'Низкий',
    stripeClass: 'bg-sky-500',
  },
};

const getPriorityStripeClass = (priority?: number) => {
  if (!priority) return 'bg-white/10';
  return PRIORITY_META[priority]?.stripeClass ?? 'bg-white/10';
};

const CardContent = ({ card }: CardProps) => {
  const priorityMeta = card.priority ? PRIORITY_META[card.priority] : undefined;
  const overdue =
    card.dateDue instanceof Date &&
    !Number.isNaN(card.dateDue.getTime()) &&
    isBefore(startOfDay(card.dateDue), startOfDay(new Date()));

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="text-sm font-medium leading-snug">{card.title}</h3>
      {card.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
          {card.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {card.dateDue && (
          <div
            title={overdue ? 'Просрочено' : undefined}
            className={`flex gap-1 px-1.5 py-1 rounded items-center ${
              overdue
                ? 'bg-red-500/15 text-red-300'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <IconClock size={13} />
            <p className="text-[11px]">{format(card.dateDue, 'dd MMM')}</p>
          </div>
        )}
        {priorityMeta && (
          <span
            className={`rounded px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${priorityMeta.className}`}
          >
            {priorityMeta.label}
          </span>
        )}
      </div>
    </div>
  );
};
