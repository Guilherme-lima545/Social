'use client';
import {VIDEOPOST}  from '@/app/api/route';
import Button from '@/components/button';
import Input from '@/components/input';
import styles from '@/styles/videoupload.module.css';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { compressVideo } from '@/utils/ComprimirVideo';

export default function VIDEOUPLOAD() {
  const [titulo, settitulo] = useState('');
  const [legenda, setlegenda] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!video) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(video);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [video]);

  async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  if (!video) {
    console.log("No video selected");
    return;
  }


  let videofinal = video;

  console.log("Tamanho original:", video.size / 1024 / 1024, "MB");


  if (video.size > 20 * 1024 * 1024) {
    console.log("Comprimindo vídeo...");

  setLoading(true);
  setProgress(0);

  videofinal = await compressVideo(video, (p) => {
    setProgress(p);
    setConfirmation(`Vídeo muito grande, comprimindo...`);
  });

  setLoading(false);
  } else {
    console.log("Vídeo pequeno → enviando direto sem compressão");
    setConfirmation('Video Enviado')
  }

  console.log("Tamanho final:", videofinal.size / 1024 / 1024, "MB");

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("legenda", legenda);
  formData.append("video", videofinal);

  const response = await VIDEOPOST(formData);

  console.log(response.status);



  redirect("/");
}


  return (
    <section className={`${styles.videoPost} animeLeft container`}>
      <form onSubmit={handleSubmit}>
        <Input
          name='titulo'
          label="Titulo"
          type="text"
          value={titulo}
          maxLength={50}
          onChange={(e) => settitulo(e.target.value)}
        />
        <Input
          name='legenda'
          label="Legenda"
          type="text"
          value={legenda}
          onChange={(e) => setlegenda(e.target.value)}
        />
        <Input
          name='video'
          label="Video"
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />
         {confirmation} {loading ? progress : null}%
        <Button> Enviar </Button>
      </form>
      <div>
        {preview && (
          <div className={styles.preview}>
          <video src={preview} className={styles.video} controls> </video>
          </div>
        )}
      </div>
    </section>
  );
}
