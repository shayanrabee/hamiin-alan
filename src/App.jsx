import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient.js";

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
   سوالات
========================= */

const moodGroups = [
  {
    value: "very_low",
    options: [
      "الان سگم",
      "خراب خراب",
      "داغون داغون",
      "از این بدتر نمیشم",
      "میخوام جیغ بزنم",
      "میخوام فحش بدم",
      "تف تو این زندگی",
      "فنام",
      "برو بابا ولم کن",
      "اعصاب ندارم",
    ],
  },
  {
    value: "low",
    options: [
      "از این بدتر هم بودم",
      "خیلی حوصله ندارم",
      "خوب نیستم زیاد",
      "تعریفی ندارم",
      "خیلی حال مال ندارم",
      "کی خوبه تو این اوضاع؟",
      "یه مقداری کلافه‌م",
      "راستش نه! خوب نیستم",
      "دلم گرفته!",
    ],
  },
  {
    value: "normal",
    options: [
      "معمولی‌ام",
      "بدی نیستم",
      "نه خوبم، نه بدم",
      "ای! خدا رو شکر",
      "مرسی، می‌گذره",
      "فعلاً هستم تا ببینم چی میشه",
      "زنده‌ایم شکر",
      "یه نفسی میاد و میره",
    ],
  },
  {
    value: "good",
    options: [
      "خوبم",
      "سرحالم",
      "یه قندی تو دلم آب شده",
      "خوشحالم",
      "انگار تازه صبح شده",
      "اصلاً خسته نیستم",
      "ما خوبیم، شما چطوری؟",
      "شانس داره باهام راه میاد",
      "فعلاً که همه‌چی خوبه",
      "امروز رو فرم‌ام",
      "حالم با خودم خوبه",
    ],
  },
  {
    value: "very_good",
    options: [
      "دلت نخواد خیلییی خوبم",
      "قر تو کمرم فراوووونه",
      "انقد خوشحالم کههههه",
      "دارم پرررررر درمیارم",
      "از این بهتر نمیشهههه",
      "بالای بالام. خیلی بالااا",
      "انگار رو ابراااااام",
      "خوششششال",
    ],
  },
];

const staticQuestions = [
  {
    key: "goal",
    title: "الان دلت چی می‌خواد؟",
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
      {
        value: "very_low",
        label: "اصلاً حوصله ندارم، یه چیز راحت می‌خوام",
      },
      { value: "low", label: "یه کم، خیلی کم" },
      {
        value: "medium",
        label: "بستگی داره، اگه بیارزه چرا که نه",
      },
      { value: "high", label: "حوصله دارم، بزن بریم" },
      { value: "very_high", label: "پایه‌ام، هرچی داری رو کن" },
    ],
  },
];

function getRandomMoodQuestion() {
  const options = moodGroups.map((group) => {
    const randomIndex = Math.floor(
      Math.random() * group.options.length
    );

    return {
      value: group.value,
      label: group.options[randomIndex],
    };
  });

  return {
    key: "mood",
    title: "حالت چطوره؟",
    options,
  };
}

function getQuestions() {
  return [getRandomMoodQuestion(), ...staticQuestions];
}

/* =========================
   دیتابیس‌ها
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

/* =========================
   نوع محتوا
========================= */

function getItemType(item) {
  const type = String(
    item?.type || item?.category || ""
  ).toLowerCase();

  const origin = String(
    item?.origin || ""
  ).toLowerCase();

  if (type === "short_film" || type === "short") {
    return "short_film";
  }

  if (type === "series" || type === "tv_series") {
    return "series";
  }

  if (type === "podcast") {
    return "podcast";
  }

  if (type === "book") {
    return "book";
  }

  if (
    type === "instrumental_music" ||
    type === "music" ||
    type === "instrumental"
  ) {
    return "instrumental_music";
  }

  if (
    type === "long_film" ||
    type === "film" ||
    type === "feature_film"
  ) {
    if (
      origin === "iran" ||
      origin === "iranian"
    ) {
      return "iran_film";
    }

    return "foreign_film";
  }

  if (type === "iran_film") {
    return "iran_film";
  }

  if (type === "foreign_film") {
    return "foreign_film";
  }

  return "unknown";
}

function getTypeLabel(item) {
  const type = getItemType(item);

  switch (type) {
    case "short_film":
      return "فیلم کوتاه";
    case "iran_film":
      return "فیلم ایرانی";
    case "foreign_film":
      return "فیلم خارجی";
    case "series":
      return "سریال";
    case "podcast":
      return "پادکست";
    case "book":
      return "کتاب";
    case "instrumental_music":
      return "موسیقی بی‌کلام";
    case "poetry":
      return "شعر";
    case "music_video":
      return "موزیک‌ویدئو";
    case "standup":
      return "استندآپ";
    case "online_game":
      return "بازی آنلاین";
    default:
      return "پیشنهادها";
  }
}

