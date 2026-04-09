"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, PenLine, X, Download, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Hero images ─────────────────────────────────────────────────────────────
const MONTH_IMAGES = [
  { url: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=900&auto=format&fit=crop&q=80", alt: "Snowy winter forest" },          // Jan
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80", alt: "Frosted winter lake" },           // Feb
  { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&auto=format&fit=crop&q=80", alt: "Early spring buds" },             // Mar
  { url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&auto=format&fit=crop&q=80", alt: "Spring cherry blossoms" },        // Apr
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80", alt: "Green mountain meadow in May" },  // May
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80", alt: "Tropical beach in June" },        // Jun
  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&auto=format&fit=crop&q=80", alt: "Lush green mountains in July" },  // Jul
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop&q=80", alt: "Mountain lake in August" },       // Aug
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop&q=80", alt: "Autumn mountain fog" },           // Sep
  { url: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=900&auto=format&fit=crop&q=80", alt: "Fall foliage in October" },       // Oct
  { url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80", alt: "Misty forest in November" },      // Nov
  { url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&auto=format&fit=crop&q=80", alt: "Snowy Christmas landscape" },     // Dec
];

// ── Per-month accent colours ────────────────────────────────────────────────
const MONTH_THEMES = [
  { accent: "#5B9BD5", light: "#DBEAFE", ring: "#93C5FD", gradient: "linear-gradient(135deg,#5B9BD5,#93C5FD)" },  // Jan – icy blue
  { accent: "#A78BFA", light: "#EDE9FE", ring: "#C4B5FD", gradient: "linear-gradient(135deg,#A78BFA,#DDD6FE)" },  // Feb – lavender
  { accent: "#10B981", light: "#D1FAE5", ring: "#6EE7B7", gradient: "linear-gradient(135deg,#10B981,#6EE7B7)" },  // Mar – mint
  { accent: "#22C55E", light: "#DCFCE7", ring: "#86EFAC", gradient: "linear-gradient(135deg,#16A34A,#86EFAC)" },  // Apr – spring green
  { accent: "#CA8A04", light: "#FEF9C3", ring: "#FDE047", gradient: "linear-gradient(135deg,#CA8A04,#FDE047)" },  // May – golden
  { accent: "#0891B2", light: "#CFFAFE", ring: "#67E8F9", gradient: "linear-gradient(135deg,#0891B2,#67E8F9)" },  // Jun – ocean cyan
  { accent: "#EA580C", light: "#FFEDD5", ring: "#FDBA74", gradient: "linear-gradient(135deg,#EA580C,#FDBA74)" },  // Jul – warm orange
  { accent: "#D97706", light: "#FEF3C7", ring: "#FCD34D", gradient: "linear-gradient(135deg,#D97706,#FCD34D)" },  // Aug – amber
  { accent: "#DB2777", light: "#FCE7F3", ring: "#F9A8D4", gradient: "linear-gradient(135deg,#DB2777,#F9A8D4)" },  // Sep – rose pink
  { accent: "#C2410C", light: "#FFF7ED", ring: "#FB923C", gradient: "linear-gradient(135deg,#C2410C,#FB923C)" },  // Oct – pumpkin
  { accent: "#64748B", light: "#F1F5F9", ring: "#CBD5E1", gradient: "linear-gradient(135deg,#64748B,#CBD5E1)" },  // Nov – slate
  { accent: "#2563EB", light: "#DBEAFE", ring: "#93C5FD", gradient: "linear-gradient(135deg,#1D4ED8,#93C5FD)" },  // Dec – winter blue
];

// ── Weather mood per month (shows month name in badge) ──────────────────────
const WEATHER_MOODS = [
  { emoji: "❄️",  label: "January",   sub: "Cold & Crisp" },
  { emoji: "🌨️", label: "February",  sub: "Chilly Days" },
  { emoji: "🌸",  label: "March",     sub: "Warming Up" },
  { emoji: "☀️",  label: "April",     sub: "Bright & Sunny" },
  { emoji: "🌻",  label: "May",       sub: "Warm Breeze" },
  { emoji: "🏖️", label: "June",      sub: "Hot & Sunny" },
  { emoji: "⚡",  label: "July",      sub: "Monsoon Winds" },
  { emoji: "⛅",  label: "August",    sub: "Partly Cloudy" },
  { emoji: "🍂",  label: "September", sub: "Cool & Crisp" },
  { emoji: "🎃",  label: "October",   sub: "Colourful Leaves" },
  { emoji: "🌫️", label: "November",  sub: "Foggy Mornings" },
  { emoji: "🎄",  label: "December",  sub: "Festive & Frosty" },
];

// ── Indian public holidays (YYYY-MM-DD) ─────────────────────────────────────
const INDIAN_HOLIDAYS: Record<string, { name: string; type: "national" | "religious" | "regional" }> = {
  // 2025
  "2025-01-01": { name: "New Year's Day",        type: "national"  },
  "2025-01-14": { name: "Makar Sankranti",        type: "religious" },
  "2025-01-26": { name: "Republic Day",           type: "national"  },
  "2025-02-26": { name: "Maha Shivaratri",        type: "religious" },
  "2025-03-14": { name: "Holi",                   type: "religious" },
  "2025-03-31": { name: "Ramzan Id (Eid al-Fitr)", type: "religious" },
  "2025-04-06": { name: "Ram Navami",             type: "religious" },
  "2025-04-10": { name: "Mahavir Jayanti",        type: "religious" },
  "2025-04-14": { name: "Ambedkar Jayanti",       type: "national"  },
  "2025-04-18": { name: "Good Friday",            type: "religious" },
  "2025-05-01": { name: "Labour Day",             type: "national"  },
  "2025-05-12": { name: "Buddha Purnima",         type: "religious" },
  "2025-06-07": { name: "Bakrid",                 type: "religious" },
  "2025-08-15": { name: "Independence Day",       type: "national"  },
  "2025-08-16": { name: "Janmashtami",            type: "religious" },
  "2025-08-27": { name: "Ganesh Chaturthi",       type: "religious" },
  "2025-10-02": { name: "Gandhi Jayanti & Dussehra", type: "national" },
  "2025-10-20": { name: "Diwali",                 type: "religious" },
  "2025-11-05": { name: "Guru Nanak Jayanti",     type: "religious" },
  "2025-12-25": { name: "Christmas",              type: "religious" },
  // 2026
  "2026-01-01": { name: "New Year's Day",         type: "national"  },
  "2026-01-14": { name: "Makar Sankranti",        type: "religious" },
  "2026-01-26": { name: "Republic Day",           type: "national"  },
  "2026-02-15": { name: "Maha Shivaratri",        type: "religious" },
  "2026-03-04": { name: "Holi",                   type: "religious" },
  "2026-03-21": { name: "Ramzan Id (Eid al-Fitr)", type: "religious" },
  "2026-03-26": { name: "Ram Navami",             type: "religious" },
  "2026-03-31": { name: "Mahavir Jayanti",        type: "religious" },
  "2026-04-03": { name: "Good Friday",            type: "religious" },
  "2026-04-14": { name: "Ambedkar Jayanti",       type: "national"  },
  "2026-05-01": { name: "Labour Day & Buddha Purnima", type: "national" },
  "2026-05-27": { name: "Bakrid",                 type: "religious" },
  "2026-08-15": { name: "Independence Day",       type: "national"  },
  "2026-09-04": { name: "Janmashtami",            type: "religious" },
  "2026-09-14": { name: "Ganesh Chaturthi",       type: "religious" },
  "2026-10-02": { name: "Gandhi Jayanti",         type: "national"  },
  "2026-10-20": { name: "Dussehra",               type: "religious" },
  "2026-11-08": { name: "Diwali",                 type: "religious" },
  "2026-11-24": { name: "Guru Nanak Jayanti",     type: "religious" },
  "2026-12-25": { name: "Christmas",              type: "religious" },
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ── Types ───────────────────────────────────────────────────────────────────
interface CalendarDay {
  date: number;
  type: "prev" | "current" | "next";
  weekIndex: number;
}
interface Note {
  id: string;
  text: string;
  rangeStart: string | null;
  rangeEnd: string | null;
  createdAt: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevLast = new Date(year, month, 0).getDate();
  const firstDOW = (firstDay.getDay() + 6) % 7;
  const days: CalendarDay[] = [];
  for (let i = firstDOW - 1; i >= 0; i--)
    days.push({ date: prevLast - i, type: "prev", weekIndex: firstDOW - 1 - i });
  for (let d = 1; d <= daysInMonth; d++)
    days.push({ date: d, type: "current", weekIndex: (firstDOW + d - 1) % 7 });
  const trailing = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= trailing; d++)
    days.push({ date: d, type: "next", weekIndex: days.length % 7 });
  return days;
}

function fmtDate(d: Date) {
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function getHoliday(year: number, month: number, day: number) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return INDIAN_HOLIDAYS[key] ?? null;
}

function noteRangeLabel(note: Note): string | null {
  if (!note.rangeStart) return null;
  const s = new Date(note.rangeStart);
  if (!note.rangeEnd) return fmtDate(s);
  const e = new Date(note.rangeEnd);
  return s.getMonth() === e.getMonth()
    ? `${SHORT_MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}`
    : `${fmtDate(s)} – ${fmtDate(e)}`;
}

function notesKey(y: number, m: number) { return `calendar-notes-${y}-${m}`; }
function loadNotes(y: number, m: number): Note[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(notesKey(y, m)) ?? "[]"); } catch { return []; }
}
function persistNotes(y: number, m: number, notes: Note[]) {
  if (typeof window !== "undefined")
    localStorage.setItem(notesKey(y, m), JSON.stringify(notes));
}

// ── Ruled notepad CSS ────────────────────────────────────────────────────────
const RULED_BG: React.CSSProperties = {
  backgroundImage: "repeating-linear-gradient(#faf8ee, #faf8ee 27px, #ddd6b4 27px, #ddd6b4 28px)",
  backgroundSize: "100% 28px",
};

// ── Page-flip animation variants (true 3D card flip) ────────────────────────
// We use a two-phase approach: exit rotates out, enter rotates in from the other side
const pageFlipVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 75 : -75,
    opacity: 0,
    scale: 0.95,
    transformOrigin: dir > 0 ? "left center" : "right center",
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: "center center",
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -75 : 75,
    opacity: 0,
    scale: 0.95,
    transformOrigin: dir > 0 ? "right center" : "left center",
  }),
};

// ── Image fade variants ──────────────────────────────────────────────────────
const imageFadeVariants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

const dayCellRevealVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 8,
    scale: 0.92,
    transition: { delay: (i % 35) * 0.006 },
  }),
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: (i % 35) * 0.006,
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

