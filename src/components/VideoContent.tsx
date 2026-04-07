import styles from '@/styles/videocontent.module.css';
import PhotoComments from './PhotoComents';
import Link from 'next/link';
import { USER_GET } from '@/app/api/route';
import { Getcookies } from '@/actions/cookie';
import { useEffect, useState } from 'react';
import VideoDeleteModal from './VideoDeleteModal';
import { redirect } from 'next/navigation';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

type VideoProps = {
  video: {
    id: number;
    user_id: number;
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
    acessos: number;
  };
};

export default function VideoContent({
  video,
  single = false,
}: VideoProps & { single?: boolean }) {
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

  async function handleDownload(videoUrl: string, title: string) {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'video'}.mp4`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar vídeo:', error);
  }
}

function handleDeleteVideo() {
  redirect('/')
}



  return (
    <div className={`${styles.video} ${single ? styles.single : ''}`}>
      <div className={styles.videoWrapper}>
        <video autoPlay muted controls>
          <source src={video.video} type="video/mp4" />
        </video>
      </div>
      <div className={styles.details}>
        <div>
          <div className={styles.author}>
            {user?.nome === video.author ? (
              <VideoDeleteModal user={user} video={video} onDelete={handleDeleteVideo} />
            ) : (
              <Link href={`/profile/${video.author}`}>@{video.author}</Link>
            )}
               <button  type='button' onClick={() => handleDownload(video.video, video.title)} className={styles.buttondownload}> Download </button>
            <span className={styles.visualizacoes}>{video.acessos}</span>
          </div>
          <h1 className={`title ${styles.title}`} >
            {video.title}
          </h1>
          <ul className={styles.attributes}>
            <li>{video.excerpt}</li>
          </ul>
        </div>
      </div>
      <PhotoComments
        single={single}
        id={video.id}
        comments={video.comments ?? []}
        likes={video.likes}
      />
    </div>
  );
}
