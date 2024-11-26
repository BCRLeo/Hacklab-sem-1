import "./Bar.css"

/**
 * 
 * @param {"horizontal" | "vertical"} orientation - The orientation in which the bar elements should be arranged
 * @param {React.ReactNode} children - The elements to be placed in the bar
 * 
 * @returns {JSX.Element}
 */

export default function Bar({ orientation, children }) {
    return (
        <div className={orientation ? `bar ${orientation}` : "bar"}>
            {children}
        </div>
    );
}