import "./Card.css"

const Card = ({ id, children }) => {
    if (children) {
        return (
            <div id={id} className="card">
                {children}
            </div>
        );
    }
}

export default Card;