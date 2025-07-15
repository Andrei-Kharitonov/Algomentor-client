import { Link } from 'react-router';
import styles from './styles/Header.module.css';
import login from '../assets/login.svg';
import {onAuthStateChanged, signOut, type User} from 'firebase/auth';
import {auth} from './firebase';
import { useEffect, useState, useRef } from 'react';

export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };
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
      <div className="pt-[40px] flex w-[1350px] m-auto justify-between items-center">
        <span className={styles.logo + ' text-5xl font-bold bg-gradient-to-r from-[#FA3DF4] to-[#E50F0F] bg-clip-text text-transparent border-t-0 border-r-0 border-l-0'}>
          AlgoMentor
        </span>
        <nav className={styles.navigation + ' flex justify-between align-center'}>
          <a className="mr-[30px]" href="#">ТЕМЫ КУРСА</a>
          <a className="mr-[30px]" href="#">ОТЗЫВЫ</a>
          <a href="#">КОНТАКТЫ</a>
        </nav>
        {currentUser ? (
          <div className="relative flex items-center" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img src={login} alt="user" />
              <span className="text-[#c2b3e2] font-medium text-[21px] ml-2.5">
                {currentUser.email}
              </span>
            </div>

            {isOpen && (
              <div className="border-none text-white text-center absolute top-full right-6 mt-0 bg-gradient-to-r from-[#FA3DF4] to-[#E50F0F] border rounded-lg shadow-lg w-42 z-50">
                <ul className="text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-white"
                    onClick={handleSignOut}
                  >
                  Выйти
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center px-4 py-2 text-white rounded transition">
              <img src={login} className="inline mr-[7px]" alt="login" />
            ВХОД
            </button>
          </Link>
        )}
    
       
      </div>
    </div>

  );
}


{/* <button className={styles.login} onClick={() => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}}>
  <img src={login} className="inline mr-[7px]" alt="" />
            ВЫХОД
</button>; */}