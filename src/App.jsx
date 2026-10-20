
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabase";

import films from "./data/films.js";
import foreignFilms from "./data/foreignFilms.js";
import podcasts from "./data/podcasts.js";
import books from "./data/books.js";
import shortFilms from "./data/shortFilms.js";
import series from "./data/series.js";
import instrumentalMusic from "./data/instrumentalMusic.js";

import {
  getCategorizedRecommendations,
  getAlternativeRecommendation,
} from "./data/recommend.js";

import "./App.css";

/* =========================
   سوالات حال و حوصله
========================= */

const moodGroups = [
  {
    value: "very_low",
    options: [
      "الان سگم", "خراب خراب", "داغون داغون", "از این بدتر نمیشم",
      "میخوام جیغ بزنم", "میخوام فحش بدم", "تف تو این زندگی",
      "فنام", "برو بابا ولم کن", "اعصاب ندارم",
    ],
  },
  {
    value: "low",
    options: [
      "از این بدتر هم بودم", "خیلی حوصله ندارم", "خوب نیستم زیاد",
      "تعریفی ندارم", "خیلی حال مال ندارم", "کی خوبه تو این اوضاع؟",
      "یه مقداری کلافه‌م", "راستش نه! خوب نیستم", "دلم گرفته!",
    ],
  },
  {
    value: "normal",
    options: [
      "معمولی‌ام", "بدی نیستم", "نه خوبم، نه بدم", "ای! خدا رو شکر",
      "مرسی، می‌گذره", "فعلاً هستم تا ببینم چی میشه", "زنده‌ایم شکر",
      "یه نفسی میاد و میره",
    ],
  },
  {
    value: "good",
    options: [
      "خوبم", "سرحالم", "یه قندی تو دلم آب شده", "خوشحالم",
      "انگار تازه صبح شده", "اصلاً خسته نیستم", "ما خوبیم، شما چطوری؟",
      "شانس داره باهام راه میاد", "فعلاً که همه‌چی خوبه",
      "امروز رو فرم‌ام", "حالم با خودم خوبه",
    ],
  },
  {
    value: "very_good",
    options: [
      "دلت نخواد خیلییی خوبم", "قر تو کمرم فراوووونه",
      "انقد خوشحالم کههههه", "دارم پرررررر درمیارم",
      "از این بهتر نمیشهههه", "بالای بالام. خیلی بالااا",
      "انگار رو ابراااااام", "خوششششال",
    ],
  },
];

const staticQuestions = [
  {
    key: "goal",
    title: "الان چی می‌خوای؟",
    options: [
      { value: "feel_better", label: "می‌خوام حالم بهتر بشه" },
      { value: "fun", label: "می‌خوام بخندم" },
      { value: "excitement", label: "می‌خوام هیجان داشته باشم" },
      { value: "calm", label: "می‌خوام آروم بشم" },
      { value: "thoughtful", label: "می‌خوام ذهنم درگیر بشه" },
      { value: "discovery", label: "می‌خوام یه چیز عجیب و متفاوت پیدا کنم" },
      { value: "learning", label: "می‌خوام یه چیز تازه یاد بگیرم" },
      { value: "surprise", label: "نمی‌دونم، خودمم نمی‌دونم" },
    ],
  },
  {
    key: "time",
    title: "چقدر وقت داری؟",
    options: [
      { value: "30min", label: "تا نیم ساعت" },
      { value: "1hour", label: "حدود یه ساعت" },
      { value: "2_3hours", label: "دو سه ساعت" },
      { value: "half_day", label: "یه نصف روز" },
      { value: "a_lot", label: "مهم نیست، وقتم زیاده" },
    ],
  },
  {
    key: "energy",
    title: "چقدر حوصله داری؟",
    options: [
      { value: "very_low", label: "اصلاً حوصله ندارم، یه چیز راحت می‌خوام" },
      { value: "low", label: "یه کم، خیلی کم" },
      { value: "medium", label: "بستگی داره، اگه بیارزه چرا که نه" },
      { value: "high", label: "حوصله دارم، بزن بریم" },
      { value: "very_high", label: "پایه‌ام، هرچی داری رو کن" },
    ],
  },
];

function getRandomMoodQuestion() {
  return {
    key: "mood",
    title: "الان چه حالی داری؟",
    options: moodGroups.map((group) => ({
      value: group.value,
      label: group.options[
        Math.floor(Math.random() * group.options.length)
      ],
    })),
  };
}

function getQuestions() {
  return [getRandomMoodQuestion(), ...staticQuestions];
}

/* =========================
   منابع پیشنهادها
========================= */

