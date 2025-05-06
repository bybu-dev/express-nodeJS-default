import { SocketRepository } from '@/repositories/socket';
import { connection } from '@/utils/lib/socket';

describe('SocketRepository', () => {
  it('should return the mocked connection', () => {
    const repo = new SocketRepository();
    expect(repo.getConnection).toBe(connection);
  });
});
