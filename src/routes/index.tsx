import { Board } from '#/components/board';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ ssr: false, component: Home });

function Home() {
  return (
    <div>
      <Board />
    </div>
  );
}
