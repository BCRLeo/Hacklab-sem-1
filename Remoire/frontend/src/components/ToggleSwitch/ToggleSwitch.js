import "./ToggleSwitch.css"

export default function ToggleSwitch() {
    return (
        <label class="toggleswitch">
            <input type="checkbox" />
            <span class="toggleswitch-slider"></span>
        </label>
    );
}