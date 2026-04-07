import styles from '@/styles/likescontent.module.css';
import avatardefault from '../../public/Assests/avatar-default.jpg'

type UserLike = {
  users: {
    id: number;
    name: string;
    avatar_url?: string;
  }[];
};

export default function LikesContent({ like }: { like: UserLike }) {
  return (
    <>
      <div className={styles.container}>
        <h1>Usuarios que curtiram</h1>

        <div className={styles.details}>
          <ul className={styles.content}>
            {like?.users?.map((user) => (
              <li key={user.id} className={styles.userdetails}>
                <img src={user.avatar_url || avatardefault.src} alt="Avatar" className={styles.avatarphoto} />
                <span>{user.name} </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
