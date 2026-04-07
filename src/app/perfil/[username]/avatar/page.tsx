'use client';

import Button from '@/components/button';
import styles from '@/styles/avatar.module.css';
import { UPLOADAVATAR, USER_GET } from '../../../api/route';
import Image from 'next/image';
import { compressImage } from '@/utils/Comprimirimagem';
import { useCallback, useEffect, useState } from 'react';
import AvatarDefault from '../../../../../public/Assests/avatar-default.jpg';
import { getCroppedImg } from '@/utils/getCroppedimg';
import Cropper from 'react-easy-crop';

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function Avatar() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  const [croppedImage, setCroppedImage] = useState<File | null>(null);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvatar() {
      const token = window.localStorage.getItem('token');
      if (!token) return;

      try {
        const userData = await USER_GET(token);

        if (userData?.avatar_url) {
          setUserAvatar(userData.avatar_url);
          setPreview(userData.avatar_url);
        }
      } catch (err) {
        console.error('Erro ao buscar avatar do usuário', err);
      }
    }

    fetchAvatar();
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  function handleCancel() {
    setImage(null);
    setCroppedAreaPixels(null);
    setCroppedImage(null);
  }

  async function handleSaveCrop() {
    if (!image || !croppedAreaPixels) return;

    const croppedImageBlob = await getCroppedImg(
      image,
      croppedAreaPixels
    );

    if (!croppedImageBlob) return;

    const file = new File([croppedImageBlob], 'avatar.jpg', {
      type: 'image/jpeg',
    });

    const compressedFile = await compressImage(file);

    setCroppedImage(compressedFile);

    const previewUrl = URL.createObjectURL(compressedFile);
    setPreview(previewUrl);

    setImage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!croppedImage) return;

    const formData = new FormData();
    formData.append('avatar', croppedImage);

    try {
      const updatedAvatar = await UPLOADAVATAR(formData);

      if (updatedAvatar?.secure_url) {
        setUserAvatar(updatedAvatar.secure_url);
        setPreview(updatedAvatar.secure_url);
        setCroppedImage(null);

        alert('Avatar atualizado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao enviar avatar', err);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  const avatarShow = preview || userAvatar || AvatarDefault;

  return (
    <div className={styles.container}>
      <h1>Faça upload de seu Avatar</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
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
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={handleCancel}
                >
                  Voltar
                </button>

                <Button
                  type="button"
                  disabled={!croppedAreaPixels}
                  onClick={handleSaveCrop}
                >
                  Salvar corte
                </Button>
              </div>
            </div>
          </div>
        )}

        {!image && (
          <Image
            src={avatarShow}
            alt="Avatar do usuário"
            width={200}
            height={200}
            className={styles.avatarImage}
          />
        )}

        <input type="file" accept="image/*" onChange={handleChange} />

        <Button type="submit" disabled={!croppedImage}>
          Enviar avatar
        </Button>
      </form>
    </div>
  );
}