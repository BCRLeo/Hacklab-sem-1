import "./Card.css"

export default function Card({ id, className = "", children, ref }) {
    if (children) {
        return (
            <div id={id} className={`card ${className}`} ref={ref}>
                {children}
            </div>
        );
    }
}