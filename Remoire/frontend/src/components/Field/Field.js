import "./Field.css"

const Field = ({ label, type, name, placeholder, onChange, children }) => {
    if (children) {
        return (
            <div className="field">
                {label && <h3>{label}</h3>}
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
};

export default Field;