function getDurationNumber(item) {
  const value =
    item?.duration ??
    item?.durationMinutes ??
    item?.minutes ??
    item?.length;

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+/);

    if (match) {
      return Number(match[0]);
    }
  }

  return null;
}

function getDuration(item) {
  const duration = getDurationNumber(item);

  if (duration !== null) {
    return `${duration} دقیقه`;
  }

  return "";
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
  if (!item) {
    return "";
  }

  if (
    item.id !== undefined &&
    item.id !== null
  ) {
    return String(item.id);
  }

  return `${item.category || getItemType(item) || ""}-${item.title || ""}`
    .toLowerCase()
    .trim();
}

/* =========================
   پیشنهادها
========================= */

function getRecommendations(
  answers,
  databases,
  excludedKeys = new Set()
) {
  const results =
    getCategorizedRecommendations(
      databases,
      answers,
      {
        excludedKeys,
      }
    );

  const usedCategories = new Set();
  const usedKeys = new Set();
  const finalResults = [];

  for (
    const rawItem of Array.isArray(results)
      ? results
      : []
  ) {
    const category =
      rawItem?.category ||
      getItemType(rawItem);

    const item = {
      ...rawItem,
      category,
    };

    const key = getItemKey(item);

    if (!category || !key) {
      continue;
    }

    if (usedCategories.has(category)) {
      continue;
    }

    if (usedKeys.has(key)) {
      continue;
    }

    usedCategories.add(category);
    usedKeys.add(key);

    finalResults.push(item);
  }

  return finalResults;
}

/* =========================
   عنوان دسته
========================= */

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

