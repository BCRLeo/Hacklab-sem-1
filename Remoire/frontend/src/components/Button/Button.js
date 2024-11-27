import "./Button.css"

export default function Button(props) {
    const { className, children, ...rest } = props;

    return (
        <button className={className ? `button ${className}` : "button"} {...rest}>
            {children}
        </button>
    );
}