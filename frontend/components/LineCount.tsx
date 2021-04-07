import React from 'react';

export default function LineCount(props: ILineCount): JSX.Element {

  function getBotLinePercentageString(): string {
    if (props.lineCount !== undefined && props.botLines !== undefined) {
      const botLinePercentage: number = parseFloat(((props.botLines / props.lineCount) * 100).toPrecision(1));
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
