import React from 'react';

export default function LineCount(props: ILineCount): JSX.Element {
  function getBotLinePercentageString(): string {
    if (props.lineCount !== undefined && props.botLines !== undefined) {
      const botLinePercentage: number = parseFloat(((props.botLines / props.lineCount) * 100).toFixed(0));
      const botLinePerentageString = `${botLinePercentage}%`;
      return botLinePerentageString.startsWith('0') && botLinePerentageString.includes('.')
        ? botLinePerentageString.slice(1)
        : botLinePerentageString;
    }
    return '0%';
  }

  return (
    <div>
      {props.date}: {props.lineCount} ({getBotLinePercentageString()}){props.message}
    </div>
  );
}

export interface ILineCount {
  lineCount?: number;
  botLines?: number;
  date?: string;
  message?: string;
}
