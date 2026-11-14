import {vi} from 'vitest';
import {getPostDetail} from './postService';
import {fetchPostDetailsWithCache, getCachedPostDetails, clearPostDetailsCache} from './postDetailsCache';
vi.mock('./postService',()=>({getPostDetail:vi.fn()}));
beforeEach(()=>{localStorage.clear();sessionStorage.clear();clearPostDetailsCache();vi.clearAllMocks();});
test('member cached flags are not reused for a guest or a different member',async()=>{
  localStorage.setItem('accessToken','member-a');
  getPostDetail.mockResolvedValueOnce({id:244,isLiked:true,isSaved:true});
  await fetchPostDetailsWithCache(244);
  expect(getCachedPostDetails(244).isSaved).toBe(true);
  localStorage.clear();
  expect(getCachedPostDetails(244)).toBeNull();
  getPostDetail.mockResolvedValueOnce({id:244,isLiked:false,isSaved:false});
  expect((await fetchPostDetailsWithCache(244)).isLiked).toBe(false);
  localStorage.setItem('accessToken','member-b');
  expect(getCachedPostDetails(244)).toBeNull();
});
test('late response from a logged-out member cannot populate guest cache',async()=>{
  localStorage.setItem('accessToken','member-a');
  let resolve;
  getPostDetail.mockImplementationOnce(()=>new Promise(r=>{resolve=r;}));
  const old=fetchPostDetailsWithCache(244);const check=expect(old).rejects.toThrow('Session changed');
  await Promise.resolve();localStorage.clear();resolve({id:244,isLiked:true,isSaved:true});
  await check;expect(getCachedPostDetails(244)).toBeNull();
  getPostDetail.mockResolvedValueOnce({id:244,isLiked:false,isSaved:false});
  expect((await fetchPostDetailsWithCache(244)).isSaved).toBe(false);
});
test('deduplicates same-session requests',async()=>{
  getPostDetail.mockResolvedValue({id:244});
  await Promise.all([fetchPostDetailsWithCache(244),fetchPostDetailsWithCache(244)]);
  expect(getPostDetail).toHaveBeenCalledTimes(1);
});
