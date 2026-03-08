import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Sidebar } from '../../components/Sidebar';
import { getSessionSecret } from '../../lib/session-secret';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('prosaas_session')?.value;
  if (!token) return null;
  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(token, secret);
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar username={user?.username} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
