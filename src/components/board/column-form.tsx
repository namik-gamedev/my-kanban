import {
  Button,
  Dialog,
  FormActions,
  FormField,
  formControlClass,
} from '#/components/ui';
import { useBoardStore } from '#/store/board';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

type NameFormValues = {
  title: string;
};

type ColumnFormProps = {
  columnId?: string;
  onClose: () => void;
  onDeleteRequest: (columnId: string) => void;
};

export const ColumnForm = ({
  columnId,
  onClose,
  onDeleteRequest,
}: ColumnFormProps) => {
  const column = useBoardStore((state) =>
    columnId ? state.columns.find((item) => item.id === columnId) : undefined,
  );
  const addColumn = useBoardStore((state) => state.addColumn);
  const renameColumn = useBoardStore((state) => state.renameColumn);
  const columnsCount = useBoardStore((state) => state.columns.length);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NameFormValues>({
    defaultValues: { title: column?.title ?? '' },
  });

  const onSubmit: SubmitHandler<NameFormValues> = ({ title }) => {
    const normalizedTitle = title.trim();
    if (column) {
      renameColumn(column.id, normalizedTitle);
    } else {
      addColumn(normalizedTitle);
    }
    onClose();
  };

  return (
    <Dialog
      title={column ? 'Редактировать колонку' : 'Новая колонка'}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          label="Название колонки"
          htmlFor="column-title"
          error={errors.title?.message}
        >
          <input
            autoFocus
            id="column-title"
            className={formControlClass}
            maxLength={50}
            placeholder="Например, На проверке"
            aria-invalid={!!errors.title}
            {...register('title', {
              required: 'Введите название колонки.',
              maxLength: { value: 50, message: 'Не больше 50 символов.' },
              validate: (value) =>
                value.trim().length > 0 ||
                'Название не может быть из одних пробелов.',
            })}
          />
        </FormField>
        <FormActions
          destructiveAction={
            column && column.cardIds.length === 0 && columnsCount > 1 ? (
              <Button
                onClick={() => onDeleteRequest(column.id)}
                type="button"
                variant="danger"
              >
                Удалить колонку
              </Button>
            ) : undefined
          }
        >
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button disabled={isSubmitting} type="submit" variant="primary">
            {column ? 'Сохранить изменения' : 'Создать колонку'}
          </Button>
        </FormActions>
      </form>
    </Dialog>
  );
};
