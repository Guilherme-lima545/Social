'use client'
import Button from '@/components/button';
import Input from '@/components/input';
import styles from '@/styles/apoie.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function apoie() {
  const [nome, setNome] = useState('');
  const [feedback, setFeedback] = useState('');

  async function EnviarFeedback(e: React.FormEvent) {
  e.preventDefault();

  const data = { nome, feedback };

  const res = await fetch('/api/form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    alert('Erro ao enviar. Tente novamente.');
    return;
  }

  alert('Enviado! Muito obrigado pelo seu apoio!');
  setNome('');
  setFeedback('');
}

  return (
    <div className={styles.Containerapoie}>
      <Image
        src="/Assests/qrcode-pix.png"
        alt="QR-code para apoio"
        width={300}
        height={300}
      />
      <span>
        Caso queira me apoiar para manter esse site no ar, faça um pix para esse
        QR-code, qualquer valor depositado eu agradeço! Obrigado :)
      </span>

      <form className={styles.formfeedback} onSubmit={EnviarFeedback}>
        <h1 className="title"> Deixe seu feedback sobre o site </h1>
        <Input
          label="Nome"
          type="text"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          label="Feedback"
          type="text"
          name="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button type="submit"> Enviar </Button>
      </form>
    </div>
  );
}
