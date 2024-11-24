import "./Icon.css"

import { ReactComponent as AccountIcon } from "../../assets/icons/icon__account-circle.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/icons/icon__arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/icon__arrow-right.svg";
import { ReactComponent as SearchIcon } from "../../assets/icons/icon__search.svg";

/**
 * The Icon component renders an SVG icon as a React component based on the given name prop.
 *
 * This component dynamically renders one of defined SVG icons: `AccountIcon`, `ArrowLeftIcon`,
 * `ArrowRightIcon`, or `SearchIcon` based on the value passed in the `name` prop. Additional
 * SVG properties can be passed and will be spread onto the rendered SVG component.
 *
 * @param {Object} props - The props object for the MyIcon component.
 * @param {'accountIcon' | 'arrowLeftIcon' | 'arrowRightIcon' | 'searchIcon'} props.name - The name of the icon to render. It must be one of 'arrowIcon', 'avatarIcon', or 'dashboardIcon'.
 * @param {Object} [props.svgProps] - Any additional props to be spread to the SVG component (e.g., width, height, className, etc.).
 * @returns {JSX.Element|null} - Returns the corresponding SVG component for the specified icon name, or `null` if the name is invalid.
 *
 * @example
 * // Rendering an arrow icon with additional styling
 * <Icon name="arrowIcon" className="custom-class" width="24" height="24" />
 *
 * @example
 * // Rendering an avatar icon
 * <Icon name="avatarIcon" />
 */
export default function Icon(props) {
    const { name, ...svgProps } = props;

    const Icons = {
        accountIcon: <AccountIcon className="icon" {...svgProps} />,
        arrowLeftIcon: <ArrowLeftIcon className="icon" {...svgProps} />,
        arrowRightIcon: <ArrowRightIcon className="icon" {...svgProps} />,
        searchIcon: <SearchIcon className="icon" {...svgProps} />,
    };

    return Icons[name] || null;
}