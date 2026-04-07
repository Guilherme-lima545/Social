import { Getcookies } from '@/actions/cookie';
import { PROFILE_GET, PROFILE_LIKE_GET, USER_GET } from '@/app/api/route';
import styles from '@/styles/Profile.module.css';
import Link from 'next/link';
import Feeduserphoto from '@/components/Feeduserphoto';
import FeeduserVideo from '@/components/FeeduserVideo';
import UserHeader from '@/components/userheader';

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { username } = await params;
  const { tab = 'fotos' } = await searchParams;

  const token = await Getcookies('token');
  const loggedUser = token?.value ? await USER_GET(token.value) : null;

  const profileUser = await PROFILE_GET(username);
  const profileWithLikes = await PROFILE_LIKE_GET(username);
  const isOwner = loggedUser?.nome === username;

  const userWithLikes = {
  ...profileUser,
  likes: {
    total: profileWithLikes?.likes?.total || 0,
    already_liked: profileWithLikes?.likes?.already_liked || false,
  },
};

  return (
    <>
      <section className="container">
        <UserHeader user={userWithLikes} login={!!loggedUser} isOwner={isOwner} />
        <nav className={styles.menu}>
          <Link href={`/profile/${username}?tab=fotos`}>
            <li className={tab === 'fotos' ? styles.active : ''}> Fotos </li>
          </Link>
          <Link href={`/profile/${username}?tab=videos`}>
            <li className={tab === 'videos' ? styles.active : ''}> Videos </li>
          </Link>
        </nav>
          {tab === 'fotos' && <Feeduserphoto userId={profileUser.id} />}
          {tab === 'videos' && <FeeduserVideo userId={profileUser.id} username={username} />}
      </section>
    </>
  );
}
