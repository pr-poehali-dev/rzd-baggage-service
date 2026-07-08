import { useState } from "react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SUPPORT_PHONE = "8-800-600-0701";
const SUPPORT_PHONE_TEL = "88006000701";

const messengers = [
  { name: "Telegram", icon: "Send", color: "#26A5E4" },
  { name: "WhatsApp", icon: "MessageCircle", color: "#25D366" },
  { name: "MAX", icon: "MessageSquare", color: "#E21A1A" },
];

export default function SupportButton() {
  const [open, setOpen] = useState(false);

  const handleMessengerClick = (name: string) => {
    setOpen(false);
    toast.info(`${name} скоро подключим`, {
      description: "А пока позвоните нам — 8-800-600-0701, бесплатно по России",
    });
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-30">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="Поддержка"
            className="w-14 h-14 rounded-full bg-rzd-red hover:bg-rzd-red-dark text-white shadow-lg shadow-rzd-red/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <Icon name={open ? "X" : "Headset"} fallback="MessageCircle" size={24} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={12}
          className="w-72 p-0 overflow-hidden rounded-2xl border-rzd-gray-mid"
        >
          <div className="bg-rzd-dark text-white px-4 py-3.5">
            <div className="font-bold text-sm">Служба поддержки</div>
            <div className="text-xs text-white/60 mt-0.5">Мы на связи, поможем быстро</div>
          </div>

          <a
            href={`tel:${SUPPORT_PHONE_TEL}`}
            className="flex items-center gap-3 px-4 py-3.5 border-b border-rzd-gray-mid hover:bg-rzd-gray transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-rzd-red/10 flex items-center justify-center shrink-0">
              <Icon name="Phone" size={18} className="text-rzd-red" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-rzd-dark">{SUPPORT_PHONE}</div>
              <div className="text-xs text-rzd-muted">Бесплатно по России</div>
            </div>
          </a>

          <div className="py-1.5">
            {messengers.map((m) => (
              <button
                key={m.name}
                onClick={() => handleMessengerClick(m.name)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rzd-gray transition-colors text-left"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${m.color}1A` }}
                >
                  <Icon name={m.icon} fallback="MessageCircle" size={16} style={{ color: m.color }} />
                </div>
                <span className="text-sm font-medium text-rzd-dark">{m.name}</span>
                <Icon name="ChevronRight" size={14} className="text-rzd-muted ml-auto" />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
