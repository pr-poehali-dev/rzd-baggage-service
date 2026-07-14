import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const steps = [
  { number: "01", title: "Получите ссылку", desc: "Зарегистрируйтесь в личном кабинете — там будет ваша персональная ссылка" },
  { number: "02", title: "Поделитесь с другом", desc: "Отправьте ссылку в мессенджере, соцсетях или просто дайте её лично" },
  { number: "03", title: "Друг делает заказ", desc: "Как только он оформит первый заказ MyPorter по вашей ссылке" },
  { number: "04", title: "Получите бонус", desc: "500 ₽ автоматически зачислятся на ваш бонусный счёт" },
];

const faqs = [
  { q: "Сколько можно заработать?", a: "Ограничений нет — за каждого приглашённого друга, который сделает заказ, вы получаете 500 ₽" },
  { q: "Как вывести бонусы?", a: "Бонусами можно оплачивать заказы MyPorter напрямую в личном кабинете" },
  { q: "Когда начисляются бонусы?", a: "Сразу после того, как приглашённый друг завершит первый оплаченный заказ" },
];

export default function PartnersLanding() {
  return (
    <div className="font-golos min-h-screen bg-white text-rzd-dark">

      {/* HEADER */}
      <header className="bg-white border-b border-rzd-gray-mid sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-rzd-red text-white font-black text-sm px-3 py-1.5 rounded tracking-widest">MP</div>
            <div>
              <div className="font-semibold text-sm leading-tight text-rzd-dark">MyPorter</div>
              <div className="text-xs text-rzd-muted leading-tight">Сервис переноски багажа</div>
            </div>
          </Link>
          <Link to="/cabinet/login" className="flex items-center gap-1.5 border border-rzd-gray-mid text-rzd-dark font-semibold text-sm px-3 py-2 rounded-lg hover:border-rzd-red transition-colors">
            <Icon name="User" size={15} />
            <span className="hidden sm:inline">Личный кабинет</span>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="py-20 bg-rzd-gray">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-rzd-gray-mid rounded-full px-4 py-1.5 text-xs font-semibold text-rzd-red mb-6">
            <Icon name="Gift" size={13} />
            Партнёрская программа
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight">
            Приглашайте друзей — <span className="text-rzd-red">получайте 500 ₽</span> за каждого
          </h1>
          <p className="text-rzd-muted text-lg max-w-xl mx-auto mb-8">
            Делитесь личной ссылкой, а мы начислим бонус, как только друг сделает первый заказ
          </p>
          <Link
            to="/cabinet/login"
            className="inline-flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Начать приглашать
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </section>

      {/* КАК РАБОТАЕТ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
            <h2 className="text-3xl font-black mb-3">Как это работает</h2>
            <p className="text-rzd-muted max-w-md mx-auto">Четыре простых шага до первого бонуса</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-black text-rzd-gray-mid mb-3">{s.number}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-rzd-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-20 bg-rzd-gray">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "Infinity", title: "Без ограничений", desc: "Приглашайте сколько угодно друзей — бонусы начисляются за каждого" },
              { icon: "Zap", title: "Мгновенное начисление", desc: "Бонус появляется на счету сразу после первого заказа друга" },
              { icon: "Wallet", title: "Оплата заказов бонусами", desc: "Накопленные бонусы можно использовать при оплате своих поездок" },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-rzd-gray-mid">
                <div className="w-12 h-12 bg-rzd-red/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon name={b.icon} fallback="Star" size={22} className="text-rzd-red" />
                </div>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-rzd-muted text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block w-10 h-1 bg-rzd-red mb-4" />
            <h2 className="text-3xl font-black mb-3">Частые вопросы</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="border border-rzd-gray-mid rounded-2xl p-6">
                <h3 className="font-bold mb-2">{f.q}</h3>
                <p className="text-rzd-muted text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rzd-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-4">Готовы начать зарабатывать?</h2>
          <p className="text-white/60 mb-8">Войдите в личный кабинет — там уже ждёт ваша персональная ссылка</p>
          <Link
            to="/cabinet/login"
            className="inline-flex items-center gap-2 bg-rzd-red hover:bg-rzd-red-dark text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Перейти в кабинет
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/30 bg-rzd-dark border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <span>© 2026 MyPorter. Все права защищены.</span>
          <Link to="/" className="hover:text-white/60 transition-colors">← Вернуться на главную</Link>
        </div>
      </footer>
    </div>
  );
}
