'use client';
import Link from 'next/link';
import styles from '@/styles/userheadernav.module.css';
import { REMOVECOOKIE } from '@/actions/cookie';
import Usemedia from '@/Hook/Usemedia';
import { useState } from 'react';

type User = {
  nome: string;
};

type Props = {
  user: User | null;
  login?: boolean;
  isOwner?: boolean;
};

export default function USERHEADERNAV({ user, login, isOwner }: Props) {
  const mobile = Usemedia('(max-width: 50rem)');
  const [mobileMenu, setMobileMenu] = useState(false);

  if (!user) return null;

  return (
    <>
      {mobile && (
        <button
          aria-label="Menu"
          className={`${styles.mobileButton} ${mobileMenu && styles.mobileButtonActive}`}
          onClick={() => setMobileMenu(!mobileMenu)}
        ></button>
      )}
        <nav
          className={`${mobile ? styles.navMobile : styles.nav}
         ${mobileMenu ? styles.navMobileActive : ''}`}
        >
          {!login ? (
            <>
              <Link href={`/perfil/${user.nome}`}>
                <img src="/Assests/feed.svg" alt="Feed" />
              </Link>
              <Link href={`/perfil/${user.nome}/avatar`}>
                <img src="/Assests/avatar.svg" alt="Adicionar Avatar" />
              </Link>
              <Link href={`/perfil/${user.nome}/estatisticas`}>
                <img src="/Assests/estatisticas.svg" alt="estatisticas" />
              </Link>
              <Link href={`/perfil/${user.nome}/uploadphoto`}>
                <img src="/Assests/adicionar.svg" alt="Adicionar Foto" />
              </Link>
              <Link href={`/perfil/${user.nome}/uploadvideo`}>
                <img src="/Assests/AdicionarVideo.png" alt="Adicionar Video" />
              </Link>
              <button onClick={REMOVECOOKIE}>
                <img src="/Assests/sair.svg" alt="Logout" />
              </button>
            </>
          ) : null}
        </nav>
    </>
  );
}
