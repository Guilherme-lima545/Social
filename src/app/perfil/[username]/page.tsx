import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Feeduserphoto from '@/components/Feeduserphoto';
import FeeduserVideo from '@/components/FeeduserVideo';
import { USER_GET } from '@/app/api/route';
import styles from '@/styles/menu.module.css';
import Link from 'next/link';


export default async function perfilPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab = 'fotos' } = await searchParams;


  if (!username || username === 'undefined') {
    redirect('/login');
  }

  const token = (await cookies()).get('token')?.value || '';

  if (!token) {
    redirect('/login');
  }

  const iduser = await USER_GET(token);

  if (iduser.nome !== username) {
    redirect('/login');
  }

  return (
    <>
      <section className="container">
        <nav className={styles.menu}>
          <Link href={`/perfil/${username}?tab=fotos`}>
            <li className={tab === 'fotos' ? styles.active : ''}> Fotos </li>
          </Link>
          <Link href={`/perfil/${username}?tab=videos`}>
            <li className={tab === 'videos' ? styles.active : ''}> Videos </li>
          </Link>
        </nav>
        {tab === 'fotos' && <Feeduserphoto userId={iduser.id} />}
        {tab === 'videos' && <FeeduserVideo userId={iduser.id} username={username} />}
      </section>
    </>
  );
}
