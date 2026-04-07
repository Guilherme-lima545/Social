'use client';
import { useFeed } from '@/Hook/feed';
import Image from 'next/image';
import styles from '@/styles/photofeed.module.css';
import { useState } from 'react';
import Feedmodal from './Feedmodal';

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
  likes: number;
  idade: number;
  title: string;
  author: string;
  acessos: number;
  user_id: number;
};

export default function userphotopage({ userId }: { userId: number }) {
  const { photos } = useFeed({
    user: userId,
  });
  const [modalphoto, setModalphoto] = useState<Photo | null>(null);

  return (
    <div className={styles.photofeed}>
      {modalphoto && (
        <Feedmodal photo={modalphoto} onclose={() => setModalphoto(null)} />
      )}
      {photos.map((photo) => (
        <div key={photo.id} className={styles.photo}>
          {photo?.src && (
            <Image
              src={photo.src}
              alt={photo.title}
              width={200}
              height={200}
              onClick={() => setModalphoto(photo)}
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
