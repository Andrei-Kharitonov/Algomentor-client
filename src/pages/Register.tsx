import styles from './styles/Login.module.css';
import githublogo from '../assets/github.svg';
import google from '../assets/google.svg';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged,
  signInWithPopup,
  
} from 'firebase/auth';
import { auth, db, googleProvider,githubProvider } from '../components/firebase';
import { setDoc, doc } from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
      } else {
        console.log('unregistered');
      }
    });
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      window.location.href = '/login';
      if (checkbox) {
        setPersistence(auth, browserLocalPersistence);
      } else {
        setPersistence(auth, browserSessionPersistence);
      }
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
        });
      }
      window.location.href = '/login';
    } catch (error: unknown) {
      console.log(error);
      if((error as FirebaseError).code == 'auth/email-already-in-use'){
        alert('Пользователь с такими данными уже существувет');
      }
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, 'Users', user.uid), { email: user.email });
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };
  const signUpWithGitHub = async () => {
    try {
      const { user } = await signInWithPopup(auth, githubProvider);
      await setDoc(doc(db, 'Users', user.uid), { email: user.email });
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-[560px] h-[640px] p-[1px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] border-3 m-auto mt-[100px] rounded-[30px]">
      <div className=" bg-[#252525] w-[552px] h-[632px] m-auto rounded-[30px]">
        <div className={styles.formTitle + ' text-center pt-[20px] pb-[20px]'}>SIGNUP FORM</div>
        <hr style={{ border: '1.5px solid #BB86FC' }} />
        <div className="flex flex-col justify-between text-center max-w-[450px] m-auto">
          <form onSubmit={handleRegister}>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder="EMAIL"
              className="inpuut border-[#BB86FC]  text-[#BB86FC] text-[22px] mt-[30px] border-[2px] w-[450px] h-[70px] border rounded-[30px] pl-[18px] focus:outline-none"
            />

            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              placeholder="PASSWORD"
              className="inpuut border-[#BB86FC]  text-[#BB86FC] text-[22px] mt-[30px] border-[2px] w-[450px] h-[70px] border rounded-[30px] pl-[18px] focus:outline-none"
            />

            <div className="flex justify-between items-center mt-[20px] pl-2 pr-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="horns"
                  name="horns"
                  className="border-[3px] border-[#BB86FC]"
                  onChange={() => setCheckbox(!checkbox)}
                  checked={checkbox}
                />
                <label className={styles.remember + ' ml-[6px]'} htmlFor="horns">Запомнить меня</label>
              </div>
            </div>

            <button className={styles.buttonLogin + ' w-[450px] rounded-[30px] h-[70px] text-[#ddc6f9] mt-[20px] font-bold cursor-pointer'}>
            РЕГИСТРЦИЯ
            </button>

            <div className="flex justify-center mt-[20px]">
              <div className="inline-block p-[3px] rounded-[40px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none ml-[15px]">
                <div
                  onClick={signUpWithGoogle}
                  className="w-[120px] h-[61px] bg-[#252525] rounded-[40px] flex justify-center m-auto items-center cursor-pointer"
                >
                  <img src={google} alt="Google" />
                </div>
              </div>

              <div className="inline-block p-[3px] rounded-[40px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none ml-[15px]" onClick={signUpWithGitHub}>
                <div className="w-[120px] h-[61px] bg-[#252525] rounded-[40px] flex justify-center m-auto items-center">
                  <a href="#"><img src={githublogo} alt="GitHub" /></a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
