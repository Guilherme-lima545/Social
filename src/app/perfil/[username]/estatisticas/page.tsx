'use client';
import { useEffect, useState, useMemo } from 'react';
import { ESTATISTICAS_GET } from '@/app/api/route';
import styles from '@/styles/estatisticas.module.css';

interface Post {
  id: number;
  title: string;
  acessos: number;
}

interface Visitor {
  user_id: number;
  display_name: string;
  avatar_url: string;
  visit_count: number;
  last_visit: string;
}

interface StatsData {
  posts: Post[];
  profile_visitors: {
    total_unique: number;
    total_views: number;
    visitors: Visitor[];
  };
}


const formatDate = (iso: string) =>
  iso
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso))
    : '—';

const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'visitors' | 'posts'>('visitors');

  useEffect(() => {
    ESTATISTICAS_GET().then(setData).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;

    const sortedPosts = [...data.posts].sort((a, b) => b.acessos - a.acessos);
    const totalViews = sortedPosts.reduce((s, p) => s + p.acessos, 0);

    return {
      sortedPosts,
      totalViews,
      topViews: sortedPosts[0]?.acessos ?? 1,
      ...data.profile_visitors,
      postsCount: data.posts.length,
    };
  }, [data]);

  const handleDownload = () => {
    if (!data) return;
    downloadFile(
      JSON.stringify(data, null, 2),
      `stats_${new Date().toISOString().slice(0, 10)}.txt`
    );
  };

  if (loading)
    return <section className={styles.loading}><span className={styles.spinner} /></section>;

  if (!stats)
    return <section className={styles.loading}><p>Erro ao carregar dados.</p></section>;

  return (
    <section className={`${styles.stats} animeLeft container`}>

      <header className={styles.header}>
        <div>
          <h1 className={styles.sub}>Visão geral do seu perfil</h1>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload}>
          <DownloadIcon /> Baixar relatório
        </button>
      </header>

      <div className={styles.kpis}>
        <KPI label="Visitantes únicos" value={stats.total_unique} accent />
        <KPI label="Total de visitas" value={stats.total_views} />
        <KPI label="Posts" value={stats.postsCount} />
        <KPI label="Acessos (posts)" value={stats.totalViews} />
      </div>

      <div className={styles.tabs}>
        {['visitors', 'posts'].map((t) => (
          <button
            key={t}
            className={tab === t ? styles.tabActive : styles.tabBtn}
            onClick={() => setTab(t as any)}
          >
            {t === 'visitors' ? 'Visitantes' : 'Posts'}
          </button>
        ))}
      </div>

      {tab === 'visitors' && (
        <div className={styles.panel}>
          {stats.visitors.length === 0 ? (
            <p className={styles.empty}>Nenhum visitante ainda.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuário</th>
                  <th>Visitas</th>
                  <th>Última visita</th>
                </tr>
              </thead>
              <tbody>
                {stats.visitors.map((v, i) => (
                  <tr key={v.user_id}>
                    <td>{i + 1}</td>
                    <td>{v.display_name}</td>
                    <td>{v.visit_count}</td>
                    <td>{formatDate(v.last_visit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div className={styles.panel}>
          <div className={styles.bars}>
            {stats.sortedPosts.slice(0, 8).map((p) => (
              <div key={p.id} className={styles.barRow}>
                <span>{p.title}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${Math.round((p.acessos / stats.topViews) * 100)}%`,
                    }}
                  />
                </div>
                <span>{p.acessos}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <table className={styles.table}>
            <tbody>
              {stats.sortedPosts.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.acessos}</td>
                  <td>#{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function KPI({ label, value, accent }: any) {
  return (
    <div className={`${styles.kpi} ${accent ? styles.kpiAccent : ''}`}>
      <span>{label}</span>
      <strong>{value.toLocaleString('pt-BR')}</strong>
    </div>
  );
}

function DownloadIcon() {
  return <span>⬇</span>;
}