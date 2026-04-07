import LoginForm from "@/components/loginForm";
import styles from "@/styles/login.module.css"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { USER_GET } from "../api/route";


export default async function login() {
  const token = (await cookies()).get('token')?.value || '';

  const user = await USER_GET(token)



  if(user.nome === 'undefined') {
    redirect('/login')
  }
  
  return (
    <div>
      <section className={`animeLeft ${styles.login}`}>
        <div className={styles.forms}>
          <LoginForm />
        </div>
      </section>
    </div>
  )
}



