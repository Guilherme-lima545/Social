'use client';
import UPLOADPHOTO from '@/app/api/route';
import Button from '@/components/button';
import Input from '@/components/input';
import styles from '@/styles/photoUpload.module.css';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/getCroppedimg';
import { compressImage } from '@/utils/Comprimirimagem';
import { ErrorMessage } from '@/Helper/Error';

export default function PHOTOUPLOAD() {
  const [nome, setnome] = useState('');
  const [idade, setidade] = useState('');
  const [legenda, setlegenda] = useState('');
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  function handleCancel() {
    setImage(null);
    setCroppedAreaPixels(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);

  if (!croppedFile) {
    setError('Por favor, selecione e corte uma foto antes de enviar.');
    return;
  }

  if (!nome.trim()) {
    setError('Insira um nome para a foto');
    return;
  }

  const idadeNumber = Number(idade);

  if (isNaN(idadeNumber)) {
    setError('A idade deve ser um número');
    return;
  }

  if (!legenda.trim()) {
    setError('Insira uma legenda para a foto');
    return;
  }

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('idade', String(idadeNumber));
  formData.append('legenda', legenda);
  formData.append('img', croppedFile);

  await UPLOADPHOTO(formData);

  alert('Foto enviada com sucesso!');
}

  async function handleConfirmCrop() {
  if (!image || !croppedAreaPixels) return;

  const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
  if (!croppedBlob) return;

  const file = new File([croppedBlob], 'photo.jpg', {
    type: 'image/jpeg',
  });

  const compressedFile = await compressImage(file);

  setCroppedFile(compressedFile);
  setPreview(URL.createObjectURL(compressedFile));

  setImage(null); 
}

  return (
    <section className={`${styles.photoPost} animeLeft container`}>
      <form onSubmit={handleSubmit}>
        <Input
          name="nome"
          label="Nome"
          type="text"
          value={nome}
          onChange={(e) => setnome(e.target.value)}
        />
        <Input
          name="idade"
          label="Idade"
          type="number"
          value={idade}
          onChange={(e) => setidade(e.target.value)}
        />
        <Input
          name="legenda"
          label="Legenda"
          type="text"
          value={legenda}
          onChange={(e) => setlegenda(e.target.value)}
        />
        <Input
          name="img"
          label="Foto"
          type="file"
          onChange={handleFileChange}
        />

        <Button type="submit">Enviar</Button>
        {image && (
          <div className={styles.modalOverlay} onClick={handleCancel}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.cropContainer}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 5} 
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="button" onClick={handleCancel}>
                  Cancelar
                </button>
                <Button type="button" disabled={!croppedAreaPixels} onClick={handleConfirmCrop}>
                  Cortar 
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
      {preview && (
        <div
          className={styles.preview}
          style={{ backgroundImage: `url(${preview})` }}
        />
      )}
      {error && <ErrorMessage error={error} />}
    </section>
  );
}