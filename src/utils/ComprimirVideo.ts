'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';

let ffmpeg: FFmpeg | null = null;

async function getFFmpeg() {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    await ffmpeg.load();
  }
  return ffmpeg;
}

export async function compressVideo(file: File, onProgress?: (progress: number) => void) {
  console.log('1 - iniciando ffmpeg');

  const ffmpeg = await getFFmpeg();

  console.log('2 - ffmpeg carregado');

  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  const buffer = await file.arrayBuffer();
  await ffmpeg.writeFile(inputName, new Uint8Array(buffer));

  console.log('3 - arquivo carregado no ffmpeg');

  ffmpeg.on('progress', ({ progress }) => {
    const percent = Math.round(progress * 100);
    console.log(`Compressão: ${percent}%`);
    onProgress?.(percent);
  });

  await ffmpeg.exec([
    '-i', inputName,
    '-vcodec', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '35',
    '-movflags', '+faststart',
    outputName,
  ]);

  console.log('4 - compressão terminou');

const data = await ffmpeg.readFile(outputName);
const uint8 = new Uint8Array((data as Uint8Array).buffer.slice(0) as ArrayBuffer);

const blob = new Blob([uint8], { type: 'video/mp4' });

  return new File([blob], 'compressed.mp4', { type: 'video/mp4' });
}