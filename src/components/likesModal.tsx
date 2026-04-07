import { ErrorMessage } from "@/Helper/Error";
import { useFeed } from "@/Hook/feed";
import Loading from "./loading";
import LikesContent from "./likescontent";
import styles from '@/styles/likesmodal.module.css'

type UserLike = {
  users: {
    id: number
    name: string
  }[]
}
export default function LikesModal({like, onclose}: {like: UserLike, onclose: () => void}) {
  const {error, loading} = useFeed({})

   function handleClose(e: React.MouseEvent<HTMLDivElement>) {
    if(e.target === e.currentTarget) {
      onclose();
    }
  }

  return (
  <div className={styles.likemodal} onClick={handleClose}>
    {error && <ErrorMessage error={error} />}
    {loading && <Loading />}
    {like && <LikesContent like={like} />}
  </div>
  )
}