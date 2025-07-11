import styles from './styles/Login.module.css';
import githublogo from '../assets/github.svg';
import google from '../assets/google.svg';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import {signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithPopup}from 'firebase/auth';
import {auth, googleProvider} from '../components/firebase'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.email);
      } else {
        console.log('unregistred');
      }
    });
  }, []);
  
  const handleRegister = async (e : React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth, email, password);
      if(checkbox){
        setPersistence(auth, browserLocalPersistence);
      }
      else{
        setPersistence(auth, browserSessionPersistence);
      }
      window.location.href = '/';
    } catch(error : unknown){
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      window.location.href = '/';
      console.log('User signed in:', result.user);
    } catch (error : unknown) {
      console.error('Error signing in with Google:', error);
    }
  };

    
  return (
    <div className="mt-[100px] bg-[#D9D9D9] w-[552px] h-[632px] m-auto rounded-[30px]">
      <div className={styles.formTitle + ' text-center pt-[20px] pb-[20px]'}>LOGIN FORM</div>
      <hr style={{ border: '1px solid black' }} />
      <div className="flex flex-col justify-between text-center max-w-[450px] m-auto">
        <form className="" action="" onSubmit={handleRegister}>
          <div className="mt-[40px] inline-block p-[1.5px] rounded-[30px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none">
            <input type="email" onChange={(event) => setEmail(event.target.value)} value={email} id="first" name="first" required placeholder="EMAIL" className="bg-white border-none w-[450px] h-[70px] border rounded-[30px] pl-[18px]" />
          </div>
          <div className="mt-[30px] inline-block p-[1.5px] rounded-[30px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none">
            <input type="password"  onChange={(event) => setPassword(event.target.value)} value={password} id="first" name="first" required placeholder="PASSWORD" className="bg-white border-none w-[450px] h-[70px] border rounded-[30px] pl-[18px]" />
          </div>
          <div className="flex justify-between mt-[20px] pl-2 pr-2">
            <div>
              <input type="checkbox" id="horns" name="horns" className="" onChange={() => setCheckbox(!checkbox)} checked={checkbox} />
              <label className={styles.remember + ' ml-[10px]'} htmlFor="horns" >Запомнить меня</label>
            </div>
            <Link to="/resetpassword" ><span className={styles.forgot}>Забыли пароль?</span></Link>
          </div>

          <button className={styles.buttonLogin + ' w-[450px] rounded-[30px] h-[70px] text-white mt-[20px]'}>LOGIN</button>
          <div className="flex justify-center mt-[20px]">
            <div className="inline-block p-[3px] rounded-[40px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none ml-[15px]" onClick={signInWithGoogle}>
              <div className="w-[120px] h-[61px] bg-[#D9D9D9] rounded-[40px] flex justify-center m-auto items-center"><img className="" src={google}></img></div>
            </div >
            <div className="inline-block p-[3px] rounded-[40px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none ml-[15px]">
              <div className="w-[120px] h-[61px] bg-[#D9D9D9] rounded-[40px] flex justify-center m-auto items-center"><a href=""><img className="" src={githublogo}></img></a></div>
            </div >
          </div>
          <div>Если не зарегистрирован <Link to="/register" className="text-blue-400" >Загерайся</Link></div>
        </form>

      </div>

    </div>
  );
}

export default Login;
