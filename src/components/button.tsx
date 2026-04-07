'use client'
import styles from '../styles/Button.module.css'

type children = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({children, ...props}: children) {
    return (
    <div>
      <button {...props} className={styles.button}>{children}</button>
    </div>
  )

}