// src/data/recommend.js

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function getItemType(item) {
  return normalizeText(
    item?.type ||
      item?.category ||
      item?.kind ||
      item?.format
  );
}

function getDurationNumber(item) {
  const value =
    item?.duration ??
    item?.durationMinutes ??
    item?.minutes ??
    item?.length;

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  return 0;
}

function getMoodValues(item) {
  const values = [
    ...(Array.isArray(item?.moods) ? item.moods : []),
    ...(Array.isArray(item?.mood) ? item.mood : []),
    ...(item?.mood && !Array.isArray(item.mood)
      ? [item.mood]
      : []),
    ...(Array.isArray(item?.tags) ? item.tags : []),
  ];

  return values
    .map(normalizeText)
    .filter(Boolean);
}

function getItemText(item) {
  return normalizeText(
    [
      item?.title,
      item?.description,
      item?.summary,
      item?.genre,
      item?.genres,
      item?.author,
      item?.director,
      item?.creator,
      item?.artist,
      item?.host,
      item?.tags,
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
  );
}

function getEnergyValues(item) {
  const values = [
    ...(Array.isArray(item?.energy)
      ? item.energy
      : item?.energy
        ? [item.energy]
        : []),

    ...(Array.isArray(item?.energyLevels)
      ? item.energyLevels
      : []),

    ...(Array.isArray(item?.effort)
      ? item.effort
      : item?.effort
        ? [item.effort]
        : []),
  ];

  return values
    .map(normalizeText)
    .filter(Boolean);
}

function getGoalValues(item) {
  const values = [
    ...(Array.isArray(item?.goals)
      ? item.goals
      : item?.goals
        ? [item.goals]
        : []),

    ...(Array.isArray(item?.goal)
      ? item.goal
      : item?.goal
        ? [item.goal]
        : []),

    ...(Array.isArray(item?.purposes)
      ? item.purposes
      : item?.purposes
        ? [item.purposes]
        : []),
  ];

  return values
    .map(normalizeText)
    .filter(Boolean);
}

function getGenreValues(item) {
  const values = [
    ...(Array.isArray(item?.genres)
      ? item.genres
      : item?.genres
        ? [item.genres]
        : []),

    ...(Array.isArray(item?.genre)
      ? item.genre
      : item?.genre
        ? [item.genre]
        : []),
  ];

  return values
    .map(normalizeText)
    .filter(Boolean);
}

function getItemKey(item) {
  if (!item) {
    return "";
  }

  if (item.id !== undefined && item.id !== null) {
    return String(item.id);
  }

  return `${item.category || ""}-${item.title || ""}`
    .toLowerCase()
    .trim();
}

/*
 * سقف زمانی واقعی
 *
 * توجه:
 * این مقادیر بر اساس پاسخ‌های questionnaire در App.jsx
 * تنظیم شده‌اند.
 */
const TIME_LIMITS = {
  "30min": 30,
  "1hour": 60,
  "2_3hours": 180,
  half_day: 720,
  a_lot: Infinity,
};

/*
 * دسته‌هایی که در حال حاضر واقعاً در دیتابیس اپ داریم.
 *
 * بعداً می‌توان دسته‌هایی مثل:
 * game
 * poetry
 * standup
 * music_video
 *
 * را بدون تغییر معماری اضافه کرد.
 */
const CATEGORY_DATABASES = [
  {
    key: "iran_film",
    databaseKey: "films",
  },
  {
    key: "foreign_film",
    databaseKey: "foreignFilms",
  },
  {
    key: "short_film",
    databaseKey: "shortFilms",
  },
  {
    key: "series",
    databaseKey: "series",
  },
  {
    key: "podcast",
    databaseKey: "podcasts",
  },
  {
    key: "book",
    databaseKey: "books",
  },
  {
    key: "instrumental_music",
    databaseKey: "instrumentalMusic",
  },
];

/*
 * دسته‌های مجاز بر اساس زمانی که کاربر دارد.
 *
 * تا نیم ساعت:
 * فیلم بلند و سریال ممنوع.
 *
 * حدود یک ساعت:
 * فیلم بلند همچنان وارد نمی‌شود.
 *
 * دو سه ساعت به بالا:
 * همه دسته‌های فعلی مجازند.
 */
function getAllowedCategories(time) {
  switch (time) {
    case "30min":
      return [
        "short_film",
        "podcast",
        "instrumental_music",
      ];

    case "1hour":
      return [
        "short_film",
        "podcast",
        "instrumental_music",
        "series",
        "book",
      ];

    default:
      return [
        "iran_film",
        "foreign_film",
        "short_film",
        "series",
        "podcast",
        "book",
        "instrumental_music",
      ];
  }
}

/*
 * انرژی پایین باید روی طول و میزان درگیری اثر بگذارد.
 *
 * این محدودیت عمداً محافظه‌کارانه است:
 * اگر دیتاست برای یک آیتم energy مشخص نکرده باشد،
 * فقط محدودیت زمانی اعمال می‌شود.
 */
function getEnergyDurationLimit(energy) {
  switch (energy) {
    case "very_low":
      return 30;

    case "low":
      return 90;

    default:
      return Infinity;
  }
}

/*
 * بررسی سن.
 *
 * فقط وقتی فیلد صریحی مثل minAge/maxAge در دیتاست وجود داشته باشد
 * از آن استفاده می‌کنیم.
 *
 * از روی اسم فیلم یا کتاب حدس نمی‌زنیم که برای چه سنی مناسب است.
 */
function isAgeEligible(item, age) {
  const numericAge = Number(age);

  if (!Number.isFinite(numericAge)) {
    return true;
  }

  const minAge = Number(
    item?.minAge ??
      item?.minimumAge ??
      item?.ageMin
  );

  const maxAge = Number(
    item?.maxAge ??
      item?.maximumAge ??
      item?.ageMax
  );

  if (
    Number.isFinite(minAge) &&
    numericAge < minAge
  ) {
    return false;
  }

  if (
    Number.isFinite(maxAge) &&
    numericAge > maxAge
  ) {
    return false;
  }

  return true;
}

/*
 * فیلتر اصلی هر آیتم
 */
function isItemEligible(
  item,
  category,
  answers = {}
) {
  if (!item) {
    return false;
  }

  const time = normalizeText(
    answers?.time ||
      answers?.availableTime
  );

  const energy = normalizeText(
    answers?.energy ||
      answers?.energyLevel
  );

  const age = answers?.age;

  const allowedCategories =
    getAllowedCategories(time);

  if (
    allowedCategories.length &&
    !allowedCategories.includes(category)
  ) {
    return false;
  }

  if (!isAgeEligible(item, age)) {
    return false;
  }

  const duration = getDurationNumber(item);

  /*
   * محدودیت واقعی زمان
   */
  const timeLimit =
    TIME_LIMITS[time] ?? Infinity;

  if (
    duration > 0 &&
    Number.isFinite(timeLimit) &&
    duration > timeLimit
  ) {
    return false;
  }

  /*
   * محدودیت انرژی
   *
   * فقط وقتی duration شناخته شده باشد.
   */
  const energyLimit =
    getEnergyDurationLimit(energy);

  if (
    duration > 0 &&
    Number.isFinite(energyLimit) &&
    duration > energyLimit
  ) {
    return false;
  }

  return true;
}

/*
 * استخراج مقدار انتخاب‌شده توسط کاربر
 */
function getSelectedGoal(answers) {
  return normalizeText(
    answers?.goal ||
      answers?.purpose ||
      answers?.objective
  );
}

function getSelectedMood(answers) {
  return normalizeText(
    answers?.mood ||
      answers?.currentMood ||
      answers?.feeling
  );
}

function getSelectedEnergy(answers) {
  return normalizeText(
    answers?.energy ||
      answers?.energyLevel
  );
}

function getSelectedGenre(answers) {
  return normalizeText(
    answers?.genre ||
      answers?.genrePreference
  );
}

/*
 * امتیازدهی
 */
function scoreItem(
  item,
  answers = {},
  category = ""
) {
  let score = 0;

  const itemMoods = getMoodValues(item);
  const itemEnergies = getEnergyValues(item);
  const itemGoals = getGoalValues(item);
  const itemGenres = getGenreValues(item);
  const itemText = getItemText(item);

  /*
   * حال و هوا
   */
  const selectedMood =
    getSelectedMood(answers);

  if (selectedMood) {
    if (itemMoods.includes(selectedMood)) {
      score += 14;
    }

    if (itemText.includes(selectedMood)) {
      score += 3;
    }
  }

  /*
   * حوصله / انرژی
   */
  const selectedEnergy =
    getSelectedEnergy(answers);

  if (selectedEnergy) {
    if (
      itemEnergies.includes(selectedEnergy)
    ) {
      score += 12;
    }

    if (itemText.includes(selectedEnergy)) {
      score += 2;
    }

    /*
     * اگر آیتم انرژی مشخص نداشته باشد،
     * بر اساس انرژی کاربر کمی رفتار می‌کنیم.
     *
     * حوصله کم:
     * محتوای کوتاه‌تر امتیاز بیشتری می‌گیرد.
     */
    const duration =
      getDurationNumber(item);

    if (duration > 0) {
      if (
        selectedEnergy === "very_low"
      ) {
        if (duration <= 20) {
          score += 8;
        } else if (duration <= 30) {
          score += 4;
        } else {
          score -= 4;
        }
      }

      if (selectedEnergy === "low") {
        if (duration <= 30) {
          score += 6;
        } else if (duration <= 60) {
          score += 2;
        }
      }

      if (
        selectedEnergy === "high" ||
        selectedEnergy === "very_high"
      ) {
        if (duration >= 60) {
          score += 3;
        }
      }
    }
  }

  /*
   * هدف
   *
   * این بخش قبلاً تقریباً کاملاً غایب بود.
   */
  const selectedGoal =
    getSelectedGoal(answers);

  if (selectedGoal) {
    if (
      itemGoals.includes(selectedGoal)
    ) {
      score += 14;
    }

    if (
      itemText.includes(selectedGoal)
    ) {
      score += 3;
    }
  }

  /*
   * زمان
   */
  const availableTime = normalizeText(
    answers?.time ||
      answers?.availableTime
  );

  const timeLimit =
    TIME_LIMITS[availableTime] ??
    Number(
      answers?.availableMinutes ||
        0
    );

  const itemDuration =
    getDurationNumber(item);

  if (
    itemDuration > 0 &&
    Number.isFinite(timeLimit) &&
    timeLimit > 0
  ) {
    if (itemDuration <= timeLimit) {
      /*
       * هرچه نسبت زمان محتوا به زمان آزاد
       * منطقی‌تر باشد، کمی امتیاز بیشتر.
       */
      const ratio =
        itemDuration / timeLimit;

      score += 8;

      if (ratio <= 0.5) {
        score += 2;
      } else if (ratio <= 0.8) {
        score += 4;
      } else {
        score += 2;
      }
    }
  }

  /*
   * نوع محتوا
   */
  const preferredType =
    normalizeText(
      answers?.contentType ||
        answers?.type ||
        answers?.content
    );

  if (preferredType) {
    const type =
      getItemType(item);

    if (type === preferredType) {
      score += 10;
    }

    if (
      itemText.includes(preferredType)
    ) {
      score += 2;
    }
  }

  /*
   * ژانر
   */
  const selectedGenre =
    getSelectedGenre(answers);

  if (selectedGenre) {
    if (
      itemGenres.includes(selectedGenre)
    ) {
      score += 8;
    }

    if (
      itemText.includes(selectedGenre)
    ) {
      score += 2;
    }
  }

  /*
   * امتیاز پایه کیفیت
   */
  if (item?.rating !== undefined) {
    const rating =
      Number(item.rating);

    if (
      Number.isFinite(rating)
    ) {
      score += Math.min(rating, 10) * 0.5;
    }
  }

  /*
   * کمی ترجیح دسته‌ای برای خروجی متعادل
   */
  if (category) {
    score += 0.01;
  }

  return score;
}

/*
 * مرتب‌سازی یک دیتابیس
 */
function scoreAndSort(
  database = [],
  answers = {},
  category = "",
  excludedKeys = new Set()
) {
  if (!Array.isArray(database)) {
    return [];
  }

  return database
    .filter(Boolean)
    .filter((item) => {
      const key = getItemKey(item);

      if (
        key &&
        excludedKeys.has(key)
      ) {
        return false;
      }

      return isItemEligible(
        item,
        category,
        answers
      );
    })
    .map((item, index) => ({
      ...item,

      _recommendationScore:
        scoreItem(
          item,
          answers,
          category
        ) +

        /*
         * مقدار بسیار کوچک برای جلوگیری
         * از مساوی‌شدن کامل آیتم‌ها.
         *
         * برخلاف نسخه قبلی، ترتیب دیتابیس
         * عامل اصلی انتخاب نیست.
         */
        index * 0.000001,
    }))
    .sort(
      (a, b) =>
        b._recommendationScore -
        a._recommendationScore
    );
}

/*
 * پیشنهاد از یک دیتابیس
 */
export function getRecommendations(
  database,
  answers,
  limit = 1,
  options = {}
) {
  const excludedKeys =
    options?.excludedKeys instanceof Set
      ? options.excludedKeys
      : new Set(
          Array.isArray(
            options?.excludedKeys
          )
            ? options.excludedKeys
            : []
        );

  const category =
    options?.category || "";

  const sorted =
    scoreAndSort(
      database,
      answers,
      category,
      excludedKeys
    );

  return sorted
    .slice(0, limit)
    .map(
      ({
        _recommendationScore,
        ...item
      }) => item
    );
}

/*
 * فیلم ایرانی
 */
export function getFilmRecommendations(
  films,
  answers,
  limit = 1,
  options = {}
) {
  return getRecommendations(
    films,
    answers,
    limit,
    {
      ...options,
      category:
        options?.category ||
        "iran_film",
    }
  );
}

/*
 * دیتابیس دلخواه
 */
export function getRecommendationsForDatabase(
  database,
  answers,
  limit = 1,
  options = {}
) {
  return getRecommendations(
    database,
    answers,
    limit,
    options
  );
}

/*
 * پیشنهاد بر اساس نوع محتوا
 */
export function getRecommendationsByType(
  databases = {},
  type,
  answers = {},
  limit = 1,
  options = {}
) {
  const typeMap = {
    iran_film:
      databases.films || [],

    foreign_film:
      databases.foreignFilms || [],

    short_film:
      databases.shortFilms || [],

    series:
      databases.series || [],

    podcast:
      databases.podcasts || [],

    book:
      databases.books || [],

    instrumental_music:
      databases.instrumentalMusic || [],
  };

  const database =
    typeMap[type] || [];

  return getRecommendations(
    database,
    answers,
    limit,
    {
      ...options,
      category: type,
    }
  );
}

/*
 * پیشنهادهای دسته‌بندی‌شده
 *
 * قانون مهم:
 * از هر دسته فقط یک آیتم برمی‌گردد.
 *
 * excludedKeys:
 * آیتم‌هایی که قبلاً در همین session نمایش داده شده‌اند
 * یا کاربر ذخیره کرده است.
 */
export function getCategorizedRecommendations(
  databases = {},
  answers = {},
  options = {}
) {
  const allResults = [];

  const excludedKeys =
    options?.excludedKeys instanceof Set
      ? options.excludedKeys
      : new Set(
          Array.isArray(
            options?.excludedKeys
          )
            ? options.excludedKeys
            : []
        );

  const categories =
    CATEGORY_DATABASES;

  for (const category of categories) {
    const items =
      getRecommendations(
        databases?.[
          category.databaseKey
        ] || [],
        answers,
        1,
        {
          category:
            category.key,
          excludedKeys,
        }
      );

    /*
     * فقط یک آیتم از هر دسته
     */
    const item = items[0];

    if (!item) {
      continue;
    }

    allResults.push({
      ...item,
      category:
        category.key,
    });
  }

  return allResults;
}

/*
 * انتخاب یک پیشنهاد جایگزین از یک دسته
 *
 * برای «یه چیز دیگه بگو» استفاده می‌شود.
 */
export function getAlternativeRecommendation(
  databases = {},
  category,
  answers = {},
  options = {}
) {
  const typeMap = {
    iran_film: "films",
    foreign_film: "foreignFilms",
    short_film: "shortFilms",
    series: "series",
    podcast: "podcasts",
    book: "books",
    instrumental_music:
      "instrumentalMusic",
  };

  const databaseKey =
    typeMap[category];

  if (!databaseKey) {
    return null;
  }

  const excludedKeys =
    options?.excludedKeys instanceof Set
      ? options.excludedKeys
      : new Set(
          Array.isArray(
            options?.excludedKeys
          )
            ? options.excludedKeys
            : []
        );

  const results =
    getRecommendations(
      databases?.[databaseKey] || [],
      answers,
      1,
      {
        category,
        excludedKeys,
      }
    );

  return results[0] || null;
}