// ── Mini month preview component ─────────────────────────────────────────────
function MiniMonthGrid({
  year,
  month,
  accent,
  gradient,
}: {
  year: number;
  month: number;
  accent: string;
  gradient: string;
}) {
  const days = getCalendarDays(year, month);
  const today = new Date();
  const holidayDates = new Set<number>();
  days.forEach((d) => {
    if (d.type === "current") {
      const h = getHoliday(year, month, d.date);
      if (h) holidayDates.add(d.date);
    }
  });

  return (
    <div
      className="bg-white rounded-2xl p-2.5 sm:p-3 w-36 sm:w-48 max-w-[calc(100vw-2.5rem)]"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Mini header */}
      <div
        className="rounded-xl px-2 py-1.5 mb-2 flex items-center justify-center gap-1.5"
        style={{ background: gradient }}
      >
        <p className="text-center text-[11px] font-bold text-white tracking-wide">
          {SHORT_MONTHS[month]} {year}
        </p>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div
            key={i}
            className={`text-center text-[8px] font-bold pb-1 ${
              i === 6 ? "text-rose-400" : i === 5 ? "text-sky-400" : "text-gray-300"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const isCurrentDay =
            day.type === "current" &&
            day.date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const isHoliday = day.type === "current" && holidayDates.has(day.date);
          return (
            <div key={idx} className="flex flex-col items-center justify-center h-5">
              <span
                className="w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-medium"
                style={
                  isCurrentDay
                    ? { background: gradient, color: "#fff" }
                    : undefined
                }
              >
                <span
                  className={
                    isCurrentDay
                      ? "text-white"
                      : day.type === "current"
                      ? "text-gray-700"
                      : "text-gray-200"
                  }
                >
                  {day.date}
                </span>
              </span>
              {isHoliday && (
                <div
                  className="w-1 h-1 rounded-full -mt-px"
                  style={{ backgroundColor: accent }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Holiday dot color by type ────────────────────────────────────────────────
function getHolidayDotStyle(type: string, accent: string): React.CSSProperties {
  if (type === "national") return { backgroundColor: "#EF4444" };          // red for national
  if (type === "regional") return { backgroundColor: "#F59E0B" };          // amber for regional
  return { backgroundColor: accent };                                       // accent for religious
}

// ── Main component ───────────────────────────────────────────────────────────
export default function WallCalendar() {
  const today = new Date();
  const [istNow, setIstNow] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [direction, setDirection] = useState(1);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [notesView, setNotesView] = useState<"notes" | "events">("notes");
  const [isFlipping, setIsFlipping] = useState(false);
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const theme = MONTH_THEMES[month];
  const mood = WEATHER_MOODS[month];
  const calendarDays = getCalendarDays(year, month);
  const { url: heroUrl, alt: heroAlt } = MONTH_IMAGES[month];

  // Adjacent months
  const prevD = new Date(year, month - 1, 1);
  const nextD = new Date(year, month + 1, 1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIstNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => { setNotes(loadNotes(year, month)); }, [year, month]);

  // ── Date helpers ──────────────────────────────────────────────────────────
  const cellDate = (day: CalendarDay): Date => {
    if (day.type === "prev") return new Date(year, month - 1, day.date);
    if (day.type === "next") return new Date(year, month + 1, day.date);
    return new Date(year, month, day.date);
  };
  const isToday = (day: CalendarDay) =>
    day.type === "current" && day.date === today.getDate() &&
    month === today.getMonth() && year === today.getFullYear();
  const isCellStart = (day: CalendarDay) =>
    rangeStart !== null && cellDate(day).getTime() === rangeStart.getTime();
  const isCellEnd = (day: CalendarDay) =>
    rangeEnd !== null && cellDate(day).getTime() === rangeEnd.getTime();
  const isCellInRange = (day: CalendarDay): boolean => {
    if (!rangeStart || !rangeEnd) return false;
    const d = cellDate(day);
    return d >= rangeStart && d <= rangeEnd;
  };

  // ── Click handler ─────────────────────────────────────────────────────────
  const handleDayClick = (day: CalendarDay) => {
    const clicked = cellDate(day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clicked); setRangeEnd(null);
    } else {
      const t = clicked.getTime(), s = rangeStart.getTime();
      if (t === s) setRangeStart(null);
      else if (clicked > rangeStart) setRangeEnd(clicked);
      else { setRangeStart(clicked); setRangeEnd(null); }
    }
  };

  // ── Navigation with flip guard ────────────────────────────────────────────
  const navigate = (delta: number) => {
    if (isFlipping) return;
    setIsFlipping(true);
    setDirection(delta);
    setTimeout(() => {
      setViewDate(new Date(year, month + delta, 1));
      setTimeout(() => setIsFlipping(false), 350);
    }, 10);
  };
  const handlePrev = () => navigate(-1);
  const handleNext = () => navigate(1);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isFlipping || e.touches.length !== 1) return;
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!swipeStartRef.current || isFlipping) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - swipeStartRef.current.x;
    const dy = touch.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Avoid accidental triggers on short or vertical gestures.
    if (absX < 56 || absX < absY * 1.2) return;

    if (dx < 0) handleNext();
    else handlePrev();
  };

  const handleTouchCancel = () => {
    swipeStartRef.current = null;
  };

  // Keyboard shortcuts for quick demo navigation.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }

      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key.toLowerCase() === "t") jumpToToday();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [year, month, isFlipping]);

  // ── Notes ─────────────────────────────────────────────────────────────────
  const dayCount = rangeStart && rangeEnd
    ? Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000) + 1 : 0;

  const saveNote = () => {
    if (!noteText.trim()) return;
    const n: Note = {
      id: Date.now().toString(), text: noteText.trim(),
      rangeStart: rangeStart?.toISOString() ?? null,
      rangeEnd: rangeEnd?.toISOString() ?? null,
      createdAt: Date.now(),
    };
    const updated = [n, ...notes];
    setNotes(updated); persistNotes(year, month, updated); setNoteText("");
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated); persistNotes(year, month, updated);
  };

  const notePlaceholder = rangeStart && rangeEnd
    ? `Note for ${fmtDate(rangeStart)}–${fmtDate(rangeEnd)}…`
    : rangeStart ? `Note from ${fmtDate(rangeStart)}…`
    : `General memo for ${MONTH_NAMES[month]}…`;

  const eventSortTime = (n: Note) => {
    if (n.rangeStart) return new Date(n.rangeStart).getTime();
    if (n.rangeEnd) return new Date(n.rangeEnd).getTime();
    return n.createdAt;
  };

  const chronologicalNotes = [...notes].sort((a, b) => {
    const diff = eventSortTime(a) - eventSortTime(b);
    if (diff !== 0) return diff;
    return a.createdAt - b.createdAt;
  });

  const clockTime = istNow.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const clockDate = `${istNow.toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" })}, ${istNow.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}`;

  // ── Handlers & Actions for polish ─────────────────────────────────────────
  const exportNotes = () => {
    if (notes.length === 0) return;
    const txt = notes.map(n => {
      const d = noteRangeLabel(n);
      return `[${new Date(n.createdAt).toLocaleDateString()}] ${d ? d + ': ' : ''}${n.text}`;
    }).join('\n\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Calendar_Notes_${MONTH_NAMES[month]}_${year}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jumpToToday = () => {
    const d = new Date();
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const handleCellKeyDown = (e: React.KeyboardEvent, day: CalendarDay) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDayClick(day);
    } else if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      const currentCell = e.currentTarget as HTMLElement;
      const allCells = Array.from(document.querySelectorAll('.date-cell')) as HTMLElement[];
      const currentIndex = allCells.indexOf(currentCell);
      let nextIndex = currentIndex;

      if (e.key === "ArrowRight") nextIndex++;
      else if (e.key === "ArrowLeft") nextIndex--;
      else if (e.key === "ArrowDown") nextIndex += 7;
      else if (e.key === "ArrowUp") nextIndex -= 7;

      if (nextIndex >= 0 && nextIndex < allCells.length) {
        allCells[nextIndex].focus();
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative overflow-hidden flex items-center justify-center min-h-screen bg-stone-200 p-4 sm:p-10"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #e7e0d8 0%, #d6cec5 60%, #c8bfb5 100%)",
      }}
    >
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(234,88,12,0.22), rgba(234,88,12,0))" }}
        animate={{ x: [0, 36, -12, 0], y: [0, -14, 20, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-28 -right-24 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.2), rgba(37,99,235,0))" }}
        animate={{ x: [0, -30, 16, 0], y: [0, 14, -18, 0], scale: [1, 0.92, 1.06, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      <motion.div
        className="w-full max-w-4xl drop-shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{ y: -2 }}
      >

        <div className="rounded-t-2xl overflow-hidden">
          {/* ── Spiral binding ── */}
          <div className="relative flex items-center justify-center bg-linear-to-b from-zinc-400 to-zinc-300 px-6 py-2.5 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-zinc-500/40" />
            <div className="flex items-center justify-center gap-2.5 relative z-10">
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[18px] h-[18px] rounded-full border-[2.5px] border-zinc-500 bg-linear-to-br from-zinc-200 via-white to-zinc-400"
                  style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.3)" }}
                />
              ))}
            </div>
          </div>

          {/* ── Live IST clock ── */}
          <div
            className="px-5 pt-3.5 pb-2.5 text-center border border-stone-200/70 border-t-0 paper-texture"
            style={{
              background: "linear-gradient(180deg, #f8f5ef 0%, #f2ede4 100%)",
              boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: theme.accent, opacity: 0.9 }}>
              IST • Asia/Kolkata
            </p>
            <p
              className="mt-1 text-[clamp(1.25rem,3.8vw,1.9rem)] font-bold leading-none tracking-[0.06em] tabular-nums text-stone-700"
              style={{ fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace" }}
            >
              {clockTime}
            </p>
            <p
              className="mt-1 text-[clamp(0.72rem,2vw,0.9rem)] font-medium"
              style={{ color: theme.accent, opacity: 0.82 }}
            >
              {clockDate}
            </p>
            <div className="mt-2 h-px w-full" style={{ background: theme.gradient, opacity: 0.5 }} />
          </div>
        </div>

        {/* ── Main card ── */}
        <div
          className="flex flex-col bg-white overflow-visible lg:overflow-hidden rounded-b-2xl paper-texture print-break-inside-avoid"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          {/* ── Desktop LG split vs Tablet MD split vs Mobile ── */}
          <div className="flex flex-col lg:flex-row w-full h-full">

            {/* ── Hero image with animated fade ── */}
            <div className="relative lg:w-[42%] shrink-0 h-48 sm:h-56 md:h-64 lg:h-auto lg:min-h-[500px] overflow-hidden no-print">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${year}-${month}-img`}
                  src={heroUrl}
                  alt={heroAlt}
                  variants={imageFadeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />

              {/* Film-grain overlay */}
              <div
                className="absolute inset-0 opacity-[0.08] z-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.15) 3px,rgba(255,255,255,0.15) 4px)",
                }}
              />

              {/* ── Weather mood badge (shows month name) ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-${month}`}
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute top-3 right-3 z-20"
                >
                  <div
                    className="flex items-center gap-2 rounded-2xl px-3 py-2"
                    style={{
                      background: "rgba(0,0,0,0.38)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    }}
                  >
                    <span className="text-xl leading-none">{mood.emoji}</span>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="text-white text-[12px] font-bold tracking-wide">
                        {mood.label}
                      </span>
                      <span className="text-white/60 text-[9px] font-medium tracking-wider uppercase">
                        {mood.sub}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Month / year overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white select-none z-20">
                <p className="text-xs font-light tracking-[0.3em] uppercase opacity-60 mb-1">{year}</p>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`title-${month}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none drop-shadow-lg"
                  >
                    {MONTH_NAMES[month]}
                  </motion.h2>
                </AnimatePresence>

                {/* Accent underline bar */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`bar-${month}`}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                    className="mt-2 h-[3px] w-14 rounded-full"
                    style={{ background: theme.gradient }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* ── Right side container (Grid + Notes side by side on max-md, stacked otherwise) ── */}
            <div className="flex flex-col md:flex-row lg:flex-col lg:w-[58%] w-full h-full">
              {/* ── Calendar grid panel ── */}
              <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6 lg:p-7 bg-transparent md:w-1/2 lg:w-full">

              {/* ── Navigation with mini-preview tooltips ── */}
              <div className="flex items-center justify-between mb-4">

                {/* Prev arrow with mini-month tooltip */}
                <div className="relative">
                  <button
                    onClick={handlePrev}
                    onMouseEnter={() => setPrevHover(true)}
                    onMouseLeave={() => setPrevHover(false)}
                    disabled={isFlipping}
                    className="w-11 h-11 min-h-11 min-w-11 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 no-print"
                    style={{ color: theme.accent }}
                    aria-label="Previous month"
                  >
                    <span
                      className="absolute inset-0 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: prevHover ? theme.light : "transparent",
                        transform: prevHover ? "scale(1)" : "scale(0.8)",
                      }}
                    />
                    <ChevronLeft className="w-5 h-5 relative z-10" />
                  </button>

                  {/* Prev mini-month tooltip */}
                  <AnimatePresence>
                    {prevHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.92 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-3 z-50 pointer-events-none"
                      >
                        <MiniMonthGrid
                          year={prevD.getFullYear()}
                          month={prevD.getMonth()}
                          accent={MONTH_THEMES[prevD.getMonth()].accent}
                          gradient={MONTH_THEMES[prevD.getMonth()].gradient}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Month heading with animated accent */}
                <div className="flex flex-col items-center gap-0.5">
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={`heading-${month}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-[clamp(1rem,3vw,1.15rem)] font-bold tracking-wide"
                      style={{ color: theme.accent }}
                    >
                      {MONTH_NAMES[month]} {year}
                    </motion.h3>
                  </AnimatePresence>
                  <div className="h-0.5 w-8 rounded-full mb-1" style={{ background: theme.gradient }} />
                  <button onClick={jumpToToday} 
                    className="text-[10px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity no-print flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 rounded min-w-11"
                    style={{ color: theme.accent }} aria-label="Jump to Today">
                    <CalendarIcon className="w-3 h-3" /> TODAY
                  </button>
                </div>

                {/* Next arrow with mini-month tooltip */}
                <div className="relative">
                  <button
                    onClick={handleNext}
                    onMouseEnter={() => setNextHover(true)}
                    onMouseLeave={() => setNextHover(false)}
                    disabled={isFlipping}
                    className="w-11 h-11 min-w-11 min-h-11 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 no-print"
                    style={{ color: theme.accent }}
                    aria-label="Next month"
                  >
                    <span
                      className="absolute inset-0 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: nextHover ? theme.light : "transparent",
                        transform: nextHover ? "scale(1)" : "scale(0.8)",
                      }}
                    />
                    <ChevronRight className="w-5 h-5 relative z-10" />
                  </button>

                  {/* Next mini-month tooltip */}
                  <AnimatePresence>
                    {nextHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.92 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-3 z-50 pointer-events-none"
                        style={{ right: 0 }}
                      >
                        <MiniMonthGrid
                          year={nextD.getFullYear()}
                          month={nextD.getMonth()}
                          accent={MONTH_THEMES[nextD.getMonth()].accent}
                          gradient={MONTH_THEMES[nextD.getMonth()].gradient}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── 3D Page-flip animated section ── */}
              <div style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${year}-${month}`}
                    custom={direction}
                    variants={pageFlipVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.32,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                    style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
                  >

                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 mb-1">
                      {DAY_NAMES.map((d, i) => (
                        <div
                          key={d}
                          className={`text-center text-[10px] font-bold uppercase tracking-widest py-1 ${
                            i === 6 ? "text-rose-400" : i === 5 ? "text-sky-400" : "text-gray-400"
                          }`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mb-1" />

                    {/* Date cells */}
                    <div className="grid grid-cols-7 flex-1">
                      {calendarDays.map((day, idx) => {
                        const todayCell = isToday(day);
                        const isCurrent = day.type === "current";
                        const isStart = isCellStart(day);
                        const isEnd = isCellEnd(day);
                        const inRange = isCellInRange(day);
                        const showLeft = inRange && !isStart;
                        const showRight = inRange && !isEnd;
                        const holiday = isCurrent ? getHoliday(year, month, day.date) : null;

                        // Circle style
                        let circleStyle: React.CSSProperties = {};
                        let circleExtra = "";
                        if (isStart || isEnd) {
                          circleStyle = {
                            background: theme.gradient,
                            color: "#fff",
                            boxShadow: `0 2px 12px ${theme.accent}60`,
                          };
                        } else if (todayCell) {
                          circleExtra = "bg-rose-500 text-white ring-2 ring-rose-300 ring-offset-1";
                          circleStyle = { boxShadow: "0 2px 8px rgba(239,68,68,0.45)" };
                        } else if (isCurrent && day.weekIndex === 6) {
                          circleExtra = "text-rose-500 hover:bg-rose-50 cursor-pointer";
                        } else if (isCurrent && day.weekIndex === 5) {
                          circleExtra = "text-sky-500 hover:bg-sky-50 cursor-pointer";
                        } else if (isCurrent) {
                          circleExtra = "text-gray-800 hover:bg-gray-100 cursor-pointer";
                        } else {
                          circleExtra = "text-gray-300 cursor-pointer";
                        }

                        return (
                          <div
                            key={idx}
                            className="relative h-12 flex items-center justify-center group/cell cursor-pointer focus-visible:outline-none date-cell min-w-11 min-h-11"
                            tabIndex={0}
                            aria-label={`Select ${fmtDate(cellDate(day))}`}
                            onClick={() => handleDayClick(day)}
                            onKeyDown={(e) => handleCellKeyDown(e, day)}
                          >
                            {/* Range band halves */}
                            {showLeft && (
                              <div
                                className="absolute left-0 right-1/2 inset-y-[5px] z-0"
                                style={{ backgroundColor: theme.light }}
                              />
                            )}
                            {showRight && (
                              <div
                                className="absolute left-1/2 right-0 inset-y-[5px] z-0"
                                style={{ backgroundColor: theme.light }}
                              />
                            )}

                            {/* Date circle */}
                            <motion.span
                              custom={idx}
                              variants={dayCellRevealVariants}
                              initial="hidden"
                              animate="show"
                              className={[
                                "relative z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full",
                                "text-[clamp(0.85rem,2vw,1rem)] font-medium select-none transition-all duration-200",
                                "group-hover/cell:scale-110 group-hover/cell:shadow-md",
                                "group-focus-visible/cell:ring-2 group-focus-visible/cell:ring-offset-2",
                                circleExtra,
                              ].join(" ")}
                              style={circleStyle}
                            >
                              {day.date}
                            </motion.span>

                            {/* Holiday dot + tooltip */}
                            {holiday && (
                              <>
                                {/* Dot */}
                                <div
                                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full z-20 ring-1 ring-white"
                                  style={getHolidayDotStyle(holiday.type, theme.accent)}
                                />

                                {/* Tooltip */}
                                <div
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5
                                    opacity-0 group-hover/cell:opacity-100 pointer-events-none
                                    transition-all duration-150 z-50 scale-95 group-hover/cell:scale-100"
                                >
                                  <div
                                    className="text-white text-[10px] font-semibold
                                      px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-1.5"
                                    style={{
                                      background:
                                        holiday.type === "national"
                                          ? "linear-gradient(135deg,#DC2626,#EF4444)"
                                          : `linear-gradient(135deg,${theme.accent},${theme.ring})`,
                                      boxShadow:
                                        holiday.type === "national"
                                          ? "0 8px 24px rgba(220,38,38,0.4)"
                                          : `0 8px 24px ${theme.accent}50`,
                                    }}
                                  >
                                    <span className="text-[11px]">
                                      {holiday.type === "national" ? "🇮🇳" : "🕉️"}
                                    </span>
                                    {holiday.name}
                                  </div>
                                  {/* Arrow */}
                                  <div className="flex justify-center -mt-1">
                                    <div
                                      className="w-2 h-2 rotate-45"
                                      style={{
                                        background:
                                          holiday.type === "national" ? "#EF4444" : theme.accent,
                                      }}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Range summary / month dots ── */}
              <div className="mt-3 pt-3 border-t border-gray-100 min-h-8 flex items-center justify-center">
                {rangeStart && rangeEnd ? (
                  <p className="text-sm font-semibold tracking-wide" style={{ color: theme.accent }}>
                    {fmtDate(rangeStart)}
                    <span className="mx-2 opacity-40">→</span>
                    {fmtDate(rangeEnd)}
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="font-normal text-gray-500">
                      {dayCount} day{dayCount !== 1 ? "s" : ""} selected
                    </span>
                  </p>
                ) : rangeStart ? (
                  <p className="text-sm italic" style={{ color: theme.accent, opacity: 0.7 }}>
                    {fmtDate(rangeStart)} selected — tap an end date…
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {[...Array(12)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > month ? 1 : -1);
                          setViewDate(new Date(year, i, 1));
                        }}
                        title={MONTH_NAMES[i]}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === month ? "18px" : "6px",
                          height: "6px",
                          background: i === month ? theme.gradient : "#e5e7eb",
                          transform: i === month ? "scaleY(1.1)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

              {/* ── Notes panel ── */}
              <div className="border-t-2 md:border-t-0 md:border-l-2 lg:border-t-2 lg:border-l-0 border-stone-100 md:w-1/2 lg:w-full flex-1 flex flex-col no-print pb-4">

            {/* Header */}
            <div className="flex items-center gap-2 px-5 md:px-7 pt-4 pb-2">
              <PenLine className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Notes</span>
              {rangeStart && rangeEnd && (
                <span
                  className="ml-1 px-2 py-0.5 text-[11px] font-semibold rounded-full"
                  style={{ backgroundColor: theme.light, color: theme.accent }}
                >
                  {fmtDate(rangeStart)}–{fmtDate(rangeEnd)}
                </span>
              )}
              {rangeStart && !rangeEnd && (
                <span
                  className="ml-1 px-2 py-0.5 text-[11px] rounded-full italic text-stone-400"
                  style={{ backgroundColor: theme.light }}
                >
                  from {fmtDate(rangeStart)}…
                </span>
              )}
              <span className="ml-auto text-[10px] text-stone-300 italic">{MONTH_NAMES[month]} {year}</span>
            </div>

            <div className="px-5 md:px-7 pb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold tracking-wide" style={{ color: theme.accent, opacity: 0.82 }}>
                View
              </span>
              <div className="p-0.5 rounded-full bg-stone-100 border border-stone-200 flex items-center">
                <button
                  onClick={() => setNotesView("notes")}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded-full transition-all"
                  style={{
                    background: notesView === "notes" ? theme.gradient : "transparent",
                    color: notesView === "notes" ? "#fff" : "#78716c",
                  }}
                >
                  NOTES
                </button>
                <button
                  onClick={() => setNotesView("events")}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded-full transition-all"
                  style={{
                    background: notesView === "events" ? theme.gradient : "transparent",
                    color: notesView === "events" ? "#fff" : "#78716c",
                  }}
                >
                  EVENTS
                </button>
              </div>
            </div>

            {notesView === "notes" && (
              <>
                {/* Textarea */}
                <div
                  className="mx-5 md:mx-7 rounded-xl overflow-hidden border border-stone-200/80"
                  style={RULED_BG}
                >
                  <textarea
                    className="w-full bg-transparent resize-none px-4 pt-1.5 pb-2
                      text-gray-700 placeholder-stone-400/70 outline-none leading-7
                      font-handwriting text-[1.05rem]"
                    rows={3}
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder={notePlaceholder}
                    onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveNote(); }}
                  />
                </div>

                {/* Save button & Export */}
                <div className="flex items-center justify-between px-5 md:px-7 pt-2 pb-4">
                  <span className="text-[10px] text-stone-300 hidden sm:inline">⌘↵ to save</span>
                  <span className="text-[10px] text-stone-300 hidden md:inline">←/→ month • T today</span>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <motion.button
                      onClick={exportNotes}
                      disabled={notes.length === 0}
                      className="px-3 min-h-11 min-w-11 sm:min-h-0 sm:py-1.5 text-stone-500 text-xs font-semibold rounded-full tracking-wide active:scale-95 disabled:opacity-25 transition-all duration-200 flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 no-print focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      aria-label="Export notes as text"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span>
                    </motion.button>
                    <motion.button
                      onClick={saveNote}
                      disabled={!noteText.trim()}
                      className="px-4 min-h-11 min-w-11 sm:min-h-0 sm:py-1.5 text-white text-xs font-semibold rounded-full
                        tracking-wide active:scale-95 disabled:opacity-25 transition-all duration-200 no-print focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ background: theme.gradient, boxShadow: `0 4px 12px ${theme.accent}40` }}
                      whileHover={{ y: -1, boxShadow: `0 8px 18px ${theme.accent}55` }}
                      whileTap={{ scale: 0.96 }}
                    >
                      Save Note
                    </motion.button>
                  </div>
                </div>
              </>
            )}

            {/* Notes list */}
            <AnimatePresence initial={false}>
              {notesView === "notes" && notes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 md:px-7 pb-5"
                >
                  <div className="border-t border-stone-100 pt-3">
                    <AnimatePresence initial={false}>
                      {notes.map(note => {
                        const label = noteRangeLabel(note);
                        return (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-baseline gap-2 py-2 border-b border-stone-100 last:border-0 group">
                              <p className="flex-1 font-handwriting text-[1rem] text-stone-700 leading-snug">
                                {label && (
                                  <span className="font-semibold mr-0.5" style={{ color: theme.accent }}>
                                    {label}:{" "}
                                  </span>
                                )}
                                {note.text}
                              </p>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full
                                  text-stone-300 hover:text-red-400 hover:bg-red-50
                                  opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                                aria-label="Delete note"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {notesView === "notes" && notes.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 md:px-7 pb-5"
                >
                  <div className="border-t border-stone-100 pt-4">
                    <p className="text-sm text-stone-400 italic text-center py-3">No notes in this month yet.</p>
                  </div>
                </motion.div>
              )}

              {notesView === "events" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 md:px-7 pb-5"
                >
                  <div className="border-t border-stone-100 pt-3">
                    {chronologicalNotes.length === 0 ? (
                      <p className="text-sm text-stone-400 italic text-center py-6">No events for this month yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {chronologicalNotes.map((note, idx) => {
                          const label = noteRangeLabel(note) ?? "General";
                          const displayDate = new Date(eventSortTime(note)).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          });
                          return (
                            <div key={note.id} className="relative pl-5 pr-2 py-2 rounded-xl bg-stone-50/80 border border-stone-100">
                              <span className="absolute left-2 top-3 w-2 h-2 rounded-full" style={{ background: theme.gradient }} />
                              {idx < chronologicalNotes.length - 1 && (
                                <span className="absolute left-[11px] top-5 -bottom-2 w-px bg-stone-200" />
                              )}
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] font-semibold" style={{ color: theme.accent }}>{label}</p>
                                <p className="text-[10px] text-stone-400">{displayDate}</p>
                              </div>
                              <p className="mt-1 font-handwriting text-[1rem] text-stone-700 leading-snug">{note.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </div>
          </div>
        </div>

        {/* Paper depth layers */}
        <div className="mx-3 h-2 bg-zinc-100 rounded-b-xl shadow-sm no-print" />
        <div className="mx-5 h-1.5 bg-zinc-50 rounded-b-xl" />
      </motion.div>
    </div>
  );
}
