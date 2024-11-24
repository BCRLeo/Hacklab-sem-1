import './SearchBar.css';
import IconSearch from "../../assets/icons/icon__search.svg";
import Icon from '../Icon/Icon';
import { Link } from 'react-router-dom';

export default function SearchBar() {
	return (
		<div className="searchbar">
			<Link to="/search"><Icon name="searchIcon" /></Link>
			<div className="searchbar-container">
				<input type="text" name="search" placeholder="Search" />
			</div>
		</div>
	);
}