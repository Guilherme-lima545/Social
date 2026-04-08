'use client';
import Link from 'next/link';
import styles from '@/styles/loginform.module.css';
import Button from './button';
import Input from './input';
import stylesbt from '@/styles/Button.module.css';
import { LOGIN } from '@/app/api/route';
import { useState } from 'react';
import { ErrorMessage } from '@/Helper/Error';

export default function LoginForm() {
  const [usuario, setUsuario] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [mostrar, setmostrar] = useState<boolean>(false);

   async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) {
      setError('insira seu usuario');
      return;
    }

    if (!senha) {
      setError('Insira sua senha');
      return;
    }

  
    
    setError('');

    const formData = new FormData();
    formData.append('usuario', usuario);
    formData.append('senha', senha);

    const result = await LOGIN(formData);

    if (!result.ok) {
      setError('Usuário ou senha inválidos');
      return;
    }
  }



  return (
    <section>
      <h1 className="title"> Login </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.containerinput}> 
        <Input
          label="Usuario"
          type="text"
          name="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <Input
          label="Senha"
          type={mostrar ? 'text' : 'password'}
          name="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {senha && (
          <>
          <input
            className={styles.mostrarsenha}
            type="checkbox"
            id="mostrarSenha"
            checked={mostrar}
            onChange={() => setmostrar(!mostrar)}
          />
          <label className={styles.mostrarsenhalabel} htmlFor="mostrarSenha"> </label>
          </>
         )}
          </div>
        <Button> Logar </Button>
        {error && <ErrorMessage error={error} /> }
      </form>
      <Link href="/login/perdeu" className={styles.perdeu}>
        Putz! Esqueci minha Senha
      </Link>
      <div className={styles.cadastro}>
        <h2 className={styles.subtitle}> Cadastre-se Aqui.</h2>
        <p> Novo por aqui? </p>
        <Link href="/login/cadastro" className={stylesbt.button}>
          Cadastro
        </Link>
      </div>
    </section>
  );
}
