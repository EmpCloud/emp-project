export interface ILabel {
  item:string;
  color: string;
  text: string;
}
export interface ITask {
  subTaskStatus: boolean;
  subTaskTitle: ReactNode;
  _id: Key;
  progress: unknown;
  id: number;
  completed: boolean;
  text: string;
}
export interface ICard {
  assignedTo: any;
  taskDetails: string;
  attachment: any;
  progress: unknown;
  dueDate: string ;
  subTasks: ITask[];
  _id: number;
  id: number;
  title: string;
  labels: ILabel[];
  date: string;
  tasks: ITask[];
  desc?: string;
  priority:string;
  subTaskTitle:string;
  taskTitle:string;
}
export interface IBoard {
  isDefault: any;
  tasks: ICard[];
  _id: number;
  subTasks: any;
  taskStatus: string;
  id: number;
  title: string;
  cards: ICard[];
}
