'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/header.module.css';
import { USER_GET } from '@/app/api/route';
import Usemedia from '@/Hook/Usemedia';
import { useEffect, useState } from 'react';
import { Getcookies } from '@/actions/cookie';

type User = {
  nome: string;
};

export default function Header({ children }: { children?: React.ReactNode }) {
  const mobile = Usemedia('(max-width: 40rem)');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const token = await Getcookies('token');
      setToken(token.value);

      const user = await USER_GET(token.value);
      setUser(user);
    }

    getUser();
  }, []);

  return (
    <div>
      {mobile && (
        <button
          aria-label="Menu"
          className={`${styles.mobileButton} ${
            mobileMenu ? styles.mobileButtonActive : ''
          }`}
          onClick={() => setMobileMenu(!mobileMenu)}
        />
      )}

      <header className={styles.header}>
        <nav
          className={
            mobile
              ? `${styles.navMobile} ${
                  mobileMenu ? styles.navMobileActive : ''
                }`
              : styles.nav
          }
        >
          <Link href="/">
            <Image
              src="/Assests/SOCIAL.png"
              width={180}
              height={180}
              alt="Logo"
              className={styles.logo}
            />
          </Link>

          {token && user?.nome ? (
            <Link href={`/perfil/${user.nome}`} className={styles.login}>
              {user.nome}
            </Link>
          ) : (
            <Link href="/login" className={styles.login}>
              Usuario / Criar Usuario
            </Link>
          )}

          <Link href="/news" className={styles.apoie}>
            Noticias 📰
          </Link>

          <Link href="/apoie" className={styles.apoie}>
            Apoiar
          </Link>
        </nav>
      </header>

      <div>{children}</div>
    </div>
  );
}