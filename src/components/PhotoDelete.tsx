import { PHOTO_DELETE } from '@/app/api/route';
import styles from '@/styles/PhotoDelete.module.css';
import { useState } from 'react';
import Loading from './loading';
import { redirect } from 'next/navigation';

type User = {
  id: number;
  roles: string;
  username: string;
};

type Photo = {
  id: number;
  user_id: number;
  author: string;
};

export default function PhotoDelete({
  user,
  photo,
  onDelete
}: {
  user: User;
  photo: Photo;
  onDelete: (id: number) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
     if (photo.author !== user.username && user.roles !== 'admin') {
      alert('Você não pode excluir essa foto');
      return;
    }

    const confirmDelete = confirm('Tem Certeza que deseja excluir?');
    if (!confirmDelete) return;

    setLoading(true);

    const data = await PHOTO_DELETE({ id: photo.id });

    if (data?.error) {
      setLoading(false);
      alert(data.error);
      return;
    }

    if (data.ok) {
      onDelete(photo.id); 
      alert('Foto deleta com sucesso!')
      redirect('/')
    }


    alert('Foto deleta com sucesso!')
    
    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <>
      {loading || user.roles === 'admin' ? (
        <button className={styles.delete} disabled>
          Deletar
        </button>
      ) : (
        <button onClick={handleDelete} className={styles.delete}>
          Deletar
        </button>
      )}
    </>
  );
}
