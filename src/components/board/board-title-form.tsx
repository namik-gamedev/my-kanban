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

type BoardTitleValues = {
  title: string;
};

export const BoardTitleForm = ({ onClose }: { onClose: () => void }) => {
  const title = useBoardStore((state) => state.title);
  const renameBoard = useBoardStore((state) => state.renameBoard);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BoardTitleValues>({ defaultValues: { title } });

  const onSubmit: SubmitHandler<BoardTitleValues> = ({ title: nextTitle }) => {
    renameBoard(nextTitle.trim());
    onClose();
  };

  return (
    <Dialog title="Переименовать доску" onClose={onClose}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          label="Название доски"
          htmlFor="board-title"
          error={errors.title?.message}
        >
          <input
            autoFocus
            id="board-title"
            className={formControlClass}
            maxLength={60}
            aria-invalid={!!errors.title}
            {...register('title', {
              required: 'Введите название доски.',
              maxLength: { value: 60, message: 'Не больше 60 символов.' },
              validate: (value) =>
                value.trim().length > 0 ||
                'Название не может быть из одних пробелов.',
            })}
          />
        </FormField>
        <FormActions>
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button disabled={isSubmitting} type="submit" variant="primary">
            Сохранить
          </Button>
        </FormActions>
      </form>
    </Dialog>
  );
};
