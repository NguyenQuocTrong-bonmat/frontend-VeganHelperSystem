import HeaderGuest from '../../components/layout/HeaderGuest';
import SearchCore from '../../components/home/SearchCore';

function SearchResultsGuest() {
  return (
    <>
      <HeaderGuest />
      <SearchCore isGuest={true} />
    </>
  );
}

export default SearchResultsGuest;