function getDatabases() {
  return {
    films: Array.isArray(films) ? films : [],
    foreignFilms: Array.isArray(foreignFilms) ? foreignFilms : [],
    shortFilms: Array.isArray(shortFilms) ? shortFilms : [],
    series: Array.isArray(series) ? series : [],
    podcasts: Array.isArray(podcasts) ? podcasts : [],
    books: Array.isArray(books) ? books : [],
    instrumentalMusic: Array.isArray(instrumentalMusic)
      ? instrumentalMusic
      : [],
  };
}

function getItemType(item) {
  const type = String(item?.type || item?.category || "").toLowerCase();
  const origin = String(item?.origin || "").toLowerCase();

  if (type === "short_film" || type === "short") return "short_film";
  if (type === "series" || type === "tv_series") return "series";
  if (type === "podcast") return "podcast";
  if (type === "book") return "book";

  if (
    type === "instrumental_music" ||
    type === "music" ||
    type === "instrumental"
  ) return "instrumental_music";

  if (
    type === "long_film" ||
    type === "film" ||
    type === "feature_film"
  ) {
    return origin === "iran" || origin === "iranian"
      ? "iran_film"
      : "foreign_film";
  }

  if (type === "iran_film") return "iran_film";
  if (type === "foreign_film") return "foreign_film";

  return "unknown";
}

function getTypeLabel(item) {
  const labels = {
    short_film: "فیلم کوتاه",
    iran_film: "فیلم ایرانی",
    foreign_film: "فیلم خارجی",
    series: "سریال",
    podcast: "پادکست",
    book: "کتاب",
    instrumental_music: "موسیقی بی‌کلام",
    poetry: "شعر",
    music_video: "موزیک‌ویدئو",
    standup: "استندآپ",
    online_game: "بازی آنلاین",
  };

  return labels[getItemType(item)] || "پیشنهادها";
}

function getDurationNumber(item) {
  const value =
    item?.duration ??
    item?.durationMinutes ??
    item?.minutes ??
    item?.length;

  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) return Number(match[0]);
  }

  return null;
}

function getDuration(item) {
  const duration = getDurationNumber(item);
  return duration !== null ? `${duration} دقیقه` : "";
}

function getCreator(item) {
  return (
    item?.director ||
    item?.author ||
    item?.creator ||
    item?.artist ||
    item?.host ||
    ""
  );
}

function getItemKey(item) {
  if (!item) return "";
  if (item.id !== undefined && item.id !== null) return String(item.id);

  return `${item.category || getItemType(item)}-${item.title || ""}`
    .toLowerCase()
    .trim();
}

/* =========================
   الگوریتم پیشنهادها
========================= */

function getRecommendations(answers, databases, excludedKeys = new Set()) {
  const results = getCategorizedRecommendations(
    databases,
    answers,
    { excludedKeys }
  );

  const usedCategories = new Set();
  const usedKeys = new Set();
  const finalResults = [];

  for (const rawItem of Array.isArray(results) ? results : []) {
    const category = rawItem?.category || getItemType(rawItem);
    const item = { ...rawItem, category };
    const key = getItemKey(item);

    if (!category || !key) continue;
    if (usedCategories.has(category) || usedKeys.has(key)) continue;

    usedCategories.add(category);
    usedKeys.add(key);
    finalResults.push(item);
  }

  return finalResults;
}

function getCategoryTitle(category) {
  const titles = {
    iran_film: "فیلم ایرانی",
    foreign_film: "فیلم خارجی",
    short_film: "فیلم کوتاه",
    podcast: "پادکست",
    series: "سریال",
    book: "کتاب",
    instrumental_music: "موسیقی بی‌کلام",
    poetry: "شعر",
    music_video: "موزیک‌ویدئو",
    standup: "استندآپ",
    online_game: "بازی آنلاین",
  };

  return titles[category] || "پیشنهادها";
}

/* =========================
   کارت پیشنهاد
========================= */

