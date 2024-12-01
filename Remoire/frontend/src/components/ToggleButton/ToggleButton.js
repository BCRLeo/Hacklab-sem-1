import "./ToggleButton.css"

import { useState } from "react";

/**
 * ToggleButton is a component that toggles between two states, rendering different content and labels for each state.
 * It accepts two sets of content and labels, one for each state (before and after), and an optional callback function 
 * that triggers when the button is clicked.
 *
 * @param {Object} labels - The labels to display for the two states of the button.
 * @param {string} [labels.before] - The label to display when the button is in its default state (before toggle).
 * @param {string} [labels.after] - The label to display when the button is toggled (after toggle).
 * @param {Object} content - The content to display inside the button for the two states.
 * @param {React.ReactNode} content.before - The content to display in the default state (before toggle).
 * @param {React.ReactNode} content.after - The content to display in the toggled state (after toggle).
 * @param {boolean} isToggles - Indicates whether the button is in the toggled state.
 * @param {function} [onClick] - An optional callback function that is called when the button is clicked.
 *
 * @returns {JSX.Element} A toggleable button component.
 * 
 * @example
 * // Rendering an edit toggle button
 * <ToggleButton labels={{"before": "Edit", "after": "Done"}} content={{"before": <Icon name="editIcon" />, "after": <Icon name="checkIcon" />}} />
 */

export default function ToggleButton({ labels, content, isToggled, onClick }) {
    return (
        <button className="togglebutton" type="button" onClick={onClick}>
            {isToggled ?
                <>
                    {content.after}
                    {labels.after ? <span className="togglebutton-text">{labels.after}</span> : <></>}
                </>
            :
                <>
                    {content.before}
                    {labels.before ? <span className="togglebutton-text">{labels.before}</span> : <></>}
                </>
            }
        </button>
    );
}