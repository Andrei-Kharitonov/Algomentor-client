import Header from '../components/Header';
import frame from '../assets/main.png';
import { useInView } from 'react-intersection-observer';
function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <>
      <Header></Header>
      <div ref={ref} className={`transition-all duration-4000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-[1300px] pl-[50px] flex justify-between mt-[50px] items-center m-auto">
          <div className="max-w-[600px]">
            <div className="maketTitle bg-gradient-to-r from-[#FA3DF4] to-[#E50F0F] bg-clip-text text-transparent">Algorithms & Data structures</div>
            <div className="maketDesc">Миссия:Сделать изучение алгоритмов и структур данных доступным, интерактивным и увлекательным для всех — от новичков до профессионалов.</div>
          </div>
          <div><img className="" src={frame}></img></div>
        </div>
      </div>

      <div className="m-auto w-[1200px] h-[400px] bg-amber-400 mb-7 flex">
        <button className="w-[150px] h-[30px] bg-amber-950 text-blue-800">
  Месяц
        </button>
        <button className="w-[150px] h-[30px] bg-amber-950 text-blue-800 ml-1.5">
          Год
        </button>
      </div>
    </>
  );
}

export default Home;