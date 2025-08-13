import Header from '../components/Header';
import frame from '../assets/main.png';
import { useInView } from 'react-intersection-observer';
import testt from '../assets/testt.png';
import test1 from '../assets/test1.png';
import test2 from '../assets/test2.png';
import gr from '../assets/gr.png';
import hesh from '../assets/hash.png';
import ds1 from '../assets/dsall.png';
import string from '../assets/sstring.png';
import dp from '../assets/dpp.png';
import { buy } from '../pay';
function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <>
      <Header></Header>
      <div ref={ref} className={`transition-all duration-4000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-[1300px] pl-[50px] flex justify-between mt-[70px] items-center m-auto">
          <div className="max-w-[600px]">
            <div className="maketTitle bg-gradient-to-r from-[#FA3DF4] to-[#E50F0F] bg-clip-text text-transparent font-medium">АЛГОРИТМЫ & СТРУКТУРЫ ДАННЫХ</div>
            <div className="maketDesc">"Хочешь работать в крупной IT-компании? Начни с алгоритмов. Разбираем сложное на простых примерах и тренируемся на реальных задачах с собеседований."</div>
          </div>
          <div><img className="" src={frame}></img></div>
        </div>
      </div>

      <div className="flex justify-center mt-[120px]">
        <div className="w-[455px] h-[770px] bg-[#252525] border rounded-[25px] border-[#FFD6FB] mr-5">
          <div className="text-center font-black text-[#D4C4FF] text-[35px] w-[400px] m-auto mt-[30px]">ГРАФЫ</div>
          <div className="flex w-[400px] bg-center m-auto items-center justify-between mt-[20px]">
            <img src={test2}/>
            <img src={testt}/>
            <img src={test1}/>
          </div>

          <ol className="list-decimal mx-auto mt-[40px] text-[#D4C4FF] text-[20px] list-inside w-[400px]">
            <li>BFS, DFS</li>
            <li>АЛГОРИТМ ДЕЙКСТРЫ</li>
            <li>АЛГОРИТМ ФЛОЙДА</li>
            <li>АЛГОРИТМ БЕЛАМАНА-ФОРДА</li>
            <li>MST.АЛГОРИТМ ПРИМА И КРАСКАЛА</li>
            <li>ПОИСК ЭЙЛЕРОВА И ГАМЕЛЬТОНОВА ЦИКЛА</li>
            <li>ПОИСК МОСТОВ И ТОЧЕК СОЧЛЕНЕНИЯ</li>
            <li>АЛГОРИТМ КУНА ДЛЯ НАХОЖДЕНИЯ МАКСИМАЛЬНОГО ПАРОСОЧЕТАНИЯ</li>
            <li>АЛГОРИТМ ФОРДА-ФАЛКЕРСОНА ДЛЯ НАХОЖДЕНИЯ МАКИМАЛЬНОГО ПОТОКА И МАКСИМАЛЬНОГО ПАРОСОЧЕТАНИЯ</li>
            <li className="t">АЛГОРИТМ БОРУВКИ</li>
          
          </ol>
        </div>

        <div className="w-[455px] h-[770px] bg-[#252525] border rounded-[25px] border-[#FFD6FB] mr-5">
          <div className="text-center font-black text-[#D4C4FF] text-[34px] w-[400px] m-auto mt-[30px]">СОРТИРОВКИ И АЛГОРИТМЫ ПОИСКА</div>
          <div className="bg-center mt-[35px] pl-5 pr-5">
            <img src={gr}/>
           
          </div>

          <ol className="list-decimal mx-auto mt-[50px] text-[#D4C4FF] text-[20px] list-inside w-[400px]">
            <li>БИНАРНЫЙ ПОИСК, ЛЕВОСТОРОННИЙ, ПРАВОСТОРОННИЙ БИНАРНЫЙ ПОИСК, БИНАРНЫЙ ПОИСК ПО ОТВЕТУ, ВЕЩЕСТВЕННЫЙ БИНАРНЫЙ ПОИСК</li>
            <li>ТЕРНАРНЫЙ ПОИСК</li>
            <li>QUICK SORT</li>
            <li>MERGE SORT</li>
            <li>COUNTING SORT</li>
            <li>RADIX SORT</li>
            <li>СОРТИРОВКА ВЫБОРОМ</li>
            
            <li className="t">MERGE SORT ЗА O(1) ПО ДОПОЛНИТЕЛЬНОЙ ПАМЯТИ</li>
            <li className="t">ПОИСК K-ОЙ ПОРЯДКОВОЙ СТАТИСТИКИ</li>
          
          </ol>
        </div>

        <div className="w-[455px] h-[770px] bg-[#252525] border rounded-[25px] border-[#FFD6FB]">
          <div className="text-center font-black text-[#D4C4FF] text-[35px] w-[400px] m-auto mt-[30px]">ХЭШИРОВАНИЕ</div>
          <div className="flex w-[400px] bg-center m-auto items-center justify-between mt-[15px]">
            <img src={hesh}/>
           
          </div>

          <ol className="list-decimal mx-auto mt-[20px] text-[#D4C4FF] text-[20px] list-inside w-[400px]">
            <li>ХЭШ-ТАБЛИЦЫ, ХЭШ-ФУНКЦИИ</li>
            <li>ОТКРЫТАЯ И ЗАКРЫТАЯ АДРЕСАЦИЯ</li>
            <li>КОЛЛИЗИИ</li>
            <li>АЛГОРИТМ КУКУШКИ</li>
            <li>ФИЛЬТРЫ БЛУМА</li>
            <li>УНИВЕРСАЛЬНОЕ СЕМЕЙСТВО ХЭШ-ФУНКЦИЙ</li>
            <li>ПЕРЕХЭШИРОВАНИЕ</li>
            <li>ДВОЙНОЕ ХЭШИРОВАНИЕ</li>
            <li className="t">ИДЕАЛЬНОЕ ХЭШИРОВАНИЕ</li>
          
          </ol>
        </div>
      </div>

      <div className="flex justify-center mt-[20px] mb-[50px] ">
        <div className="w-[455px] h-[770px] bg-[#252525] border rounded-[25px] border-[#FFD6FB] mr-5">
          <div className="text-center font-black text-[#D4C4FF] text-[35px] w-[400px] m-auto mt-[30px]">СТРУКТУРЫ ДАННЫХ</div>
          <div className="flex w-[400px] bg-center m-auto items-center justify-between mt-[11px]">
            <img src={ds1}/>
            
            
          </div>

          <ol className="list-decimal mx-auto mt-[10px] text-[#D4C4FF] text-[20px] list-inside w-[400px]">
            <li>BFS, DFS</li>
            <li>АЛГОРИТМ ДЕЙКСТРЫ</li>
            <li>АЛГОРИТМ ФЛОЙДА</li>
            <li>АЛГОРИТМ БЕЛАМАНА-ФОРДА</li>
            <li>MST.АЛГОРИТМ ПРИМА И КРАСКАЛА</li>
            <li>ПОИСК ЭЙЛЕРОВА И ГАМЕЛЬТОНОВА ЦИКЛА</li>
            <li>ПОИСК МОСТОВ И ТОЧЕК СОЧЛЕНЕНИЯ</li>
            <li>АЛГОРИТМ КУНА ДЛЯ НАХОЖДЕНИЯ МАКСИМАЛЬНОГО ПАРОСОЧЕТАНИЯ</li>
            <li>АЛГОРИТМ ФОРДА-ФАЛКЕРСОНА ДЛЯ НАХОЖДЕНИЯ МАКИМАЛЬНОГО ПОТОКА И МАКСИМАЛЬНОГО ПАРОСОЧЕТАНИЯ</li>
            <li className="t">АЛГОРИТМ БОРУВКИ</li>
          
          </ol>
        </div>

        <div className="w-[455px] h-[770px] bg-[#252525] border rounded-[25px] border-[#FFD6FB] mr-5">
          <div className="text-center font-black text-[#D4C4FF] text-[34px] w-[400px] m-auto mt-[30px]">ПОДСТРОКИ</div>
          <div className="bg-center mt-[35px] mx-auto flex items-center justify-center">
            <img src={string}/>
           
          </div>

          <ol className="list-decimal mx-auto mt-[50px] text-[#D4C4FF] text-[20px] list-inside w-[400px]">
            <li>БИНАРНЫЙ ПОИСК, ЛЕВОСТОРОННИЙ, ПРАВОСТОРОННИЙ БИНАРНЫЙ ПОИСК, БИНАРНЫЙ ПОИСК ПО ОТВЕТУ, ВЕЩЕСТВЕННЫЙ БИНАРНЫЙ ПОИСК</li>
            <li>ТЕРНАРНЫЙ ПОИСК</li>
            <li>QUICK SORT</li>
            <li>MERGE SORT</li>
            <li>COUNTING SORT</li>
            <li>RADIX SORT</li>
            <li>СОРТИРОВКА ВЫБОРОМ</li>
            
            <li className="t">MERGE SORT ЗА O(1) ПО ДОПОЛНИТЕЛЬНОЙ ПАМЯТИ</li>
            <li className="t">ПОИСК K-ОЙ ПОРЯДКОВОЙ СТАТИСТИКИ</li>
          
          </ol>
        </div>

        <div className="w-[455px] h-[770px] bg-[#252525] border rounded-[25px] border-[#FFD6FB]">
          <div className="text-center font-black text-[#D4C4FF] text-[35px] w-[400px] m-auto mt-[30px]">ДИНАМИЧЕСКОЕ ПРОГРАММИРОВАНИЕ</div>
          <div className="flex bg-center m-auto items-center justify-center mt-[15px]">
            <img src={dp}/>
           
          </div>

          <ol className="list-decimal mx-auto mt-[20px] text-[#D4C4FF] text-[20px] list-inside w-[400px]">
            <li>ХЭШ-ТАБЛИЦЫ, ХЭШ-ФУНКЦИИ</li>
            <li>ОТКРЫТАЯ И ЗАКРЫТАЯ АДРЕСАЦИЯ</li>
            <li>КОЛЛИЗИИ</li>
            <li>АЛГОРИТМ КУКУШКИ</li>
            <li>ФИЛЬТРЫ БЛУМА</li>
            <li>УНИВЕРСАЛЬНОЕ СЕМЕЙСТВО ХЭШ-ФУНКЦИЙ</li>
            <li>ПЕРЕХЭШИРОВАНИЕ</li>
            <li>ДВОЙНОЕ ХЭШИРОВАНИЕ</li>
            <li className="t">ИДЕАЛЬНОЕ ХЭШИРОВАНИЕ</li>
          
          </ol>
        </div>
      </div>
      <div className="flex mx-auto items-center mt-[100px]">
        <div className="m-auto w-[700px] h-[550px] bg-[#252525] rounded-[50px] block shadowww border border-[#ACDEFF] border-[1px]">
          <div className="text-[#ACDEFF] text-center text-[70px] font-black pt-[22px]">BASE</div>
        
          <ul className="uull mx-auto m-auto list-inside ml-[30px] w-[570px]">
            <li className="liii">Доступ к базовым урокам</li>
            <li className="liii">Видео-урок, конспект, практические задания по каждой теме</li>
            <li className="liii">Закрытый телеграм канал</li>
          </ul>
          <div className="flex items-center justify-between w-[590px] m-auto mt-[100px]">
            <button onClick={() => buy('basic')} className="cursor-pointer w-[230px] h-[55px] bg-[#23212A] text-[#D4C4FF] rounded-[17px] text-[21px] sha">
  2990/месяц
            </button>
            <button onClick={() => buy('basic365')} className="cursor-pointer w-[230px] h-[55px] bg-[#23212A] text-[#D4C4FF] rounded-[17px] text-[21px] sha">
 19990/навсегда
            </button>
          </div>
        </div>


        <div className="m-auto w-[700px] h-[550px] bg-[#252525] rounded-[50px] block shadowww2 border border-[#ACDEFF] border-[1px]">
          <div className="t text-center text-[70px] font-black pt-[22px]">PRO</div>
        
          <ul className="uull uull mx-auto m-auto list-inside ml-[30px] w-[570px]">
            <li className="liii2">Доступ к базовым и продвинутым урокам</li>
            <li className="liii2">Видео-урок, конспект, практические задания по каждой теме</li>
            <li className="liii2">Закрытый телеграм канал</li>
            <li className="liii2">Поддержка по всем вопросам 24/7</li>
          </ul>
          <div className="flex items-center justify-between w-[590px] m-auto mt-[100px]">
            <button onClick={() => buy('pro')} className="w-[230px] h-[55px] bg-[#23212A] text-[#D4C4FF] rounded-[17px] text-[21px] cursor-pointer sha2">
  3990/месяц
            </button>
            <button onClick={() => buy('pro365')} className="w-[230px] h-[55px] bg-[#23212A] text-[#D4C4FF] cursor-pointer rounded-[17px] text-[21px] sha2">
 24990/навсегда
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;