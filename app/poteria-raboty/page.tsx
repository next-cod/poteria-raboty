"use client";
import { useMemo, useState } from "react";
import {
  ArrowBullet,
  ArchetypeCard,
  AutoTextarea,
  LevelBars,
  MoodScale,
  PageFooter,
  PillToggle,
  PrintButton,
  ProgressBar,
  ResetButton,
  StepCard,
} from "../_components/primitives";
import { useChecklistState } from "../_components/useChecklistState";

const FEELING_LABELS = ["Стыд", "Страх", "Хаос", "Растерянность", "Злость", "Другое"] as const;

const LEVEL_PHRASES = [
  // child (indices 0,1,2)
  "«Мне кажется, что всё рухнуло, и я не понимаю, как жить дальше»",
  "«Мне стыдно перед собой и другими за то, что я остался(ась) без работы»",
  "«Я боюсь, что я никому не нужен(на) и меня больше никуда не возьмут»",
  // teen (indices 3,4,5)
  "«Я начинаю хаотично что-то делать: срочно рассылать резюме, соглашаться на всё подряд, лишь бы не остаться без работы»",
  "«Я думаю, что во всём виноваты кризис, рынок, работодатели, искусственный интеллект - только не мои стратегии»",
  "«Я занижаю свою планку и готов(а) хвататься за что угодно из страха»",
  // adult (indices 6,7,8)
  "«Я могу признать: да, сейчас я без работы, и мне важно трезво понять, что делать дальше»",
  "«Я готов(а) посмотреть на свои сильные и слабые стороны, чтобы выстроить новую стратегию»",
  "«Я понимаю, что потеря работы - это не конец, а точка пересборки и роста»",
];

const TO_UPDATE_LABELS = ["Профиль в соцсетях", "Резюме", "Портфолио"] as const;

const WEEK_HINTS = [
  "Сфокусироваться и навести порядок: провести аудит, не рассылать резюме хаотично.",
  "Упаковать себя: обновить резюме, использовать нейросети.",
  "Активизировать связи: рассказать людям, что я ищу работу.",
  "Поддерживать ежедневные действия до результата: отклики, собеседования, встречи.",
];

type DayEntry = { a1: string; a2: string; a3: string };

type State = {
  lastRole: string;
  actualWork: string;
  lostIncome: string;
  financialBuffer: string;
  moneyDuration: string;
  feelings: boolean[];
  feelingsOther: string;

  levels: boolean[];
  currentLevel: string;
  whereAdult: string;

  whyLost: string;
  notSeenEarlier: string;
  stoppedLearning: string;
  worldChanges: string;
  losingToCompetitors: string;
  oneConclusion: string;

  strengths: string[];

  losingToMarket: string;
  skillsDeclined: string;
  toolsNotLearned: string;
  expertiseCracked: string;
  criticalSkill: string;
  wouldHireMyself: string;

  keyTheses: string;
  toUpdate: boolean[];
  aiUsage: string;
  peopleToNotify: string;
  communities: string;
  weakestSkill: string;
  skillImprovement: string;
  startDate: string;
  progressTracking: string;

  week1: string;
  week2: string;
  week3: string;
  week4: string;
  weekDone: boolean[];
  goal4weeks: string;

  fivePeople: string[];
  days: DayEntry[];

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
  weekDone: Array(4).fill(false),
  goal4weeks: "",

  fivePeople: Array(5).fill(""),
  days: Array(7).fill(null).map(() => ({ a1: "", a2: "", a3: "" })),

  anxietyBefore: null,
  anxietyAfter: null,
};

const REQUIRED_FIELDS: (keyof State)[] = [
  "lastRole", "actualWork", "lostIncome", "financialBuffer", "moneyDuration",
  "currentLevel", "whereAdult", "whyLost", "oneConclusion", "keyTheses", "goal4weeks",
];

const TOTAL = 6;

