'use client';
import { useState, useEffect, useCallback } from 'react';
import { Photo, PHOTOGET, Video, VIDEOGET } from '../app/api/route';

interface UseFeedParams {
  total?: number;
  user?: number;
  page?: number;
  username?: string;
}

type ApiError = {
  code: string;
  message: string;
  data: {
    status: number;
  };
};
export function useFeed({ total = 6, user, username }: UseFeedParams) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [infinite, setInfinite] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
   if (loading || !infinite) return;


  try {
    setLoading(true);

    const response = await PHOTOGET({ page, total, user }) as Photo[] | ApiError;

    if (!Array.isArray(response)) {
      console.log(response);
      setError(response.message);
      setInfinite(false);
      return;
    }

    const newPhotos = response;

    if (newPhotos.length === 0) {
      setInfinite(false);
    } else {
      setPhotos((prev) => {
        const newUnique = newPhotos.filter(
          (photo) => !prev.some((p) => p.id === photo.id),
        );
        return [...prev, ...newUnique];
      });

      setPage((prev) => prev + 1);
    }
  } catch {
    setError('Erro ao carregar fotos.');
  } finally {
    setLoading(false);
  }

  }, [page, total, user, infinite, loading]);

  const loadVideos = useCallback(async () => {
    if (loading || !infinite) return;
    try {
      setLoading(true);
      const newVideos = (await VIDEOGET()) as Video[];
   

        if (!Array.isArray(newVideos)) {
        console.log('O retorno não é um array:', newVideos);
        setInfinite(false);
        return;
      }

       const filtered = username ? newVideos.filter((v) => v.author === username) : newVideos;
       console.log('username:', username);
       console.log('filtered:', filtered);

      if (filtered.length === 0) {
        setInfinite(false);
      } else {
        setVideos((prev) => {
          const newUnique = filtered.filter(
            (video) => !prev.some((v) => v.id === video.id),
          );
          return [...prev, ...newUnique];
        });
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError('Erro ao carregar videos.');
    } finally {
      setLoading(false);
    }
  }, [page, total, user, infinite, loading, username]);

  useEffect(() => {
     if (user == null) return;


    setPhotos([]);
    setVideos([]);
    setPage(1);
    setInfinite(true);
    loadPhotos();
    loadVideos();
  }, [user]);

  return { photos, videos, loading, error, infinite, loadPhotos, loadVideos, page, user, total, username };
}
