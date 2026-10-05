import HeaderMember from '../../components/layout/HeaderMember';
import SearchCore from '../../components/home/SearchCore';

function SearchResults() {
  return (
    <>
      <HeaderMember />
      <SearchCore isGuest={false} />
    </>
  );
}

export default SearchResults;
