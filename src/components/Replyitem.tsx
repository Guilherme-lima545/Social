import styles from '@/styles/ReplyItem.module.css';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author?: string;
  user_id?: number;
  comment_parent?: number;
};

type ReplyItemProps = {
  reply: Coment;
  userId: number;
  onDelete: (commentId: number) => void;
};

export default function Replyitem({ reply, userId, onDelete }: ReplyItemProps) {
  return (
    <div className={styles.respostaItem}>
           <li>
            <b>{reply.comment_author}: </b>
            <p>{reply.comment_content}</p>
            {userId === Number(reply.user_id) && (
              <button onClick={() => onDelete(Number(reply.comment_ID))} className={styles.delete}>
                🗑
              </button>
            )}
          </li>
    </div>
  );
}
