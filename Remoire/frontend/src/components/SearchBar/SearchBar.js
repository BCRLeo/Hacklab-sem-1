import './SearchBar.css';
import IconSearch from "../../assets/icons/icon__search.svg";

const SearchBar = () => {
  return (
    <div className="searchbar">
        <div className="searchbar-container">
            <img src={IconSearch} alt="search icon" />
        </div>
    </div>
  );
};

export default SearchBar;