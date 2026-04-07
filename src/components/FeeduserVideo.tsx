'use client';
import { useFeed } from '@/Hook/feed';
import Loading from './loading';
import styles from '@/styles/videouserfeed.module.css';
import { useState } from 'react';
import Feedmodal from './Feedmodal';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

type Video = {
 id: number;
  user_id: number,
  title: string;
  media_type: string;
  excerpt: string;
  author: string;
  date: Date;
  video: string;
  thumbnail: string;
  likes: number;
  comments?: Coment[];
  commentsCount: number;
  acessos: number
}

export default function uservideopage({ userId, username}: { userId: number, username: string }) {
  const [modal, setModal] = useState<Video | null>(null)
  const { videos, loading } = useFeed({
    user: userId,
    username
  });

  if (loading) return <Loading />;

  return (
    <>
     {modal && (
            <Feedmodal video={modal} onclose={() => setModal(null)} />
          )}
    <div className={styles.videofeed}>
      {videos.map((video) => (
        <div key={video.id} className={styles.video}>
          {video && (
            <video width="200" height="200"  onClick={() => setModal(video)}>
              <source src={video.video} type="video/mp4" />
            </video>
          )}
        </div>
      ))}
    </div>
    </>
  );
}
