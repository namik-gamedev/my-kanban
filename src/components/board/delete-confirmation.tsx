import { Button, Dialog, FormActions } from '#/components/ui';
import type { ICard } from '#/model/card';
import { useBoardStore } from '#/store/board';

export const DeleteCardConfirmation = ({
  cardId,
  onClose,
}: {
  cardId: string;
  onClose: () => void;
}) => {
  const card = useBoardStore((state): ICard | undefined => state.cards[cardId]);

  const deleteCard = useBoardStore((state) => state.deleteCard);

  return (
    <Dialog title="Удалить карточку?" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-gray-300">
          Это навсегда удалит <strong>{card?.title ?? 'эту карточку'}</strong>.
        </p>
        <FormActions>
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button
            onClick={() => {
              deleteCard(cardId);
              onClose();
            }}
            type="button"
            variant="danger-solid"
          >
            Удалить карточку
          </Button>
        </FormActions>
      </div>
    </Dialog>
  );
};

export const DeleteColumnConfirmation = ({
  columnId,
  onClose,
}: {
  columnId: string;
  onClose: () => void;
}) => {
  const column = useBoardStore((state) =>
    state.columns.find((item) => item.id === columnId),
  );
  const deleteColumn = useBoardStore((state) => state.deleteColumn);

  return (
    <Dialog title="Удалить колонку?" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-gray-300">
          Удалить пустую колонку <strong>{column?.title ?? 'колонка'}</strong>?
          Колонки с карточками удалять нельзя.
        </p>
        <FormActions>
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button
            onClick={() => {
              deleteColumn(columnId);
              onClose();
            }}
            type="button"
            variant="danger-solid"
          >
            Удалить колонку
          </Button>
        </FormActions>
      </div>
    </Dialog>
  );
};
