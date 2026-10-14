import axiosInstance from '../lib/axios';
import { getPublicProfile } from './userService';
jest.mock('../lib/axios', () => ({ get: jest.fn() }));
beforeEach(() => jest.clearAllMocks());
test.each(['', undefined, '0', '-1', 'abc', '1.2', '9223372036854775808'])('invalid ID %s sends no request', async id => {
  await expect(getPublicProfile(id)).rejects.toMatchObject({ status: 400 }); expect(axiosInstance.get).not.toHaveBeenCalled();
});
test('supports Int64 IDs without rounding', async () => {
  axiosInstance.get.mockResolvedValue({ data: { id: '9223372036854775807' } });
  await getPublicProfile('9223372036854775807'); expect(axiosInstance.get).toHaveBeenCalledWith('/users/9223372036854775807/profile');
});
