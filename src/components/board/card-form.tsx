import {
  Button,
  Dialog,
  FormActions,
  FormField,
  formControlClass,
} from '#/components/ui';
import { useBoardStore } from '#/store/board';
import type { CardInput } from '#/store/board';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

type CardFormValues = {
  title: string;
  description: string;
  columnId: string;
  dateDue: string;
  priority: string;
};

type CardFormProps = {
  cardId?: string;
  columnId: string;
  onClose: () => void;
  onDeleteRequest: (cardId: string) => void;
};

export const CardForm = ({
  cardId,
  columnId,
  onClose,
  onDeleteRequest,
}: CardFormProps) => {
  const card = useBoardStore((state) =>
    cardId ? state.cards[cardId] : undefined,
  );
  const columns = useBoardStore((state) => state.columns);
  const addCard = useBoardStore((state) => state.addCard);
  const updateCard = useBoardStore((state) => state.updateCard);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    defaultValues: {
      title: card?.title ?? '',
      description: card?.description ?? '',
      columnId: card?.columnId ?? columnId,
      dateDue:
        card?.dateDue && card.dateDue instanceof Date
          ? format(card.dateDue, 'yyyy-MM-dd')
          : '',
      priority: card?.priority ? String(card.priority) : '',
    },
  });

  const onSubmit: SubmitHandler<CardFormValues> = (values) => {
    const input: CardInput = {
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      columnId: values.columnId,
      dateDue: values.dateDue
        ? new Date(`${values.dateDue}T12:00:00`)
        : undefined,
      priority: values.priority ? Number(values.priority) : undefined,
    };

    if (card) {
      updateCard(card.id, input);
    } else {
      addCard(input);
    }
    onClose();
  };

  return (
    <Dialog
      title={card ? 'Редактировать карточку' : 'Новая карточка'}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          label="Заголовок"
          htmlFor="card-title"
          error={errors.title?.message}
        >
          <input
            autoFocus
            id="card-title"
            className={formControlClass}
            maxLength={120}
            placeholder="Что нужно сделать?"
            aria-invalid={!!errors.title}
            {...register('title', {
              required: 'Введите заголовок.',
              maxLength: {
                value: 120,
                message: 'Не больше 120 символов.',
              },
              validate: (value) =>
                value.trim().length > 0 ||
                'Заголовок не может быть из одних пробелов.',
            })}
          />
        </FormField>
        <FormField
          label="Описание"
          htmlFor="card-description"
          error={errors.description?.message}
        >
          <textarea
            id="card-description"
            className={`${formControlClass} min-h-24 resize-y`}
            maxLength={1000}
            placeholder="Пара деталей..."
            aria-invalid={!!errors.description}
            {...register('description', {
              maxLength: {
                value: 1000,
                message: 'Не больше 1000 символов.',
              },
            })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            label="Колонка"
            htmlFor="card-column"
            error={errors.columnId?.message}
          >
            <select
              id="card-column"
              className={formControlClass}
              aria-invalid={!!errors.columnId}
              {...register('columnId', {
                required: 'Выберите колонку.',
                validate: (value) =>
                  columns.some((column) => column.id === value) ||
                  'Выберите существующую колонку.',
              })}
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Срок"
            htmlFor="card-due-date"
            error={errors.dateDue?.message}
          >
            <input
              id="card-due-date"
              className={formControlClass}
              type="date"
              aria-invalid={!!errors.dateDue}
              {...register('dateDue', {
                validate: (value) =>
                  !value ||
                  !Number.isNaN(new Date(`${value}T12:00:00`).getTime()) ||
                  'Введите корректную дату.',
              })}
            />
          </FormField>
          <FormField
            label="Приоритет"
            htmlFor="card-priority"
            error={errors.priority?.message}
          >
            <select
              id="card-priority"
              className={formControlClass}
              aria-invalid={!!errors.priority}
              {...register('priority', {
                validate: (value) =>
                  ['', '1', '2', '3'].includes(value) ||
                  'Выберите корректный приоритет.',
              })}
            >
              <option value="">Нет</option>
              <option value="1">Высокий</option>
              <option value="2">Средний</option>
              <option value="3">Низкий</option>
            </select>
          </FormField>
        </div>
        <FormActions
          destructiveAction={
            card ? (
              <Button
                onClick={() => onDeleteRequest(card.id)}
                type="button"
                variant="danger"
              >
                Удалить карточку
              </Button>
            ) : undefined
          }
        >
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button disabled={isSubmitting} type="submit" variant="primary">
            {card ? 'Сохранить изменения' : 'Создать карточку'}
          </Button>
        </FormActions>
      </form>
    </Dialog>
  );
};
