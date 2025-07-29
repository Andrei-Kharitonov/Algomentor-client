export default function Courses(){
  const tranferCources = () => {
    try {
      window.location.href = '/themes';
    } catch (error) {
      console.error('Ошибка при заходе на курсы:', error);
    }
  };
  return(
    <div className="course" onClick={tranferCources}>
      <span className="text-[30px] text-[#BB86FC]">АЛГОРИТМЫ И СТРУКТУРЫ ДАННЫХ</span>
    </div>
  );
}