"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className={styles.page}>
        <h1>Hello, world!</h1>
      </div>
    </div>
  );
}
