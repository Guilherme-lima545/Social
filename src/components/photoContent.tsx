import styles from '@/styles/photoContent.module.css';
import Image from 'next/image';
import PhotoComments from './PhotoComents';
import PhotoDelete from './PhotoDelete';
import Link from 'next/link';
import { USER_GET } from '@/app/api/route';
import { Getcookies } from '@/actions/cookie';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

type PhotoContentProps = {
  photo: {
    id: number;
    src: string;
    title: string;
    author: string;
    acessos: number;
    likes: number;
    idade: number;
    descricao: string;
    comments?: Coment[];
    user_id: number;
  };
};

export default function PhotoContent({
  photo,
  single = false,
}: PhotoContentProps & { single?: boolean }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const token = Getcookies('token');

      if (!token) return;

      const response = await USER_GET((await token).value);
      setUser(response);
    }

    getUser();
  }, []);

  function handleDownload(url: string) {
  const link = document.createElement('a');
  link.href = photo.src;
  link.download = photo.title || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.open(url, '_blank', 'noopener,noreferrer');
}


function handleDeletePhoto(id: number) {
  redirect('/')
}

  return (
    <div className={`${styles.photo} ${single ? styles.single : ''}`}>
      <div className={styles.img}>
        <Image src={photo.src} alt={photo.title} width={500} height={500} />
      </div>
      <div className={styles.details}>
        <div>
          <div className={styles.author}>
            {user?.nome === photo.author ? (
              <PhotoDelete user={user}  photo={photo} onDelete={handleDeletePhoto} />
            ) : (
              <Link href={`/profile/${photo.author}`}>@{photo.author}</Link>
            )}
            <button  type='button' onClick={() => handleDownload(photo.src)} className={styles.buttondownload}> Download </button>
            <span className={styles.visualizacoes}>{photo.acessos}</span>
          </div>
          <h1 className="title">
            <Link href={`/photo/${photo.id}`}>{photo.title}</Link>
          </h1>
          <ul className={styles.attributes}>
            <li> {photo.idade} anos</li>
          </ul>
          <ul className={styles.attributes}>
            <li>{photo.descricao}</li>
          </ul>
        </div>
      </div>
      <PhotoComments
        single={single}
        id={photo.id}
        comments={photo.comments ?? []}
        likes={photo.likes}
      />
    </div>
  );
}