function RecommendationCard({ item, onDifferent, changing }) {
  const type = getTypeLabel(item);
  const duration = getDuration(item);
  const creator = getCreator(item);

  function handleTitleClick() {
    const title = item?.title?.trim();
    if (!title) return;

    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
      `دانلود ${title}`
    )}`;

    window.open(googleUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <article className="recommendation-card">
      <div className="recommendation-image">
        {item?.image ? (
          <img src={item.image} alt={item.title || "پیشنهاد"} />
        ) : (
          <div className="image-placeholder">
            <span>yeyho</span>
          </div>
        )}
      </div>

      <div className="recommendation-content">
        <div className="recommendation-meta">
          <span>{type}</span>
          {item?.year && <span>{item.year}</span>}
          {duration && <span>{duration}</span>}
        </div>

        <h3
          className="recommendation-title-link"
          onClick={handleTitleClick}
          title={item?.title ? `جستجوی دانلود ${item.title}` : ""}
        >
          {item?.title || "بدون عنوان"}
        </h3>

        {creator && <p className="creator">{creator}</p>}

        <div className="card-actions">
          <button
            className="ghost"
            onClick={() => onDifferent(item)}
            disabled={changing}
          >
            {changing ? "یه لحظه..." : "یه چیز دیگه بگو"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================
   برنامه اصلی
========================= */

function App() {
  const [screen, setScreen] = useState("home");
  const [authLoading, setAuthLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [questions, setQuestions] = useState(() => getQuestions());
  const [seenRecommendationKeys, setSeenRecommendationKeys] =
    useState(() => new Set());
  const [changingItemKey, setChangingItemKey] = useState(null);
  const [message, setMessage] = useState("");

  const googleButtonRef = useRef(null);
  const googleInitializedRef = useRef(false);
  const databases = useMemo(() => getDatabases(), []);

  function startQuestionnaire() {
    setQuestions(getQuestions());
    setAnswers({});
    setRecommendations([]);
    setQuestionIndex(0);
    setMessage("");
    setScreen("questionnaire");
  }

  /* نشست موجود را بررسی کن */
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        setMessage("بررسی ورود ناموفق بود. دوباره تلاش کن.");
        return;
      }

      if (data.session) {
        startQuestionnaire();
      }
    }).catch((error) => {
      console.error("Session check failed:", error);
      if (active) setMessage("ارتباط با سرویس ورود برقرار نشد.");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && session && event === "SIGNED_IN") {
        setScreen("questionnaire");
        setMessage("");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  /* بارگذاری دکمه رسمی Google Identity Services */
  useEffect(() => {
    if (screen !== "login") return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setMessage("شناسهٔ گوگل در فایل .env پیدا نشد.");
      return;
    }

    let cancelled = false;

    function renderGoogleButton() {
      if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
        return;
      }

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response?.credential) {
            setMessage("گوگل توکن ورود را برنگرداند. دوباره تلاش کن.");
            return;
          }

          setAuthLoading(true);
          setMessage("");

          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
            });

            if (error) throw error;

            startQuestionnaire();
          } catch (error) {
            console.error("Google token sign-in error:", error);
            setMessage(
              "ورود ناموفق بود. تنظیمات Google Provider در Supabase و شناسهٔ کلاینت را بررسی کن."
            );
          } finally {
            setAuthLoading(false);
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 280,
        locale: "en",
      });

      googleInitializedRef.current = true;
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      let script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );

      const onLoad = () => renderGoogleButton();
      const onError = () => {
        if (!cancelled) {
          setMessage("بارگذاری دکمهٔ گوگل ناموفق بود. اتصال اینترنت را بررسی کن.");
        }
      };

      if (!script) {
        script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.addEventListener("load", onLoad);
        script.addEventListener("error", onError);
        document.head.appendChild(script);
      } else {
        script.addEventListener("load", onLoad);
        script.addEventListener("error", onError);
        if (window.google?.accounts?.id) renderGoogleButton();
      }

      return () => {
        cancelled = true;
        script?.removeEventListener("load", onLoad);
        script?.removeEventListener("error", onError);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [screen]);

  function chooseAnswer(option) {
    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.key]: option.value,
    };

    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    const results = getRecommendations(
      updatedAnswers,
      databases,
      seenRecommendationKeys
    );

    const newKeys = results.map(getItemKey).filter(Boolean);

    setSeenRecommendationKeys(
      (current) => new Set([...current, ...newKeys])
    );

    setRecommendations(results);
    setMessage("");
    setScreen("results");
  }

  function goBack() {
    if (questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
    } else {
      setScreen("home");
    }
  }

  function restart() {
    setAnswers({});
    setRecommendations([]);
    setQuestions(getQuestions());
    setQuestionIndex(0);
    setMessage("");
    setScreen("home");
  }

  function showDifferentRecommendation(currentItem) {
    if (!currentItem) return;

    const itemKey = getItemKey(currentItem);
    const category = currentItem.category || getItemType(currentItem);
    if (!category) return;

    setChangingItemKey(itemKey);

    const currentlyShown = recommendations
      .filter((item) => (item.category || getItemType(item)) === category)
      .map(getItemKey)
      .filter(Boolean);

    const excludedKeys = new Set([
      ...seenRecommendationKeys,
      ...currentlyShown,
      itemKey,
    ]);

    const newItem = getAlternativeRecommendation(
      databases,
      category,
      answers,
      { excludedKeys }
    );

    if (!newItem) {
      setMessage(
        `برای بخش «${getCategoryTitle(category)}» فعلاً پیشنهاد دیگری نداریم.`
      );
      setChangingItemKey(null);
      return;
    }

    const replacement = { ...newItem, category };
    const replacementKey = getItemKey(replacement);

    setSeenRecommendationKeys(
      (current) => new Set([...current, replacementKey])
    );

    setRecommendations((current) =>
      current.map((item) =>
        getItemKey(item) === itemKey ? replacement : item
      )
    );

    setMessage("");
    setChangingItemKey(null);
  }

  const currentQuestion = questions[questionIndex];

  /* صفحه شروع */
  if (screen === "home") {
    return (
      <main className="app yeyho-app">
        <section className="yeyho-home">
          <div className="yeyho-logo">yeyho</div>

          <div className="yeyho-hero-content">
            <h1>حوصله ت سر رفته؟</h1>
            <button
              className="yeyho-main-button"
              onClick={() => {
                setMessage("");
                setScreen("login");
              }}
            >
              بزن بریم
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* صفحه ورود جداگانه */
  if (screen === "login") {
    return (
      <main className="app yeyho-app">
        <section className="yeyho-home">
          <div className="yeyho-logo">yeyho</div>

          <div className="yeyho-hero-content">
            <h1>با گوگل وارد شو</h1>
            <p>برای ادامه، حساب گوگلت رو انتخاب کن.</p>

            <div
              ref={googleButtonRef}
              style={{
                display: "flex",
                justifyContent: "center",
                minHeight: 44,
                margin: "24px auto",
              }}
            />

            {authLoading && <p>در حال بررسی حساب...</p>}

            {message && (
              <p role="alert" className="auth-message">
                {message}
              </p>
            )}

            <button
              className="ghost"
              onClick={() => {
                setMessage("");
                setScreen("home");
              }}
              disabled={authLoading}
            >
              برگشت
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* پرسش‌نامه */
  if (screen === "questionnaire") {
    if (!currentQuestion) return null;

    const progress = ((questionIndex + 1) / questions.length) * 100;

    return (
      <main className="app">
        <section className="questionnaire">
          <header className="question-header">
            <button className="back-button" onClick={goBack}>←</button>

            <div className="progress">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <span className="question-number">
              {questionIndex + 1}/{questions.length}
            </span>
          </header>

          <div className="question-content">
            <h1>{currentQuestion.title}</h1>

            {currentQuestion.key === "mood" && (
              <p>همون چیزی رو بگو که واقعاً الان حس می‌کنی.</p>
            )}
            {currentQuestion.key === "goal" && (
              <p>قرار نیست جواب درست یا غلطی وجود داشته باشه.</p>
            )}
            {currentQuestion.key === "time" && (
              <p>این یکی مهمه؛ چیزی پیشنهاد نمی‌کنیم که وسطش مجبور شی ولش کنی.</p>
            )}
            {currentQuestion.key === "energy" && (
              <p>این مشخص می‌کنه چقدر باید ازت انرژی بگیریم!</p>
            )}

            <div className="options">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  className="option"
                  onClick={() => chooseAnswer(option)}
                >
                  <span>{option.label}</span>
                  <span className="option-arrow">←</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* نتایج */
  const groupedRecommendations = recommendations.reduce((groups, item) => {
    const category = item.category || getItemType(item) || "unknown";

    if (!groups[category]) groups[category] = [];
    if (groups[category].length === 0) {
      groups[category].push({ ...item, category });
    }

    return groups;
  }, {});

  return (
    <main className="app">
      <section className="results">
        <header className="results-header">
          <button className="back-button" onClick={restart}>←</button>
          <div>
            <div className="logo small yeyho-wordmark">yeyho</div>
          </div>
        </header>

        <div className="results-intro">
          <h1>پیداش کردیم</h1>
          <p>این‌ها شاید بهت بچسبن.</p>
          <p>بر اساس حال و حوصله‌ای که گفتی، این‌ها رو برات کنار گذاشتیم.</p>
        </div>

        {message && (
          <div
            style={{
              color: "#555",
              fontSize: "13px",
              lineHeight: "1.8",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="recommendations-grid">
            {Object.entries(groupedRecommendations).map(([category, items]) => (
              <section className="recommendation-category" key={category}>
                <h2 className="category-title">{getCategoryTitle(category)}</h2>

                <div className="category-cards">
                  {items.map((item) => {
                    const itemKey = getItemKey(item);

                    return (
                      <RecommendationCard
                        key={itemKey}
                        item={item}
                        onDifferent={showDifferentRecommendation}
                        changing={changingItemKey === itemKey}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>هنوز چیزی برای پیشنهاد نداریم.</h2>
            <p>به‌زودی اینجا پر از چیزهای دیدنی، شنیدنی و خواندنی می‌شود.</p>
          </div>
        )}

        <button className="again-button" onClick={startQuestionnaire}>
          دوباره بپرس ازم
        </button>
      </section>
    </main>
  );
}

export default App;
