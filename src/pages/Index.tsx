import { useState } from "react";
import Icon from "@/components/ui/icon";

const steps = [
  {
    number: "01",
    title: "Оставьте заявку",
    desc: "Укажите вокзал, дату, время и количество мест багажа в форме на сайте",
  },
  {
    number: "02",
    title: "Оплатите услугу",
    desc: "Оплатите заказ онлайн банковской картой",
  },
  {
    number: "03",
    title: "Получите информацию",
    desc: "После оплаты вы получите данные носильщика и точное место встречи",
  },
  {
    number: "04",
    title: "Встретьтесь с носильщиком",
    desc: "Носильщик встретит вас в назначенном месте с табличкой",
  },
  {
    number: "05",
    title: "Доставка багажа",
    desc: "Носильщик доставит ваши вещи до вагона, такси или выхода с вокзала",
  },
];

const benefits = [
  {
    icon: "Clock",
    title: "Работаем 24/7",
    desc: "Сервис доступен круглосуточно на всех крупных вокзалах страны",
    detail: "365 дней в году",
  },
  {
    icon: "Package",
    title: "Любое количество багажа",
    desc: "Принимаем чемоданы, сумки и крупногабаритный груз",
    detail: "Без ограничений",
  },
  {
    icon: "CreditCard",
    title: "Удобная оплата",
    desc: "Оплатите услугу банковской картой на сайте",
    detail: "Онлайн",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full border border-[#D9D9D9] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white placeholder:text-[#BFBFBF]";
  const labelClass = "text-xs font-semibold text-[#8C8C8C] uppercase tracking-wide block mb-1.5";

  return (
    <div className="font-golos min-h-screen bg-white text-rzd-dark">

      {/* HEADER */}
      <header className="bg-white border-b border-[#F0F0F0] sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-rzd-red text-white font-black text-xs px-3 py-2 rounded-lg tracking-[0.2em]">
              РЖД
            </div>
            <div className="hidden sm:block h-6 w-px bg-[#E8E8E8]" />
            <span className="hidden sm:block text-sm font-medium text-[#595959]">
              Перенос багажа на вокзале
            </span>
          </div>
          <a
            href="tel:+78001000888"
            className="flex items-center gap-2 bg-rzd-red text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-rzd-red-dark transition-colors"
          >
            <Icon name="Phone" size={15} />
            <span>8 800 100-08-88</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F0F0F] text-white">
        {/* Декоративная сетка */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Красный акцент */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-rzd-red" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-rzd-red opacity-[0.07] blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white/60 text-xs px-3.5 py-1.5 rounded-full mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rzd-red animate-pulse" />
              Все крупные вокзалы России
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-6 tracking-tight">
              Перенос<br />
              <span className="text-rzd-red">багажа</span><br />
              на вокзале
            </h1>
            <p className="text-white/60 text-xl leading-relaxed mb-10 max-w-lg">
              Профессиональные носильщики встретят вас, заберут вещи и доставят куда нужно
            </p>

            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-black text-white">от 500 ₽</div>
                <div className="text-xs text-white/40 mt-0.5 tracking-wide uppercase">стоимость услуги</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white">Онлайн</div>
                <div className="text-xs text-white/40 mt-0.5 tracking-wide uppercase">оплата картой</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white">24/7</div>
                <div className="text-xs text-white/40 mt-0.5 tracking-wide uppercase">работа сервиса</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* КАК РАБОТАЕТ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-rzd-red text-sm font-bold uppercase tracking-[0.15em] mb-3">Процесс</p>
            <h2 className="text-4xl font-black mb-4 leading-tight">Как работает сервис</h2>
            <p className="text-[#8C8C8C] text-lg max-w-md">
              5 простых шагов от заявки до доставки ваших вещей
            </p>
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group grid md:grid-cols-[80px_1fr] gap-6 py-8 border-b border-[#F0F0F0] last:border-0 hover:bg-[#FAFAFA] -mx-6 px-6 transition-colors rounded-2xl"
              >
                <div className="flex items-start pt-1">
                  <span className="text-rzd-red font-black text-lg tabular-nums">{step.number}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                  <h3 className="font-bold text-xl w-72 shrink-0">{step.title}</h3>
                  <p className="text-[#8C8C8C] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* УСЛОВИЯ И ПРЕИМУЩЕСТВА */}
      <section className="py-24 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-rzd-red text-sm font-bold uppercase tracking-[0.15em] mb-3">Сервис</p>
            <h2 className="text-4xl font-black mb-4 leading-tight">Условия и преимущества</h2>
            <p className="text-[#8C8C8C] text-lg max-w-md">
              Профессиональный сервис для вашего комфорта
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-transparent hover:border-rzd-red hover:shadow-[0_8px_40px_rgba(226,26,26,0.08)] transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-rzd-red/8 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rzd-red/15 transition-colors">
                  <Icon name={b.icon} fallback="Star" size={22} className="text-rzd-red" />
                </div>
                <div className="inline-block bg-[#F0F0F0] text-[#595959] text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide">
                  {b.detail}
                </div>
                <h3 className="font-bold text-xl mb-3 leading-tight">{b.title}</h3>
                <p className="text-[#8C8C8C] text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Статы */}
          <div className="bg-white rounded-2xl border border-[#E8E8E8] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F0F0F0]">
            {[
              { value: "от 500 ₽", label: "Стоимость за 1 место" },
              { value: "Все вокзалы", label: "Работаем на всех крупных вокзалах" },
              { value: "Быстро", label: "Подача носильщика в день заказа" },
            ].map((item, i) => (
              <div key={i} className="px-8 py-7 text-center">
                <div className="text-2xl font-black text-rzd-red mb-1">{item.value}</div>
                <div className="text-sm text-[#8C8C8C]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАКАЗА */}
      <section className="py-24 bg-white" id="order">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_480px] gap-16 items-start">
            <div>
              <p className="text-rzd-red text-sm font-bold uppercase tracking-[0.15em] mb-3">Заказ</p>
              <h2 className="text-4xl font-black mb-4 leading-tight">Заказать носильщика</h2>
              <p className="text-[#8C8C8C] text-lg mb-10">
                Заполните форму и оплатите услугу онлайн
              </p>

              {/* Доп. инфо */}
              <div className="space-y-5">
                {[
                  { icon: "Shield", title: "Безопасно", desc: "Обученный персонал с удостоверениями РЖД" },
                  { icon: "Zap", title: "Быстро", desc: "Подача носильщика в день заказа" },
                  { icon: "CreditCard", title: "Удобно", desc: "Онлайн-оплата картой" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rzd-red/8 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={item.icon} fallback="Star" size={18} className="text-rzd-red" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5">{item.title}</div>
                      <div className="text-[#8C8C8C] text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Карточка формы */}
            <div className="bg-[#F7F7F7] rounded-3xl p-8 border border-[#EBEBEB]">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Icon name="CheckCircle" size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Заявка принята!</h3>
                  <p className="text-[#8C8C8C] text-sm leading-relaxed mb-6">
                    Вы получите данные носильщика после оплаты
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-rzd-red text-sm font-semibold hover:underline"
                  >
                    Оформить ещё один заказ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
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
                    <label className={labelClass}>Дата и время</label>
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
                      <option value="1">1 место</option>
                      <option value="2">2 места</option>
                      <option value="3">3 места</option>
                      <option value="4">4 места</option>
                      <option value="5">5 мест</option>
                      <option value="6+">6 мест и более</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Комментарий{" "}
                      <span className="normal-case font-normal text-[#BFBFBF]">— необязательно</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Место встречи, текст на табличке, особые пожелания..."
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rzd-red hover:bg-rzd-red-dark text-white font-bold py-4 rounded-xl transition-colors text-sm tracking-wide mt-2"
                  >
                    Оформить заказ и оплатить
                  </button>
                  <p className="text-center text-xs text-[#BFBFBF] leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <span className="text-rzd-red cursor-pointer hover:underline">
                      политикой обработки данных
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="py-24 bg-[#0F0F0F] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-rzd-red" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-rzd-red opacity-[0.05] blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-rzd-red text-sm font-bold uppercase tracking-[0.15em] mb-3">Связь</p>
              <h2 className="text-4xl font-black mb-5 leading-tight">Контакты</h2>
              <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-sm">
                Если у вас возникли вопросы — звоните, пишите или обращайтесь к сотруднику РЖД на вокзале
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: "Phone",
                    label: "8 800 100-08-88",
                    sub: "Бесплатно по России, 24/7",
                    href: "tel:+78001000888",
                  },
                  {
                    icon: "Mail",
                    label: "baggage@rzd.ru",
                    sub: "Ответим в течение дня",
                    href: "mailto:baggage@rzd.ru",
                  },
                  {
                    icon: "MapPin",
                    label: "Все крупные вокзалы России",
                    sub: "Москва, Санкт-Петербург, Сочи и другие города",
                    href: undefined,
                  },
                ].map((item, i) => {
                  const Inner = (
                    <div className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-rzd-red transition-colors">
                        <Icon name={item.icon} fallback="Circle" size={18} className="text-white/60 group-hover:text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.label}</div>
                        <div className="text-white/40 text-sm mt-0.5">{item.sub}</div>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={i} href={item.href}>{Inner}</a>
                  ) : (
                    <div key={i}>{Inner}</div>
                  );
                })}
              </div>
            </div>

            <div className="border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="bg-rzd-red text-white font-black text-xs px-3 py-2 rounded-lg tracking-[0.2em]">
                  РЖД
                </div>
                <div>
                  <div className="font-semibold text-sm">ОАО «Российские железные дороги»</div>
                  <div className="text-white/30 text-xs mt-0.5">Официальный сервис перенос багажа</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "Лицензированный сервис РЖД",
                  "Обученный персонал с удостоверениями",
                  "Онлайн оплата",
                  "Работаем на всех вокзалах страны",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/50">
                    <div className="w-5 h-5 rounded-full bg-rzd-red/20 flex items-center justify-center shrink-0">
                      <Icon name="Check" fallback="Check" size={11} className="text-rzd-red" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-white/25 text-xs">© 2024 ОАО «РЖД». Все права защищены</div>
          <div className="flex gap-6 text-xs text-white/25">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Условия сервиса</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
