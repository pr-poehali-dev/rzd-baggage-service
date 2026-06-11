import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const steps = [
  {
    number: "01",
    title: "Оставьте заявку",
    desc: "Укажите дату, время, вокзал, поезд и количество мест багажа в форме",
  },
  {
    number: "02",
    title: "Оплатите картой",
    desc: "Оплатите услугу банковской картой онлайн сразу при оформлении заявки",
  },
  {
    number: "03",
    title: "Встреча с носильщиком",
    desc: "Носильщик встретит вас в указанном месте с табличкой с вашим именем",
  },
  {
    number: "04",
    title: "Доставка багажа",
    desc: "Носильщик доставит вещи до вагона, такси или выхода с вокзала",
  },
];

const benefits = [
  {
    icon: "Package",
    title: "Без ограничений по багажу",
    desc: "Принимаем чемоданы, сумки и крупногабаритный груз — любое количество мест",
    detail: "Любой объём",
  },
  {
    icon: "CreditCard",
    title: "Оплата картой",
    desc: "Оплата банковской картой онлайн при оформлении заявки — быстро и безопасно",
    detail: "Visa / Mastercard / МИР",
  },
  {
    icon: "Clock",
    title: "Работаем 24/7",
    desc: "Сервис доступен круглосуточно на всех крупных вокзалах страны",
    detail: "365 дней в году",
  },
];

