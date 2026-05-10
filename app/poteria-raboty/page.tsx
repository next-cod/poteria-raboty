"use client";
import { useMemo, useState } from "react";
import {
  ArrowBullet,
  AutoTextarea,
  MoodScale,
  PageFooter,
  PillToggle,
  PrintButton,
  ProgressBar,
  ResetButton,
} from "../_components/primitives";
import { useChecklistState } from "../_components/useChecklistState";

const FEELING_LABELS = ["Стыд", "Страх", "Хаос", "Растерянность", "Злость", "Другое"] as const;

const LEVEL_PHRASES = [
  // child (1,4,7)
  "«Мне кажется, что всё рухнуло, и я не понимаю, как жить дальше»",
  "«Мне стыдно перед собой и другими за то, что я остался(ась) без работы»",
  "«Я боюсь, что я никому не нужен(на) и меня больше никуда не возьмут»",
  // teen (2,5,8)
  "«Я начинаю хаотично что-то делать: срочно рассылать резюме, соглашаться на всё подряд, лишь бы не остаться без работы»",
  "«Я думаю, что во всём виноваты кризис, рынок, работодатели, искусственный интеллект — только не мои стратегии»",
  "«Я занижаю свою планку и готов(а) хвататься за что угодно из страха»",
  // adult (3,6,9)
  "«Я могу признать: да, сейчас я без работы, и мне важно трезво понять, что делать дальше»",
  "«Я готов(а) посмотреть на свои сильные и слабые стороны, чтобы выстроить новую стратегию»",
  "«Я понимаю, что потеря работы — это не конец, а точка пересборки и роста»",
];

const TO_UPDATE_LABELS = ["Профиль в соцсетях", "Резюме", "Портфолио"] as const;

type DayEntry = { a1: string; a2: string; a3: string };

type State = {
  // Section 2 — Текущая ситуация
  lastRole: string;
  actualWork: string;
  lostIncome: string;
  financialBuffer: string;
  moneyDuration: string;
  feelings: boolean[];
  feelingsOther: string;

  // Section 3 — Уровни мышления
  levels: boolean[];
  currentLevel: string;
  whereAdult: string;

  // Section 4 — Почему потерял(а) доход
  whyLost: string;
  notSeenEarlier: string;
  stoppedLearning: string;
  worldChanges: string;
  losingToCompetitors: string;
  oneConclusion: string;

  // Section 5 — Сильные стороны (5 полей)
  strengths: string[];

  // Section 5b — Слабые стороны
  losingToMarket: string;
  skillsDeclined: string;
  toolsNotLearned: string;
  expertiseCracked: string;
  criticalSkill: string;
  wouldHireMyself: string;

  // Section 6 — Стратегия
  keyTheses: string;
  toUpdate: boolean[];
  aiUsage: string;
  peopleToNotify: string;
  communities: string;
  weakestSkill: string;
  skillImprovement: string;
  startDate: string;
  progressTracking: string;

  // Section 7 — План 4 недели
  week1: string;
  week2: string;
  week3: string;
  week4: string;
  goal4weeks: string;

  // Section 8 — Ежедневные действия
  fivePeople: string[];
  days: DayEntry[];

  // Итог
  anxietyBefore: number | null;
  anxietyAfter: number | null;
};

const INITIAL: State = {
  lastRole: "",
  actualWork: "",
  lostIncome: "",
  financialBuffer: "",
  moneyDuration: "",
  feelings: Array(6).fill(false),
  feelingsOther: "",

  levels: Array(9).fill(false),
  currentLevel: "",
  whereAdult: "",

  whyLost: "",
  notSeenEarlier: "",
  stoppedLearning: "",
  worldChanges: "",
  losingToCompetitors: "",
  oneConclusion: "",

  strengths: Array(5).fill(""),

  losingToMarket: "",
  skillsDeclined: "",
  toolsNotLearned: "",
  expertiseCracked: "",
  criticalSkill: "",
  wouldHireMyself: "",

  keyTheses: "",
  toUpdate: Array(3).fill(false),
  aiUsage: "",
  peopleToNotify: "",
  communities: "",
  weakestSkill: "",
  skillImprovement: "",
  startDate: "",
  progressTracking: "",

  week1: "",
  week2: "",
  week3: "",
  week4: "",
  goal4weeks: "",

  fivePeople: Array(5).fill(""),
  days: Array(7).fill(null).map(() => ({ a1: "", a2: "", a3: "" })),

  anxietyBefore: null,
  anxietyAfter: null,
};

