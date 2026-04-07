'use client';
import { PHOTOGETUSER, USER_GET } from '@/app/api/route';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '@/styles/PhotoGetUser.module.css';
import { Getcookies } from '@/actions/cookie';
import PhotoDelete from './PhotoDelete';
import Link from 'next/link';
import PhotoComents from './PhotoComents';
import { redirect } from 'next/navigation';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

type PhotoItem = {
  id: number;
  user_id: number;
  acessos: number;
  likes: number;
  idade: number;
  author: string;
  src: string;
  title: string;
  descricao: string;
};

type PhotoResponse = {
  comments: Coment[];
  photo: PhotoItem;
};

export default function PhotoGetItem({ id, single }: { id: string } & { single?: boolean }) {
  const [photo, setPhoto] = useState<PhotoResponse[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const token = await Getcookies('token');
      const data = await USER_GET(token.value);
      setUser(data);
    }

    async function getPhoto() {
      const data = await PHOTOGETUSER(id);
      setPhoto(data);
    }

    getPhoto();
    getUser();
  }, [id]);


  
  function handleDeletePhoto(id: number) {
    redirect('/')
  }

  return (
    <div className={`${styles.photo} ${single ? styles.single : ''}`}>
      {photo?.map((photo) => (
        <div key={photo.photo.id} className={styles.containerphotoitem}>
          <div>
            <Image
              src={photo.photo.src}
              alt={photo.photo.title}
              width={500}
              height={500}
            />
          </div>
          <div className={styles.details}>
            <div>
              <div className={styles.author}>
                {user?.nome === photo.photo.author ? (
                  <PhotoDelete user={user} photo={photo.photo} onDelete={handleDeletePhoto} />
                ) : (
                  <Link href={`/profile/${photo.photo.author}`}>
                    @{photo.photo.author}
                  </Link>
                )}
                <span className={styles.visualizacoes}>
                  {photo.photo.acessos}
                </span>
              </div>
              <h1 className={`title ${styles.title}`}>{photo.photo.title}</h1>
              <ul className={styles.attributes}>
                <li> {photo.photo.idade} anos</li>
              </ul>

              <ul className={styles.attributes}>
                <li>{photo.photo.descricao}</li>
              </ul>
            </div>
          </div>
          
          <PhotoComents
            single={single}
            id={photo.photo.id}
            comments={photo.comments ?? []}
            likes={photo.photo.likes}
          />
        </div>
      ))}
    </div>
  );
}
