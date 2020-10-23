export default function TestComponent(props: IProps) {

    return (
        <div style={divStyle}>
            {props.myText}
        </div>
    )
}

const divStyle = {
    fontSize: '2em'
};

interface IProps {
    myText: string
}
