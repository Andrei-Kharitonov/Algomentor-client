import { Link } from 'react-router';
import styles from './styles/Header.module.css';
import login from '../assets/login.svg';
import {onAuthStateChanged, signOut, type User} from 'firebase/auth';
import {auth} from './firebase';
import { useEffect, useState } from 'react';

export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);
  return (
    <div className={styles.header}>
      <div className="pt-[40px] flex w-[1100px] m-auto justify-between">
        <span className={styles.logo + ' text-5xl font-bold bg-gradient-to-r from-[#FA3DF4] to-[#E50F0F] bg-clip-text text-transparent border-t-0'}>
          AlgoMentor
        </span>
        <nav className={styles.navigation + ' flex justify-between align-center'}>
          <a href="#">Главная</a>
          <a href="#">О нас</a>
          <a href="#">Контакты</a>
        </nav>
        {currentUser ? currentUser.email : <Link to="/login" >
          <button className={styles.login}>
            <img src={login} className="inline mr-[7px]" alt="" />
            ВХОД
          </button>
        </Link>}
    
        <button className={styles.login} onClick={() => {
          signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
        }}>
          <img src={login} className="inline mr-[7px]" alt="" />
            ВЫХОД
        </button>
      </div>
    </div>

  );
}
