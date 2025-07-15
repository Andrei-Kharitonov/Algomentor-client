import Header from '../components/Header';
import frame from '../assets/main.png';
function Home() {
  return (
    <>
      <Header></Header>
      <div className="w-[1250px] flex justify-between mt-[50px] items-center m-auto">
        <div className="max-w-[600px]">
          <div className="maketTitle">Algorithms & Data structures</div>
          <div className="maketDesc">Миссия: Сделать изучение алгоритмов и структур данных доступным, интерактивным и увлекательным для всех — от новичков до профессионалов.</div>
        </div>
        <div><img className="" src={frame}></img></div>
      </div>
    </>
  );
}

export default Home;