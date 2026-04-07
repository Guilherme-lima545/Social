'use client';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import AsideUsers from '@/components/asideUsers';
import Feedphotos from '@/components/Feedphotos';
import Feedvideos from '@/components/Feedvideos';
import Loading from '@/components/loading';
import Feedmodal from '@/components/Feedmodal';


type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

type Photo = {
  id: number;
  src: string;
  descricao: string;
  comments?: Coment[];
  idade: number;
  likes: number;
  title: string;
  author: string;
  acessos: number;
  user_id: number;
};

export default function Home() {
  const [tab, setTab] = useState<'fotos' | 'videos'>('fotos');
  const [loading, setLoading] = useState(true);
  const [modalphoto, setModalphoto] = useState<Photo | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  if (loading) return <Loading />;

  return (
    <>
       {modalphoto && (
      <Feedmodal
        photo={modalphoto}
        onclose={() => setModalphoto(null)}
      />
    )}
      <div className={styles.page}>
        <nav className={tab === 'fotos' ? styles.menu : styles.menuvideo}>
          <ul>
            <li
              onClick={() => setTab('fotos')}
              className={tab === 'fotos' ? styles.active : ''}
            >
              Fotos
            </li>
            <li
              onClick={() => setTab('videos')}
              className={tab === 'videos' ? styles.active : ''}
            >
              Vídeos
            </li>
          </ul>
        </nav>
        <div
          className={`animeLeft container mainContainer ${styles.layoutWithAside}`}
        >
          {tab === 'fotos' && <Feedphotos setModalphoto={(photo) => setModalphoto(photo)} />}
          {tab === 'videos' && <Feedvideos setTab={setTab} />}
          {tab === 'fotos' && (
            <div className={styles.asideWrapper}>
              <AsideUsers />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
