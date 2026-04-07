import { Getcookies } from '@/actions/cookie';
import { COMMENT_DELETE, USER_GET } from '@/app/api/route';
import { useEffect, useState } from 'react';
import styles from '@/styles/photoComments.module.css';
import ComentsForm from './CommentsForm';
import Replyitem from './Replyitem';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author?: string;
  user_id?: number;
  comment_parent?: number;
};

type ReplyComments = {
  id: number;
  comments?: Coment[];
};

export default function ReplyComments({
  comments,
  id,
  parentCommentId,
  updateComments,
}: {
  comments: Coment[];
  id: number;
  parentCommentId: number;
  updateComments: (action: any) => void;
}) {
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [verRespostas, setVerRespostas] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const token = await Getcookies('token');
      if (!token) return;

      const response = await USER_GET(token.value);
      setUser(response);
    }

    getUser();
  }, [id]);

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

  function toggleVerRespostas(commentId: number) {
    setVerRespostas((prev) =>
      prev.includes(commentId)
        ? prev.filter((i) => i !== commentId)
        : [...prev, commentId],
    );
  }

  const replies = comments.filter(
    (c) => Number(c.comment_parent) === Number(parentCommentId),
  );

  return (
    <>
      <div className={styles.respostaContainer}>
        {user?.nome && (
          <button
            onClick={() =>
              setReplyTo(replyTo === parentCommentId ? null : parentCommentId)
            }
            className={styles.resposta}
          >
            {replyTo === parentCommentId ? 'Voltar' : 'Responder'}
          </button>
        )}

        {replies.length > 0 && (
          <button
            className={styles.verRespostas}
            onClick={() => toggleVerRespostas(parentCommentId)}
          >
            {verRespostas.includes(parentCommentId)
              ? 'Ocultar respostas'
              : `Ver respostas (${replies.length})`}
          </button>
        )}
           </div>

        {verRespostas.includes(parentCommentId) && (
          <ul className={styles.respostas}>
            {replies.map((reply) => (
              <Replyitem
                key={reply.id}
                reply={reply}
                userId={user?.id}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      <div className={styles.formReply}>
        {replyTo === parentCommentId && (
          <ComentsForm
            id={id}
            single={true}
            updateComments={updateComments}
            parentId={parentCommentId}
          />
        )}
        </div>
    </>
  );
}
