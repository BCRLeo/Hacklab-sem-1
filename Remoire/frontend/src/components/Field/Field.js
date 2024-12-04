import "./Field.css"

/**
 * 
 * @param {string} className 
 * @param {string} label
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 */
export default function Field(props) {
    const { className="", label, children, ...rest } = props;

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
            <input className={`field-input ${className}`} {...rest} />
        </div>
    );
}