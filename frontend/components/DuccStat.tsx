export default function DuccStat(props: IDuccStat) {
  return (
    <div>
      {props.user} {props.duccs}
    </div>
  );
}

export interface IDuccStat {
  user: string;
  duccs?: string;
}
