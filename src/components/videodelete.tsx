import { DELETE_VIDEO } from "@/app/api/route";
import styles from '@/styles/videoDelete.module.css'


type Props = {
  user: any;
  video: any;
  onDelete: (id: number) => void;
}

export default function VideoDelete({ user, video, onDelete }: Props) {

  async function handleDelete() {
    if (video.author !== user.username && user.roles !== 'admin') {
      alert('Você não pode excluir esse vídeo');
      return;
    }

    const confirmDelete = confirm('Tem certeza que deseja excluir?');
    if (!confirmDelete) return;

    const data = await DELETE_VIDEO({ id: video.id });

    if (data?.error) {
      alert(data.error);
      return;
    }

      onDelete(video.id);


    alert('Vídeo excluído');
  }

if (video.author !== user.username && user.roles !== 'admin') {
  return null;
}

  return (
    <div className={styles.coluns}>
    <button onClick={handleDelete}>
      🗑
    </button>
    </div>
  );
}