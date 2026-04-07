'use client';
import styles from '@/styles/Commentcontent.module.css';
import { useEffect, useState } from 'react';
import { COMMENT_DELETE, COMMENT_GET, USER_GET } from '@/app/api/route';
import { Getcookies } from '@/actions/cookie';
import ComentsForm from './CommentsForm';
import ReplyComments from './ReplyComentarios';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
  comment_parent?: number;
  user_id?: number;
};

type Commentsvideo = {
  id: number;
  comments: Coment[];
  comment_author?: string;
  single?: boolean;
  onNewComment?: () => void;
};

export default function Commmentscontent({
  id,
  comments = [],
  single = false,
  onNewComment,
}: Commentsvideo) {
  const [user, setUser] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Coment[]>(comments);
  const [error, setError] = useState(null);

  async function getComments() {
    const response = await COMMENT_GET({ id });

    const lista = Array.isArray(response?.userscoment)
      ? response.userscoment
      : [];

    if (lista.length > 0) {
      setComentarios(lista);
    }

    if (response.error) {
      setError(response.error);
    }
  }

  useEffect(() => {
    async function getuser() {
      const token = await Getcookies('token');
      if (!token) return;

      const response = await USER_GET(token.value);

      setUser(response);
    }

    getComments();
    getuser();
  }, [id]);

  function updateComments(action: any) {
   if (action.deleteId) {
    setComentarios((prev) => prev.filter((c) => c.id !== action.deleteId));
    return;
  }
  setComentarios((prev) => [...prev, action]);
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

  console.log(comentarios);

  const rootComments = comentarios.filter(
    (c) => !c.comment_parent || Number(c.comment_parent) === 0,
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.details}>
          <h1> Comentarios </h1>
          {comentarios ? (
            <ul className={`${styles.comments} ${single ? styles.single : ''}`}>
              {rootComments.map((comment) => (
                <div key={comment.id}>
                  <li className={styles.commentItem}>
                    <b>{comment.comment_author}:</b>
                    <span>{comment.comment_content}</span>
                    {user?.id === Number(comment.user_id) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className={styles.delete}
                      >
                        🗑
                      </button>
                    )}
                  </li>
                  <ReplyComments
                    comments={comentarios}
                    id={id}
                    parentCommentId={comment.comment_ID}
                    updateComments={updateComments}
                  />
                </div>
              ))}
            </ul>
          ) : null}
          {user?.nome ? (
            <ComentsForm
              id={id}
              updateComments={updateComments}
              refreshComments={getComments}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
