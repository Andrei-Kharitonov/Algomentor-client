import styles from './styles/Login.module.css';
import githublogo from '../assets/github.svg';
import google from '../assets/google.svg';
import { useState, useEffect } from 'react';
import {createUserWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence, setPersistence, onAuthStateChanged}from 'firebase/auth';
import {auth, db} from '../components/firebase';
import {setDoc, doc} from 'firebase/firestore';

function Register() {
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
      await createUserWithEmailAndPassword(auth, email, password);
      if(checkbox){
        setPersistence(auth, browserLocalPersistence);
      }
      else{
        setPersistence(auth, browserSessionPersistence);
      }
      const user = auth.currentUser;
      console.log(user);
      if(user){
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
        });
      }
      window.location.href = '/login';
    } catch(error : unknown){
      console.log(error);
    }
  };


  return (
    <div className="mt-[100px] bg-[#D4C4FF] border-[4px] border-[#5F3AA8] w-[552px] h-[632px] m-auto rounded-[30px]">
      <div className={styles.formTitle + ' text-center pt-[20px] pb-[20px]'}>SIGNUP FORM</div>
      <hr style={{ border: '1.5px solid #5F3AA8' }} />
      <div className="flex flex-col justify-between text-center max-w-[450px] m-auto">
        <form className="" action="" onSubmit={handleRegister}>
         
          <input type="email" onChange={(event) => setEmail(event.target.value)} value={email} id="first" name="first" required placeholder="EMAIL" className="border-[#5F3AA8] border-[2px] w-[450px] h-[70px] rounded-[30px] pl-[18px] mt-[40px] focus:outline-none" />
        
        
          <input type="password"  onChange={(event) => setPassword(event.target.value)} value={password}  id="first" name="first" required placeholder="PASSWORD" className="border-[#5F3AA8] border-[2px] w-[450px] h-[70px] rounded-[30px] pl-[18px] mt-[30px] focus:outline-none"/>
         
          {/* <div className="mt-[30px] inline-block p-[1.5px] rounded-[30px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none">
            <input type="text" id="first" name="first" required placeholder="RETRY PASSWORD" className="bg-white border-none w-[450px] h-[70px] border rounded-[30px] pl-[18px]" />
          </div> */}
          <div className="flex justify-between items-center mt-[20px] pl-2 pr-2">
            <div className="flex items-center">
              <input type="checkbox" id="horns" name="horns" className="border-[3px] border-[#5F3AA8]" onChange={() => setCheckbox(!checkbox)} checked={checkbox} />
              <label className={styles.remember + ' ml-[6px]'} htmlFor="horns" >Запомнить меня</label>
            </div>
            
          </div>

          <button className={styles.buttonLogin + ' w-[450px] rounded-[30px] h-[70px] text-white mt-[20px]'}>SIGNUP</button>
          <div className="flex justify-center mt-[20px]">
            <div className="inline-block p-[3px] rounded-[40px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none ml-[15px]">
              <div className="w-[120px] h-[61px] bg-[#D4C4FF] rounded-[40px] flex justify-center m-auto items-center"><img className="" src={google}></img></div>
            </div >
            <div className="inline-block p-[3px] rounded-[40px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none ml-[15px]">
              <div className="w-[120px] h-[61px] bg-[#D4C4FF] rounded-[40px] flex justify-center m-auto items-center"><a href=""><img className="" src={githublogo}></img></a></div>
            </div >
          </div>
        </form>

      </div>

    </div>
  );
}

export default Register;
