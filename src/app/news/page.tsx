'use client'
import { useEffect, useState } from "react";
import { GET_NEWS } from "../api/route";
import styles from '@/styles/news.module.css';
import Image from "next/image";
import Link from "next/link";

type Article = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}


export default function news() {
  const [news, setNews] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const article = await GET_NEWS();
        setNews(article);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews();
  }, []);


  return (
  <>
  <section className={styles.newsContainer}>
    <h1>Ultimas noticias</h1>
    {news.map((article, index) => (
    <div key={index} className={styles.news}>
    {article.image &&  <Link href={article.url} target="_blank"><Image src={article.image} alt={article.title} width={500} height={500} /> </Link>}
    <div className={styles.newsContent}>
    <h2>{article.title}</h2>
    <p>{article.description}</p>
    <small>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</small>
    <Link href={article.url} target="_blank">Ler mais</Link>
    </div>
  </div>
))}
  </section>
  </>
  );
}