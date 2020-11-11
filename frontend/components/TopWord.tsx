export default function TopWord(props: ITopWord) {
  return (
    <div>
      {props.word}: {props.count}
    </div>
  );
}

export interface ITopWord {
  word: string;
  count: number;
}
