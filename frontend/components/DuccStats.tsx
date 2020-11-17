export default function DuccStats(props: IDucc) {
  return (
    <div>
      {props.user} {props.duccs}
    </div>
  );
}

export interface IDucc {
  user: string;
  duccs?: string;
}
