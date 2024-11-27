import "./Field.css"

export default function Field(props) {
    const { label, children, ...rest } = props;

    if (children) {
        return (
            <div className="field">
                {label && <h4 className="field-label">{label}</h4>}
                {children}
            </div>
        );
    }

    return (
        <div className="field">
            {label && <h4 className="field-label">{label}</h4>}
            <input className="field-input" {...rest} />
        </div>
    );
}