export default function Index() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    station: "",
    train: "",
    bags: "1",
    sign: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="font-golos min-h-screen bg-white text-rzd-dark">

      {/* HEADER */}
      <header className="bg-white border-b border-rzd-gray-mid sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">
              РЖД
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight text-rzd-dark">Сервис переноски</div>
              <div className="text-xs text-rzd-muted leading-tight">багажа на вокзалах</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+78001000888"
              className="hidden sm:flex items-center gap-2 text-rzd-red font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              <Icon name="Phone" size={16} />
              8 800 100-08-88
            </a>
            <Link
              to="/cabinet/login"
              className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark font-semibold text-sm px-3 py-2 rounded-lg hover:border-rzd-red transition-colors"
            >
              <Icon name="User" size={15} />
              <span className="hidden sm:inline">Личный кабинет</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-rzd-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rzd-red rounded-full -translate-y-1/2 translate-x-1/3 opacity-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rzd-red rounded-full translate-y-1/2 -translate-x-1/3 opacity-10" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div style={{ animation: "slideUp 0.7s ease-out forwards" }}>
              <div className="inline-flex items-center gap-2 bg-rzd-red/20 border border-rzd-red/40 text-rzd-red-light text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <Icon name="MapPin" size={12} />
                Все крупные вокзалы России
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                Переноска<br />
                <span className="text-rzd-red">багажа</span><br />
                на вокзале
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-sm">
                Профессиональные носильщики встретят вас, заберут вещи и доставят куда нужно
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-rzd-red">от 500 ₽</div>
                  <div className="text-xs text-white/50 mt-0.5">стоимость услуги</div>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-rzd-red">15 мин</div>
                  <div className="text-xs text-white/50 mt-0.5">до прибытия поезда</div>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-rzd-red">24/7</div>
                  <div className="text-xs text-white/50 mt-0.5">работа сервиса</div>
                </div>
              </div>
            </div>

            {/* Форма */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl text-rzd-dark">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Заявка принята!</h3>
                  <p className="text-rzd-muted text-sm">
                    Носильщик встретит вас с табличкой в указанном месте
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-rzd-red text-sm font-medium hover:underline"
                  >
                    Отправить ещё одну заявку
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-1">Заказать носильщика</h2>
                  <p className="text-rzd-muted text-sm mb-6">Заполните форму и оплатите картой</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-rzd-muted block mb-1.5">Ваше имя</label>
                        <input
                          type="text"
                          required
                          placeholder="Иван Иванов"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-rzd-muted block mb-1.5">Телефон</label>
                        <input
                          type="tel"
                          required
                          placeholder="+7 (999) 000-00-00"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-rzd-muted block mb-1.5">Вокзал</label>
                      <select
                        required
                        value={form.station}
                        onChange={(e) => setForm({ ...form, station: e.target.value })}
                        className="w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors bg-white"
                      >
                        <option value="">Выберите вокзал</option>
                        <option>Москва — Ленинградский вокзал</option>
                        <option>Москва — Казанский вокзал</option>
                        <option>Москва — Ярославский вокзал</option>
                        <option>Санкт-Петербург — Московский вокзал</option>
                        <option>Санкт-Петербург — Финляндский вокзал</option>
                        <option>Другой вокзал</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-rzd-muted block mb-1.5">Дата и время</label>
                        <input
                          type="datetime-local"
                          required
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-rzd-muted block mb-1.5">Мест багажа</label>
                        <div className="flex items-center border border-rzd-gray-mid rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, bags: String(Math.max(1, Number(form.bags) - 1)) })}
                            className="px-3 py-2.5 text-rzd-red hover:bg-rzd-gray transition-colors font-bold text-lg leading-none"
                          >−</button>
                          <div className="flex-1 text-center text-sm font-bold text-rzd-dark py-2.5 border-x border-rzd-gray-mid">
                            {form.bags}
                          </div>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, bags: String(Number(form.bags) + 1) })}
                            className="px-3 py-2.5 text-rzd-red hover:bg-rzd-gray transition-colors font-bold text-lg leading-none"
                          >+</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-rzd-muted block mb-1.5">Поезд и номер вагона</label>
                      <input
                        type="text"
                        required
                        placeholder="Например: № 020А, вагон 5"
                        value={form.train}
                        onChange={(e) => setForm({ ...form, train: e.target.value })}
                        className="w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-rzd-muted block mb-1.5">Табличка (необязательно)</label>
                      <textarea
                        rows={2}
                        placeholder="Текст на табличке носильщика, особые пожелания..."
                        value={form.sign}
                        onChange={(e) => setForm({ ...form, sign: e.target.value })}
                        className="w-full border border-rzd-gray-mid rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rzd-red transition-colors resize-none"
                      />
                    </div>

                    {/* Итоговая цена */}
                    <div className="bg-rzd-gray rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="text-sm text-rzd-muted">
                        {form.bags} {Number(form.bags) === 1 ? "место" : Number(form.bags) < 5 ? "места" : "мест"} × 500 ₽
                      </div>
                      <div className="text-xl font-black text-rzd-dark">
                        {(Number(form.bags) * 500).toLocaleString("ru-RU")} ₽
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-rzd-red hover:bg-rzd-red-dark text-white font-bold py-3.5 rounded-lg transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
                    >
                      <Icon name="CreditCard" size={16} />
                      Оплатить и заказать — {(Number(form.bags) * 500).toLocaleString("ru-RU")} ₽
                    </button>
                    <p className="text-center text-xs text-rzd-muted">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <span className="text-rzd-red cursor-pointer hover:underline">политикой обработки данных</span>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="py-20 bg-rzd-gray">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
            <h2 className="text-3xl font-black mb-3">Как работает сервис</h2>
            <p className="text-rzd-muted max-w-md mx-auto">
              4 простых шага от заявки до доставки ваших вещей
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <p className="text-rzd-muted max-w-md mx-auto">
              Профессиональный сервис с гарантией безопасности
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group border border-rzd-gray-mid rounded-2xl p-8 hover:border-rzd-red hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-rzd-red/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon name={b.icon} fallback="ShieldCheck" size={24} className="text-rzd-red" />
                </div>
                <div className="inline-block bg-rzd-red text-white text-xs font-bold px-2.5 py-1 rounded-full mb-4">
                  {b.detail}
                </div>
                <h3 className="font-bold text-lg mb-3">{b.title}</h3>
                <p className="text-rzd-muted text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-rzd-gray rounded-2xl p-8 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {[
              { label: "Стоимость", value: "от 500 ₽", sub: "за 1 место" },
              { label: "Зона работы", value: "Весь вокзал", sub: "включая перроны" },
              { label: "Отмена заявки", value: "за 15 мин", sub: "полный возврат средств" },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-rzd-red mb-1">{item.value}</div>
                <div className="font-semibold text-sm mb-0.5">{item.label}</div>
                <div className="text-xs text-rzd-muted">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="py-20 bg-rzd-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
              <h2 className="text-3xl font-black mb-4">Контакты</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Если у вас возникли вопросы — звоните, пишите или обращайтесь к сотруднику РЖД на вокзале
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
                <a href="mailto:baggage@rzd.ru" className="flex items-center gap-4 group">
                  <div className="w-11 h-11 bg-rzd-red/20 rounded-xl flex items-center justify-center group-hover:bg-rzd-red transition-colors">
                    <Icon name="Mail" size={18} className="text-rzd-red group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">baggage@rzd.ru</div>
                    <div className="text-white/50 text-xs">Ответим в течение дня</div>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-rzd-red/20 rounded-xl flex items-center justify-center">
                    <Icon name="MapPin" size={18} className="text-rzd-red" />
                  </div>
                  <div>
                    <div className="font-semibold">Все крупные вокзалы России</div>
                    <div className="text-white/50 text-xs">Москва, Санкт-Петербург и другие города</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">
                  РЖД
                </div>
                <div>
                  <div className="font-semibold text-sm">ОАО «Российские железные дороги»</div>
                  <div className="text-xs text-white/40">Официальный сервис переноски багажа</div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-white/60">
                {[
                  "Лицензированный сервис РЖД",
                  "Обученный персонал с удостоверениями",
                  "Страхование каждой перевозки",
                  "Безналичная и наличная оплата",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Icon name="CheckCircle" size={16} className="text-rzd-red mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white/40 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div>© 2024 ОАО «РЖД». Все права защищены</div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span className="hover:text-white cursor-pointer transition-colors">Условия сервиса</span>
          </div>
        </div>
      </footer>
    </div>
  );
}