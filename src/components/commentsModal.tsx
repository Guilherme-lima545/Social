import Commmentscontent from "./CommentsContent";
import styles from '@/styles/commentsModal.module.css'


type UserComments = {
  userscoment: {
    id: number,
    comment_ID: number,
    comment_author: string,
    comment_content: string
  }[];
  commentByCurrentUser: boolean
}

export default function CommentsModal({comment, onclose, videoId, onNewComment}: {comment: UserComments, onclose: () => void, videoId: number, onNewComment?: () => void;}) {
  

    function handleClose(e: React.MouseEvent<HTMLDivElement>) {
    if(e.target === e.currentTarget) {
      onclose();
    }
  }

  return <>
  <div  className={styles.modal} onClick={handleClose}>
  {comment && <Commmentscontent comments={comment.userscoment} id={videoId} onNewComment={onNewComment} />}
  </div>
  </>
}