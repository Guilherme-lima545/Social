'use client'
import { Getcookies } from "@/actions/cookie";
import { PASSWORD_RESET, USER_GET } from "@/app/api/route";
import Button from "@/components/button";
import Input from "@/components/input";
import { ErrorMessage } from "@/Helper/Error";
import styles from '@/styles/login.module.css';
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pagereset() {
  const [senha, setSenha] = useState('');
  const [Error, setError] = useState('');
  const [key, setKey] = useState('');
  const [login, setLogin] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  setKey(params.get('key') || '')
  setLogin(params.get('login') || '')
  }, []);

    if (!key || !login) {
    return <p>Link inválido ou expirado.</p>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if(!senha) {
      setError('Insira uma senha')
    }

    const token = await Getcookies('token')

    const user = await USER_GET(token.value)

    const resetar = await PASSWORD_RESET(login, key, senha);

    if(resetar) {
      setSucesso("Senha alterada com Sucesso.")
      setError('')
      redirect('/login')
    }
  }

  return (
  <section className={`animeLeft  ${styles.login}`}>
  <form
        className={styles.forms}
        onSubmit={handleSubmit}
      >
        <h1 className="title" style={{ fontSize: '45px' }}>
          Insira uma nova senha
        </h1>
        <Input
          label="Nova Senha"
          type="password"
          name="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {sucesso}
        <Button> Resetar a Senha </Button>
        {Error && <ErrorMessage error={Error} />}
      </form>
  </section>
  )
}