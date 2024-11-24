import "./Field.css"

export default function Field({ label, type, name, placeholder, onChange, children }) {
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
            <input className="field-input" onChange={onChange} type={type} name={name} placeholder={placeholder} />
        </div>
    );
}