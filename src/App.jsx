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
    title: "الان چی می‌خوای؟",
    subtitle: "قرار نیست جواب درست یا غلطی وجود داشته باشه.",
    options: [
      {
        value: "feel_better",
        label: "می‌خوام حالم بهتر بشه",
      },
      {
        value: "fun",
        label: "می‌خوام بخندم",
      },
      {
        value: "excitement",
        label: "می‌خوام هیجان داشته باشم",
      },
      {
        value: "calm",
        label: "می‌خوام آروم بشم",
      },
      {
        value: "thoughtful",
        label: "می‌خوام ذهنم درگیر بشه",
      },
      {
        value: "discovery",
        label: "می‌خوام یه چیز عجیب و متفاوت پیدا کنم",
      },
      {
        value: "learning",
        label: "می‌خوام یه چیز تازه یاد بگیرم",
      },
      {
        value: "surprise",
        label: "نمی‌دونم، خودمم نمی‌دونم",
      },
    ],
  },
  {
    key: "time",
    title: "چقدر وقت داری؟",
    subtitle:
      "این یکی مهمه؛ چیزی پیشنهاد نمی‌کنیم که وسطش مجبور شی ولش کنی.",
    options: [
      {
        value: "30min",
        label: "تا نیم ساعت",
      },
      {
        value: "1hour",
        label: "حدود یه ساعت",
      },
      {
        value: "2_3hours",
        label: "دو سه ساعت",
      },
      {
        value: "half_day",
        label: "یه نصف روز",
      },
      {
        value: "a_lot",
        label: "مهم نیست، وقتم زیاده",
      },
    ],
  },
  {
    key: "energy",
    title: "چقدر حوصله داری؟",
    subtitle:
      "این مشخص می‌کنه چقدر باید ازت انرژی بگیریم!",
    options: [
      {
        value: "very_low",
        label: "اصلاً حوصله ندارم، یه چیز راحت می‌خوام",
      },
      {
        value: "low",
        label: "یه کم، خیلی کم",
      },
      {
        value: "medium",
        label: "بستگی داره، اگه بیارزه چرا که نه",
      },
      {
        value: "high",
        label: "حوصله دارم، بزن بریم",
      },
      {
        value: "very_high",
        label: "پایه‌ام، هرچی داری رو کن",
      },
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
    title: "الان چه حالی داری؟",
    subtitle: "همون چیزی رو بگو که واقعاً الان حس می‌کنی.",
    options,
  };
}

function getQuestions() {
  return [
    getRandomMoodQuestion(),
    ...staticQuestions,
  ];
}


/* =========================
   دیتابیس‌ها
========================= */

function getDatabases() {
  return {
    films: Array.isArray(films) ? films : [],
    foreignFilms: Array.isArray(foreignFilms)
      ? foreignFilms
      : [],
    shortFilms: Array.isArray(shortFilms)
      ? shortFilms
      : [],
    series: Array.isArray(series)
      ? series
      : [],
    podcasts: Array.isArray(podcasts)
      ? podcasts
      : [],
    books: Array.isArray(books)
      ? books
      : [],
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
    item?.type || ""
  ).toLowerCase();

  const origin = String(
    item?.origin || ""
  ).toLowerCase();

  if (
    type === "short_film" ||
    type === "short"
  ) {
    return "short_film";
  }

  if (
    type === "series" ||
    type === "tv_series"
  ) {
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

    default:
      return "پیشنهاد";
  }
}

