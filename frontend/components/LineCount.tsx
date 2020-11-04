export default function LineCount(props: ILines) {
  return (
    <div>
      [{props.date}]: {props.lineCount}
      {props.message}
    </div>
  );
}

export interface ILines {
  lineCount?: number;
  date?: string;
  message?: string;
}
