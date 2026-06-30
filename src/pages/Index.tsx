import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Данные для режима ЖД ────────────────────────────────────────────────────

const rzhdStations = [
  "Москва — Ленинградский вокзал",
  "Москва — Казанский вокзал",
  "Москва — Ярославский вокзал",
  "Москва — Павелецкий вокзал",
  "Москва — Киевский вокзал",
  "Москва — Курский вокзал",
  "Санкт-Петербург — Московский вокзал",
  "Санкт-Петербург — Витебский вокзал",
  "Санкт-Петербург — Финляндский вокзал",
  "Сочи — Главный вокзал",
  "Другой вокзал",
];

const rzhdServices = [
  { icon: "Car",        label: "С вокзала — до такси или выхода",        value: "station_to_taxi" },
  { icon: "MapPin",     label: "С вокзала — до любой точки на территории", value: "station_to_point" },
  { icon: "Home",       label: "Из города / дома — до вагона",            value: "city_to_wagon" },
  { icon: "Navigation", label: "Из города / дома — до точки на вокзале",  value: "city_to_point" },
];

const rzhdSteps = [
  { number: "01", title: "Оставьте заявку",       desc: "Укажите вокзал, поезд, вагон, дату и количество мест багажа" },
  { number: "02", title: "Оплатите онлайн",        desc: "Оплата банковской картой при оформлении заявки" },
  { number: "03", title: "Встреча с носильщиком",  desc: "Носильщик встретит вас с табличкой в указанном месте" },
  { number: "04", title: "Доставка до места",      desc: "Вещи доставят до вагона, такси или любой точки на территории" },
];

const rzhdBenefits = [
  { icon: "Package",    title: "Любой багаж",         desc: "Чемоданы, сумки, крупногабаритный груз — без ограничений по количеству мест", detail: "Без ограничений" },
  { icon: "CreditCard", title: "Оплата картой",        desc: "Visa, Mastercard, МИР — быстро и безопасно онлайн при оформлении", detail: "Visa / МИР" },
  { icon: "Clock",      title: "Работаем 24/7",        desc: "Сервис доступен круглосуточно на всех крупных вокзалах страны", detail: "365 дней в году" },
];

const rzhdStats = [
  { label: "Стоимость",    value: "от 500 ₽",    sub: "за 1 место" },
  { label: "Зона работы",  value: "Весь вокзал", sub: "включая перроны" },
  { label: "Отмена",       value: "за 15 мин",   sub: "полный возврат" },
];

// ─── Данные для режима Авиа ──────────────────────────────────────────────────

const aviaAirports = [
  "Москва — Шереметьево (SVO)",
  "Москва — Домодедово (DME)",
  "Москва — Внуково (VKO)",
  "Санкт-Петербург — Пулково (LED)",
  "Сочи — Адлер (AER)",
  "Екатеринбург — Кольцово (SVX)",
  "Казань (KZN)",
  "Новосибирск — Толмачёво (OVB)",
  "Другой аэропорт",
];

const aviaServices = [
  { icon: "PlaneLanding", label: "С самолёта — до выхода / такси",           value: "arrival_to_exit" },
  { icon: "MapPin",       label: "По территории аэропорта",                   value: "airport_point" },
  { icon: "PlaneTakeoff", label: "Из города / дома — до стойки регистрации", value: "home_to_checkin" },
  { icon: "Navigation",   label: "Из города — до любой точки в аэропорту",   value: "home_to_point" },
];

const aviaMeetPoints = [
  "Зона прилёта (терминал A)",
  "Зона прилёта (терминал B)",
  "Зона прилёта (терминал C)",
  "Стойка регистрации",
  "Вход в терминал",
  "Парковка P1",
  "Остановка такси",
];

const aviaSteps = [
  { number: "01", title: "Оставьте заявку",        desc: "Укажите аэропорт, номер рейса, дату и точку встречи" },
  { number: "02", title: "Оплатите онлайн",         desc: "Оплата банковской картой при оформлении заявки" },
  { number: "03", title: "Носильщик вас встретит",  desc: "Сотрудник встретит вас с табличкой в указанной точке аэропорта" },
  { number: "04", title: "Доставка до места",       desc: "Вещи доставят до выхода, такси, стойки регистрации или вашего гейта" },
];