function RecommendationCard({
  item,
  onSaveForLater,
  onDifferent,
  isSaved,
  saving,
  changing,
}) {
  const type = getTypeLabel(item);
  const duration = getDuration(item);
  const creator = getCreator(item);

  function handleTitleClick() {
    const title =
      item?.title?.trim();

    if (!title) {
      return;
    }

    const searchQuery =
      `دانلود ${title}`;

    const googleUrl =
      `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;

    window.open(
      googleUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <article className="recommendation-card">
      <div className="recommendation-image">
        {item?.image ? (
          <img
            src={item.image}
            alt={
              item.title ||
              "پیشنهاد"
            }
          />
        ) : (
          <div className="image-placeholder">
            <span>همین الان</span>
          </div>
        )}
      </div>

      <div className="recommendation-content">
        <div className="recommendation-meta">
          <span>{type}</span>

          {item?.year && (
            <span>{item.year}</span>
          )}

          {duration && (
            <span>{duration}</span>
          )}
        </div>

        <h3
          className="recommendation-title-link"
          onClick={handleTitleClick}
          title={
            item?.title
              ? `جستجوی دانلود ${item.title}`
              : ""
          }
        >
          {item?.title ||
            "بدون عنوان"}
        </h3>

        {creator && (
          <p className="creator">
            {creator}
          </p>
        )}

        <div className="card-actions">
          <button
            className="secondary"
            onClick={() =>
              onSaveForLater(item)
            }
            disabled={
              saving || isSaved
            }
          >
            {saving
              ? "در حال ذخیره..."
              : isSaved
              ? "ذخیره شد ✓"
              : "بعدن می‌بینم"}
          </button>

          <button
            className="ghost"
            onClick={() =>
              onDifferent(item)
            }
            disabled={changing}
          >
            {changing
              ? "یه لحظه..."
              : "یه چیز دیگه بگو"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================
   کارت ذخیره‌شده
========================= */

function SavedItemCard({
  item,
  onRemove,
  removing,
}) {
  const type = item?.item_type
    ? getCategoryTitle(
        item.item_type
      )
    : "پیشنهادها";

  function handleTitleClick() {
    const title =
      item?.title?.trim();

    if (!title) {
      return;
    }

    const searchQuery =
      `دانلود ${title}`;

    const googleUrl =
      `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;

    window.open(
      googleUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <article className="recommendation-card">
      <div className="recommendation-image">
        {item?.image ? (
          <img
            src={item.image}
            alt={
              item.title ||
              "ذخیره‌شده"
            }
          />
        ) : (
          <div className="image-placeholder">
            <span>همین الان</span>
          </div>
        )}
      </div>

      <div className="recommendation-content">
        <div className="recommendation-meta">
          <span>{type}</span>

          {item?.year && (
            <span>{item.year}</span>
          )}

          {item?.duration && (
            <span>
              {item.duration}
            </span>
          )}
        </div>

        <h3
          className="recommendation-title-link"
          onClick={handleTitleClick}
        >
          {item?.title ||
            "بدون عنوان"}
        </h3>

        {item?.creator && (
          <p className="creator">
            {item.creator}
          </p>
        )}

        <div className="card-actions">
          <button
            className="secondary"
            onClick={() =>
              onRemove(item.id)
            }
            disabled={removing}
          >
            {removing
              ? "در حال حذف..."
              : "حذف"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================
   استایل فیلد
========================= */

const inputStyle = {
  width: "100%",
  padding: "15px 18px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box",
  textAlign: "right",
  direction: "rtl",
};

/* =========================
   پروفایل
========================= */

function ProfileScreen({
  userId,
  onComplete,
}) {
  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [age, setAge] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [city, setCity] =
    useState("");

  const [
    wantsPhone,
    setWantsPhone,
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");

    const cleanName =
      displayName.trim();

    const cleanCity =
      city.trim();

    const cleanPhone =
      phone.trim();

    const numericAge =
      Number(age);

    if (!cleanName) {
      setError(
        "اسمتو نمی‌گی!؟"
      );
      return;
    }

    if (
      !age ||
      !Number.isInteger(
        numericAge
      ) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      setError(
        "نگفتی چند سالته که!"
      );
      return;
    }

    if (!gender) {
      setError(
        "پسری یا دختر؟"
      );
      return;
    }

    if (!cleanCity) {
      setError(
        "کجا زندگی می‌کنی؟ بین خودمون می‌مونه!"
      );
      return;
    }

    if (!wantsPhone) {
      setError(
        "برای ادامه بگو شماره‌ات رو میدی یا نه."
      );
      return;
    }

    if (
      wantsPhone === "yes" &&
      !cleanPhone
    ) {
      setError(
        "شماره موبایلت رو بده، من زنگ منگ نمی‌زنم"
      );
      return;
    }

    if (
      wantsPhone === "yes" &&
      !/^09\d{9}$/.test(
        cleanPhone
      )
    ) {
      setError(
        "شماره موبایل رو به شکل ۰۹xxxxxxxxx وارد کن."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            display_name:
              cleanName,
            age: numericAge,
            gender,
            city: cleanCity,
            phone:
              wantsPhone ===
              "yes"
                ? cleanPhone
                : null,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        throw profileError;
      }

      onComplete();
    } catch (err) {
      console.error(err);

      setError(
        "یه مشکلی پیش اومده باید از اول انجامش بدیم"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="logo">
          همین الان
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            H A M I N A L A N
          </div>

          <h1>
            یه کم از خودت بهم بگو
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{
              width:
                "min(100%, 420px)",
              marginTop: "35px",
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder="دوست داری به چه اسمی صدات بزنم؟"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
              autoComplete="nickname"
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="چند سالته؟"
              value={age}
              onChange={(event) =>
                setAge(
                  event.target.value
                )
              }
              min="1"
              max="120"
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "3px",
                }}
              >
                داداشمی یا آبجیم؟
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setGender(
                      "male"
                    )
                  }
                  style={{
                    padding:
                      "13px 8px",
                    borderRadius:
                      "12px",
                    border:
                      gender === "male"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      gender === "male"
                        ? "#111"
                        : "#fff",
                    color:
                      gender === "male"
                        ? "#fff"
                        : "#333",
                    cursor:
                      "pointer",
                    fontSize:
                      "14px",
                  }}
                >
                  داداش
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setGender(
                      "female"
                    )
                  }
                  style={{
                    padding:
                      "13px 8px",
                    borderRadius:
                      "12px",
                    border:
                      gender === "female"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      gender === "female"
                        ? "#111"
                        : "#fff",
                    color:
                      gender === "female"
                        ? "#fff"
                        : "#333",
                    cursor:
                      "pointer",
                    fontSize:
                      "14px",
                  }}
                >
                  آبجی
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setGender(
                      "prefer_not_to_say"
                    )
                  }
                  style={{
                    padding:
                      "13px 8px",
                    borderRadius:
                      "12px",
                    border:
                      gender ===
                      "prefer_not_to_say"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      gender ===
                      "prefer_not_to_say"
                        ? "#111"
                        : "#fff",
                    color:
                      gender ===
                      "prefer_not_to_say"
                        ? "#fff"
                        : "#333",
                    cursor:
                      "pointer",
                    fontSize:
                      "14px",
                  }}
                >
                  هیچ‌کوم
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="کدوم شهر زندگی می‌کنی؟"
              value={city}
              onChange={(event) =>
                setCity(
                  event.target.value
                )
              }
              autoComplete="address-level2"
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "3px",
                }}
              >
                بهم شماره میدی؟
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setWantsPhone(
                      "yes"
                    )
                  }
                  style={{
                    padding:
                      "13px",
                    borderRadius:
                      "12px",
                    border:
                      wantsPhone ===
                      "yes"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      wantsPhone ===
                      "yes"
                        ? "#111"
                        : "#fff",
                    color:
                      wantsPhone ===
                      "yes"
                        ? "#fff"
                        : "#333",
                    cursor:
                      "pointer",
                    fontSize:
                      "14px",
                  }}
                >
                  آره! تو جون بخواه
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWantsPhone(
                      "no"
                    );
                    setPhone("");
                  }}
                  style={{
                    padding:
                      "13px",
                    borderRadius:
                      "12px",
                    border:
                      wantsPhone ===
                      "no"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      wantsPhone ===
                      "no"
                        ? "#111"
                        : "#fff",
                    color:
                      wantsPhone ===
                      "no"
                        ? "#fff"
                        : "#333",
                    cursor:
                      "pointer",
                    fontSize:
                      "14px",
                  }}
                >
                  نه! هنوز یه کم زوده!
                </button>
              </div>
            </div>

            {wantsPhone ===
              "yes" && (
              <input
                type="tel"
                inputMode="numeric"
                placeholder="شماره موبایل"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        11
                      )
                  )
                }
                autoComplete="tel"
                style={{
                  ...inputStyle,
                  direction: "ltr",
                  textAlign: "left",
                }}
              />
            )}

            {error && (
              <div
                style={{
                  color:
                    "#b00020",
                  fontSize:
                    "13px",
                  lineHeight:
                    "1.8",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="main-button"
              disabled={loading}
              style={{
                marginTop: "8px",
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}
            >
              {loading
                ? "یه لحظه دندون به جیگر بگیر!"
                : "بزن بریم"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

/* =========================
   ورود / ثبت‌نام
========================= */

function AuthScreen({
  mode,
  setMode,
  onSuccess,
  onProfileNeeded,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail =
      email.trim();

    if (
      !cleanEmail ||
      !password
    ) {
      setError(
        "ایمیل و رمز عبورت رو وارد کن"
      );
      return;
    }

    if (
      mode === "signup" &&
      password !==
        confirmPassword
    ) {
      setError(
        "این دوتا رمزی که نوشتی یکی نیستن!"
      );
      return;
    }

    if (
      mode === "signup" &&
      password.length < 6
    ) {
      setError(
        "رمز عبور باید حداقل شش کاراکتر باشه. سرکوچه که نیست!"
      );
      return;
    }

    setLoading(true);

    try {
      if (
        mode === "signup"
      ) {
        const {
          data,
          error:
            signupError,
        } =
          await supabase.auth.signUp(
            {
              email:
                cleanEmail,
              password,
            }
          );

        if (signupError) {
          throw signupError;
        }

        if (
          data?.session &&
          data?.user?.id
        ) {
          onProfileNeeded(
            data.user.id
          );
          return;
        }

        setMessage(
          "خیلی خوش اومدی! یه ایمیل برات فرستادیم؛ تأییدش کن و تمام."
        );

        setMode("login");
      } else {
        const {
          data,
          error:
            loginError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                cleanEmail,
              password,
            }
          );

        if (loginError) {
          throw loginError;
        }

        if (data.session) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);

      setError(
        "یه جای کار می‌لنگه! دوباره امتحان کن."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="logo">
          همین الان
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            H A M I N A L A N
          </div>

          <h1>
            {mode ===
            "signup" ? (
              <>
                یه حساب بساز،
                <br />
                <strong>
                  بریم جلو.
                </strong>
              </>
            ) : (
              <>
                خوش برگشتی.
                <br />
                <strong>
                  همین الان شروع کنیم.
                </strong>
              </>
            )}
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{
              width:
                "min(100%, 420px)",
              marginTop: "35px",
              display: "flex",
              flexDirection:
                "column",
              gap: "12px",
            }}
          >
            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              autoComplete="email"
              style={{
                ...inputStyle,
                direction: "ltr",
                textAlign: "left",
              }}
            />

            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete={
                mode ===
                "signup"
                  ? "new-password"
                  : "current-password"
              }
              style={{
                ...inputStyle,
                direction: "ltr",
                textAlign: "left",
              }}
            />

            {mode ===
              "signup" && (
              <input
                type="password"
                placeholder="تکرار رمز عبور"
                value={
                  confirmPassword
                }
                onChange={(
                  event
                ) =>
                  setConfirmPassword(
                    event.target
                      .value
                  )
                }
                autoComplete="new-password"
                style={{
                  ...inputStyle,
                  direction:
                    "ltr",
                  textAlign:
                    "left",
                }}
              />
            )}

            {error && (
              <div
                style={{
                  color:
                    "#b00020",
                  fontSize:
                    "13px",
                  lineHeight:
                    "1.8",
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                style={{
                  color: "#555",
                  fontSize:
                    "13px",
                  lineHeight:
                    "1.8",
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="main-button"
              disabled={loading}
              style={{
                marginTop: "8px",
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}
            >
              {loading
                ? "یه لحظه دندون به جیگر بگیر!"
                : mode ===
                  "signup"
                ? "بیا تو"
                : "ورود"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(
                mode ===
                  "signup"
                  ? "login"
                  : "signup"
              );

              setError("");
              setMessage("");
            }}
            style={{
              marginTop: "20px",
              border: 0,
              background:
                "transparent",
              cursor:
                "pointer",
              fontSize:
                "13px",
              color: "#666",
            }}
          >
            {mode ===
            "signup"
              ? "حساب داری؟ وارد شو"
              : "حساب نداری؟ ثبت‌نام کن"}
          </button>
        </div>
      </section>
    </main>
  );
}

/* =========================
   App
========================= */

function App() {
  const [session, setSession] =
    useState(undefined);

  const [authMode, setAuthMode] =
    useState("login");

  const [screen, setScreen] =
    useState("home");

  const [
    profileUserId,
    setProfileUserId,
  ] = useState(null);

  const [
    profileChecking,
    setProfileChecking,
  ] = useState(false);

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const [answers, setAnswers] =
    useState({});

  const [
    recommendations,
    setRecommendations,
  ] = useState([]);

  const [questions, setQuestions] =
    useState(() =>
      getQuestions()
    );

  const [
    seenRecommendationKeys,
    setSeenRecommendationKeys,
  ] = useState(
    () => new Set()
  );

  const [
    savedItems,
    setSavedItems,
  ] = useState([]);

  const [
    savedItemsLoading,
    setSavedItemsLoading,
  ] = useState(false);

  const [
    savingItemKey,
    setSavingItemKey,
  ] = useState(null);

  const [
    changingItemKey,
    setChangingItemKey,
  ] = useState(null);

  const [
    removingSavedId,
    setRemovingSavedId,
  ] = useState(null);

  const [
    savedError,
    setSavedError,
  ] = useState("");

  const databases = useMemo(
    () => getDatabases(),
    []
  );

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data,
      } =
        await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(
        data.session
      );

      if (
        data.session?.user
          ?.id
      ) {
        setProfileChecking(
          true
        );

        const {
          data: profile,
          error,
        } =
          await supabase
            .from("profiles")
            .select(
              "display_name, age, gender, city"
            )
            .eq(
              "id",
              data.session
                .user.id
            )
            .maybeSingle();

        if (!mounted) {
          return;
        }

        setProfileChecking(
          false
        );

        if (
          error ||
          !profile ||
          !profile.display_name ||
          !profile.age ||
          !profile.gender ||
          !profile.city
        ) {
          setProfileUserId(
            data.session
              .user.id
          );

          setScreen(
            "profile"
          );
        } else {
          setScreen("home");
        }
      }
    }

    checkSession();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          currentSession
        ) => {
          setSession(
            currentSession
          );
        }
      );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadSavedItems() {
    if (!session?.user?.id) {
      return;
    }

    setSavedItemsLoading(
      true
    );

    setSavedError("");

    try {
      const {
        data,
        error,
      } =
        await supabase
          .from("saved_items")
          .select("*")
          .eq(
            "user_id",
            session.user.id
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {
        throw error;
      }

      setSavedItems(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setSavedError(
        "چی شد؟ نشد که!"
      );
    } finally {
      setSavedItemsLoading(
        false
      );
    }
  }

  useEffect(() => {
    if (
      session?.user?.id
    ) {
      loadSavedItems();
    } else {
      setSavedItems([]);
    }
  }, [session?.user?.id]);

  function startQuestionnaire() {
    setQuestions(
      getQuestions()
    );

    setAnswers({});
    setRecommendations([]);
    setQuestionIndex(0);
    setSavedError("");
    setScreen(
      "questionnaire"
    );
  }

  function chooseAnswer(option) {
    if (!currentQuestion) {
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion.key]:
        option.value,
    };

    setAnswers(
      updatedAnswers
    );

    if (
      questionIndex <
      questions.length - 1
    ) {
      setQuestionIndex(
        (current) =>
          current + 1
      );

      return;
    }

    const savedKeys =
      new Set(
        savedItems
          .map(
            (item) =>
              item.item_key
          )
          .filter(Boolean)
      );

    const excludedKeys =
      new Set([
        ...seenRecommendationKeys,
        ...savedKeys,
      ]);

    const results =
      getRecommendations(
        updatedAnswers,
        databases,
        excludedKeys
      );

    const newKeys =
      results
        .map((item) =>
          getItemKey(item)
        )
        .filter(Boolean);

    setSeenRecommendationKeys(
      (current) =>
        new Set([
          ...current,
          ...newKeys,
        ])
    );

    setRecommendations(
      results
    );

    setScreen("results");
  }

  function goBack() {
    if (questionIndex > 0) {
      setQuestionIndex(
        (current) =>
          current - 1
      );

      return;
    }

    setScreen("home");
  }

  function restart() {
    setAnswers({});
    setRecommendations([]);
    setQuestions(
      getQuestions()
    );
    setQuestionIndex(0);
    setScreen("home");
  }

  async function saveForLater(item) {
    if (!session?.user?.id) {
      return;
    }

    const itemKey =
      getItemKey(item);

    if (!itemKey) {
      return;
    }

    const alreadySaved =
      savedItems.some(
        (saved) =>
          saved.item_key ===
          itemKey
      );

    if (alreadySaved) {
      return;
    }

    setSavingItemKey(
      itemKey
    );

    setSavedError("");

    try {
      const payload = {
        user_id:
          session.user.id,

        item_key:
          itemKey,

        title:
          item?.title ||
          "بدون عنوان",

        item_type:
          item?.category ||
          getItemType(item),

        category:
          item?.category ||
          getItemType(item),

        image:
          item?.image ||
          null,

        creator:
          getCreator(item) ||
          null,

        year:
          item?.year !==
            undefined &&
          item?.year !== null
            ? String(item.year)
            : null,

        duration:
          getDuration(item) ||
          null,

        item_data:
          item || {},
      };

      const {
        data,
        error,
      } =
        await supabase
          .from("saved_items")
          .upsert(
            payload,
            {
              onConflict:
                "user_id,item_key",
            }
          )
          .select()
          .single();

      if (error) {
        throw error;
      }

      if (data) {
        setSavedItems(
          (current) => {
            const exists =
              current.some(
                (saved) =>
                  saved.id ===
                  data.id
              );

            if (exists) {
              return current;
            }

            return [
              data,
              ...current,
            ];
          }
        );
      }
    } catch (err) {
      console.error(err);

      setSavedError(
        "ذخیره نشد که"
      );
    } finally {
      setSavingItemKey(
        null
      );
    }
  }

  async function removeSavedItem(
    savedId
  ) {
    if (!savedId) {
      return;
    }

    setRemovingSavedId(
      savedId
    );

    setSavedError("");

    try {
      const {
        error,
      } =
        await supabase
          .from("saved_items")
          .delete()
          .eq(
            "id",
            savedId
          )
          .eq(
            "user_id",
            session.user.id
          );

      if (error) {
        throw error;
      }

      setSavedItems(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              savedId
          )
      );
    } catch (err) {
      console.error(err);

      setSavedError(
        "حذف نشد که"
      );
    } finally {
      setRemovingSavedId(
        null
      );
    }
  }

  function showDifferentRecommendation(
    currentItem
  ) {
    if (!currentItem) {
      return;
    }

    const itemKey =
      getItemKey(
        currentItem
      );

    const category =
      currentItem.category ||
      getItemType(
        currentItem
      );

    if (!category) {
      return;
    }

    setChangingItemKey(
      itemKey
    );

    const currentlyShown =
      recommendations
        .filter(
          (item) =>
            (item.category ||
              getItemType(
                item
              )) ===
            category
        )
        .map((item) =>
          getItemKey(item)
        )
        .filter(Boolean);

    const savedKeys =
      new Set(
        savedItems
          .map(
            (item) =>
              item.item_key
          )
          .filter(Boolean)
      );

    const excludedKeys =
      new Set([
        ...seenRecommendationKeys,
        ...currentlyShown,
        ...savedKeys,
        itemKey,
      ]);

    const newItem =
      getAlternativeRecommendation(
        databases,
        category,
        answers,
        {
          excludedKeys,
        }
      );

    if (!newItem) {
      setSavedError(
        "فعلاً پیشنهاد دیگری نداریم"
      );

      setChangingItemKey(
        null
      );

      return;
    }

    const replacement = {
      ...newItem,
      category,
    };

    const replacementKey =
      getItemKey(
        replacement
      );

    setSeenRecommendationKeys(
      (current) =>
        new Set([
          ...current,
          replacementKey,
        ])
    );

    setRecommendations(
      (current) =>
        current.map(
          (item) =>
            getItemKey(item) ===
            itemKey
              ? replacement
              : item
        )
    );

    setSavedError("");
    setChangingItemKey(null);
  }

  function openSavedScreen() {
    setScreen("saved");
    setSavedError("");
  }

  function closeSavedScreen() {
    setScreen("home");
    setSavedError("");
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setScreen("home");
    setProfileUserId(null);
    setSavedItems([]);

    setSeenRecommendationKeys(
      new Set()
    );
  }

  const currentQuestion =
    questions[
      questionIndex
    ];

  if (
    session === undefined ||
    profileChecking
  ) {
    return (
      <main className="app">
        <section
          className="hero"
          style={{
            minHeight:
              "100vh",
          }}
        >
          <div className="logo">
            همین الان
          </div>

          <p>
            یه لحظه دندون به جیگر بگیر!
          </p>
        </section>
      </main>
    );
  }

  if (
    screen === "profile" &&
    profileUserId
  ) {
    return (
      <ProfileScreen
        userId={
          profileUserId
        }
        onComplete={() => {
          setProfileUserId(
            null
          );
          setScreen("home");
        }}
      />
    );
  }

  if (!session) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={() => {
          setScreen("home");
        }}
        onProfileNeeded={(
          userId
        ) => {
          setProfileUserId(
            userId
          );

          setScreen(
            "profile"
          );
        }}
      />
    );
  }

  if (screen === "saved") {
    return (
      <main className="app">
        <section className="results">
          <header className="results-header">
            <button
              className="back-button"
              onClick={
                closeSavedScreen
              }
            >
              ←
            </button>

            <div>
              <div className="logo small">
                همین الان
              </div>
            </div>

            <button
              className="logout-link"
              onClick={logout}
            >
              خروج
            </button>
          </header>

          <div className="results-intro">
            <h1>
              برای بعدن
            </h1>

            <p>
              اینا رو نگه داشتی.
            </p>

            <p>
              چیزهایی که گفتی بعدن سراغشون می‌ری، اینجان.
            </p>
          </div>

          {savedError && (
            <div
              style={{
                color:
                  "#b00020",
                fontSize:
                  "13px",
                lineHeight:
                  "1.8",
                marginBottom:
                  "20px",
              }}
            >
              {savedError}
            </div>
          )}

          {savedItemsLoading ? (
            <div className="empty-state">
              <h2>
                یه لحظه...
              </h2>

              <p>
                دارم می‌گردم!‌اینا رو کجا گذاشته بودی...؟
              </p>
            </div>
          ) : savedItems.length >
            0 ? (
            <div className="recommendations-grid">
              {Object.entries(
                savedItems.reduce(
                  (
                    groups,
                    item
                  ) => {
                    const category =
                      item.category ||
                      item.item_type ||
                      "unknown";

                    if (
                      !groups[
                        category
                      ]
                    ) {
                      groups[
                        category
                      ] = [];
                    }

                    groups[
                      category
                    ].push(item);

                    return groups;
                  },
                  {}
                )
              ).map(
                ([
                  category,
                  items,
                ]) => (
                  <section
                    className="recommendation-category"
                    key={
                      category
                    }
                  >
                    <h2 className="category-title">
                      {getCategoryTitle(
                        category
                      )}
                    </h2>

                    <div className="category-cards">
                      {items.map(
                        (
                          item
                        ) => (
                          <SavedItemCard
                            key={
                              item.id
                            }
                            item={
                              item
                            }
                            onRemove={
                              removeSavedItem
                            }
                            removing={
                              removingSavedId ===
                              item.id
                            }
                          />
                        )
                      )}
                    </div>
                  </section>
                )
              )}
            </div>
          ) : (
            <div className="empty-state">
              <h2>
                خالیه که!
              </h2>

              <p>
                پیشنهادی که دوست داشتی ولی الان وقتش رو نداری، بزن «بعدن می‌بینم»
              </p>
            </div>
          )}

          <button
            className="again-button"
            onClick={
              startQuestionnaire
            }
          >
            یه چیز جدید پیدا کنیم
          </button>
        </section>
      </main>
    );
  }

  if (screen === "home") {
    return (
      <main className="app">
        <section className="hero">
          <div className="hero-top-actions">
            <button
              className="saved-link"
              onClick={
                openSavedScreen
              }
            >
              <span>
                بعدن می‌بینم
              </span>

              {savedItems.length >
                0 && (
                <span className="saved-count">
                  {
                    savedItems.length
                  }
                </span>
              )}
            </button>

            <button
              className="logout-link"
              onClick={logout}
            >
              خروج
            </button>
          </div>

          <div className="logo">
            همین الان
          </div>

          <div className="hero-content">
            <div className="eyebrow">
              H A M I N A L A N
            </div>

            <h1>
              نمی‌دونی الان چیکار کنی؟
            </h1>

            <p>
              بزن ببینیم چی بهت می‌چسبه
            </p>

            <button
              className="main-button"
              onClick={
                startQuestionnaire
              }
            >
              چه کنم؟
              <span>←</span>
            </button>
          </div>

          <div className="hero-note">
            فیلمایی که ندیدی، موزیکایی که نشنیدی، کتابایی که نخوندی، جاهایی که نرفتی... من همه رو بلدم! بهت میگم.
          </div>
        </section>
      </main>
    );
  }

  if (
    screen ===
    "questionnaire"
  ) {
    if (!currentQuestion) {
      return null;
    }

    const progress =
      ((questionIndex + 1) /
        questions.length) *
      100;

    return (
      <main className="app">
        <section className="questionnaire">
          <header className="question-header">
            <button
              className="back-button"
              onClick={goBack}
            >
              ←
            </button>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>

            <span className="question-number">
              {questionIndex +
                1}
              /
              {
                questions.length
              }
            </span>
          </header>

          <div className="question-content">
            <h1>
              {
                currentQuestion.title
              }
            </h1>

            <div className="options">
              {currentQuestion.options.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    className="option"
                    onClick={() =>
                      chooseAnswer(
                        option
                      )
                    }
                  >
                    <span>
                      {
                        option.label
                      }
                    </span>

                    <span className="option-arrow">
                      ←
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const groupedRecommendations =
    recommendations.reduce(
      (
        groups,
        item
      ) => {
        const category =
          item.category ||
          getItemType(item) ||
          "unknown";

        if (
          !groups[category]
        ) {
          groups[
            category
          ] = [];
        }

        if (
          groups[category]
            .length === 0
        ) {
          groups[
            category
          ].push({
            ...item,
            category,
          });
        }

        return groups;
      },
      {}
    );

  return (
    <main className="app">
      <section className="results">
        <header className="results-header">
          <button
            className="back-button"
            onClick={restart}
          >
            ←
          </button>

          <div>
            <div className="logo small">
              همین الان
            </div>
          </div>

          <div className="results-header-actions">
            <button
              className="saved-link"
              onClick={
                openSavedScreen
              }
            >
              <span>
                بعدن می‌بینم
              </span>

              {savedItems.length >
                0 && (
                <span className="saved-count">
                  {
                    savedItems.length
                  }
                </span>
              )}
            </button>

            <button
              className="logout-link"
              onClick={logout}
            >
              خروج
            </button>
          </div>
        </header>

        <div className="results-intro">
          <h1>
            کلیک کن، حالشو ببر!
          </h1>

          <p>
            اسکرول کن برو پایین ببین چیا برات گذاشتم کنار
          </p>
        </div>

        {savedError && (
          <div
            style={{
              color:
                "#b00020",
              fontSize:
                "13px",
              lineHeight:
                "1.8",
              marginBottom:
                "20px",
            }}
          >
            {savedError}
          </div>
        )}

        {recommendations.length >
        0 ? (
          <div className="recommendations-grid">
            {Object.entries(
              groupedRecommendations
            ).map(
              ([
                category,
                items,
              ]) => (
                <section
                  className="recommendation-category"
                  key={
                    category
                  }
                >
                  <h2 className="category-title">
                    {getCategoryTitle(
                      category
                    )}
                  </h2>

                  <div className="category-cards">
                    {items.map(
                      (item) => {
                        const itemKey =
                          getItemKey(
                            item
                          );

                        const isSaved =
                          savedItems.some(
                            (
                              saved
                            ) =>
                              saved.item_key ===
                              itemKey
                          );

                        return (
                          <RecommendationCard
                            key={
                              itemKey
                            }
                            item={
                              item
                            }
                            onSaveForLater={
                              saveForLater
                            }
                            onDifferent={
                              showDifferentRecommendation
                            }
                            isSaved={
                              isSaved
                            }
                            saving={
                              savingItemKey ===
                              itemKey
                            }
                            changing={
                              changingItemKey ===
                              itemKey
                            }
                          />
                        );
                      }
                    )}
                  </div>
                </section>
              )
            )}
          </div>
        ) : (
          <div className="empty-state">
            <h2>
              هنوز چیزی برای پیشنهاد نداریم.
            </h2>

            <p>
              به‌زودی اینجا پر از چیزهای دیدنی، شنیدنی و خواندنی می‌شود.
            </p>
          </div>
        )}

        <button
          className="again-button"
          onClick={
            startQuestionnaire
          }
        >
          می‌خوای از اول امتحان کنی؟
        </button>
      </section>
    </main>
  );
}

export default App;