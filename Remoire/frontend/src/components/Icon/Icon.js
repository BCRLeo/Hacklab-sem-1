import "./Icon.css"

import { ReactComponent as AccountIcon } from "../../assets/icons/icon__account-circle.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/icons/icon__arrow-left.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/icon__arrow-right.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/icon__check.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/icon__edit.svg";
import { ReactComponent as LogoIcon } from "../../assets/icons/icon__logo.svg";
import { ReactComponent as SearchIcon } from "../../assets/icons/icon__search.svg";

/**
 * The Icon component renders an SVG icon as a React component based on the given name prop.
 *
 * This component dynamically renders one of defined SVG icons: `AccountIcon`, `ArrowLeftIcon`,
 * `ArrowRightIcon`, or `SearchIcon` based on the value passed in the `name` prop. Additional
 * SVG properties can be passed and will be spread onto the rendered SVG component.
 *
 * @param {Object} props - The props object for the MyIcon component.
 * @param {'accountIcon' | 'arrowLeftIcon' | 'arrowRightIcon' | "checkIcon" | "editIcon" | "logoIcon" | 'searchIcon'} props.name - The name of the icon to render.
 * @param {"xs" | "sm" | "md" | "lg" | "xl" | "xll"} props.size - The size of the icon to render. 
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
    const { name, size = "sm", className, ...svgProps } = props;

    const Icons = {
        accountIcon: <AccountIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
        arrowLeftIcon: <ArrowLeftIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
        arrowRightIcon: <ArrowRightIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
        checkIcon: <CheckIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
        editIcon: <EditIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
        logoIcon: <LogoIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
        searchIcon: <SearchIcon className={`icon ${size} ${className ? className : ""}`} {...svgProps} />,
    };

    return Icons[name] || null;
}