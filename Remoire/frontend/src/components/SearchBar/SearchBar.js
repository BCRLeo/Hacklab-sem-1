import './SearchBar.css';
import IconSearch from "../../assets/icons/icon__search.svg";
import { Link } from 'react-router-dom';

export default function SearchBar() {
	return (
		<div className="searchbar">
			<div className="searchbar-container">
				<Link to="/search"><img src={IconSearch} alt="search icon" /></Link>
			</div>
		</div>
	);
}