import HeaderGuest from '../../components/layout/HeaderGuest';
import SearchCore from '../../components/home/SearchCore';
import AIChatbot from '../../components/chat/AIChatbot';

function SearchResultsGuest() {
  return (
    <>
      <HeaderGuest />
      <SearchCore isGuest={true} />
      <AIChatbot />
    </>
  );
}

export default SearchResultsGuest;
