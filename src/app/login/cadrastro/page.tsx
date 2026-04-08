'use client';
import { CREATELOGIN } from '@/app/api/route';
import Button from '@/components/button';
import Input from '@/components/input';
import { ErrorMessage } from '@/Helper/Error';
import styles from '@/styles/login.module.css';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function CreateLogin() {
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: React.FormEvent) {
    if (!nome || !email || !password) {
      e.preventDefault();
      setError('Preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      e.preventDefault();
      setError('Email inválido');
      return;
    }

    setError('');
    redirect('/login')
  }


  function voltar(e?: React.FormEvent) {
    e?.preventDefault()
    setError('')
    redirect('/login')
  }

  return (
    <section className={`animeLeft ${styles.login}`}>
      <form
        className={styles.forms}
        action={CREATELOGIN}
        onSubmit={handleSubmit}
      >
        <h1 className="title"> Cadrastre - se </h1>
        <Input
          label="Usuario"
          type="text"
          name="username"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          label="Email"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit"> Cadastrar </Button>
        <Button type="button" onClick={() => {voltar()}}>
        Voltar
        </Button>
        {error && <ErrorMessage error={error} />}
      </form>
    </section>
  );
}
