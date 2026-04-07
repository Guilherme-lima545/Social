import styles from '@/styles/input.module.css';

type input = {
  label: string;
  type: string;
  name: string;
  value?: string | number | File | null | undefined | any;
  maxLength?: number;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  type,
  name,
  value,
  onChange,
  accept,
  maxLength,
}: input) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={styles.input}
        maxLength={maxLength}
        accept={accept}
      />
    </div>
  );
}
