import userHash from "../data/UserHash";

export default function DuccStat(props: IDuccStat) {
  {
    console.log(props.user, props.user.length, props.user.trim().length);
  }

  return (
    <div>
      <span
        className={`nick-${Math.abs(
          userHash(props.user.replace(/[^a-zA-Z0-9]/g, "")) % 16
        )}`}
      >
        {props.user}
      </span>
      : {props.duccs}
    </div>
  );
}

export interface IDuccStat {
  user: string;
  duccs?: string;
}
