'use client';
import Image from 'next/image';
import styles from '../app/page.module.css';
import { useFeed } from '@/Hook/feed';
import { ErrorMessage } from '@/Helper/Error';
import { useEffect } from 'react';

type Coment = {
  id: number;
  comment_ID: number
  comment_content: string;
  comment_author: string;
};

type Photo = {
  id: number;
  src: string;
  descricao: string;
  comments?: Coment[];
  likes: number;
  idade: number;
  title: string;
  author: string;
  acessos: number;
  user_id: number;
};

export default function Feedphotos({
  setModalphoto,
}: {
  setModalphoto: (photo: Photo) => void;
}) {
  const { photos, error, infinite, loadPhotos, loading } = useFeed({
    total: 4,
    user: 0,
  });

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loading &&
        infinite
      ) {
        loadPhotos();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, infinite, loadPhotos]);

  return (
    <>
      <section className={styles.mainContent}>
        <ul className={styles.feed}>
          {photos.map((photo) => (
            <li key={photo.id} className={styles.photo} onClick={() => setModalphoto(photo)}>
              {photo?.src ? (
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={500}
                  height={500}
                  sizes="80vw"
                  layout="responsive"
                />
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p></p>
              )}
            </li>
          ))}
        </ul>
        {error && <ErrorMessage error={error} />}
        {!infinite && (
          <div>
            <p> Não há mais fotos para carregar. </p>
          </div>
        )}
      </section>
    </>
  );
}