const REQUIRED_FIELDS: (keyof State)[] = [
  "lastRole",
  "actualWork",
  "lostIncome",
  "financialBuffer",
  "moneyDuration",
  "currentLevel",
  "whereAdult",
  "whyLost",
  "oneConclusion",
  "keyTheses",
  "goal4weeks",
];

const TOTAL = 6;

export default function PotteriaRabotyPage() {
  const { state, setState, update, reset } = useChecklistState<State>(
    "checklist:poteria-raboty:v1",
    INITIAL,
  );

  const [navOpen, setNavOpen] = useState(false);

  const setFeeling = (i: number, v: boolean) => {
    setState((prev) => {
      const feelings = [...prev.feelings];
      feelings[i] = v;
      return { ...prev, feelings };
    });
  };

  const setLevel = (i: number, v: boolean) => {
    setState((prev) => {
      const levels = [...prev.levels];
      levels[i] = v;
      return { ...prev, levels };
    });
  };

  const setToUpdate = (i: number, v: boolean) => {
    setState((prev) => {
      const toUpdate = [...prev.toUpdate];
      toUpdate[i] = v;
      return { ...prev, toUpdate };
    });
  };

  const setStrength = (i: number, v: string) => {
    setState((prev) => {
      const strengths = [...prev.strengths];
      strengths[i] = v;
      return { ...prev, strengths };
    });
  };

  const setPerson = (i: number, v: string) => {
    setState((prev) => {
      const fivePeople = [...prev.fivePeople];
      fivePeople[i] = v;
      return { ...prev, fivePeople };
    });
  };

  const setDay = (i: number, key: keyof DayEntry, v: string) => {
    setState((prev) => {
      const days = prev.days.map((d, idx) => idx === i ? { ...d, [key]: v } : d);
      return { ...prev, days };
    });
  };

  const progress = useMemo(() => {
    const textDone = REQUIRED_FIELDS.reduce((sum, key) => {
      const v = state[key];
      return sum + (typeof v === "string" && v.trim().length > 0 ? 1 : 0);
    }, 0);
    const feelingDone = state.feelings.some(Boolean) ? 1 : 0;
    const levelsDone = state.levels.some(Boolean) ? 1 : 0;
    const strengthDone = state.strengths.some((s) => s.trim().length > 0) ? 1 : 0;
    const beforeDone = state.anxietyBefore ? 1 : 0;
    const afterDone = state.anxietyAfter ? 1 : 0;
    const total = REQUIRED_FIELDS.length + 5;
    return Math.round(
      ((textDone + feelingDone + levelsDone + strengthDone + beforeDone + afterDone) / total) * 100,
    );
  }, [state]);

  return (
    <>
      <NavBar progress={progress} open={navOpen} setOpen={setNavOpen} />
      <main className="paper-page">
        <CoverPage />

        <div className="guide-card no-print">
          <div>
            <div className="guide-kicker sans">Как проходить</div>
            <h2>Идите сверху вниз. Сайт сам сохраняет ответы.</h2>
          </div>
          <p>
            Отвечайте честно — чем точнее картина, тем яснее следующий шаг. Это ваш личный
            аудит: никто не увидит ваши ответы, кроме вас.
          </p>
          <a href="#p2" className="guide-button sans">
            Начать с текущей ситуации
          </a>
        </div>

        {/* SECTION 2 — Моя текущая ситуация */}
        <section id="p2" className="section">
          <div>
            <h2 className="h1">Моя текущая ситуация</h2>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Зафиксируйте текущее положение спокойно и честно:
          </p>

          <div className="field-row">
            <label className="label">Моя последняя должность / роль:</label>
            <AutoTextarea
              value={state.lastRole}
              onChange={(v) => update("lastRole", v)}
              minRows={1}
              className="field-input field-input-single"
            />
          </div>

          <div className="field-row">
            <label className="label">Чем я реально занимался(ась):</label>
            <AutoTextarea
              value={state.actualWork}
              onChange={(v) => update("actualWork", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">Какой доход я потерял(а):</label>
            <AutoTextarea
              value={state.lostIncome}
              onChange={(v) => update("lostIncome", v)}
              minRows={1}
              className="field-input field-input-single"
            />
          </div>

          <div className="field-row">
            <label className="label">Какая у меня сейчас финансовая подушка:</label>
            <AutoTextarea
              value={state.financialBuffer}
              onChange={(v) => update("financialBuffer", v)}
              minRows={1}
              className="field-input field-input-single"
            />
          </div>

          <div className="field-row">
            <label className="label">На сколько времени мне хватит этих денег без работы:</label>
            <AutoTextarea
              value={state.moneyDuration}
              onChange={(v) => update("moneyDuration", v)}
              minRows={1}
              className="field-input field-input-single"
            />
          </div>

          <div className="field-row" style={{ marginTop: "28px" }}>
            <div className="flex items-start gap-3 mb-4">
              <ArrowBullet />
              <div className="h2">Что я чувствую сейчас</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
              {FEELING_LABELS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  className="pill-toggle"
                  data-active={state.feelings[i]}
                  onClick={() => setFeeling(i, !state.feelings[i])}
                >
                  <span>{label}</span>
                  <span className="pill-dot" />
                </button>
              ))}
            </div>
            {state.feelings[5] && (
              <div className="field-row" style={{ marginTop: "16px" }}>
                <label className="label">Опишите подробнее:</label>
                <AutoTextarea
                  value={state.feelingsOther}
                  onChange={(v) => update("feelingsOther", v)}
                  minRows={2}
                />
              </div>
            )}
          </div>

          <PageFooter index={1} total={TOTAL} />
        </section>

        {/* SECTION 3 — Уровни мышления */}
        <section id="p3" className="section">
          <div>
            <h2 className="h1">Как я сейчас проживаю потерю работы</h2>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Отметьте галочкой те фразы, которые больше всего похожи на вас сейчас:
          </p>

          <LevelGroup
            pill="Уровень «Дитя»"
            indices={[0, 1, 2]}
            levels={state.levels}
            setLevel={setLevel}
          />
          <LevelGroup
            pill="Уровень «Подросток»"
            indices={[3, 4, 5]}
            levels={state.levels}
            setLevel={setLevel}
          />
          <LevelGroup
            pill="Уровень «Взрослый»"
            indices={[6, 7, 8]}
            levels={state.levels}
            setLevel={setLevel}
          />

          <div
            className="quote-card mt-8"
            style={{ borderColor: "var(--c-gold-soft)", background: "var(--c-purple-soft)" }}
          >
            <div className="sans" style={{ fontSize: "14px", color: "var(--c-muted)", marginBottom: "6px" }}>
              Выпишите номера утверждений, где вы поставили галочку, и посмотрите, в каких строках вас больше:
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <span style={{ color: "var(--c-purple)", fontWeight: 600 }}>Ребёнок (Дитя): 1, 4, 7</span>
              <span style={{ color: "var(--c-gold)", fontWeight: 600 }}>Подросток: 2, 5, 8</span>
              <span style={{ color: "#2E9E6E", fontWeight: 600 }}>Взрослый: 3, 6, 9</span>
            </div>
          </div>

          <div className="field-row" style={{ marginTop: "24px" }}>
            <label className="label">
              Мой текущий уровень мышления в ситуации потери работы:
            </label>
            <AutoTextarea
              value={state.currentLevel}
              onChange={(v) => update("currentLevel", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">
              Что поможет мне перейти на уровень Взрослого уже сейчас?
            </label>
            <AutoTextarea
              value={state.whereAdult}
              onChange={(v) => update("whereAdult", v)}
              minRows={3}
            />
          </div>

          <PageFooter index={2} total={TOTAL} />
        </section>

        {/* SECTION 4 — Почему потерял(а) доход */}
        <section id="p4" className="section">
          <div>
            <h2 className="h1">Почему я потерял(а) доход</h2>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Ответьте на вопросы письменно. Это поможет увидеть причины и сделать выводы
            для следующего этапа.
          </p>

          <div className="field-row">
            <label className="label">Почему я потерял(а) доход?</label>
            <AutoTextarea
              value={state.whyLost}
              onChange={(v) => update("whyLost", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">Я не видел(а) ситуацию заранее? В чём именно?</label>
            <AutoTextarea
              value={state.notSeenEarlier}
              onChange={(v) => update("notSeenEarlier", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">Я перестал(а) учиться и развиваться? Где именно остановился(ась)?</label>
            <AutoTextarea
              value={state.stoppedLearning}
              onChange={(v) => update("stoppedLearning", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">Что изменилось в мире за последние два года, а я этого не заметил(а)?</label>
            <AutoTextarea
              value={state.worldChanges}
              onChange={(v) => update("worldChanges", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">В чём я проигрываю своим конкурентам и рынку?</label>
            <AutoTextarea
              value={state.losingToCompetitors}
              onChange={(v) => update("losingToCompetitors", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">Какой один вывод я делаю из этого опыта?</label>
            <AutoTextarea
              value={state.oneConclusion}
              onChange={(v) => update("oneConclusion", v)}
              minRows={3}
            />
          </div>

          <PageFooter index={3} total={TOTAL} />
        </section>

        {/* SECTION 5 — Сильные и слабые стороны */}
        <section id="p5" className="section">
          <div>
            <h2 className="h1">Мои сильные и слабые стороны</h2>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Проведите аудит компетенций: что уже работает, а что важно усилить.
          </p>

          <div className="mt-6 mb-3">
            <span className="pill-gold">1 — Мои сильные стороны</span>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Что у меня действительно получается хорошо:
          </p>

          <div className="grid gap-3 mt-4">
            {state.strengths.map((val, i) => (
              <div key={i} className="field-row" style={{ margin: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span
                    className="num-circle"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  >
                    {i + 1}
                  </span>
                  <AutoTextarea
                    value={val}
                    onChange={(v) => setStrength(i, v)}
                    placeholder="Напишите сильную сторону…"
                    minRows={1}
                    className="field-input field-input-single"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 mb-3">
            <span className="pill-gold">2 — Мои слабые стороны / зоны роста</span>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Проведите аудит компетенций: что уже работает, а что важно усилить.
          </p>

          <div className="field-row">
            <label className="label">В чём я проигрываю рынку и конкурентам:</label>
            <AutoTextarea
              value={state.losingToMarket}
              onChange={(v) => update("losingToMarket", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">Какие навыки у меня просели:</label>
            <AutoTextarea
              value={state.skillsDeclined}
              onChange={(v) => update("skillsDeclined", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">Какие инструменты / технологии я не освоил(а) вовремя:</label>
            <AutoTextarea
              value={state.toolsNotLearned}
              onChange={(v) => update("toolsNotLearned", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">Где моя экспертность уже дала трещину:</label>
            <AutoTextarea
              value={state.expertiseCracked}
              onChange={(v) => update("expertiseCracked", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">Какой один навык критично важно усилить в ближайшие месяцы:</label>
            <AutoTextarea
              value={state.criticalSkill}
              onChange={(v) => update("criticalSkill", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">
              Если бы я был(а) работодателем, я бы нанял(а) себя сегодня? Да / Нет. Почему?
            </label>
            <AutoTextarea
              value={state.wouldHireMyself}
              onChange={(v) => update("wouldHireMyself", v)}
              minRows={3}
            />
          </div>

          <PageFooter index={4} total={TOTAL} />
        </section>

        {/* SECTION 6 — Стратегия + План + Действия */}
        <section id="p6" className="section">
          <div>
            <h2 className="h1">Новая стратегия поиска работы</h2>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            На основании ответов составьте свою стратегию поиска работы на ближайшие 4 недели.
          </p>

          {/* Блок 1 — Упаковать себя */}
          <div className="flex items-start gap-3 mt-8 mb-3">
            <ArrowBullet />
            <div className="h2">1 — Упаковать себя</div>
          </div>

          <div className="field-row">
            <label className="label">Мои 3–5 ключевых тезисов о себе для работодателя:</label>
            <AutoTextarea
              value={state.keyTheses}
              onChange={(v) => update("keyTheses", v)}
              minRows={4}
            />
          </div>

          <div className="field-row">
            <label className="label">Что нужно обновить:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
              {TO_UPDATE_LABELS.map((label, i) => (
                <PillToggle
                  key={i}
                  active={state.toUpdate[i]}
                  onChange={(v) => setToUpdate(i, v)}
                >
                  {label}
                </PillToggle>
              ))}
            </div>
          </div>

          <div className="field-row">
            <label className="label">
              Как я буду использовать нейросети для упаковки опыта и поиска вариантов:
            </label>
            <AutoTextarea
              value={state.aiUsage}
              onChange={(v) => update("aiUsage", v)}
              minRows={2}
            />
          </div>

          {/* Блок 2 — Активизировать связи */}
          <div className="flex items-start gap-3 mt-10 mb-3">
            <ArrowBullet />
            <div className="h2">2 — Активизировать связи</div>
          </div>

          <div className="field-row">
            <label className="label">Люди, которым я сообщу, что ищу работу:</label>
            <AutoTextarea
              value={state.peopleToNotify}
              onChange={(v) => update("peopleToNotify", v)}
              minRows={3}
            />
          </div>

          <div className="field-row">
            <label className="label">В каких профессиональных сообществах / чатах я заявлю о себе:</label>
            <AutoTextarea
              value={state.communities}
              onChange={(v) => update("communities", v)}
              minRows={2}
            />
          </div>

          {/* Блок 3 — Прокачать навык */}
          <div className="flex items-start gap-3 mt-10 mb-3">
            <ArrowBullet />
            <div className="h2">3 — Прокачать ключевой навык</div>
          </div>

          <div className="field-row">
            <label className="label">Навык, который сейчас самый слабый, но важен для рынка:</label>
            <AutoTextarea
              value={state.weakestSkill}
              onChange={(v) => update("weakestSkill", v)}
              minRows={2}
            />
          </div>

          <div className="field-row">
            <label className="label">Что я буду делать, чтобы его усилить:</label>
            <AutoTextarea
              value={state.skillImprovement}
              onChange={(v) => update("skillImprovement", v)}
              minRows={2}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="field-row" style={{ margin: 0, marginTop: "16px" }}>
              <label className="label">Дата старта:</label>
              <AutoTextarea
                value={state.startDate}
                onChange={(v) => update("startDate", v)}
                minRows={1}
                className="field-input field-input-single"
              />
            </div>
            <div className="field-row" style={{ margin: 0, marginTop: "16px" }}>
              <label className="label">Как я буду отслеживать прогресс:</label>
              <AutoTextarea
                value={state.progressTracking}
                onChange={(v) => update("progressTracking", v)}
                minRows={1}
                className="field-input field-input-single"
              />
            </div>
          </div>

          {/* Мой план на 4 недели */}
          <div className="mt-12">
            <div className="flex items-start gap-3 mb-6">
              <ArrowBullet />
              <div>
                <div className="h2">Мой план на ближайшие 4 недели</div>
                <p className="audit-helper-text italic" style={{ color: "var(--c-muted)", marginTop: "4px" }}>
                  Разложите стратегию на понятные недельные шаги.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <WeekCard
                n={1}
                hint="Сфокусироваться и навести порядок в действиях, провести аудит, не рассылать резюме хаотично."
                value={state.week1}
                onChange={(v) => update("week1", v)}
              />
              <WeekCard
                n={2}
                hint="Упаковать себя, обновить резюме, использовать нейросети."
                value={state.week2}
                onChange={(v) => update("week2", v)}
              />
              <WeekCard
                n={3}
                hint="Активизировать связи, рассказать людям, что я ищу работу."
                value={state.week3}
                onChange={(v) => update("week3", v)}
              />
              <WeekCard
                n={4}
                hint="Поддерживать ежедневные действия до результата: отклики, собеседования, встречи."
                value={state.week4}
                onChange={(v) => update("week4", v)}
              />
            </div>

            <div className="field-row" style={{ marginTop: "20px" }}>
              <label className="label">Моя цель на 4 недели:</label>
              <AutoTextarea
                value={state.goal4weeks}
                onChange={(v) => update("goal4weeks", v)}
                minRows={2}
              />
            </div>
          </div>

          <PageFooter index={5} total={TOTAL} />
        </section>

        {/* SECTION 7 — Ежедневные действия + Итог */}
        <section id="p7" className="section">
          <div>
            <h2 className="h1">Ежедневные действия</h2>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Каждый день задавайте себе вопрос: что я сегодня сделал(а) для того, чтобы найти
            новую работу?
          </p>

          {/* 5 человек */}
          <div className="flex items-start gap-3 mt-8 mb-4">
            <ArrowBullet />
            <div>
              <div className="h2">5 человек</div>
              <p className="audit-helper-text italic" style={{ color: "var(--c-muted)", marginTop: "4px" }}>
                Напишите 5 человек, которым вы расскажете, что ищете работу:
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {state.fivePeople.map((val, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="num-circle" style={{ flexShrink: 0 }}>{i + 1}</span>
                <AutoTextarea
                  value={val}
                  onChange={(v) => setPerson(i, v)}
                  placeholder="Имя / контакт…"
                  minRows={1}
                  className="field-input field-input-single"
                />
              </div>
            ))}
          </div>

          {/* 7-дневный трекер */}
          <div className="flex items-start gap-3 mt-10 mb-4">
            <ArrowBullet />
            <div>
              <div className="h2">Ежедневный трекер действий</div>
              <p className="audit-helper-text italic" style={{ color: "var(--c-muted)", marginTop: "4px" }}>
                Каждый вечер фиксируйте три маленьких действия, которые приблизили вас к новой работе:
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {state.days.map((day, i) => (
              <DayCard key={i} n={i + 1} day={day} onChange={(key, v) => setDay(i, key, v)} />
            ))}
          </div>

          {/* Заключение */}
          <div
            className="quote-card mt-12"
            style={{ borderColor: "var(--c-gold)", background: "#fff", textAlign: "center" }}
          >
            <div className="flex items-start gap-3">
              <ArrowBullet />
              <div style={{ textAlign: "left" }}>
                Если вы дошли до конца чек-листа, значит, вы уже сделали шаг от тревоги и
                избегания к ясности и действиям.
              </div>
            </div>
          </div>

          {/* Шкала состояния */}
          <div className="state-change-card mt-8">
            <div className="state-scale-block">
              <div className="label">Уровень тревоги до заполнения чек-листа:</div>
              <MoodScale
                value={state.anxietyBefore}
                onChange={(v) => update("anxietyBefore", v)}
                mode="before"
              />
            </div>
            <div className="state-scale-block">
              <div className="label">Уровень тревоги после заполнения чек-листа:</div>
              <MoodScale
                value={state.anxietyAfter}
                onChange={(v) => update("anxietyAfter", v)}
                mode="after"
              />
            </div>
          </div>

          <div
            className="quote-card mt-10"
            style={{ borderColor: "var(--c-gold-soft)", background: "var(--c-purple-soft)" }}
          >
            <div className="flex items-start gap-3">
              <ArrowBullet />
              <div>
                Этот чек-лист — первый шаг. Чтобы глубже разобраться в своих стратегиях мышления
                и выстроить взрослую опору в жизни и деньгах, читайте книгу Натальи Батаевой
                «На Личность идёт НаЛичность».
              </div>
            </div>
          </div>

          <div className="cta-buttons no-print">
            <a
              href="https://na-lichnost.ru/book"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn cta-btn--book"
            >
              Книга «На Личность идёт НаЛичность»
            </a>
            <a
              href="https://na-lichnost.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn cta-btn--course"
            >
              Онлайн-курс
            </a>
          </div>

          <div className="final-actions no-print">
            <PrintButton />
            <ResetButton onReset={reset} />
          </div>

          <PageFooter index={6} total={TOTAL} />
        </section>
      </main>
    </>
  );
}

// ─────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────

function NavBar({
  progress,
  open,
  setOpen,
}: {
  progress: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <nav className="top-dock no-print">
      <div className="top-dock-inner">
        <div className="top-dock-head sans">
          <a href="#p1" className="toc-link brand-link">
            Потеря работы
          </a>
          <div className="top-dock-actions">
            <span>{progress}% заполнено</span>
            <button
              type="button"
              className="menu-toggle"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <ProgressBar value={progress} />
        <div className="section-tabs" data-open={open}>
          <a href="#p2" className="toc-link" onClick={() => setOpen(false)}>Ситуация</a>
          <a href="#p3" className="toc-link" onClick={() => setOpen(false)}>Уровни</a>
          <a href="#p4" className="toc-link" onClick={() => setOpen(false)}>Анализ</a>
          <a href="#p5" className="toc-link" onClick={() => setOpen(false)}>Стороны</a>
          <a href="#p6" className="toc-link" onClick={() => setOpen(false)}>Стратегия</a>
          <a href="#p7" className="toc-link" onClick={() => setOpen(false)}>Действия</a>
        </div>
      </div>
    </nav>
  );
}

function CoverPage() {
  return (
    <section
      id="p1"
      className="cover-page rounded-2xl overflow-hidden mb-10"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, #5e2a91 0%, #3b1768 55%, #2a0e52 100%)",
        color: "#fff",
        padding: "60px 40px",
        textAlign: "center",
      }}
    >
      <div className="mb-7" style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-nalich.png`}
          alt="НаЛичность"
          className="cover-logo"
        />
      </div>
      <div style={{ marginBottom: "20px", marginTop: "36px" }}>
        <span className="pill-gold" style={{ fontSize: "20px", padding: "10px 32px" }}>
          «Чек-лист»
        </span>
      </div>
      <h1
        style={{
          fontFamily: "var(--font-forum), serif",
          fontSize: "clamp(36px, 5vw, 54px)",
          lineHeight: 1.05,
          fontWeight: 400,
          margin: "0",
          maxWidth: "720px",
          marginInline: "auto",
        }}
      >
        «Ваш профессиональный аудит»
      </h1>
      <p
        className="sans mt-4 opacity-80"
        style={{ fontSize: "18px", maxWidth: "36rem", margin: "1rem auto 0" }}
      >
        Этот чек-лист поможет вам провести разбор своих сильных и слабых сторон, понять,
        почему вы потеряли доход, и сделать конкретные шаги, чтобы быстрее найти новую работу.
      </p>
      <p className="sans italic mt-12 opacity-80">
        <a
          href="https://na-lichnost.ru/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit" }}
        >
          @MethodBataeva
        </a>
      </p>
    </section>
  );
}

function LevelGroup({
  pill,
  indices,
  levels,
  setLevel,
}: {
  pill: string;
  indices: number[];
  levels: boolean[];
  setLevel: (i: number, v: boolean) => void;
}) {
  return (
    <div className="mt-7">
      <div className="mb-3">
        <span className="pill-gold">{pill}</span>
      </div>
      <div className="grid gap-1">
        {indices.map((idx) => (
          <button
            key={idx}
            type="button"
            className="level-option flex items-center gap-3 text-left w-full py-2"
            onClick={() => setLevel(idx, !levels[idx])}
          >
            <span className="radio-circle" data-checked={levels[idx]}>
              <span className="radio-inner" />
            </span>
            <span className="level-option-text flex-1">{LEVEL_PHRASES[idx]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WeekCard({
  n,
  hint,
  value,
  onChange,
}: {
  n: number;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        background: "var(--c-purple-soft)",
        border: "1px solid var(--c-purple-line)",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <span className="pill-gold" style={{ fontSize: "14px", padding: "4px 14px" }}>
          Неделя {n}
        </span>
      </div>
      <p
        className="italic"
        style={{ fontSize: "14px", color: "var(--c-muted)", margin: "8px 0 12px" }}
      >
        {hint}
      </p>
      <label className="label" style={{ fontSize: "14px" }}>
        Мои задачи на эту неделю:
      </label>
      <AutoTextarea
        value={value}
        onChange={onChange}
        placeholder="Напишите 2–3 конкретных действия…"
        minRows={3}
      />
    </div>
  );
}

function DayCard({
  n,
  day,
  onChange,
}: {
  n: number;
  day: DayEntry;
  onChange: (key: keyof DayEntry, v: string) => void;
}) {
  return (
    <div
      style={{
        background: n % 2 === 1 ? "var(--c-purple-soft)" : "#fff",
        border: "1px solid var(--c-purple-line)",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span className="num-circle">{n}</span>
        <span style={{ fontWeight: 600, color: "var(--c-purple-deep)" }}>День {n}</span>
      </div>
      <div className="grid gap-2">
        <AutoTextarea
          value={day.a1}
          onChange={(v) => onChange("a1", v)}
          placeholder="Сегодня сделал(а)…"
          minRows={1}
          className="field-input field-input-single"
        />
        <AutoTextarea
          value={day.a2}
          onChange={(v) => onChange("a2", v)}
          placeholder="Сегодня сделал(а)…"
          minRows={1}
          className="field-input field-input-single"
        />
        <AutoTextarea
          value={day.a3}
          onChange={(v) => onChange("a3", v)}
          placeholder="Сегодня сделал(а)…"
          minRows={1}
          className="field-input field-input-single"
        />
      </div>
    </div>
  );
}
