import styles from './styles/Login.module.css';
import { useState } from 'react';
import {auth} from '../components/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword(){
  const [email, setEmail] = useState('');
  const handleRegister = async (e : React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    try{
      await sendPasswordResetEmail(auth, email);
    } catch(error : unknown){
      console.log(error);
    }
  };
  return(
    <div className="mt-[100px] bg-[#D9D9D9] w-[552px] h-[632px] m-auto rounded-[30px]">
      <div className={styles.formTitle + ' text-center pt-[20px] pb-[20px]'}>RESET PASSWORD FORM</div>
      <hr style={{ border: '1px solid black' }} />
      <div className="flex flex-col justify-between text-center max-w-[450px] m-auto">
        <form className="" action="" onSubmit={handleRegister}>
          <div className="mt-[40px] inline-block p-[1.5px] rounded-[30px] bg-gradient-to-l from-[#e50f0f] to-[#fa3df4] outline-none">
            <input type="email"  onChange={(event) => setEmail(event.target.value)} value={email}  id="first" name="first" required placeholder="EMAIL" className="bg-white border-none w-[450px] h-[70px] border rounded-[30px] pl-[18px]" />
          </div>

          <button className={styles.buttonLogin + ' w-[450px] rounded-[30px] h-[70px] text-white mt-[20px]'}>RESET PASSWORD</button>

        </form>

      </div>

    </div>
  );
}