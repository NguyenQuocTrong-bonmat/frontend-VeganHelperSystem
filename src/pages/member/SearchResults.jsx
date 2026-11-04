import HeaderMember from '../../components/layout/HeaderMember';
import SearchCore from '../../components/home/SearchCore';
import AIChatbot from '../../components/chat/AIChatbot';

function SearchResults() {
  return (
    <>
      <HeaderMember />
      <SearchCore isGuest={false} />
      <AIChatbot />
    </>
  );
}

export default SearchResults;