function getDurationNumber(item) {
  const value =
    item?.duration ??
    item?.durationMinutes;

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
  const duration =
    getDurationNumber(item);

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


/* =========================
   کلید یکتای آیتم
========================= */

function getItemKey(item) {
  if (!item) {
    return "";
  }

  if (item.id !== undefined && item.id !== null) {
    return String(item.id);
  }

  return `${item.category || ""}-${item.title || ""}`;
}


/* =========================
   پیشنهادها
========================= */

function getRecommendations(
  answers,
  databases
) {
  return getCategorizedRecommendations(
    databases,
    answers
  );
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

          <span>
            {type}
          </span>

          {item?.year && (
            <span>
              {item.year}
            </span>
          )}

          {duration && (
            <span>
              {duration}
            </span>
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
              saving ||
              isSaved
            }
          >
            {saving
              ? "در حال ذخیره..."
              : isSaved
              ? "ذخیره شد ✓"
              : "بعداً می‌بینم"}
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
    : "پیشنهاد";

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

          <span>
            {type}
          </span>

          {item?.year && (
            <span>
              {item.year}
            </span>
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
              : "حذف از بعداً می‌بینم"}
          </button>

        </div>

      </div>

    </article>
  );
}


/* =========================
   استایل مشترک فیلدها
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
   فرم اطلاعات پروفایل
========================= */

function ProfileScreen({
  userId,
  onComplete,
}) {
  const [displayName, setDisplayName] =
    useState("");

  const [age, setAge] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [city, setCity] =
    useState("");

  const [wantsPhone, setWantsPhone] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {
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
        "اول بگو دوست داری به چه اسمی صدات بزنیم."
      );
      return;
    }

    if (
      !age ||
      !Number.isInteger(numericAge) ||
      numericAge < 1 ||
      numericAge > 120
    ) {
      setError(
        "سن رو درست وارد کن."
      );
      return;
    }

    if (!gender) {
      setError(
        "یکی از گزینه‌های سؤال سوم رو انتخاب کن."
      );
      return;
    }

    if (!cleanCity) {
      setError(
        "اسم شهرت رو وارد کن."
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
        "شماره موبایلت رو وارد کن."
      );
      return;
    }

    if (
      wantsPhone === "yes" &&
      !/^09\d{9}$/.test(cleanPhone)
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
            display_name: cleanName,
            age: numericAge,
            gender,
            city: cleanCity,
            phone:
              wantsPhone === "yes"
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
        err?.message ||
        "ذخیره اطلاعات انجام نشد. دوباره تلاش کن."
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
            H A M I N   A L A N
          </div>

          <h1>
            یکم از خودت
            <br />
            <strong>
              بهمون بگو.
            </strong>
          </h1>


          <form
            onSubmit={handleSubmit}
            style={{
              width: "min(100%, 420px)",
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
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
              placeholder="چقد عمر کردی؟"
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
                flexDirection: "column",
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
                    setGender("male")
                  }
                  style={{
                    padding: "13px 8px",
                    borderRadius: "12px",
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
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  داداش
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setGender("female")
                  }
                  style={{
                    padding: "13px 8px",
                    borderRadius: "12px",
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
                    cursor: "pointer",
                    fontSize: "14px",
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
                    padding: "13px 8px",
                    borderRadius: "12px",
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
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  دوست ندارم بگم
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
                flexDirection: "column",
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
                    setWantsPhone("yes")
                  }
                  style={{
                    padding: "13px",
                    borderRadius: "12px",
                    border:
                      wantsPhone === "yes"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      wantsPhone === "yes"
                        ? "#111"
                        : "#fff",
                    color:
                      wantsPhone === "yes"
                        ? "#fff"
                        : "#333",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  بله
                </button>


                <button
                  type="button"
                  onClick={() => {
                    setWantsPhone("no");
                    setPhone("");
                  }}
                  style={{
                    padding: "13px",
                    borderRadius: "12px",
                    border:
                      wantsPhone === "no"
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      wantsPhone === "no"
                        ? "#111"
                        : "#fff",
                    color:
                      wantsPhone === "no"
                        ? "#fff"
                        : "#333",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  نه
                </button>

              </div>

            </div>


            {wantsPhone === "yes" && (
              <input
                type="tel"
                inputMode="numeric"
                placeholder="شماره موبایل"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11)
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
                  color: "#b00020",
                  fontSize: "13px",
                  lineHeight: "1.8",
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
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading
                ? "یک لحظه..."
                : "بزن بریم"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}


/* =========================
   فرم احراز هویت
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

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail || !password) {
      setError(
        "ایمیل و رمز عبور را وارد کن."
      );
      return;
    }

    if (
      mode === "signup" &&
      password !== confirmPassword
    ) {
      setError(
        "رمزهای عبور یکسان نیستند."
      );
      return;
    }

    if (
      mode === "signup" &&
      password.length < 6
    ) {
      setError(
        "رمز عبور باید حداقل ۶ کاراکتر باشد."
      );
      return;
    }

    setLoading(true);

    try {

      if (mode === "signup") {

        const {
          data,
          error: signupError,
        } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

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
          "حساب ساخته شد. ایمیلت رو تأیید کن و بعد وارد شو."
        );

        setMode("login");

      } else {

        const {
          data,
          error: loginError,
        } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

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
        err?.message ||
        "مشکلی پیش آمد. دوباره تلاش کن."
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
            H A M I N   A L A N
          </div>

          <h1>
            {mode === "signup" ? (
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
              width: "min(100%, 420px)",
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
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
                mode === "signup"
                  ? "new-password"
                  : "current-password"
              }
              style={{
                ...inputStyle,
                direction: "ltr",
                textAlign: "left",
              }}
            />


            {mode === "signup" && (
              <input
                type="password"
                placeholder="تکرار رمز عبور"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
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
                  color: "#b00020",
                  fontSize: "13px",
                  lineHeight: "1.8",
                }}
              >
                {error}
              </div>
            )}


            {message && (
              <div
                style={{
                  color: "#555",
                  fontSize: "13px",
                  lineHeight: "1.8",
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
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading
                ? "یک لحظه..."
                : mode === "signup"
                ? "ساخت حساب"
                : "ورود"}
            </button>

          </form>


          <button
            type="button"
            onClick={() => {
              setMode(
                mode === "signup"
                  ? "login"
                  : "signup"
              );

              setError("");
              setMessage("");
            }}
            style={{
              marginTop: "20px",
              border: 0,
              background: "transparent",
              cursor: "pointer",
              fontSize: "13px",
              color: "#666",
            }}
          >
            {mode === "signup"
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

  const [profileUserId, setProfileUserId] =
    useState(null);

  const [profileChecking, setProfileChecking] =
    useState(false);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [recommendations, setRecommendations] =
    useState([]);

  const [questions, setQuestions] =
    useState(() =>
      getQuestions()
    );


  /* =========================
     ذخیره‌ها
  ========================= */

  const [savedItems, setSavedItems] =
    useState([]);

  const [savedItemsLoading, setSavedItemsLoading] =
    useState(false);

  const [savedScreen, setSavedScreen] =
    useState(false);

  const [savingItemKey, setSavingItemKey] =
    useState(null);

  const [changingItemKey, setChangingItemKey] =
    useState(null);

  const [removingSavedId, setRemovingSavedId] =
    useState(null);

  const [savedError, setSavedError] =
    useState("");


  const databases = useMemo(
    () => getDatabases(),
    []
  );


  /* =========================
     بررسی Session
  ========================= */

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

      if (data.session?.user?.id) {

        setProfileChecking(true);

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
              data.session.user.id
            )
            .maybeSingle();

        if (!mounted) {
          return;
        }

        setProfileChecking(false);

        if (
          error ||
          !profile ||
          !profile.display_name ||
          !profile.age ||
          !profile.gender ||
          !profile.city
        ) {

          setProfileUserId(
            data.session.user.id
          );

          setScreen(
            "profile"
          );

        } else {

          setScreen(
            "home"
          );

        }
      }
    }

    checkSession();


    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, currentSession) => {

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


  /* =========================
     بارگذاری ذخیره‌ها
  ========================= */

  async function loadSavedItems() {

    if (!session?.user?.id) {
      return;
    }

    setSavedItemsLoading(true);
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
        err?.message ||
        "ذخیره‌ها بارگذاری نشدند."
      );

    } finally {

      setSavedItemsLoading(false);

    }
  }


  useEffect(() => {

    if (session?.user?.id) {
      loadSavedItems();
    } else {
      setSavedItems([]);
    }

  }, [session?.user?.id]);


  /* =========================
     شروع پرسشنامه
  ========================= */

  function startQuestionnaire() {

    setSavedScreen(false);

    setQuestions(
      getQuestions()
    );

    setAnswers({});

    setRecommendations([]);

    setQuestionIndex(0);

    setScreen("questionnaire");
  }


  /* =========================
     انتخاب پاسخ
  ========================= */

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


    const results =
      getRecommendations(
        updatedAnswers,
        databases
      );

    setRecommendations(
      results
    );

    setScreen("results");
  }


  /* =========================
     برگشت
  ========================= */

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


  /* =========================
     شروع دوباره
  ========================= */

  function restart() {

    setSavedScreen(false);

    setAnswers({});

    setRecommendations([]);

    setQuestions(
      getQuestions()
    );

    setQuestionIndex(0);

    setScreen("home");
  }


  /* =========================
     ذخیره برای بعداً
  ========================= */

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


    setSavingItemKey(itemKey);
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
          item?.year !== undefined &&
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
        err?.message ||
        "ذخیره کردن انجام نشد."
      );

    } finally {

      setSavingItemKey(null);

    }
  }


  /* =========================
     حذف از ذخیره‌ها
  ========================= */

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
              item.id !== savedId
          )
      );

    } catch (err) {

      console.error(err);

      setSavedError(
        err?.message ||
        "حذف انجام نشد."
      );

    } finally {

      setRemovingSavedId(null);

    }
  }


  /* =========================
     پیشنهاد متفاوت
  ========================= */

  function showDifferentRecommendation(
    currentItem
  ) {

    if (!currentItem) {
      return;
    }

    const itemKey =
      getItemKey(currentItem);

    const category =
      currentItem.category ||
      getItemType(currentItem);

    if (!category) {
      return;
    }


    setChangingItemKey(
      itemKey
    );


    const databaseMap = {
      iran_film:
        databases.films,

      foreign_film:
        databases.foreignFilms,

      short_film:
        databases.shortFilms,

      series:
        databases.series,

      podcast:
        databases.podcasts,

      book:
        databases.books,

      instrumental_music:
        databases.instrumentalMusic,
    };


    const categoryDatabase =
      databaseMap[category] || [];


    const currentlyShown =
      recommendations
        .filter(
          (item) =>
            (item.category ||
              getItemType(item)) ===
            category
        )
        .map(
          (item) =>
            getItemKey(item)
        );


    const excludedKeys =
      new Set(
        currentlyShown
      );


    excludedKeys.add(
      itemKey
    );


    const availableItems =
      categoryDatabase.filter(
        (candidate) =>
          !excludedKeys.has(
            getItemKey(candidate)
          )
      );


    if (
      availableItems.length === 0
    ) {

      setSavedError(
        `برای بخش «${getCategoryTitle(
          category
        )}» پیشنهاد دیگری نداریم.`
      );

      setChangingItemKey(null);

      return;
    }


    const alternative =
      getCategorizedRecommendations(
        {
          films:
            category === "iran_film"
              ? availableItems
              : [],

          foreignFilms:
            category === "foreign_film"
              ? availableItems
              : [],

          shortFilms:
            category === "short_film"
              ? availableItems
              : [],

          series:
            category === "series"
              ? availableItems
              : [],

          podcasts:
            category === "podcast"
              ? availableItems
              : [],

          books:
            category === "book"
              ? availableItems
              : [],

          instrumentalMusic:
            category ===
            "instrumental_music"
              ? availableItems
              : [],
        },

        answers
      );


    const newItem =
      alternative?.[0];


    if (!newItem) {

      setSavedError(
        "فعلاً پیشنهاد دیگری برای این بخش نداریم."
      );

      setChangingItemKey(null);

      return;
    }


    const replacement = {
      ...newItem,
      category,
    };


    setRecommendations(
      (current) =>
        current.map(
          (item) =>
            item === currentItem
              ? replacement
              : item
        )
    );


    setChangingItemKey(null);
  }


  /* =========================
     صفحه ذخیره‌ها
  ========================= */

  function openSavedScreen() {
    setSavedScreen(true);
    setScreen("saved");
    setSavedError("");
  }


  function closeSavedScreen() {
    setSavedScreen(false);
    setScreen("home");
    setSavedError("");
  }


  /* =========================
     خروج
  ========================= */

  async function logout() {

    await supabase.auth.signOut();

    setSession(null);
    setScreen("home");
    setProfileUserId(null);
    setSavedItems([]);
    setSavedScreen(false);
  }


  const currentQuestion =
    questions[questionIndex];


  /* =========================
     در حال بررسی حساب
  ========================= */

  if (
    session === undefined ||
    profileChecking
  ) {

    return (
      <main className="app">

        <section
          className="hero"
          style={{
            minHeight: "100vh",
          }}
        >

          <div className="logo">
            همین الان
          </div>

          <p>
            یک لحظه...
          </p>

        </section>

      </main>
    );
  }


  /* =========================
     تکمیل پروفایل
  ========================= */

  if (
    screen === "profile" &&
    profileUserId
  ) {

    return (
      <ProfileScreen
        userId={profileUserId}
        onComplete={() => {

          if (session) {

            setScreen("home");

          } else {

            setAuthMode("login");
            setProfileUserId(null);
            setScreen("auth");

          }

        }}
      />
    );
  }


  /* =========================
     ورود / ثبت‌نام
  ========================= */

  if (!session) {

    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}

        onSuccess={() => {
          setScreen("home");
        }}

        onProfileNeeded={(userId) => {
          setProfileUserId(userId);
          setScreen("profile");
        }}
      />
    );
  }


  /* =========================
     صفحه ذخیره‌ها
  ========================= */

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

            <span className="question-label">
              برای بعداً
            </span>

            <h1>
              اینا رو نگه داشتی.
            </h1>

            <p>
              چیزهایی که گفتی بعداً
              سراغشون می‌ری، اینجان.
            </p>

          </div>


          {savedError && (
            <div
              style={{
                color: "#b00020",
                fontSize: "13px",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              {savedError}
            </div>
          )}


          {savedItemsLoading ? (

            <div className="empty-state">

              <h2>
                یک لحظه...
              </h2>

              <p>
                داریم چیزهایی که نگه داشتی
                رو پیدا می‌کنیم.
              </p>

            </div>

          ) : savedItems.length > 0 ? (

            <div className="recommendations-grid">

              {Object.entries(
                savedItems.reduce(
                  (groups, item) => {

                    const category =
                      item.category ||
                      item.item_type ||
                      "unknown";

                    if (
                      !groups[category]
                    ) {
                      groups[category] = [];
                    }

                    groups[category].push(
                      item
                    );

                    return groups;

                  },
                  {}
                )
              ).map(
                ([category, items]) => (

                  <section
                    className="recommendation-category"
                    key={category}
                  >

                    <h2 className="category-title">
                      {getCategoryTitle(
                        category
                      )}
                    </h2>


                    <div className="category-cards">

                      {items.map(
                        (item) => (

                          <SavedItemCard
                            key={item.id}
                            item={item}
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
                هنوز چیزی نگه نداشتی.
              </h2>

              <p>
                هر پیشنهادی که دوست داشتی
                ولی الان وقتش رو نداری،
                بزن «بعداً می‌بینم».
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


  /* =========================
     صفحه خانه
  ========================= */

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
                بعداً می‌بینم
              </span>

              {savedItems.length > 0 && (
                <span className="saved-count">
                  {savedItems.length}
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
              H A M I N   A L A N
            </div>

            <h1>
              نمی‌دونی
              <br />
              <strong>
                الان چیکار کنی؟
              </strong>
            </h1>

            <p>
              چند ساعت وقت داری، ایده‌ای نداری؟
              <br />
              بزن ببینیم چی بهت می‌چسبه.
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
            فیلم، سریال، کتاب، پادکست، موسیقی و
            چیزهایی که شاید خودت پیداشون نمی‌کردی.
          </div>

        </section>

      </main>
    );
  }


  /* =========================
     پرسشنامه
  ========================= */

  if (
    screen === "questionnaire"
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
              {questionIndex + 1}/
              {questions.length}
            </span>

          </header>


          <div className="question-content">

            <span className="question-label">
              ببینیم...
            </span>

            <h1>
              {currentQuestion.title}
            </h1>

            <p>
              {currentQuestion.subtitle}
            </p>


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
                      {option.label}
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


  /* =========================
     نتایج
  ========================= */

  const groupedRecommendations =
    recommendations.reduce(
      (groups, item) => {

        const category =
          item.category ||
          "unknown";

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(
          item
        );

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
                بعداً می‌بینم
              </span>

              {savedItems.length > 0 && (
                <span className="saved-count">
                  {savedItems.length}
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

          <span className="question-label">
            پیداش کردیم
          </span>

          <h1>
            این‌ها شاید بهت بچسبن.
          </h1>

          <p>
            بر اساس حال و حوصله‌ای که گفتی،
            این‌ها رو برات کنار گذاشتیم.
          </p>

        </div>


        {savedError && (
          <div
            style={{
              color: "#b00020",
              fontSize: "13px",
              lineHeight: "1.8",
              marginBottom: "20px",
            }}
          >
            {savedError}
          </div>
        )}


        {recommendations.length > 0 ? (

          <div className="recommendations-grid">

            {Object.entries(
              groupedRecommendations
            ).map(
              ([category, items]) => (

                <section
                  className="recommendation-category"
                  key={category}
                >

                  <h2 className="category-title">
                    {getCategoryTitle(
                      category
                    )}
                  </h2>


                  <div className="category-cards">

                    {items.map(
                      (item, index) => {

                        const itemKey =
                          getItemKey(item);

                        const isSaved =
                          savedItems.some(
                            (saved) =>
                              saved.item_key ===
                              itemKey
                          );

                        return (
                          <RecommendationCard
                            key={
                              `${itemKey}-${index}`
                            }
                            item={item}
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
              به‌زودی اینجا پر از چیزهای
              دیدنی، شنیدنی و خواندنی می‌شود.
            </p>

          </div>

        )}


        <button
          className="again-button"
          onClick={
            startQuestionnaire
          }
        >
          دوباره بپرس ازم
        </button>

      </section>

    </main>
  );
}


export default App;