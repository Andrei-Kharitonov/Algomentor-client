import { Link } from 'react-router';
import styles from './styles/Header.module.css';
import login from '../assets/login.svg';
import {onAuthStateChanged, signOut, type User} from 'firebase/auth';
import {auth} from './firebase';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
export default function Header() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
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
  const tranferCources = () => {
    try {
      window.location.href = '/courses';
    } catch (error) {
      console.error('Ошибка при заходе на курсы:', error);
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
    <div ref={ref} className={`transition-all duration-4000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      <div className={styles.header}>
        <div className="pt-[30px] flex w-[1350px] m-auto justify-between items-center">
          <span className={styles.logo + ' text-5xl font-bold bg-gradient-to-r from-[#FA3DF4] to-[#E50F0F] bg-clip-text text-transparent border-t-0 border-r-0 border-l-0'}>
          AlgoMentor
          </span>
          <nav className={styles.navigation + ' flex justify-between align-center'}>
            <a className="mr-[30px]" href="#">ТЕМЫ КУРСА</a>
            <a className="mr-[30px]" href="#">ПОДПИСКИ</a>
            <a href="#">КОНТАКТЫ</a>
          </nav>
          {currentUser ? (
            <div className="relative flex items-center" ref={dropdownRef}  onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img src={login} alt="user" />
                <span className="text-[#BB86FC] text-[21px] ml-2.5">
                  {currentUser.email}
                </span>
              </div>

              {isOpen && (
                <div className="border-none text-white text-center absolute top-full right-6 mt-0 border-[#BB86FC] bg-[#252525]">
                  <ul className="text-gray-700">
                    <li
                      className="px-16 py-3 hover:bg-[rgba(255,255,255,0.22)] cursor-pointer text-white border border-[##BB86FC] rounded-[10px] border-[2px] border-b-0 mt-0.5"
                      onClick={tranferCources}
                     
                    >
                  КУРСЫ
                    </li>
                    <li className="px-16 py-3 hover:bg-[rgba(255,255,255,0.22)] cursor-pointer text-white border border-[##BB86FC] rounded-[10px] border-[2px]" 
                      onClick={handleSignOut}>
                  ВЫЙТИ
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="text-[#BB86FC] transition-all duration-1000 text-[21px] font-jetbrains cursor-pointer group">
                <img 
                  src={login} 
                  className="inline mr-[10px] transition-all duration-1000 group-hover:w-[55px] group-hover:h-[55px] delay-3000" 
                  alt="login" 
                />
                <span className={`${styles.fontjetbrains} hover:text-[18px] transition-all duration-300`}>
      ВХОД
                </span>
              </button>
            </Link>
          )}
    
       
        </div>
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