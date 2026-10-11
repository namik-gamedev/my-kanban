import { BoardDialog } from './board-dialog';
import type { BoardDialogState } from './board-dialog';
import { BoardHeader } from './board-header';
import { BoardToolbar } from './board-toolbar';
import { EmptyBoard } from './empty-board';
import { useBoardDrag } from './use-board-drag';
import { CardOverlay } from '#/components/card';
import { Column } from '#/components/column';
import { useBoardStore } from '#/store/board';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useState } from 'react';

export const Board = () => {
  const columns = useBoardStore((state) => state.columns);
  const cards = useBoardStore((state) => state.cards);
  const title = useBoardStore((state) => state.title);
  const [dialog, setDialog] = useState<BoardDialogState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const drag = useBoardDrag();

  const createCard = (columnId?: string) => {
    if (columnId) {
      setDialog({ type: 'card', columnId });
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-950 text-gray-100">
      <BoardHeader
        title={title}
        cardCount={Object.keys(cards).length}
        canCreateCard={columns.length > 0}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRenameBoard={() => setDialog({ type: 'board-title' })}
        onCreateCard={() => createCard(columns.at(0)?.id)}
      />
      <main className="flex min-h-0 flex-1 flex-col px-3 pb-4 pt-5 sm:px-6">
        <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col">
          <BoardToolbar onAddColumn={() => setDialog({ type: 'column' })} />
          <DndContext
            sensors={drag.sensors}
            measuring={drag.measuring}
            collisionDetection={drag.collisionDetection}
            onDragStart={drag.handleDragStart}
            onDragEnd={drag.handleDragEnd}
            onDragCancel={drag.handleDragCancel}
          >
            <div className="flex min-h-0 flex-1 items-start gap-3 overflow-x-auto pb-3 scrollbar-thumb-gray-700">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  searchQuery={searchQuery}
                  onAddCard={createCard}
                  onEditCard={(cardId, columnId) =>
                    setDialog({ type: 'card', cardId, columnId })
                  }
                  onEditColumn={(columnId) =>
                    setDialog({ type: 'column', columnId })
                  }
                  onDeleteColumn={(columnId) =>
                    setDialog({ type: 'delete-column', columnId })
                  }
                />
              ))}
              {columns.length === 0 && (
                <EmptyBoard onAddColumn={() => setDialog({ type: 'column' })} />
              )}
            </div>
            <DragOverlay>
              {drag.activeCard ? <CardOverlay card={drag.activeCard} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
      {dialog && (
        <BoardDialog
          dialog={dialog}
          onClose={() => setDialog(null)}
          onDeleteCardRequest={(cardId) =>
            setDialog({ type: 'delete-card', cardId })
          }
          onDeleteColumnRequest={(columnId) =>
            setDialog({ type: 'delete-column', columnId })
          }
        />
      )}
    </div>
  );
};
