'use client';
import { COMMENT_POST, USER_GET } from '@/app/api/route';
import { useEffect, useState } from 'react';
import styles from '@/styles/Comentsform.module.css';
import { ErrorMessage } from '@/Helper/Error';
import { Getcookies } from '@/actions/cookie';
import Loading from './loading';

type Comment = {
  id: number;
  single?: boolean;
  updateComments: (comment: any) => void;
  refreshComments?: () => void;
  parentId?: number | null;
};

export default function ComentsForm({
  id,
  single = false,
  updateComments, 
  refreshComments,
  parentId
}: Comment) {
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!comentario.trim()) {
      setError('Insira um comentário');
      return;
    }

  const formData = new FormData(event.currentTarget);


    if(parentId) {
      formData.append('parent', String(parentId));
    }


    const coment = await COMMENT_POST(
      { id },
      formData,
    );

    console.log('resposta da API:', coment.data);


    if (coment.ok) {
      setComentario('');
      setError(null);
      updateComments(coment.data);
      if (refreshComments) {
        refreshComments();
      }
      console.log('enviado', coment.data);
    } else {
      setError('Erro ao atualizar comentários');
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <form
        className={`${styles.form} ${single ? styles.single : ''}`}
        onSubmit={handleSubmit}
      >
        <textarea
          className={styles.textarea}
          id="comment"
          name="comment"
          placeholder="Digite seu comentário"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        <button type="submit" className={styles.botao}>
          Enviar
        </button>

        <div className={styles.error}>
          {error ? <ErrorMessage error={error} /> : null}
        </div>
      </form>
    </>
  );
}
