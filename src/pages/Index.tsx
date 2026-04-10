import { useState } from "react";
import Icon from "@/components/ui/icon";

const steps = [
  {
    number: "01",
    title: "Оставьте заявку",
    desc: "Укажите вокзал, дату, время и количество мест багажа. Заявку можно подать за 15 минут до прибытия поезда.",
    icon: "ClipboardList",
  },
  {
    number: "02",
    title: "Оплатите онлайн",
    desc: "Оплатите заказ банковской картой прямо на сайте — быстро и безопасно.",
    icon: "CreditCard",
  },
  {
    number: "03",
    title: "Получите данные",
    desc: "После оплаты вы получите имя носильщика и точное место встречи на вокзале.",
    icon: "MessageSquare",
  },
  {
    number: "04",
    title: "Встреча с носильщиком",
    desc: "Носильщик встретит вас в назначенном месте с табличкой с вашим именем.",
    icon: "UserCheck",
  },
  {
    number: "05",
    title: "Доставка багажа",
    desc: "Носильщик доставит ваши вещи до вагона, такси или выхода с вокзала.",
    icon: "Luggage",
  },
];

const stations = [
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

export default function Index() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    station: "",
    train: "",
    bags: "1",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-white border border-[#E2E2E2] rounded-2xl px-5 py-3.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C09B5B] transition-all placeholder:text-[#C0B8AC]";
  const labelClass =
    "text-[10px] font-bold text-[#9A8F82] uppercase tracking-[0.12em] block mb-2";

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1A1A1A] font-golos">

      {/* HEADER */}
      <header className="bg-[#FAF9F7]/95 backdrop-blur-md border-b border-[#EDE9E2] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-[#1A1A1A] text-white font-black text-[11px] px-3.5 py-2 rounded-xl tracking-[0.22em]">
                РЖД
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C09B5B]" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-[#1A1A1A] leading-tight">Перенос багажа</div>
              <div className="text-[11px] text-[#9A8F82] leading-tight tracking-wide">Официальный сервис</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <a href="tel:+78001000888" className="text-[#1A1A1A] font-bold text-sm hover:text-[#C09B5B] transition-colors">
                8 800 100-08-88
              </a>
              <span className="text-[10px] text-[#9A8F82] tracking-wide">Бесплатно · 24/7</span>
            </div>
            <a
              href="#order"
              className="bg-[#1A1A1A] text-white font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-[#C09B5B] transition-all duration-300"
            >
              Заказать
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F0E0C]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C09B5B] to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #C09B5B 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#C09B5B] opacity-[0.04] blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 border border-[#C09B5B]/30 bg-[#C09B5B]/8 px-4 py-2 rounded-full mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C09B5B]" />
              <span className="text-[#C09B5B] text-xs font-semibold tracking-[0.15em] uppercase">
                Официальный сервис РЖД · Все вокзалы России
              </span>
            </div>

            <h1
              className="text-[56px] md:text-[72px] font-bold leading-[1.0] mb-7 text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Перенос<br />
              <span className="text-[#C09B5B]">багажа</span><br />
              на вокзале
            </h1>

            <p className="text-white/50 text-xl leading-relaxed mb-12 max-w-xl">
              Профессиональные носильщики встретят вас, заберут вещи и доставят куда нужно. Оплата онлайн — прямо сейчас.
            </p>

            <div className="flex flex-wrap gap-5 mb-12">
              <a
                href="#order"
                className="inline-flex items-center gap-3 bg-[#C09B5B] hover:bg-[#A8843E] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-base"
              >
                Заказать носильщика
                <Icon name="ArrowRight" size={18} />
              </a>
              <a
                href="tel:+78001000888"
                className="inline-flex items-center gap-3 border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-medium px-8 py-4 rounded-2xl transition-all duration-300 text-base"
              >
                <Icon name="Phone" size={16} />
                8 800 100-08-88
              </a>
            </div>

            <div className="flex flex-wrap gap-10 pt-10 border-t border-white/8">
              {[
                { v: "от 500 ₽", l: "Стоимость услуги" },
                { v: "24/7", l: "Круглосуточно" },
                { v: "15 мин", l: "Мин. срок подачи" },
                { v: "Возврат", l: "При отказе за 15 мин" },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    className="text-2xl font-bold text-white mb-0.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.v}
                  </div>
                  <div className="text-xs text-white/35 tracking-wide uppercase">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF9F7] to-transparent" />
      </section>

      {/* ГАРАНТИИ — полоса */}
      <section className="bg-[#F4F1EC] border-y border-[#E9E3D8]">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-[#DDD7CE]">
            {[
              { icon: "Clock", text: "Заявка за 15 минут до поезда" },
              { icon: "RefreshCcw", text: "Полный возврат при отказе за 15 мин" },
              { icon: "Package", text: "Без ограничений по количеству мест" },
              { icon: "ShieldCheck", text: "Обученный персонал с удостоверениями" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 md:px-8 first:pl-0 last:pr-0">
                <div className="w-8 h-8 rounded-xl bg-[#C09B5B]/15 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} fallback="Check" size={15} className="text-[#C09B5B]" />
                </div>
                <span className="text-[#5C5346] text-xs font-medium leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАК РАБОТАЕТ */}
      <section className="py-28 bg-[#FAF9F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[#C09B5B] text-xs font-bold uppercase tracking-[0.2em] mb-4">Процесс</p>
              <h2
                className="text-4xl md:text-5xl font-bold leading-tight text-[#1A1A1A]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Как работает<br />сервис
              </h2>
            </div>
            <p className="text-[#9A8F82] text-base max-w-xs leading-relaxed">
              5 простых шагов от заявки до доставки ваших вещей
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-[#C09B5B]/40 via-[#C09B5B]/20 to-transparent hidden md:block" />
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="relative flex gap-6 p-6 rounded-3xl hover:bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-default group"
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all duration-300 ${activeStep === i ? "bg-[#C09B5B] shadow-[0_8px_24px_rgba(192,155,91,0.35)]" : "bg-[#F0EDE8]"}`}>
                    <span className={`text-[10px] font-black tracking-[0.1em] uppercase mb-1 transition-colors ${activeStep === i ? "text-white/60" : "text-[#9A8F82]"}`}>
                      {step.number}
                    </span>
                    <Icon
                      name={step.icon}
                      fallback="Circle"
                      size={22}
                      className={`transition-colors ${activeStep === i ? "text-white" : "text-[#C09B5B]"}`}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-16 pt-2">
                    <h3 className="font-bold text-xl text-[#1A1A1A] w-60 shrink-0">{step.title}</h3>
                    <p className="text-[#9A8F82] leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* УСЛОВИЯ */}
      <section className="py-28 bg-[#0F0E0C] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C09B5B] to-transparent" />
        <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-[#C09B5B] opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[#C09B5B] text-xs font-bold uppercase tracking-[0.2em] mb-4">Сервис</p>
              <h2
                className="text-4xl md:text-5xl font-bold leading-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Условия<br />и преимущества
              </h2>
            </div>
            <p className="text-white/35 text-base max-w-xs leading-relaxed">
              Профессиональный сервис для вашего комфорта
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "Clock",
                title: "Работаем 24/7",
                sub: "365 дней в году",
                desc: "Сервис доступен круглосуточно на всех крупных вокзалах страны",
              },
              {
                icon: "Package",
                title: "Любое количество багажа",
                sub: "Без ограничений",
                desc: "Принимаем чемоданы, сумки и крупногабаритный груз — сколько угодно мест",
              },
              {
                icon: "CreditCard",
                title: "Удобная оплата",
                sub: "Онлайн",
                desc: "Оплатите услугу банковской картой на сайте при оформлении заказа",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="group bg-white/4 border border-white/8 rounded-3xl p-8 hover:bg-white/7 hover:border-[#C09B5B]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#C09B5B]/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#C09B5B]/25 transition-colors">
                  <Icon name={b.icon} fallback="Star" size={22} className="text-[#C09B5B]" />
                </div>
                <div className="text-xs text-[#C09B5B] font-bold uppercase tracking-[0.15em] mb-3">{b.sub}</div>
                <h3 className="text-white font-bold text-lg mb-3 leading-tight">{b.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Блок возврата */}
          <div className="bg-gradient-to-br from-[#C09B5B]/15 to-[#C09B5B]/5 border border-[#C09B5B]/25 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-14 h-14 bg-[#C09B5B]/20 rounded-2xl flex items-center justify-center shrink-0">
                <Icon name="RefreshCcw" fallback="Shield" size={26} className="text-[#C09B5B]" />
              </div>
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Бесплатная отмена заказа
                </h3>
                <p className="text-white/50 leading-relaxed mb-6">
                  Вы можете отказаться от услуги за 15 минут до прибытия поезда — деньги будут возвращены в полном объёме на вашу карту.
                </p>
                <div className="flex flex-wrap gap-8">
                  {[
                    { v: "от 500 ₽", l: "за 1 место" },
                    { v: "100%", l: "возврат при отмене" },
                    { v: "15 мин", l: "минимальный срок подачи" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[#C09B5B] font-bold text-xl">{item.v}</span>
                      <span className="text-white/35 text-xs uppercase tracking-wide mt-0.5">{item.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ФОРМА */}
      <section className="py-28 bg-[#FAF9F7]" id="order">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_500px] gap-20 items-start">

            <div className="pt-4">
              <p className="text-[#C09B5B] text-xs font-bold uppercase tracking-[0.2em] mb-4">Оформление</p>
              <h2
                className="text-4xl md:text-5xl font-bold leading-tight text-[#1A1A1A] mb-5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Заказать<br />носильщика
              </h2>
              <p className="text-[#9A8F82] text-lg mb-12 leading-relaxed">
                Заполните форму и оплатите услугу онлайн. Оплата производится сразу при оформлении.
              </p>

              <div className="space-y-8">
                {[
                  {
                    icon: "Zap",
                    title: "Мгновенное подтверждение",
                    desc: "Данные носильщика и место встречи — сразу после оплаты",
                  },
                  {
                    icon: "RefreshCcw",
                    title: "Полный возврат",
                    desc: "Отмените за 15 минут до поезда — вернём деньги в полном объёме",
                  },
                  {
                    icon: "Package",
                    title: "Любой объём",
                    desc: "Без ограничений по количеству мест — возьмём всё",
                  },
                  {
                    icon: "ShieldCheck",
                    title: "Официальный сервис РЖД",
                    desc: "Обученный персонал с удостоверениями. Лицензированный сервис",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#F0EDE8] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={item.icon} fallback="Star" size={18} className="text-[#C09B5B]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A1A1A] mb-1">{item.title}</div>
                      <div className="text-[#9A8F82] text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Карточка формы */}
            <div className="bg-white rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.08)] border border-[#EDE9E2] overflow-hidden">
              <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2520] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">Оформление заказа</div>
                    <div className="text-white/40 text-xs mt-0.5 tracking-wide">Оплата сразу при заказе</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C09B5B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C09B5B]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C09B5B]/25" />
                  </div>
                </div>
              </div>

              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-[#C09B5B]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Icon name="CheckCircle" size={30} className="text-[#C09B5B]" />
                    </div>
                    <h3
                      className="text-2xl font-bold mb-2 text-[#1A1A1A]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Заказ оформлен!
                    </h3>
                    <p className="text-[#9A8F82] text-sm leading-relaxed mb-6">
                      Данные носильщика и место встречи отправлены вам после оплаты
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[#C09B5B] text-sm font-semibold hover:underline"
                    >
                      Оформить ещё один заказ
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Ваше имя</label>
                        <input
                          type="text"
                          required
                          placeholder="Иван Иванов"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Телефон</label>
                        <input
                          type="tel"
                          required
                          placeholder="+7 (999) 000-00-00"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Вокзал</label>
                      <select
                        required
                        value={form.station}
                        onChange={(e) => setForm({ ...form, station: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">Выберите вокзал</option>
                        {stations.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Дата и время прибытия</label>
                      <input
                        type="datetime-local"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Поезд и номер вагона</label>
                      <input
                        type="text"
                        required
                        placeholder="Например: № 020А, вагон 5"
                        value={form.train}
                        onChange={(e) => setForm({ ...form, train: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Количество мест багажа</label>
                      <select
                        value={form.bags}
                        onChange={(e) => setForm({ ...form, bags: e.target.value })}
                        className={inputClass}
                      >
                        {["1","2","3","4","5","6","7","8","9","10+"].map((n) => (
                          <option key={n} value={n}>
                            {n === "10+" ? "10 мест и более" : `${n} ${n === "1" ? "место" : ["2","3","4"].includes(n) ? "места" : "мест"}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Комментарий{" "}
                        <span className="normal-case font-normal text-[#C0B8AC]">— необязательно</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Место встречи, текст на табличке, особые пожелания..."
                        value={form.comment}
                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        className="w-full bg-[#1A1A1A] hover:bg-[#C09B5B] text-white font-bold py-4 rounded-2xl transition-all duration-300 text-sm tracking-wide flex items-center justify-center gap-2"
                      >
                        Оформить заказ и оплатить
                        <Icon name="ArrowRight" size={16} />
                      </button>
                      <p className="text-center text-xs text-[#C0B8AC] leading-relaxed mt-4">
                        Нажимая кнопку, вы соглашаетесь с{" "}
                        <span className="text-[#C09B5B] cursor-pointer hover:underline">
                          политикой обработки данных
                        </span>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="py-28 bg-[#0F0E0C] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C09B5B] to-transparent" />
        <div className="absolute -bottom-80 -left-40 w-[600px] h-[600px] rounded-full bg-[#C09B5B] opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            <div>
              <p className="text-[#C09B5B] text-xs font-bold uppercase tracking-[0.2em] mb-4">Контакты</p>
              <h2
                className="text-4xl md:text-5xl font-bold leading-tight text-white mb-5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Есть вопросы?
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-sm">
                Звоните, пишите или обращайтесь к сотруднику РЖД на вокзале
              </p>

              <div className="space-y-6">
                {[
                  { icon: "Phone", label: "8 800 100-08-88", sub: "Бесплатно по России · 24/7", href: "tel:+78001000888" },
                  { icon: "Mail", label: "baggage@rzd.ru", sub: "Ответим в течение дня", href: "mailto:baggage@rzd.ru" },
                  { icon: "MapPin", label: "Все крупные вокзалы России", sub: "Москва, Санкт-Петербург, Сочи и другие города", href: undefined },
                ].map((item, i) => {
                  const content = (
                    <div className="flex items-start gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 group-hover/item:border-[#C09B5B]/50 group-hover/item:bg-[#C09B5B]/10 transition-all">
                        <Icon name={item.icon} fallback="Circle" size={18} className="text-[#C09B5B]" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{item.label}</div>
                        <div className="text-white/35 text-xs mt-1">{item.sub}</div>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={i} href={item.href} className="block">{content}</a>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}
              </div>
            </div>

            <div className="border border-white/8 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#C09B5B]/20 to-[#C09B5B]/5 border-b border-white/8 p-8">
                <div className="bg-white text-[#1A1A1A] font-black text-[11px] px-3 py-1.5 rounded-lg tracking-[0.2em] inline-block mb-3">
                  РЖД
                </div>
                <div className="text-white font-semibold">ОАО «Российские железные дороги»</div>
                <div className="text-white/35 text-xs mt-1">Официальный сервис перенос багажа</div>
              </div>
              <div className="p-8 space-y-5">
                {[
                  "Лицензированный сервис РЖД",
                  "Обученный персонал с удостоверениями",
                  "Онлайн оплата банковской картой",
                  "Работаем на всех вокзалах страны",
                  "Полный возврат при отмене за 15 минут",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C09B5B]/20 border border-[#C09B5B]/30 flex items-center justify-center shrink-0">
                      <Icon name="Check" fallback="Check" size={10} className="text-[#C09B5B]" />
                    </div>
                    <span className="text-white/50 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080807] border-t border-white/5 py-7">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/8 text-white/50 font-black text-[10px] px-2.5 py-1.5 rounded-lg tracking-[0.2em]">
              РЖД
            </div>
            <span className="text-white/20 text-xs">© 2024 ОАО «РЖД». Все права защищены</span>
          </div>
          <div className="flex gap-6 text-xs text-white/20">
            <span className="hover:text-white/50 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white/50 cursor-pointer transition-colors">Условия сервиса</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
