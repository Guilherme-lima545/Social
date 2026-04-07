'use client';
import { useEffect, useState } from 'react';
import styles from '@/styles/aside.module.css';

type User = {
  id?: number | string;
  username: string;
  online?: boolean;
  last_seen?: string | number;
  avatar_url?: string;
};

export default function AsideUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    function getDisplayName(obj: any) {
      return (
        obj?.username ||
        obj?.user_login ||
        obj?.name ||
        obj?.display_name ||
        obj?.title ||
        obj?.email ||
        obj?.nome ||
        'Usuário'
      );
    }

    function normalize(data: any): User[] {
      if (!data) return [];
      const rawUsers = Array.isArray(data) ? data : (data.users || []);

      if (Array.isArray(data)) {
        return data.map((u: any) => ({
          id: u.id ?? u.ID ?? u.user_id,
          username: getDisplayName(u),
         online: u.online ?? u.is_online ?? (u.status === 'online'),
        last_seen: u.last_seen ?? u.lastSeen ?? u.updated_at,
        avatar_url: u.avatar_url ?? u.avatar ?? u.profile_img ?? u.image_url,
        }));
      }

          if (data.users && Array.isArray(data.users)) {
        return normalize(data.users);
      }


      return [];}

    async function loadUsers() {  
      try {
      setLoading(true);
      setError(null);
        const res = await fetch('/api', { headers: {  Accept: 'application/json' }, 
          cache: 'no-store' });
           if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        const text = await res.text();

        let data; 
        try{
          data = JSON.parse(text);
        } catch {
          console.error('API retornou HTML em vez de JSON:', text);
          throw new Error('API retornou HTML em vez de JSON');
        }
        const normalized = normalize(data);
        if (mounted) { 
          setUsers(normalized);
        }
      } catch (err: any) {
        if(mounted) setError(err.message || 'Erro ao carregar usuários.');
      } finally {
        if(mounted) setLoading(false);
      }
    }


    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  function isOnline(u: any) {
    if (typeof u?.online === 'boolean') return u.online;
    if (u?.last_seen) {
      const last = new Date(u.last_seen).getTime();
      if (!isNaN(last)) return Date.now() - last < 1000 * 60 * 5;
    }
    return false;
  }

  function formatLastSeen(lastSeen: string | number | undefined) {
    if (!lastSeen) return 'Última vez online: desconhecido';

    const last = new Date(lastSeen).getTime();
    const now = Date.now();
    const diff = (now - last) / 1000;

    if (diff < 60) return `Online há pouco tempo`;
    if (diff < 3600) return `Online há ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Online há ${Math.floor(diff / 3600)} horas`;

    const dias = Math.floor(diff / 86400);
    return `Online há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
  }


  return (
    <aside className={styles.aside} aria-label="Usuários logados">
      <h3 className={styles.title}>Usuários</h3>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.status}>Carregando...</p>}
      <ul className={styles.list}>
        {!loading && users.length === 0 && (
          <li className={styles.empty}>Nenhum usuário encontrado.</li>
        )}
        {users.map((u) => {
          const displayName = u.username || 'Usuário';
          return (
            <li key={u.id ?? displayName} className={styles.item}>
              <div className={styles.left}>
                <div className={styles.avatar}>
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={displayName} />
                  ) : (
                    <span className={styles.initial}>
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className={styles.name}>
                  {displayName}
                  <div className={styles.online}>
                    {!isOnline(u) && <span>{formatLastSeen(u.last_seen)} </span>}
                    {isOnline(u) && <span>Online agora</span>}
                  </div>
                </div>
              </div>
              <div className={styles.statusWrap}>
                <span
                  className={isOnline(u) ? styles.dotOnline : styles.dotOffline}
                  title={isOnline(u) ? 'Online' : 'Offline'}
                >  </span>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
