'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from '@/styles/userheader.module.css';
import USERHEADERNAV from './userheadernav';
import avatardefault from '../../public/Assests/avatar-default.jpg';
import { PROFILE_LIKE, PROFILE_LIKE_GET } from '@/app/api/route';
import LikesModal from './likesModal';

type Props = {
  user: {
    id: number;
    nome: string;
    username?: string;
    avatar_url?: string;
    likes?: {
      total: number;
      already_liked: boolean;
    };
  } | null;
  login?: boolean;
  isOwner?: boolean;
};

type UserLike = {
  users: {
    id: number;
    name: string;
  }[];
  likedByCurrentUser: boolean;
};

export default function UserHeader({ user, login, isOwner }: Props) {
  const [title, setTitle] = useState<React.ReactNode>(null);
  const [Liked, setLiked] = useState(false);
  const [modallike, setModallike] = useState<UserLike | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;
    setLiked(user?.likes?.already_liked || false);
    setLikeCount(user?.likes?.total || 0);
  }, [user]);

  async function handleLike(profile: string) {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (Liked ? prev - 1 : prev + 1));

    const res = await PROFILE_LIKE(profile);

    if (res?.error) {
      alert(res.error);
      setLiked(Liked);
      setLikeCount((prev) => (Liked ? prev + 1 : prev - 1));
      return;
    }

    const data = await PROFILE_LIKE_GET(profile);
    if (!data?.likes) return;

    setLikeCount(data.likes.total);
    setLiked(data.likes.already_liked);
  }

  async function handleOpenLikes(profile: string) {
    const data = await PROFILE_LIKE_GET(profile);

    if (!data?.likes?.liked_by || data.likes.liked_by.length === 0) return;

    setModallike({
      users: data.likes.liked_by.map(
        (u: { id: number; name: string; avatar_url?: string }) => ({
          id: u.id,
          name: u.name,
          avatar_url: u.avatar_url || '',
        }),
      ),
      likedByCurrentUser: data.likes.already_liked,
    });
  }

  useEffect(() => {
    if (!user) return;
    const nome = user.username || user.nome;
    const isPerfilRoute = pathname === `/perfil/${nome}`;
    const isProfileRoute = pathname === `/profile/${nome}`;
    switch (true) {
      case isPerfilRoute || isProfileRoute:
        setTitle(
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={user.avatar_url || avatardefault.src}
              alt={user.nome}
              width={74}
              height={74}
              style={{ borderRadius: '50' }}
            />

            <h1 className="title">
              {!login ? `Olá, ${user.nome}` : user.nome}
            </h1>

            {login && !isOwner && (
              <>
                <button
                  onClick={() =>
                    handleLike(user.username || user.id.toString())
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{Liked ? '❤️' : '🤍'}</span>
                </button>
                <span
                  className={styles.likecount}
                  onClick={() =>
                    handleOpenLikes(user.username || user.id.toString())
                  }
                >
                  {likeCount}
                </span>
              </>
            )}
          </div>,
        );
        break;

      case pathname === `/perfil/${user.nome}/avatar`:
        setTitle('Alterar Avatar');
        break;

      case pathname === `/perfil/${user.nome}/uploadphoto`:
        setTitle('Envie sua foto');
        break;

      case pathname === `/perfil/${user.nome}/uploadvideo`:
        setTitle('Envie seu video');
        break;

        
      case pathname === `/perfil/${user.nome}/estatisticas`:
        setTitle('Estatisticas');
        break;

      default:
        setTitle('Início');
    }
  }, [pathname, user, login, isOwner, Liked, likeCount]);

  return (
    <>
      {modallike && (
        <LikesModal like={modallike} onclose={() => setModallike(null)} />
      )}
      <section className="container">
        <header className={styles.header}>
         <h1 className="title"> {title} </h1>
          {user && <USERHEADERNAV user={user} login={login} />}
        </header>
      </section>
    </>
  );
}
