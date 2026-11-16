import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { tracks } from './tracks';
import { adjacent, shuffle } from './queue';
import './style.css';

function App() {
  const player = useRef<AudioPlayer>(null);
  const [current, setCurrent] = useState<string>();
  const [queue, setQueue] = useState(tracks.map(t => t.id));
  const [mixed, setMixed] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [minutes, setMinutes] = useState('15');
  const [deadline, setDeadline] = useState<number>();
  const deadlineRef = useRef<number | undefined>(undefined);
  const [remaining, setRemaining] = useState(0);
  const [notice, setNotice] = useState('');
  const track = tracks.find(t => t.id === current);
  function expire() {
    player.current?.audio.current?.pause();
    deadlineRef.current = undefined;
    setDeadline(undefined); setRemaining(0);
    setNotice('Таймер завершён. Сладких снов!');
  }
  useEffect(() => {
    if (!deadline) return;
    const update = () => {
      const left = deadline - Date.now();
      if (left <= 0) expire(); else setRemaining(Math.ceil(left / 1000));
    };
    update();
    const interval = window.setInterval(update, 250);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', update); };
  }, [deadline]);
  function select(id: string) {
    setNotice('');
    if (current === id) {
      const audio = player.current?.audio.current;
      if (audio?.paused) void audio.play().catch(() => setNotice('Нажмите кнопку воспроизведения в плеере.'));
      else audio?.pause();
    } else setCurrent(id);
  }
  function move(direction: number, automatic = false) {
    if (deadlineRef.current && Date.now() >= deadlineRef.current) { expire(); return; }
    if (!current) return;
    const next = adjacent(queue, current, direction, repeat);
    if (next) { setNotice(''); setCurrent(next); }
    else if (automatic) { setPlaying(false); setNotice('Все сказки прослушаны. Можно начать сначала.'); }
  }
  function mixAndPlay() {
    const next = shuffle(tracks.map(t => t.id));
    // A new first track also guarantees that changing the queue starts playback.
    if (next[0] === current && next.length > 1) [next[0], next[1]] = [next[1], next[0]];
    setQueue(next); setMixed(true); setNotice(''); setCurrent(next[0]);
  }
  function setTimer(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(minutes);
    if (!Number.isFinite(value) || value < 1 || value > 1440) return;
    const end = Date.now() + value * 60_000;
    deadlineRef.current = end; setDeadline(end); setNotice('');
  }
  return <div className="page">
    <header><a className="brand" href="#">☾ <span>тихие сказки</span></a><span className="header-note">Время слушать и мечтать</span></header>
    <main>
      <section className="intro"><span className="eyebrow">МАЛЕНЬКИЕ ИСТОРИИ ДЛЯ БОЛЬШИХ МЕЧТАТЕЛЕЙ</span><h1>У каждой сказки —<br/><em>свой тихий вечер.</em></h1><p>Устройтесь поудобнее. Выберите историю,<br className="desktop"/> а следующая начнётся сама.</p><div className="intro-art" aria-hidden="true">☾<span>✧</span><i>✦</i></div></section>
      <div className="content">
        <section className="library" aria-labelledby="library-title"><div className="section-heading"><div><h2 id="library-title">Ваша полка сказок</h2><p>{tracks.length} историй · на русском языке</p></div><button className="primary" onClick={mixAndPlay}>⤨ Перемешать и слушать</button></div>
          <p className="queue-note">{mixed ? 'Случайный порядок воспроизведения. Список на полке остаётся по алфавиту.' : 'Сказки звучат по порядку, от первой до последней.'}</p>
          <ol className="tracks">{tracks.map((t, index) => <li key={t.id}><button className={`track ${current === t.id ? 'selected' : ''}`} onClick={() => select(t.id)} aria-label={`${current === t.id && playing ? 'Приостановить' : 'Слушать'}: ${t.title}`} aria-current={current === t.id ? 'true' : undefined}><span className="number">{String(index + 1).padStart(2, '0')}</span><span className="track-title">{t.title}</span><span className="track-action" aria-hidden="true">{current === t.id && playing ? 'Ⅱ' : '▶'}</span></button></li>)}</ol>
        </section>
        <aside><section className="settings"><span className="mini-icon" aria-hidden="true">☾</span><h2>Засыпайте под сказку</h2><p>Таймер остановит воспроизведение, когда придёт время отдыхать.</p><form onSubmit={setTimer}><label htmlFor="minutes">Выключить через</label><div className="presets">{[10,15,20,30,45,60].map(n => <button key={n} type="button" className={minutes === String(n) ? 'active' : ''} onClick={() => setMinutes(String(n))}>{n === 60 ? '1 час' : `${n} мин`}</button>)}</div><div className="timer-input"><input id="minutes" type="number" min="1" max="1440" step="1" required value={minutes} onChange={e => setMinutes(e.target.value)}/><span>минут</span></div><button className="primary full" type="submit">{deadline ? 'Обновить таймер' : 'Включить таймер'}</button></form>{deadline && <div className="countdown" role="status">Осталось {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}<button onClick={() => { deadlineRef.current = undefined; setDeadline(undefined); }}>Отменить</button></div>}<div className="repeat"><div><strong>Повторять всё</strong><span>Начать заново после последней сказки</span></div><button className={`switch ${repeat ? 'on' : ''}`} role="switch" aria-label="Повторять все сказки" aria-checked={repeat} onClick={() => setRepeat(!repeat)}><span/></button></div></section><p className="aside-note">Никуда не спешите.<br/>Следующая история уже ждёт.</p></aside>
      </div>
    </main><footer>☾ Тихие сказки <span>Для уютных вечеров и добрых снов</span></footer>
    {notice && <div className="notice" role="status">{notice}<button aria-label="Закрыть сообщение" onClick={() => setNotice('')}>×</button></div>}
    {track && <section className="player" aria-label="Аудиоплеер"><div className="now-playing"><span className="cover" aria-hidden="true">☾</span><div><span className="eyebrow">{playing ? 'СЕЙЧАС ЗВУЧИТ' : 'ВЫБРАННАЯ СКАЗКА'}</span><strong>{track.title}</strong><small>{mixed ? 'Случайная очередь' : 'По порядку'} · {queue.indexOf(track.id) + 1} из {queue.length}</small></div></div><AudioPlayer ref={player} src={track.src} autoPlay autoPlayAfterSrcChange preload="metadata" showSkipControls showJumpControls hasDefaultKeyBindings={false} customAdditionalControls={[]} onClickPrevious={() => move(-1)} onClickNext={() => move(1)} onEnded={() => move(1, true)} onPlay={() => { if (deadlineRef.current && Date.now() >= deadlineRef.current) expire(); else setPlaying(true); }} onPause={() => setPlaying(false)} onListen={() => { if (deadlineRef.current && Date.now() >= deadlineRef.current) expire(); }} onError={() => setNotice('Не удалось загрузить сказку. Попробуйте выбрать другую.')} onPlayError={() => setNotice('Нажмите кнопку воспроизведения в плеере.')} i18nAriaLabels={{player:'Аудиоплеер',progressControl:'Позиция воспроизведения',volumeControl:'Громкость',play:'Воспроизвести',pause:'Пауза',previous:'Предыдущая сказка',next:'Следующая сказка',rewind:'Назад на 10 секунд',forward:'Вперёд на 10 секунд',volume:'Выключить звук',volumeMute:'Включить звук',loop:'Повтор',loopOff:'Отключить повтор'}} progressJumpSteps={{backward:10000,forward:10000}}/></section>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
