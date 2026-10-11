export type CardPriority = number;

export type ICard = {
  id: string;
  title: string;
  createdAt: Date;
  columnId: string;

  description?: string;
  dateDue?: Date;
  priority?: CardPriority;
};