const aviaBenefits = [
  { icon: "Package",    title: "Любой багаж",           desc: "Чемоданы, сумки, спортивный инвентарь, детские коляски — без ограничений", detail: "Без ограничений" },
  { icon: "CreditCard", title: "Оплата онлайн",          desc: "Visa, Mastercard, МИР — быстро и безопасно при оформлении заявки",        detail: "Visa / МИР" },
  { icon: "ShieldCheck", title: "Безопасно и надёжно",   desc: "Все носильщики прошли проверку, работают в зоне аэропорта официально",   detail: "Проверенные сотрудники" },
];

const aviaStats = [
  { label: "Стоимость",   value: "от 600 ₽",    sub: "за 1 место" },
  { label: "Зона работы", value: "Весь аэропорт", sub: "включая терминалы" },
  { label: "Отмена",      value: "за 30 мин",   sub: "полный возврат" },
];

// ─── Компоненты ─────────────────────────────────────────────────────────────

const inputCls = "w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white";
const labelCls = "text-xs font-medium text-rzd-muted block mb-1.5";

function BagsCounter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center border border-rzd-gray-mid rounded-lg overflow-hidden bg-white">
      <button type="button" onClick={() => onChange(String(Math.max(1, Number(value) - 1)))}
        className="px-3 py-2.5 text-rzd-red hover:bg-rzd-gray transition-colors font-bold text-lg leading-none">−</button>
      <div className="flex-1 text-center text-sm font-bold text-rzd-dark py-2.5 border-x border-rzd-gray-mid">{value}</div>
      <button type="button" onClick={() => onChange(String(Number(value) + 1))}
        className="px-3 py-2.5 text-rzd-red hover:bg-rzd-gray transition-colors font-bold text-lg leading-none">+</button>
    </div>
  );
}

function SuccessBlock({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="CheckCircle" size={32} className="text-green-600" />
      </div>
      <h3 className="text-xl font-bold mb-2">Заявка принята!</h3>
      <p className="text-rzd-muted text-sm">Носильщик встретит вас с табличкой в указанном месте</p>
      <button onClick={onReset} className="mt-6 text-rzd-red text-sm font-medium hover:underline">
        Отправить ещё одну заявку
      </button>
    </div>
  );
}