export default function PotteriaRabotyPage() {
  const { state, setState, update, reset } = useChecklistState<State>(
    "checklist:poteria-raboty:v1",
    INITIAL,
  );
  const [navOpen, setNavOpen] = useState(false);

  const setFeeling = (i: number, v: boolean) =>
    setState((p) => { const feelings = [...p.feelings]; feelings[i] = v; return { ...p, feelings }; });

  const setLevel = (i: number, v: boolean) =>
    setState((p) => { const levels = [...p.levels]; levels[i] = v; return { ...p, levels }; });

  const setToUpdate = (i: number, v: boolean) =>
    setState((p) => { const toUpdate = [...p.toUpdate]; toUpdate[i] = v; return { ...p, toUpdate }; });

  const setStrength = (i: number, v: string) =>
    setState((p) => { const strengths = [...p.strengths]; strengths[i] = v; return { ...p, strengths }; });

  const setPerson = (i: number, v: string) =>
    setState((p) => { const fivePeople = [...p.fivePeople]; fivePeople[i] = v; return { ...p, fivePeople }; });

  const setDay = (i: number, key: keyof DayEntry, v: string) =>
    setState((p) => ({ ...p, days: p.days.map((d, idx) => idx === i ? { ...d, [key]: v } : d) }));

  const toggleWeekDone = (i: number) =>
    setState((p) => { const weekDone = [...p.weekDone]; weekDone[i] = !weekDone[i]; return { ...p, weekDone }; });

  // Level counts: child=0,1,2 / teen=3,4,5 / adult=6,7,8
  const childCount = [0, 1, 2].filter((i) => state.levels[i]).length;
  const teenCount  = [3, 4, 5].filter((i) => state.levels[i]).length;
  const adultCount = [6, 7, 8].filter((i) => state.levels[i]).length;
  const totalLevels = childCount + teenCount + adultCount;

  const dominantLevel = useMemo(() => {
    if (!totalLevels) return null;
    if (adultCount >= childCount && adultCount >= teenCount) return "adult";
    if (teenCount >= childCount) return "teen";
    return "child";
  }, [childCount, teenCount, adultCount, totalLevels]);

  const strengthsFilled = state.strengths.filter((s) => s.trim()).length;

  const progress = useMemo(() => {
    const textDone = REQUIRED_FIELDS.reduce(
      (s, k) => s + (typeof state[k] === "string" && (state[k] as string).trim() ? 1 : 0), 0,
    );
    const feelDone   = state.feelings.some(Boolean) ? 1 : 0;
    const levDone    = state.levels.some(Boolean) ? 1 : 0;
    const strDone    = strengthsFilled > 0 ? 1 : 0;
    const beforeDone = state.anxietyBefore ? 1 : 0;
    const afterDone  = state.anxietyAfter ? 1 : 0;
    const total = REQUIRED_FIELDS.length + 5;
    return Math.round(((textDone + feelDone + levDone + strDone + beforeDone + afterDone) / total) * 100);
  }, [state, strengthsFilled]);

  const weekValues = [state.week1, state.week2, state.week3, state.week4];

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
            Отвечайте честно - чем точнее картина, тем яснее следующий шаг. Это ваш личный
            аудит: никто не увидит ваши ответы, кроме вас.
          </p>
          <a href="#p2" className="guide-button sans">Начать с текущей ситуации</a>
        </div>

        {/* === РАЗДЕЛ 2: Текущая ситуация === */}
        <section id="p2" className="section">
          <SectionHeader
            title="Моя текущая ситуация"
            done={[state.lastRole, state.actualWork, state.lostIncome, state.financialBuffer, state.moneyDuration].filter(v => v.trim()).length}
            total={5}
          />
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Зафиксируйте текущее положение спокойно и честно:
          </p>

          <div className="field-row">
            <label className="label">Моя последняя должность / роль:</label>
            <AutoTextarea value={state.lastRole} onChange={(v) => update("lastRole", v)} minRows={1} className="field-input field-input-single" />
          </div>
          <div className="field-row">
            <label className="label">Чем я реально занимался(ась):</label>
            <AutoTextarea value={state.actualWork} onChange={(v) => update("actualWork", v)} minRows={2} />
          </div>
          <div className="field-row">
            <label className="label">Какой доход я потерял(а):</label>
            <AutoTextarea value={state.lostIncome} onChange={(v) => update("lostIncome", v)} minRows={1} className="field-input field-input-single" />
          </div>
          <div className="field-row">
            <label className="label">Какая у меня сейчас финансовая подушка:</label>
            <AutoTextarea value={state.financialBuffer} onChange={(v) => update("financialBuffer", v)} minRows={1} className="field-input field-input-single" />
          </div>
          <div className="field-row">
            <label className="label">На сколько времени мне хватит этих денег без работы:</label>
            <AutoTextarea value={state.moneyDuration} onChange={(v) => update("moneyDuration", v)} minRows={1} className="field-input field-input-single" />
          </div>

          {/* Чувства */}
          <div className="field-row" style={{ marginTop: "28px" }}>
            <div className="flex items-start gap-3 mb-4">
              <ArrowBullet />
              <div className="h2">Что я чувствую сейчас</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {FEELING_LABELS.map((label, i) => (
                <PillToggle key={i} active={state.feelings[i]} onChange={(v) => setFeeling(i, v)}>
                  {label}
                </PillToggle>
              ))}
            </div>
            {/* Активные эмоции - визуальный итог */}
            {state.feelings.some(Boolean) && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 18px",
                  background: "var(--c-purple-soft)",
                  borderRadius: "12px",
                  border: "1px solid var(--c-purple-line)",
                  fontSize: "15px",
                  color: "var(--c-muted)",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--c-purple-deep)" }}>Сейчас я чувствую: </span>
                {FEELING_LABELS.filter((_, i) => state.feelings[i] && i < 5).join(", ")}
                {state.feelings[5] && (state.feelings.slice(0, 5).some(Boolean) ? ", другое" : "другое")}
              </div>
            )}
            {state.feelings[5] && (
              <div className="field-row" style={{ marginTop: "12px" }}>
                <label className="label">Опишите подробнее:</label>
                <AutoTextarea value={state.feelingsOther} onChange={(v) => update("feelingsOther", v)} minRows={2} />
              </div>
            )}
          </div>

          <PageFooter index={1} total={TOTAL} />
        </section>

        {/* === РАЗДЕЛ 3: Уровни мышления === */}
        <section id="p3" className="section">
          <SectionHeader title="Как я сейчас проживаю потерю работы" done={state.levels.some(Boolean) ? 1 : 0} total={1} label="отмечено" />
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Отметьте фразы, которые больше всего похожи на вас сейчас:
          </p>

          <LevelGroup pill="Уровень «Дитя»"     indices={[0, 1, 2]} levels={state.levels} setLevel={setLevel} />
          <LevelGroup pill="Уровень «Подросток»" indices={[3, 4, 5]} levels={state.levels} setLevel={setLevel} />
          <LevelGroup pill="Уровень «Взрослый»"  indices={[6, 7, 8]} levels={state.levels} setLevel={setLevel} />

          {/* Визуализация уровней */}
          {totalLevels > 0 && (
            <div style={{ marginTop: "28px" }}>
              <div className="flex items-start gap-3 mb-4">
                <ArrowBullet />
                <div className="h2">Мой результат</div>
              </div>
              <LevelBars child={childCount} teen={teenCount} adult={adultCount} total={3} />

              {/* Подсказка по доминирующему уровню */}
              {dominantLevel === "child" && (
                <ArchetypeCard
                  variant="child"
                  icon="D"
                  title="Сейчас преобладает Дитя"
                  tag="Реакция: замирание и страх"
                  description="В сложных ситуациях внутренний Ребёнок реагирует паникой, стыдом или ощущением беспомощности. Это нормальная первая реакция - важно её заметить."
                  tip="Вернитесь к фактам: что конкретно произошло? Запишите три вещи, которые точно есть в вашей жизни прямо сейчас."
                />
              )}
              {dominantLevel === "teen" && (
                <ArchetypeCard
                  variant="teen"
                  icon="P"
                  title="Сейчас преобладает Подросток"
                  tag="Реакция: бунт и хаотичные действия"
                  description="Подросток винит внешние обстоятельства и действует хаотично - рассылает резюме всем подряд, занижает планку. Энергия есть, но она не управляема."
                  tip="Остановитесь на один день. Составьте список из трёх конкретных действий - и сделайте только их, не больше."
                />
              )}
              {dominantLevel === "adult" && (
                <ArchetypeCard
                  variant="adult"
                  icon="V"
                  title="Сейчас преобладает Взрослый"
                  tag="Реакция: анализ и стратегия"
                  description="Взрослый смотрит на ситуацию трезво, готов анализировать свои сильные и слабые стороны и строить стратегию. Именно это состояние помогает найти работу быстрее."
                  tip="Продолжайте этот чек-лист - вы уже в нужном состоянии для системной работы над поиском."
                />
              )}

              {/* Пояснение уровней */}
              <div
                className="quote-card mt-6"
                style={{ borderColor: "var(--c-gold-soft)", background: "var(--c-purple-soft)" }}
              >
                <div className="sans" style={{ fontSize: "14px", color: "var(--c-muted)", marginBottom: "6px" }}>
                  Выпишите номера утверждений, где вы поставили галочку:
                </div>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <span style={{ color: "var(--c-purple)", fontWeight: 600 }}>Дитя: 1, 2, 3</span>
                  <span style={{ color: "var(--c-gold)", fontWeight: 600 }}>Подросток: 4, 5, 6</span>
                  <span style={{ color: "#2E9E6E", fontWeight: 600 }}>Взрослый: 7, 8, 9</span>
                </div>
              </div>
            </div>
          )}

          <div className="field-row" style={{ marginTop: "24px" }}>
            <label className="label">Мой текущий уровень мышления в ситуации потери работы:</label>
            <AutoTextarea value={state.currentLevel} onChange={(v) => update("currentLevel", v)} minRows={3} />
          </div>
          <div className="field-row">
            <label className="label">Что поможет мне перейти на уровень Взрослого уже сейчас?</label>
            <AutoTextarea value={state.whereAdult} onChange={(v) => update("whereAdult", v)} minRows={3} />
          </div>
          <PageFooter index={2} total={TOTAL} />
        </section>

        {/* === РАЗДЕЛ 4: Почему потерял доход === */}
        <section id="p4" className="section">
          <SectionHeader
            title="Почему я потерял(а) доход"
            done={[state.whyLost, state.notSeenEarlier, state.stoppedLearning, state.worldChanges, state.losingToCompetitors, state.oneConclusion].filter(v => v.trim()).length}
            total={6}
          />
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Ответьте письменно - это поможет увидеть причины и сделать выводы для следующего этапа.
          </p>

          {[
            { key: "whyLost" as const,              label: "Почему я потерял(а) доход?" },
            { key: "notSeenEarlier" as const,        label: "Я не видел(а) ситуацию заранее? В чём именно?" },
            { key: "stoppedLearning" as const,       label: "Я перестал(а) учиться и развиваться? Где именно остановился(ась)?" },
            { key: "worldChanges" as const,          label: "Что изменилось в мире за последние два года, а я этого не заметил(а)?" },
            { key: "losingToCompetitors" as const,   label: "В чём я проигрываю своим конкурентам и рынку?" },
            { key: "oneConclusion" as const,         label: "Какой один вывод я делаю из этого опыта?" },
          ].map(({ key, label }, i) => (
            <ExpandableField
              key={key}
              n={i + 1}
              label={label}
              value={state[key]}
              onChange={(v) => update(key, v)}
            />
          ))}

          <PageFooter index={3} total={TOTAL} />
        </section>

        {/* === РАЗДЕЛ 5: Сильные и слабые стороны === */}
        <section id="p5" className="section">
          <SectionHeader title="Мои сильные и слабые стороны" done={strengthsFilled} total={5} label="сильных сторон" />
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Проведите аудит компетенций: что уже работает, а что важно усилить.
          </p>

          {/* Сильные стороны */}
          <div className="mt-6 mb-3">
            <span className="pill-gold">1 - Мои сильные стороны</span>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Что у меня действительно получается хорошо:
          </p>

          {/* Прогресс заполнения */}
          {strengthsFilled > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span className="sans" style={{ fontSize: "13px", color: "var(--c-muted)" }}>Заполнено</span>
                <span className="sans" style={{ fontSize: "13px", fontWeight: 600, color: "var(--c-purple)" }}>{strengthsFilled} / 5</span>
              </div>
              <div style={{ height: "6px", background: "var(--c-purple-soft)", borderRadius: "3px" }}>
                <div style={{ height: "100%", width: `${(strengthsFilled / 5) * 100}%`, background: "var(--c-purple)", borderRadius: "3px", transition: "width 0.3s ease" }} />
              </div>
            </div>
          )}

          <div className="grid gap-3 mt-4">
            {state.strengths.map((val, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span
                  className="num-circle"
                  style={{
                    flexShrink: 0,
                    marginTop: "2px",
                    background: val.trim() ? "var(--c-purple)" : undefined,
                    color: val.trim() ? "#fff" : undefined,
                  }}
                >
                  {val.trim() ? "+" : i + 1}
                </span>
                <AutoTextarea
                  value={val}
                  onChange={(v) => setStrength(i, v)}
                  placeholder="Напишите сильную сторону..."
                  minRows={1}
                  className="field-input field-input-single"
                />
              </div>
            ))}
          </div>

          {/* Слабые стороны */}
          <div className="mt-10 mb-3">
            <span className="pill-gold">2 - Мои слабые стороны / зоны роста</span>
          </div>
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Честный взгляд на то, что важно усилить:
          </p>

          <div className="field-row">
            <label className="label">В чём я проигрываю рынку и конкурентам:</label>
            <AutoTextarea value={state.losingToMarket} onChange={(v) => update("losingToMarket", v)} minRows={2} />
          </div>
          <div className="field-row">
            <label className="label">Какие навыки у меня просели:</label>
            <AutoTextarea value={state.skillsDeclined} onChange={(v) => update("skillsDeclined", v)} minRows={2} />
          </div>
          <div className="field-row">
            <label className="label">Какие инструменты / технологии я не освоил(а) вовремя:</label>
            <AutoTextarea value={state.toolsNotLearned} onChange={(v) => update("toolsNotLearned", v)} minRows={2} />
          </div>
          <div className="field-row">
            <label className="label">Где моя экспертность уже дала трещину:</label>
            <AutoTextarea value={state.expertiseCracked} onChange={(v) => update("expertiseCracked", v)} minRows={2} />
          </div>
          <div className="field-row">
            <label className="label">Какой один навык критично важно усилить в ближайшие месяцы:</label>
            <AutoTextarea value={state.criticalSkill} onChange={(v) => update("criticalSkill", v)} minRows={2} />
          </div>

          {/* Интерактивный вопрос "взял бы я себя" */}
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "var(--c-purple-soft)",
              border: "1px solid var(--c-purple-line)",
              borderRadius: "16px",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <ArrowBullet />
              <div className="h2" style={{ fontSize: "18px" }}>Вопрос-тест</div>
            </div>
            <label className="label" style={{ display: "block", marginBottom: "10px" }}>
              Если бы я был(а) работодателем, я бы нанял(а) себя сегодня? Да / Нет. Почему?
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              {["Да", "Нет", "Скорее да", "Скорее нет"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="pill-toggle"
                  data-active={state.wouldHireMyself.startsWith(opt)}
                  onClick={() => update("wouldHireMyself", state.wouldHireMyself.startsWith(opt) ? "" : opt + " - ")}
                >
                  <span>{opt}</span>
                  <span className="pill-dot" />
                </button>
              ))}
            </div>
            <AutoTextarea
              value={state.wouldHireMyself}
              onChange={(v) => update("wouldHireMyself", v)}
              placeholder="Напишите свой ответ и объяснение..."
              minRows={3}
            />
          </div>

          <PageFooter index={4} total={TOTAL} />
        </section>

        {/* === РАЗДЕЛ 6: Стратегия + План + Действия === */}
        <section id="p6" className="section">
          <SectionHeader
            title="Новая стратегия поиска работы"
            done={[state.keyTheses, state.aiUsage, state.peopleToNotify].filter(v => v.trim()).length}
            total={3}
          />
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            На основании ответов составьте свою стратегию поиска работы на ближайшие 4 недели.
          </p>

          {/* Блок 1 - Упаковать себя */}
          <div className="flex items-start gap-3 mt-8 mb-3">
            <ArrowBullet />
            <div className="h2">1 - Упаковать себя</div>
          </div>
          <div className="field-row">
            <label className="label">Мои 3-5 ключевых тезисов о себе для работодателя:</label>
            <AutoTextarea value={state.keyTheses} onChange={(v) => update("keyTheses", v)} minRows={4} />
          </div>
          <div className="field-row">
            <label className="label">Что нужно обновить:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
              {TO_UPDATE_LABELS.map((label, i) => (
                <PillToggle key={i} active={state.toUpdate[i]} onChange={(v) => setToUpdate(i, v)}>
                  {label}
                </PillToggle>
              ))}
            </div>
          </div>
          <div className="field-row">
            <label className="label">Как я буду использовать нейросети для упаковки опыта и поиска вариантов:</label>
            <AutoTextarea value={state.aiUsage} onChange={(v) => update("aiUsage", v)} minRows={2} />
          </div>

          {/* Блок 2 - Активизировать связи */}
          <div className="flex items-start gap-3 mt-10 mb-3">
            <ArrowBullet />
            <div className="h2">2 - Активизировать связи</div>
          </div>
          <div className="field-row">
            <label className="label">Люди, которым я сообщу, что ищу работу:</label>
            <AutoTextarea value={state.peopleToNotify} onChange={(v) => update("peopleToNotify", v)} minRows={3} />
          </div>
          <div className="field-row">
            <label className="label">В каких профессиональных сообществах / чатах я заявлю о себе:</label>
            <AutoTextarea value={state.communities} onChange={(v) => update("communities", v)} minRows={2} />
          </div>

          {/* Блок 3 - Прокачать навык */}
          <div className="flex items-start gap-3 mt-10 mb-3">
            <ArrowBullet />
            <div className="h2">3 - Прокачать ключевой навык</div>
          </div>
          <div className="field-row">
            <label className="label">Навык, который сейчас самый слабый, но важен для рынка:</label>
            <AutoTextarea value={state.weakestSkill} onChange={(v) => update("weakestSkill", v)} minRows={2} />
          </div>
          <div className="field-row">
            <label className="label">Что я буду делать, чтобы его усилить:</label>
            <AutoTextarea value={state.skillImprovement} onChange={(v) => update("skillImprovement", v)} minRows={2} />
          </div>
          <div className="grid-2col" style={{ marginTop: "16px" }}>
            <div className="field-row" style={{ margin: 0 }}>
              <label className="label">Дата старта:</label>
              <AutoTextarea value={state.startDate} onChange={(v) => update("startDate", v)} minRows={1} className="field-input field-input-single" />
            </div>
            <div className="field-row" style={{ margin: 0 }}>
              <label className="label">Как я буду отслеживать прогресс:</label>
              <AutoTextarea value={state.progressTracking} onChange={(v) => update("progressTracking", v)} minRows={1} className="field-input field-input-single" />
            </div>
          </div>

          {/* План на 4 недели - StepCards */}
          <div className="mt-12">
            <div className="flex items-start gap-3 mb-4">
              <ArrowBullet />
              <div>
                <div className="h2">Мой план на ближайшие 4 недели</div>
                <p className="audit-helper-text italic" style={{ color: "var(--c-muted)", marginTop: "4px" }}>
                  Разложите стратегию на понятные недельные шаги.
                </p>
              </div>
            </div>

            {/* Общий прогресс плана */}
            {state.weekDone.some(Boolean) && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span className="sans" style={{ fontSize: "13px", color: "var(--c-muted)" }}>Недели выполнены</span>
                  <span className="sans" style={{ fontSize: "13px", fontWeight: 600, color: "#2E9E6E" }}>
                    {state.weekDone.filter(Boolean).length} / 4
                  </span>
                </div>
                <div style={{ height: "6px", background: "var(--c-purple-soft)", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: `${(state.weekDone.filter(Boolean).length / 4) * 100}%`, background: "#2E9E6E", borderRadius: "3px", transition: "width 0.3s ease" }} />
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {[state.week1, state.week2, state.week3, state.week4].map((val, i) => (
                <StepCard
                  key={i}
                  n={i + 1}
                  title={`Неделя ${i + 1}`}
                  done={state.weekDone[i]}
                  onToggleDone={() => toggleWeekDone(i)}
                >
                  <p className="italic" style={{ fontSize: "14px", color: "var(--c-muted)", margin: "0 0 10px" }}>
                    {WEEK_HINTS[i]}
                  </p>
                  <label className="label" style={{ fontSize: "14px" }}>Мои задачи на эту неделю:</label>
                  <AutoTextarea
                    value={weekValues[i]}
                    onChange={(v) => update(["week1", "week2", "week3", "week4"][i] as keyof State, v)}
                    placeholder="Напишите 2-3 конкретных действия..."
                    minRows={3}
                  />
                </StepCard>
              ))}
            </div>

            <div className="field-row" style={{ marginTop: "20px" }}>
              <label className="label">Моя цель на 4 недели:</label>
              <AutoTextarea value={state.goal4weeks} onChange={(v) => update("goal4weeks", v)} minRows={2} />
            </div>
          </div>

          <PageFooter index={5} total={TOTAL} />
        </section>

        {/* === РАЗДЕЛ 7: Ежедневные действия + Итог === */}
        <section id="p7" className="section">
          <SectionHeader
            title="Ежедневные действия"
            done={state.days.filter(d => d.a1.trim() || d.a2.trim() || d.a3.trim()).length}
            total={7}
            label="дней заполнено"
          />
          <p className="audit-helper-text italic" style={{ color: "var(--c-muted)" }}>
            Каждый день задавайте себе вопрос: что я сегодня сделал(а) для того, чтобы найти новую работу?
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
                <span
                  className="num-circle"
                  style={{
                    flexShrink: 0,
                    background: val.trim() ? "var(--c-purple)" : undefined,
                    color: val.trim() ? "#fff" : undefined,
                  }}
                >
                  {i + 1}
                </span>
                <AutoTextarea
                  value={val}
                  onChange={(v) => setPerson(i, v)}
                  placeholder="Имя / контакт..."
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
                Каждый вечер - три маленьких действия, которые приблизили вас к новой работе:
              </p>
            </div>
          </div>
          <div className="grid-2col">
            {state.days.map((day, i) => {
              const filled = [day.a1, day.a2, day.a3].filter(v => v.trim()).length;
              return (
                <div
                  key={i}
                  style={{
                    background: i % 2 === 1 ? "var(--c-purple-soft)" : "#fff",
                    border: `1px solid ${filled === 3 ? "#2E9E6E" : "var(--c-purple-line)"}`,
                    borderRadius: "14px",
                    padding: "16px",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span
                      className="num-circle"
                      style={{
                        background: filled === 3 ? "#2E9E6E" : undefined,
                        color: filled === 3 ? "#fff" : undefined,
                      }}
                    >
                      {filled === 3 ? "+" : i + 1}
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--c-purple-deep)" }}>День {i + 1}</span>
                    {filled > 0 && (
                      <span className="sans" style={{ fontSize: "12px", color: "var(--c-muted)", marginLeft: "auto" }}>
                        {filled}/3
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    {(["a1", "a2", "a3"] as const).map((k) => (
                      <AutoTextarea
                        key={k}
                        value={day[k]}
                        onChange={(v) => setDay(i, k, v)}
                        placeholder="Сегодня сделал(а)..."
                        minRows={1}
                        className="field-input field-input-single"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Итог */}
          <div className="quote-card mt-12" style={{ borderColor: "var(--c-gold)", background: "#fff", textAlign: "center" }}>
            <div className="flex items-start gap-3">
              <ArrowBullet />
              <div style={{ textAlign: "left" }}>
                Если вы дошли до конца чек-листа, значит, вы уже сделали шаг от тревоги и
                избегания к ясности и действиям.
              </div>
            </div>
          </div>

          {/* Шкалы состояния */}
          <div className="state-change-card mt-8">
            <div className="state-scale-block">
              <div className="label">Уровень тревоги до заполнения чек-листа:</div>
              <MoodScale value={state.anxietyBefore} onChange={(v) => update("anxietyBefore", v)} mode="before" />
            </div>
            <div className="state-scale-block">
              <div className="label">Уровень тревоги после заполнения чек-листа:</div>
              <MoodScale value={state.anxietyAfter} onChange={(v) => update("anxietyAfter", v)} mode="after" />
            </div>
          </div>

          <div className="quote-card mt-10" style={{ background: "var(--c-purple-soft)" }}>
            <div className="flex items-start gap-3">
              <ArrowBullet />
              <div>
                Этот чек-лист - один из инструментов работы с ситуацией потери работы. Чтобы глубже
                разобраться в своих жизненных сценариях и способах реагирования, читайте книгу
                Натальи Батаевой «На Личность идёт НаЛичность» или проходите онлайн-курс.
              </div>
            </div>
          </div>

          <div className="cta-buttons no-print">
            <a href="https://na-lichnost.ru/book" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--book">
              Книга «На Личность идёт НаЛичность»
            </a>
            <a href="https://na-lichnost.ru/" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--course">
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

// ── Компоненты ──────────────────────────────────────────

function NavBar({ progress, open, setOpen }: { progress: number; open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <nav className="top-dock no-print">
      <div className="top-dock-inner">
        <div className="top-dock-head sans">
          <a href="#p1" className="toc-link brand-link">Потеря работы</a>
          <div className="top-dock-actions">
            <span>{progress}% заполнено</span>
            <button type="button" className="menu-toggle" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} onClick={() => setOpen(!open)}>
              <span /><span /><span />
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
      style={{ background: "radial-gradient(ellipse at 30% 20%, #5e2a91 0%, #3b1768 55%, #2a0e52 100%)", color: "#fff", padding: "60px 40px", textAlign: "center" }}
    >
      <div className="mb-7" style={{ display: "flex", justifyContent: "center" }}>
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-nalich.png`} alt="НаЛичность" className="cover-logo" />
      </div>
      <div style={{ marginBottom: "20px", marginTop: "36px" }}>
        <span className="pill-gold" style={{ fontSize: "20px", padding: "10px 32px" }}>«Чек-лист»</span>
      </div>
      <h1 style={{ fontFamily: "var(--font-forum), serif", fontSize: "clamp(36px, 5vw, 54px)", lineHeight: 1.05, fontWeight: 400, margin: "0", maxWidth: "720px", marginInline: "auto" }}>
        «Ваш профессиональный аудит»
      </h1>
      <p className="sans mt-4 opacity-80" style={{ fontSize: "18px", maxWidth: "36rem", margin: "1rem auto 0" }}>
        Этот чек-лист поможет вам провести разбор своих сильных и слабых сторон, понять,
        почему вы потеряли доход, и сделать конкретные шаги, чтобы быстрее найти новую работу.
      </p>
      <p className="sans italic mt-12 opacity-80">
        <a href="https://na-lichnost.ru/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>@MethodBataeva</a>
      </p>
    </section>
  );
}

function SectionHeader({ title, done, total, label = "заполнено" }: { title: string; done: number; total: number; label?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <h2 className="h1" style={{ margin: 0 }}>{title}</h2>
        {done > 0 && (
          <span className="sans" style={{ fontSize: "13px", color: done === total ? "#2E9E6E" : "var(--c-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
            {done === total ? "Готово" : `${done} / ${total} ${label}`}
          </span>
        )}
      </div>
      {done > 0 && (
        <div style={{ height: "3px", background: "var(--c-purple-soft)", borderRadius: "2px", marginTop: "8px" }}>
          <div style={{ height: "100%", width: `${Math.min((done / total) * 100, 100)}%`, background: done === total ? "#2E9E6E" : "var(--c-purple)", borderRadius: "2px", transition: "width 0.3s ease" }} />
        </div>
      )}
    </div>
  );
}

function ExpandableField({ n, label, value, onChange }: { n: number; label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(!!value);
  return (
    <div style={{ marginTop: "12px" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          width: "100%",
          textAlign: "left",
          background: open ? "var(--c-purple-soft)" : value.trim() ? "#f0faf5" : "#fff",
          border: `1px solid ${value.trim() ? "#2E9E6E44" : "var(--c-purple-line)"}`,
          borderRadius: open ? "14px 14px 0 0" : "14px",
          padding: "14px 16px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <span
          className="num-circle"
          style={{
            flexShrink: 0,
            background: value.trim() ? "#2E9E6E" : "var(--c-purple-soft)",
            color: value.trim() ? "#fff" : "var(--c-purple)",
            fontSize: "14px",
          }}
        >
          {value.trim() ? "+" : n}
        </span>
        <span className="label" style={{ flex: 1, paddingTop: "2px", color: "var(--c-purple-deep)" }}>{label}</span>
        <span style={{ color: "var(--c-muted)", fontSize: "18px", lineHeight: 1, flexShrink: 0 }}>{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div style={{ border: "1px solid var(--c-purple-line)", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "12px 16px 16px" }}>
          <AutoTextarea value={value} onChange={onChange} minRows={3} />
        </div>
      )}
    </div>
  );
}

function LevelGroup({ pill, indices, levels, setLevel }: { pill: string; indices: number[]; levels: boolean[]; setLevel: (i: number, v: boolean) => void }) {
  return (
    <div className="mt-7">
      <div className="mb-3"><span className="pill-gold">{pill}</span></div>
      <div className="grid gap-1">
        {indices.map((idx) => (
          <button
            key={idx}
            type="button"
            className="level-option flex items-center gap-3 text-left w-full py-2"
            onClick={() => setLevel(idx, !levels[idx])}
          >
            <span className="radio-circle" data-checked={levels[idx]}><span className="radio-inner" /></span>
            <span className="level-option-text flex-1">{LEVEL_PHRASES[idx]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
