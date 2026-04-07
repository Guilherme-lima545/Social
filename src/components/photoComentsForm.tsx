'use client';
import {
  COMMENT_POST,
  LIKE_GET,
  LIKE_POST,
  USER_GET,
} from '@/app/api/route';
import { useEffect, useState } from 'react';
import styles from '@/styles/photoComentsform.module.css';
import { ErrorMessage } from '@/Helper/Error';
import LikesModal from './likesModal';
import { Getcookies } from '@/actions/cookie';
import Loading from './loading';

type Comment = {
  id: number;
  likes?: number;
  single?: boolean;
  updateComments?: (comment: any) => void;
  parentId?: number | null;
};

type UserLike = {
  users: {
    id: number;
    name: string;
  }[];
  likedByCurrentUser: boolean;
};

export default function PhotoComentsForm({
  id,
  likes: initialLikes = 0,
  single = false,
  updateComments,
  parentId,
}: Comment) {
  const [comentario, setComentario] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [modallike, setModallike] = useState<UserLike | null>(null);
  const [userLike, setUserLike] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLikes() {
    try {
      const token = await Getcookies('token');
      const data = await LIKE_GET({ id });
      const user = await USER_GET(token.value);

      localStorage.setItem('userId', String(user.id));
      localStorage.setItem('username', user.nome);

      if (data?.users) {
        setLikes(data.users.length);
        setUserLike(data);

        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (userId) {
          const hasLiked = data.users.some(
            (user: { id: number }) => user.id === Number(userId),
          );
          setLiked(hasLiked);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar likes:', err);
    } finally {
      setLoading(false); 
    }
  }

    getLikes();
  }, [id]);

  async function handleLike(photoId: number) {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    const res = await LIKE_POST({ id: photoId });

    if (res?.error) {
      alert(res.error);
      setLiked(liked);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
      return;
    }

    const data = await LIKE_GET({ id: photoId });

    setUserLike(data);
    setLikes(data.users.length);

    const userId = localStorage.getItem('userId');

    if (userId) {
      const hasLiked = data.users.some(
        (user: { id: number }) => user.id === Number(userId),
      );

      setLiked(hasLiked);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!comentario.trim()) {
      setError('Insira um comentário');
      return;
    }

    const formData = new FormData(event.currentTarget);


    if (parentId) {
  formData.append('parent', String(parentId));
}
    

    const coment = await COMMENT_POST(
      { id }, formData
    );

    if (coment.ok) {
      setComentario('');
      setError(null);

      if (updateComments) {
        updateComments(coment.data);
      }
    } else {
      setError('Erro ao enviar comentário');
    }


  }


  if (loading) return <Loading />;

  return (
    <>
      {modallike && (
        <LikesModal like={modallike} onclose={() => setModallike(null)} />
      )}

      <form
        className={`${styles.form} ${single ? styles.single : ''}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.likeContainer}>
          <button
            type="button"
            onClick={() => handleLike(id)}
            className={liked ? styles.liked : styles.likeButton}
          >
            ❤️
          </button>
          <span
            className={liked ? styles.numberlikeactive : styles.numberlike}
            onClick={() => setModallike(userLike)}
          >
            {loading ? initialLikes : likes}
          </span>
        </div>

        <textarea
          className={styles.textarea}
          id="comment"
          name="comment"
          placeholder="Digite seu comentário"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        <button className={styles.botao}>Enviar</button>

        <div className={styles.error}>
          {error ? <ErrorMessage error={error} /> : null}
        </div>
      </form>
    </>
  );
}