// ─── Форма: ЖД ──────────────────────────────────────────────────────────────
function RzhdForm() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", station: "", train: "", bags: "1", sign: "", serviceType: "" });
  const [submitted, setSubmitted] = useState(false);
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (submitted) return <SuccessBlock onReset={() => setSubmitted(false)} />;

  return (
    <>
      <h2 className="text-xl font-bold mb-1">Заказать носильщика</h2>
      <p className="text-rzd-muted text-sm mb-5">Заполните форму и оплатите картой</p>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">

        {/* Тип услуги */}
        <div>
          <label className={labelCls}>Тип услуги</label>
          <div className="space-y-1.5">
            {rzhdServices.map(s => (
              <label key={s.value} className={`flex items-center gap-3 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${form.serviceType === s.value ? "border-rzd-red bg-rzd-red/5" : "border-rzd-gray-mid hover:border-rzd-red/50"}`}>
                <input type="radio" name="serviceType" value={s.value} checked={form.serviceType === s.value}
                  onChange={e => f("serviceType", e.target.value)} className="accent-rzd-red" />
                <Icon name={s.icon} fallback="Circle" size={14} className="text-rzd-red shrink-0" />
                <span className="text-sm text-rzd-dark">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Ваше имя</label>
            <input type="text" required placeholder="Иван Иванов" value={form.name} onChange={e => f("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Телефон</label>
            <input type="tel" required placeholder="+7 (999) 000-00-00" value={form.phone} onChange={e => f("phone", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Вокзал</label>
          <select required value={form.station} onChange={e => f("station", e.target.value)} className={inputCls}>
            <option value="">Выберите вокзал</option>
            {rzhdStations.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Дата и время</label>
            <input type="datetime-local" required value={form.date} onChange={e => f("date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Мест багажа</label>
            <BagsCounter value={form.bags} onChange={v => f("bags", v)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Номер поезда и вагон</label>
          <input type="text" required placeholder="Например: № 020А, вагон 5" value={form.train} onChange={e => f("train", e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Табличка / пожелания (необязательно)</label>
          <textarea rows={2} placeholder="Текст для таблички носильщика, особые пожелания..." value={form.sign}
            onChange={e => f("sign", e.target.value)} className={`${inputCls} resize-none`} />
        </div>

        <div className="bg-rzd-gray rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-rzd-muted">{form.bags} {Number(form.bags) === 1 ? "место" : Number(form.bags) < 5 ? "места" : "мест"} × 500 ₽</span>
          <span className="text-xl font-black text-rzd-dark">{(Number(form.bags) * 500).toLocaleString("ru-RU")} ₽</span>
        </div>

        <button type="submit" className="w-full bg-rzd-red hover:bg-rzd-red-dark text-white font-bold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
          <Icon name="CreditCard" size={16} />
          Оплатить и заказать — {(Number(form.bags) * 500).toLocaleString("ru-RU")} ₽
        </button>
        <p className="text-center text-xs text-rzd-muted">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <span className="text-rzd-red cursor-pointer hover:underline">политикой обработки данных</span>
        </p>
      </form>
    </>
  );
}

// ─── Форма: Авиа ─────────────────────────────────────────────────────────────
function AviaForm() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", airport: "", flight: "", meetPoint: "", bags: "1", sign: "", serviceType: "" });
  const [submitted, setSubmitted] = useState(false);
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (submitted) return <SuccessBlock onReset={() => setSubmitted(false)} />;

  return (
    <>
      <h2 className="text-xl font-bold mb-1">Заказать носильщика</h2>
      <p className="text-rzd-muted text-sm mb-5">Заполните форму и оплатите картой</p>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">

        {/* Тип услуги */}
        <div>
          <label className={labelCls}>Тип услуги</label>
          <div className="space-y-1.5">
            {aviaServices.map(s => (
              <label key={s.value} className={`flex items-center gap-3 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${form.serviceType === s.value ? "border-rzd-red bg-rzd-red/5" : "border-rzd-gray-mid hover:border-rzd-red/50"}`}>
                <input type="radio" name="aviaService" value={s.value} checked={form.serviceType === s.value}
                  onChange={e => f("serviceType", e.target.value)} className="accent-rzd-red" />
                <Icon name={s.icon} fallback="Circle" size={14} className="text-rzd-red shrink-0" />
                <span className="text-sm text-rzd-dark">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Ваше имя</label>
            <input type="text" required placeholder="Иван Иванов" value={form.name} onChange={e => f("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Телефон</label>
            <input type="tel" required placeholder="+7 (999) 000-00-00" value={form.phone} onChange={e => f("phone", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Аэропорт</label>
          <select required value={form.airport} onChange={e => f("airport", e.target.value)} className={inputCls}>
            <option value="">Выберите аэропорт</option>
            {aviaAirports.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Дата и время рейса</label>
            <input type="datetime-local" required value={form.date} onChange={e => f("date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Номер рейса</label>
            <input type="text" required placeholder="SU 1234" value={form.flight} onChange={e => f("flight", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Точка встречи</label>
            <select required value={form.meetPoint} onChange={e => f("meetPoint", e.target.value)} className={inputCls}>
              <option value="">Выберите точку</option>
              {aviaMeetPoints.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Мест багажа</label>
            <BagsCounter value={form.bags} onChange={v => f("bags", v)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Пожелания / особые условия (необязательно)</label>
          <textarea rows={2} placeholder="Детская коляска, инвалидное кресло, особые пожелания..." value={form.sign}
            onChange={e => f("sign", e.target.value)} className={`${inputCls} resize-none`} />
        </div>

        <div className="bg-rzd-gray rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-rzd-muted">{form.bags} {Number(form.bags) === 1 ? "место" : Number(form.bags) < 5 ? "места" : "мест"} × 600 ₽</span>
          <span className="text-xl font-black text-rzd-dark">{(Number(form.bags) * 600).toLocaleString("ru-RU")} ₽</span>
        </div>

        <button type="submit" className="w-full bg-rzd-red hover:bg-rzd-red-dark text-white font-bold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
          <Icon name="CreditCard" size={16} />
          Оплатить и заказать — {(Number(form.bags) * 600).toLocaleString("ru-RU")} ₽
        </button>
        <p className="text-center text-xs text-rzd-muted">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <span className="text-rzd-red cursor-pointer hover:underline">политикой обработки данных</span>
        </p>
      </form>
    </>
  );
}

// ─── Главная страница ────────────────────────────────────────────────────────
type Mode = "rzhd" | "avia";

export default function Index() {
  const [mode, setMode] = useState<Mode | null>(null);

  const steps  = mode === "avia" ? aviaSteps    : rzhdSteps;
  const bens   = mode === "avia" ? aviaBenefits : rzhdBenefits;
  const stats  = mode === "avia" ? aviaStats    : rzhdStats;

  return (
    <div className="font-golos min-h-screen bg-white text-rzd-dark">

      {/* HEADER */}
      <header className="bg-white border-b border-rzd-gray-mid sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setMode(null)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
            <div>
              <div className="font-semibold text-sm leading-tight text-rzd-dark">MyPorter</div>
              <div className="text-xs text-rzd-muted leading-tight">Сервис переноски багажа</div>
            </div>
          </button>
          <div className="flex items-center gap-3">
            <a href="tel:+78001000888" className="hidden sm:flex items-center gap-2 text-rzd-red font-semibold text-sm hover:opacity-80 transition-opacity">
              <Icon name="Phone" size={16} />
              8 800 100-08-88
            </a>
            <Link to="/cabinet/login" className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark font-semibold text-sm px-3 py-2 rounded-lg hover:border-rzd-red transition-colors">
              <Icon name="User" size={15} />
              <span className="hidden sm:inline">Личный кабинет</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ ГЛАВНАЯ СТРАНИЦА (без выбора режима) ═══ */}
      {!mode && (
        <>
          {/* HERO — fullscreen split с фото */}
          <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
            {/* Фоновое фото */}
            <div className="absolute inset-0">
              <img
                src="https://cdn.poehali.dev/projects/9c7aced7-85b1-4288-b6e2-c053fc7d00e2/files/e8b15d9b-e867-4e79-a8c1-c9f30352c914.jpg"
                alt="MyPorter"
                className="w-full h-full object-cover object-center opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
            </div>

            {/* Контент */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 text-white text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium px-4 py-2 rounded-full mb-8 tracking-wider uppercase">
                <Icon name="MapPin" size={11} />
                Вокзалы · Аэропорты · Вся Россия
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-none mb-5 tracking-tight">
                Профессиональная<br />
                <span className="text-rzd-red">переноска</span> багажа
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-16 max-w-xl">
                Носильщик встретит вас, заберёт вещи и доставит куда нужно — быстро и надёжно
              </p>

              {/* Два больших выбора */}
              <div className="grid sm:grid-cols-2 gap-4 w-full max-w-3xl">
                {/* ЖД */}
                <button
                  onClick={() => { setMode("rzhd"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-rzd-red bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-left"
                >
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/9c7aced7-85b1-4288-b6e2-c053fc7d00e2/files/66196494-4ed4-4d26-8bcd-a040990d2c54.jpg)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative p-8 flex flex-col h-full min-h-[260px] justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rzd-red/30 group-hover:bg-rzd-red flex items-center justify-center transition-colors duration-300">
                        <Icon name="Train" size={22} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Железнодорожный</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-2">Носильщик<br />на вокзале</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-5">До вагона, от поезда, до такси — по любому маршруту на вокзале</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {["До вагона", "От поезда", "До такси", "По вокзалу"].map(t => (
                          <span key={t} className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full border border-white/10">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-rzd-red text-sm font-bold group-hover:gap-4 transition-all duration-300">
                        Заказать <Icon name="ArrowRight" size={15} />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Авиа */}
                <button
                  onClick={() => { setMode("avia"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-rzd-red bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-left"
                >
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/9c7aced7-85b1-4288-b6e2-c053fc7d00e2/files/d0eb1b47-5603-41c0-90b8-331ad33b2781.jpg)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative p-8 flex flex-col h-full min-h-[260px] justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rzd-red/30 group-hover:bg-rzd-red flex items-center justify-center transition-colors duration-300">
                        <Icon name="Plane" size={22} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Авиационный</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-2">Носильщик<br />в аэропорту</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-5">До регистрации, от самолёта, по терминалу — встретим с табличкой</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {["До регистрации", "От самолёта", "До такси", "По терминалу"].map(t => (
                          <span key={t} className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full border border-white/10">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-rzd-red text-sm font-bold group-hover:gap-4 transition-all duration-300">
                        Заказать <Icon name="ArrowRight" size={15} />
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Цифры внизу */}
              <div className="flex flex-wrap justify-center gap-10 mt-14 pt-10 border-t border-white/10 w-full max-w-3xl">
                {[
                  { val: "от 500 ₽",    sub: "стоимость услуги" },
                  { val: "15+ городов", sub: "присутствие сервиса" },
                  { val: "24/7",        sub: "работа сервиса" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-white">{s.val}</div>
                    <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* КАК ЭТО РАБОТАЕТ — общий */}
          <section className="py-20 bg-rzd-gray" id="how-it-works">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-14">
                <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
                <h2 className="text-3xl font-black mb-3">Как работает сервис</h2>
                <p className="text-rzd-muted max-w-md mx-auto">Один алгоритм — и для вокзала, и для аэропорта</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { number: "01", title: "Выберите тип",       desc: "Железнодорожный или авиационный — и заполните форму" },
                  { number: "02", title: "Оплатите онлайн",    desc: "Оплата картой при оформлении заявки" },
                  { number: "03", title: "Встреча с носильщиком", desc: "Носильщик встретит вас с табличкой в указанном месте" },
                  { number: "04", title: "Доставка до места",   desc: "Вещи доставят до вагона, выхода или любой нужной точки" },
                ].map((step, i) => (
                  <div key={i} className="relative text-center group">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-full border-2 border-rzd-gray-mid group-hover:border-rzd-red transition-colors mb-4 mx-auto">
                      <span className="text-rzd-red font-black text-lg">{step.number}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-2 leading-tight">{step.title}</h3>
                    <p className="text-rzd-muted text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => { setMode("rzhd"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex items-center justify-center gap-2 bg-rzd-dark hover:bg-rzd-dark/80 text-white font-bold px-8 py-4 rounded-xl transition-colors">
                  <Icon name="Train" size={18} />Заказать на вокзале
                </button>
                <button onClick={() => { setMode("avia"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex items-center justify-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold px-8 py-4 rounded-xl transition-colors">
                  <Icon name="Plane" size={18} />Заказать в аэропорту
                </button>
              </div>
            </div>
          </section>

          {/* ПРЕИМУЩЕСТВА — общие */}
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-14">
                <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
                <h2 className="text-3xl font-black mb-3">Условия и преимущества</h2>
                <p className="text-rzd-muted max-w-md mx-auto">Профессиональный сервис с гарантией безопасности</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: "Package",     title: "Любой багаж",           desc: "Чемоданы, сумки, крупногабаритный груз, спортивный инвентарь — без ограничений по количеству мест", detail: "Без ограничений" },
                  { icon: "CreditCard",  title: "Оплата картой",          desc: "Visa, Mastercard, МИР — быстро и безопасно при оформлении заявки онлайн", detail: "Visa / МИР" },
                  { icon: "ShieldCheck", title: "Безопасно и надёжно",    desc: "Все носильщики прошли проверку и работают официально на территории объекта", detail: "Проверенные сотрудники" },
                ].map((b, i) => (
                  <div key={i} className="group border border-rzd-gray-mid rounded-2xl p-8 hover:border-rzd-red hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-rzd-red/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon name={b.icon} fallback="ShieldCheck" size={24} className="text-rzd-red" />
                    </div>
                    <div className="inline-block bg-rzd-red text-white text-xs font-bold px-2.5 py-1 rounded-full mb-4">{b.detail}</div>
                    <h3 className="font-bold text-lg mb-3">{b.title}</h3>
                    <p className="text-rzd-muted text-sm leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══ РЕЖИМ: ЖД или АВИА ═══ */}
      {mode && (
        <>
          {/* HERO с фото + форма */}
          <section className="relative min-h-screen overflow-hidden bg-black" id="order-form">
            {/* Фон — своё фото для каждого режима */}
            <div className="absolute inset-0">
              <img
                src={mode === "rzhd"
                  ? "https://cdn.poehali.dev/projects/9c7aced7-85b1-4288-b6e2-c053fc7d00e2/files/66196494-4ed4-4d26-8bcd-a040990d2c54.jpg"
                  : "https://cdn.poehali.dev/projects/9c7aced7-85b1-4288-b6e2-c053fc7d00e2/files/d0eb1b47-5603-41c0-90b8-331ad33b2781.jpg"
                }
                alt=""
                className="w-full h-full object-cover object-center transition-all duration-700"
                style={{ opacity: 0.45 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-16 min-h-screen flex flex-col">
              {/* Переключатель */}
              <div className="flex items-center gap-3 mb-10">
                <button onClick={() => setMode(null)} className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
                  <Icon name="ArrowLeft" size={15} />Все услуги
                </button>
                <span className="text-white/20">/</span>
                <div className="flex bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-1 gap-1">
                  <button onClick={() => setMode("rzhd")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "rzhd" ? "bg-rzd-red text-white" : "text-white/60 hover:text-white"}`}>
                    <Icon name="Train" size={15} />Вокзал
                  </button>
                  <button onClick={() => setMode("avia")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "avia" ? "bg-rzd-red text-white" : "text-white/60 hover:text-white"}`}>
                    <Icon name="Plane" size={15} />Аэропорт
                  </button>
                </div>
              </div>

              {/* Основной контент */}
              <div className="flex-1 grid md:grid-cols-2 gap-12 items-center">
                {/* Левый блок */}
                <div className="text-white">
                  <div className="inline-flex items-center gap-2 bg-rzd-red/20 border border-rzd-red/40 text-rzd-red text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-wider">
                    <Icon name={mode === "rzhd" ? "Train" : "Plane"} size={11} />
                    {mode === "rzhd" ? "Вокзалы России" : "Аэропорты России"}
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black leading-none mb-5 tracking-tight">
                    {mode === "rzhd"
                      ? <>Носильщик<br />встретит вас<br /><span className="text-rzd-red">у вагона</span></>
                      : <>Носильщик<br />встретит вас<br /><span className="text-rzd-red">в аэропорту</span></>}
                  </h1>
                  <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-sm">
                    {mode === "rzhd"
                      ? "Бережная доставка багажа без ограничений по весу — от вагона до вашей машины или выхода"
                      : "Встретим в зале прилёта или у стойки регистрации — доставим вещи куда нужно"}
                  </p>

                  {/* Услуги */}
                  <div className="space-y-2 mb-10">
                    {(mode === "rzhd" ? rzhdServices : aviaServices).map(s => (
                      <div key={s.value} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors">
                        <div className="w-7 h-7 bg-rzd-red/30 rounded-lg flex items-center justify-center shrink-0">
                          <Icon name={s.icon} fallback="Circle" size={13} className="text-rzd-red" />
                        </div>
                        <span className="text-sm text-white/80">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Цифры */}
                  <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
                    {stats.map((s, i) => (
                      <div key={i}>
                        <div className="text-xl font-black text-white">{s.value}</div>
                        <div className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Форма */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl text-rzd-dark">
                  {mode === "rzhd" ? <RzhdForm /> : <AviaForm />}
                </div>
              </div>
            </div>
          </section>

          {/* КАК ЭТО РАБОТАЕТ */}
          <section className="py-20 bg-rzd-gray" id="how-it-works">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-14">
                <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
                <h2 className="text-3xl font-black mb-3">Как работает сервис</h2>
                <p className="text-rzd-muted max-w-md mx-auto">4 простых шага от заявки до доставки</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                  <div key={i} className="relative text-center group">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white rounded-full border-2 border-rzd-gray-mid group-hover:border-rzd-red transition-colors mb-4 mx-auto">
                      <span className="text-rzd-red font-black text-lg">{step.number}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-2 leading-tight">{step.title}</h3>
                    <p className="text-rzd-muted text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ПРЕИМУЩЕСТВА */}
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-14">
                <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
                <h2 className="text-3xl font-black mb-3">Условия и преимущества</h2>
                <p className="text-rzd-muted max-w-md mx-auto">Профессиональный сервис с гарантией безопасности</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {bens.map((b, i) => (
                  <div key={i} className="group border border-rzd-gray-mid rounded-2xl p-8 hover:border-rzd-red hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-rzd-red/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon name={b.icon} fallback="ShieldCheck" size={24} className="text-rzd-red" />
                    </div>
                    <div className="inline-block bg-rzd-red text-white text-xs font-bold px-2.5 py-1 rounded-full mb-4">{b.detail}</div>
                    <h3 className="font-bold text-lg mb-3">{b.title}</h3>
                    <p className="text-rzd-muted text-sm leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-rzd-gray rounded-2xl p-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-rzd-red mb-1">{s.value}</div>
                    <div className="font-semibold text-sm mb-0.5">{s.label}</div>
                    <div className="text-xs text-rzd-muted">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* КОНТАКТЫ — всегда */}
      <section className="py-20 bg-rzd-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
              <h2 className="text-3xl font-black mb-4">Контакты</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Если у вас возникли вопросы — звоните, пишите или обращайтесь к сотруднику на месте
              </p>
              <div className="space-y-5">
                <a href="tel:+78001000888" className="flex items-center gap-4 group">
                  <div className="w-11 h-11 bg-rzd-red/20 rounded-xl flex items-center justify-center group-hover:bg-rzd-red transition-colors">
                    <Icon name="Phone" size={18} className="text-rzd-red group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">8 800 100-08-88</div>
                    <div className="text-white/50 text-xs">Бесплатно по России, 24/7</div>
                  </div>
                </a>
                <a href="mailto:info@myporter.ru" className="flex items-center gap-4 group">
                  <div className="w-11 h-11 bg-rzd-red/20 rounded-xl flex items-center justify-center group-hover:bg-rzd-red transition-colors">
                    <Icon name="Mail" size={18} className="text-rzd-red group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">info@myporter.ru</div>
                    <div className="text-white/50 text-xs">Ответим в течение дня</div>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-rzd-red/20 rounded-xl flex items-center justify-center">
                    <Icon name="MapPin" size={18} className="text-rzd-red" />
                  </div>
                  <div>
                    <div className="font-semibold">Вокзалы и аэропорты России</div>
                    <div className="text-white/50 text-xs">Москва, Санкт-Петербург, Сочи и другие города</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
                <div>
                  <div className="font-semibold text-sm">MyPorter</div>
                  <div className="text-xs text-white/40">Сервис переноски багажа</div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-rzd-red mt-0.5 shrink-0" />
                  <span>Лицензированные носильщики на объектах транспорта</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-rzd-red mt-0.5 shrink-0" />
                  <span>Страхование багажа на время переноски</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-rzd-red mt-0.5 shrink-0" />
                  <span>Работаем на вокзалах и в аэропортах 24/7</span>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-rzd-red mt-0.5 shrink-0" />
                  <span>Возврат оплаты при своевременной отмене заявки</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setMode("rzhd"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-rzd-dark border border-white/20 hover:border-rzd-red text-white font-semibold text-sm py-3 rounded-xl transition-colors">
                  <Icon name="Train" size={15} />Вокзал
                </button>
                <button onClick={() => { setMode("avia"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-semibold text-sm py-3 rounded-xl transition-colors">
                  <Icon name="Plane" size={15} />Аэропорт
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/30 bg-rzd-dark border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <span>© 2026 MyPorter. Все права защищены.</span>
          <div className="flex gap-4">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Пользовательское соглашение</span>
          </div>
        </div>
      </footer>
    </div>
  );
}