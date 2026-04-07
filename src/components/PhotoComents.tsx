'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/photoComments.module.css';
import { Getcookies } from '@/actions/cookie';
import { COMMENT_DELETE, COMMENT_GET, USER_GET } from '@/app/api/route';
import PhotoComentsForm from './photoComentsForm';
import { ErrorMessage } from '@/Helper/Error';
import ReplyComentarios from '@/components/ReplyComentarios';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author?: string;
  user_id?: number;
  comment_parent?: number;
};

type PhotoComents = {
  id: number;
  comments?: Coment[];
  likes: number;
  comment_author?: string;
  single?: boolean;
};

export default function PhotoComents({
  id,
  comments,
  likes,
  single = false,
}: PhotoComents) {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState<Coment[]>(comments || []);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  useEffect(() => {
    async function getUser() {
      const token = await Getcookies('token');
      if (!token) return;

      const response = await USER_GET(token.value);
      setUser(response);
    }

    async function getComments() {
      const response = await COMMENT_GET({ id });
      if (response.error) {
        setError(response.error);
      } else {
        setComentarios(response);
      }
    }

    getUser();
    getComments();
  }, [id]);

  function updateComments(action: any) {
    if (action.deleteId) {
      setComentarios((prev) => prev.filter((c) => c.id !== action.deleteId));
      return;
    }

    setComentarios((prev) => [...prev, action]);
    setReplyTo(null);
  }

  async function handleDelete(commentId: number) {
    const confirmDelete = confirm('Deseja deletar esse comentário?');
    if (!confirmDelete) return;

    const token = await Getcookies('token');
    const res = await COMMENT_DELETE(commentId, token.value);

    if (res.ok) {
      updateComments({ deleteId: commentId });
      alert('Comentário deletado com sucesso!');
    } else {
      console.log('Erro ao deletar', res.data);
    }
  }

  const rootComments = comentarios.filter(
    (c) => !c.comment_parent || Number(c.comment_parent) === 0,
  );

  return (
    <>
      {comentarios ? (
        <ul className={`${styles.comments} ${single ? styles.single : ''}`}>
          {rootComments.map((comment) => (
            <div key={comment.id} className={styles.commentcontainer}>
              <li>
                <b>{comment.comment_author}:</b>
                <span>{comment.comment_content}</span>
                {user?.id === Number(comment.user_id) && (
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(Number(comment.comment_ID))}
                  >
                    🗑
                  </button>
                )}
              </li>

              <ReplyComentarios comments={comentarios} id={id} parentCommentId={comment.comment_ID} updateComments={updateComments} />
            </div>
          ))}
        </ul>
      ) : null}

      {error ? <ErrorMessage error={error} /> : null}

      {user?.nome ? (
        <PhotoComentsForm
          id={id}
          single={single}
          updateComments={updateComments}
          likes={likes}
          parentId={replyTo}
        />
      ) : null}
    </>
  );
}
