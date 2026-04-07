'use client';
import { PASSWORD_LOST } from '@/app/api/route';
import Button from '@/components/button';
import Input from '@/components/input';
import { ErrorMessage } from '@/Helper/Error';
import styles from '@/styles/login.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function Lostpassword() {
  const [email, setEmail] = useState<string>('');
  const [Error, setError] = useState('');
  const [sucesso, setSucesso] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()


    if (!email) {
      e.preventDefault();
      setError('Por favor insira seu Email');
      return;
    }

    

    const reset = await PASSWORD_LOST(email, `${process.env.NEXT_PUBLIC_APP_URL}/login/resetar`)
    
    if(reset) {
      setSucesso('Link enviado para o email')
      setError('')
    }
  }

  function voltar(e?: React.FormEvent) {
    e?.preventDefault();
    setError('');
    redirect('/login');
  }

  return (
    <section className={`animeLeft  ${styles.login}`}>
      <form
        className={styles.forms}
        onSubmit={handleSubmit}
      >
        <h1 className="title" style={{ fontSize: '45px' }}>
          Perdeu sua senha??
        </h1>
        <Input
          label="Email / Usuário"
          type="text"
          name="login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p style={{color: 'green'}}>{sucesso} </p>
        {Error && <ErrorMessage error={Error} />}
        <Button> Enviar </Button>
        <Button onClick={() => voltar}>
          <Link href="/login"> Voltar </Link>
        </Button>
      </form>
    </section>
  );
}
