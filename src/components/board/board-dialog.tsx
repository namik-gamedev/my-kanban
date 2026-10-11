import { BoardTitleForm } from '#/components/board/board-title-form';
import { CardForm } from '#/components/board/card-form';
import { ColumnForm } from '#/components/board/column-form';
import {
  DeleteCardConfirmation,
  DeleteColumnConfirmation,
} from '#/components/board/delete-confirmation';

export type BoardDialogState =
  | { type: 'card'; columnId: string; cardId?: string }
  | { type: 'column'; columnId?: string }
  | { type: 'board-title' }
  | { type: 'delete-card'; cardId: string }
  | { type: 'delete-column'; columnId: string };

type BoardDialogProps = {
  dialog: BoardDialogState;
  onClose: () => void;
  onDeleteCardRequest: (cardId: string) => void;
  onDeleteColumnRequest: (columnId: string) => void;
};

export const BoardDialog = ({
  dialog,
  onClose,
  onDeleteCardRequest,
  onDeleteColumnRequest,
}: BoardDialogProps) => {
  switch (dialog.type) {
    case 'card':
      return (
        <CardForm
          key={dialog.cardId ?? `new-${dialog.columnId}`}
          cardId={dialog.cardId}
          columnId={dialog.columnId}
          onClose={onClose}
          onDeleteRequest={onDeleteCardRequest}
        />
      );
    case 'column':
      return (
        <ColumnForm
          key={dialog.columnId ?? 'new-column'}
          columnId={dialog.columnId}
          onClose={onClose}
          onDeleteRequest={onDeleteColumnRequest}
        />
      );
    case 'board-title':
      return <BoardTitleForm onClose={onClose} />;
    case 'delete-card':
      return (
        <DeleteCardConfirmation cardId={dialog.cardId} onClose={onClose} />
      );
    case 'delete-column':
      return (
        <DeleteColumnConfirmation
          columnId={dialog.columnId}
          onClose={onClose}
        />
      );
  }
};
