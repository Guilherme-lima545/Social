'use client'
import { useFeed } from "@/Hook/feed"
import Loading from "./loading";
import PhotoContent from "./photoContent";
import { ErrorMessage } from "@/Helper/Error";
import styles from '@/styles/feedModal.module.css';
import VideoContent from "./VideoContent";

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

type Photo = {
  id: number;
  src: string;
  title: string;
  author: string;
  acessos: number;
  likes: number;
  descricao: string;
  idade: number;
  comments?: Coment[];
  user_id: number;
}

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
  acessos: number;
}


export default  function Feedmodal({photo, video, onclose}: {photo?: Photo | null, video?: Video | null, onclose: () => void}) {
  const { error, loading } = useFeed({});

  function handleClose(e: React.MouseEvent<HTMLDivElement>) {
    if(e.target === e.currentTarget) {
      onclose();
    }
  }
  

  return (
    <div className={styles.modal} onClick={handleClose}>
      {error && <ErrorMessage error={error} />}
      {loading && <Loading />}
      {photo && <PhotoContent photo={photo} />}
      {video && <VideoContent video={video} />}
    </div>
  )
}