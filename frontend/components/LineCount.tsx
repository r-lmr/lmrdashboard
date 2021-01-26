export default function LineCount(props: ILineCount) {

  function getBotLinePercentageString(): string {
    if (props.lineCount !== undefined && props.botLines !== undefined) {
      const botLinePercentage: string = ((props.botLines / props.lineCount) * 100).toPrecision(2);
      return `${botLinePercentage}%`;
    }
    return "0%";
  }

  return (
    <div>
      [{props.date}]: {props.lineCount} ({getBotLinePercentageString()})
      {props.message}
    </div>
  );
}

export interface ILineCount {
  lineCount?: number;
  botLines?: number;
  date?: string;
  message?: string;
}
