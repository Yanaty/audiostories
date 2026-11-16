const titles: Record<string, string> = {
'avstraliyskaya-pegaya': 'Австралийская пегая',
'beregite-pogodu': 'Берегите погоду',
'bethovenskaya-tropa': 'Бетховенская тропа',
'bolshoe-spasibo': 'Большое спасибо',
'chistye-pticy': 'Чистые птицы',
'doverchivyy-ezhik': 'Доверчивый ёжик',
'ey-vy-v-bochkah': 'Эй, вы в бочках!',
'kak-ezhik-s-medvezhonkom-lovili-osen': 'Как Ёжик с Медвежонком ловили осень',
'kak-medvezhonok-perehitril-vremya': 'Как Медвежонок перехитрил время',
'kak-ottenit-tishinu': 'Как оттенить тишину',
'kit': 'Кит',
'laskovyy-pushistyy-i-prygaet': 'Ласковый, пушистый и прыгает',
'lesnaya-ottepel': 'Лесная оттепель',
'malenkiy-zhivoy-kaktus': 'Маленький живой кактус',
'plyaska': 'Пляска',
'porosenok-v-kolyuchey-shubke': 'Поросёнок в колючей шубке',
'pozvolte-ya-vam-pomogu': 'Позвольте, я вам помогу',
'pyatochka': 'Пяточка',
'razgovor': 'Разговор',
'slon': 'Слон',
'solnyshko-u-tebya-v-uglu': 'Солнышко у тебя в углу',
'udivitelnaya-bochka': 'Удивительная бочка',
'uryuk': 'Урюк',
'v-gostyah-u-sobaki': 'В гостях у собаки',
'velikiy-kitayskiy-poet': 'Великий китайский поэт',
'velikoe-imya-base': 'Великое имя Басё',
'volnyy-osenniy-veter': 'Вольный осенний ветер',
'volshebnaya-travka-zveroboy': 'Волшебная травка зверобой',
'zayachi-ushi': 'Заячьи уши',
'zvanyy-obed': 'Званый обед',
};
const files = import.meta.glob('../audio/*.mp3', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
export const tracks = Object.entries(files).map(([path, src]) => {
  const id = path.split('/').pop()!.replace(/\.mp3$/, '');
  if (!titles[id]) throw new Error(`Добавьте русское название для ${id}.mp3 в src/tracks.ts`);
  return { id, src, title: titles[id] };
}).sort((a, b) => a.title.localeCompare(b.title, 'ru'));
