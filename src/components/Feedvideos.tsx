'use client';
import styles from '@/styles/videofeed.module.css';
import { useFeed } from '@/Hook/feed';
import { ErrorMessage } from '@/Helper/Error';
import Loading from './loading';
import Link from 'next/link';
import seta from '@/../public/Assests/white-arrow-73.png';
import { COMMENT_GET, LIKE_GET, LIKE_POST, USER_GET } from '@/app/api/route';
import { useEffect, useState } from 'react';
import { Getcookies } from '@/actions/cookie';
import LikesModal from './likesModal';
import CommentsModal from './commentsModal';
import VideoDelete from './videodelete';

type videolike = {
  id?: number;
  likes?: number;
  single?: boolean;
};

type FeedVideosProps = videolike & {
  setTab: (tab: 'fotos' | 'videos') => void;
};

type UserLike = {
  users: {
    id: number;
    name: string;
  }[];
  likedByCurrentUser: boolean;
};

type UserComments = {
  userscoment: {
    id: number;
    comment_ID: number;
    comment_author: string;
    comment_content: string;
  }[];
  commentByCurrentUser: boolean;
};

type User = {
  id: number;
  roles: string;
  username: string;
};

export default function Feedvideos({
  setTab,
  id,
  likes: initialLikes = 0,
}: FeedVideosProps) {
  const { error, infinite, videos, loading } = useFeed({
    total: 3,
    user: 0,
  });
  const [videostate, setVideostate] = useState(videos);
  const [likedMap, setLikedMap] = useState<{ [key: number]: boolean }>({});
  const [token, setToken] = useState<string | null>(null);
  const [modallike, setModallike] = useState<UserLike | null>(null);
  const [modalcomments, setModalcomments] = useState<UserComments | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setVideostate(videos);

    async function Fetchcookies() {
      const token = await Getcookies('token');

      if (token?.value) {
        setToken(token.value);
      }

      const DataUser = await USER_GET(token.value);

      setUser({
        id: DataUser.id,
        username: DataUser.nome,
        roles: DataUser.roles === 'administrator' ? 'admin' : 'subscriver',
      });
    }

    async function getLikes() {
      const token = await Getcookies('token');
      if (!token?.value) return;

      const user = await USER_GET(token.value);
      const userId = user.id;

      const newLikedMap: { [key: number]: boolean } = {};

      for (const video of videos) {
        const data = await LIKE_GET({ id: video.id });

        if (!data || !Array.isArray(data.users)) continue;

        const hasLiked = data.users.some((u: any) => u.id === userId);

        newLikedMap[video.id] = hasLiked;
      }

      setLikedMap(newLikedMap);
    }

    if (videos.length) {
      getLikes();
    }

    Fetchcookies();
  }, [videos, id]);

  async function handlelike(id: number) {
    const alreadyLiked = likedMap[id];
    const res = await LIKE_POST({ id });

    if (res?.error) {
      alert(res.error);
      return;
    }

    setVideostate((prev) =>
      prev.map((video) =>
        video.id === id
          ? {
              ...video,
              likes: alreadyLiked
                ? Math.max(0, video.likes - 1)
                : video.likes + 1,
            }
          : video,
      ),
    );

    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  async function handleOpenLikes(videoId: number) {
    const data = await LIKE_GET({ id: videoId });

    if (!data || !Array.isArray(data.users)) return;

    setModallike(data);
  }

  async function handleOpencomment(videoId: number) {
    const data = await COMMENT_GET({ id: videoId });

    let commentsArray = [];

    if (Array.isArray(data)) {
      commentsArray = data;
    } else if (Array.isArray(data?.userscoment)) {
      commentsArray = data.userscoment;
    } else {
      return;
    }

    setVideostate((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? {
              ...video,
              comments: commentsArray,
              commentsCount: commentsArray.length,
            }
          : video,
      ),
    );

    setCurrentVideoId(videoId);
    setModalcomments({
      userscoment: commentsArray,
      commentByCurrentUser: false,
    });
  }

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

function handleDeleteVideo(id: number) {
  setVideostate(prev => prev.filter(video => video.id !== id));
}

  if (loading) return <Loading />;


  return (
    <>
      {modallike && (
        <LikesModal like={modallike} onclose={() => setModallike(null)} />
      )}
      {modalcomments && currentVideoId !== null && (
        <CommentsModal
          comment={modalcomments}
          videoId={currentVideoId}
          onclose={() => setModalcomments(null)}
          onNewComment={() => {
            setVideostate((prev) =>
              prev.map((video) =>
                video.id === currentVideoId
                  ? {
                      ...video,
                      commentsCount: video.commentsCount + 1,
                    }
                  : video,
              ),
            );
          }}
        />
      )}
      <section className={styles.mainContent}>
        <div className={styles.arrow} onClick={() => setTab('fotos')}>
          <img src={seta.src} alt="Voltar" />
        </div>
        <ul className={styles.feed}>
          {videostate.map((video) => (
            <li key={video.id} className={styles.video}>
              {video && (
                <>
                  <div className={styles.videoContainer}>
                    <video
                      controls
                      preload="metadata"
                      crossOrigin="anonymous"
                      playsInline
                      autoPlay
                      muted
                      loop
                    >
                      <source src={video.video} type="video/mp4" />
                    </video>
                    <ul className={styles.videoInfo}>
                      <div className={styles.videoHeader}>
                        <h1>
                          <Link href={`/profile/${video.author}`}>
                            @{video.author}
                          </Link>
                        </h1>
                        <span>{new Date(video.date).toLocaleDateString()}</span>
                      </div>
                      <li>{video.title}</li>
                      <p className={styles.videoExcerpt}>{video.excerpt}</p>
                    </ul>
                  </div>
                  <div className={styles.details}>
                    <aside className={styles.coluns}>
                      <button
                        onClick={() => handlelike(video.id)}
                        className={
                          likedMap[video.id] ? styles.liked : styles.likeButton
                        }
                      >
                        <span> ❤ </span>
                      </button>
                      <p onClick={() => handleOpenLikes(video.id)}>
                        {video.likes}
                      </p>
                      <button onClick={() => handleOpencomment(video.id)}>
                        <span> 💬 </span>
                      </button>
                      <p>{video.commentsCount}</p>
                      {user ? <VideoDelete user={user} video={video} onDelete={handleDeleteVideo} /> : null}
                       <button  type='button' onClick={() => handleDownload(video.video, video.title)} className={styles.buttondownload}> ⬇️ </button>
                    </aside>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {!infinite && <p>Não há mais vídeos para carregar.</p>}
        {error && <ErrorMessage error={error} />}
      </section>
    </>
  );
}
