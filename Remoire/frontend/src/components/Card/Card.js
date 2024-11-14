import "./Card.css"

const Card = ({ id, className, children }) => {
    if (children) {
        return (
            <div id={id} className={`card ${className}`}>
                {children}
            </div>
        );
    }
}

export default Card;