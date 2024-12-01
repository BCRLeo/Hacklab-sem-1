import "./Button.css"

export default function Button(props) {
    const { className = "", children, text, ...rest } = props;

    return (
        <button className={`button ${className}`} {...rest}>
            {children}
            {text && <span className="button-text">{text}</span>}
        </button>
    );
}