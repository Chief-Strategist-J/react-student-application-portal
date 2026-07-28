import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApplicantsApi } from '../../repository';

describe('ApplicantsDashboard Repository Unit Test', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchApplicantsApi retrieves applicants with all API fields mapped', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
        company: { name: 'Romaguera-Crona' },
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      })
    );

    const applicants = await fetchApplicantsApi();
    expect(applicants).toHaveLength(1);
    expect(applicants[0].name).toBe('Leanne Graham');
    expect(applicants[0].username).toBe('Bret');
    expect(applicants[0].website).toBe('hildegard.org');
    expect(applicants[0].company?.name).toBe('Romaguera-Crona');
    expect(applicants[0].status).toBe('Pending');
  });
});
