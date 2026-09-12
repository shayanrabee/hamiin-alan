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
    ...(item?.mood && !Array.isArray(item.mood) ? [item.mood] : []),
    ...(Array.isArray(item?.tags) ? item.tags : []),
  ];

  return values.map(normalizeText);
}

function getItemText(item) {
  return normalizeText(
    [
      item?.title,
      item?.description,
      item?.summary,
      item?.genre,
      item?.author,
      item?.director,
      item?.creator,
      item?.tags,
    ]
      .flat()
      .filter(Boolean)
      .join(" ")
  );
}

function scoreItem(item, answers = {}) {
  let score = 0;

  const itemMoods = getMoodValues(item);
  const itemText = getItemText(item);

  /*
   * حال‌وهوای انتخاب‌شده
   */
  const selectedMood = normalizeText(
    answers?.mood ||
      answers?.currentMood ||
      answers?.feeling
  );

  if (selectedMood) {
    if (itemMoods.includes(selectedMood)) {
      score += 10;
    }

    if (itemText.includes(selectedMood)) {
      score += 3;
    }
  }

  /*
   * انرژی
   */
  const energy = normalizeText(
    answers?.energy ||
      answers?.energyLevel
  );

  if (energy) {
    const energyValues = Array.isArray(item?.energy)
      ? item.energy.map(normalizeText)
      : [normalizeText(item?.energy)];

    if (energyValues.includes(energy)) {
      score += 7;
    }

    if (itemText.includes(energy)) {
      score += 2;
    }
  }

  /*
   * مدت زمانی که کاربر دارد
   */
  const availableTime = Number(
    answers?.availableTime ||
      answers?.time ||
      answers?.duration ||
      0
  );

  const itemDuration = getDurationNumber(item);

  if (availableTime && itemDuration) {
    if (itemDuration <= availableTime) {
      score += 8;
    } else if (itemDuration <= availableTime * 1.25) {
      score += 3;
    } else {
      score -= 5;
    }
  }

  /*
   * نوع محتوا
   */
  const preferredType = normalizeText(
    answers?.contentType ||
      answers?.type ||
      answers?.content
  );

  if (preferredType) {
    const type = getItemType(item);

    if (type === preferredType) {
      score += 8;
    }

    if (itemText.includes(preferredType)) {
      score += 2;
    }
  }

  /*
   * ژانر
   */
  const preferredGenre = normalizeText(
    answers?.genre ||
      answers?.genrePreference
  );

  if (preferredGenre) {
    const genres = Array.isArray(item?.genres)
      ? item.genres.map(normalizeText)
      : [
          normalizeText(item?.genre),
          normalizeText(item?.genres),
        ].filter(Boolean);

    if (genres.includes(preferredGenre)) {
      score += 7;
    }

    if (itemText.includes(preferredGenre)) {
      score += 2;
    }
  }

  /*
   * امتیاز پایه برای اینکه نتیجه کاملاً تصادفی نباشد
   */
  if (item?.rating) {
    const rating = Number(item.rating);

    if (!Number.isNaN(rating)) {
      score += Math.min(rating, 10) * 0.5;
    }
  }

  return score;
}

function scoreAndSort(database = [], answers = {}) {
  if (!Array.isArray(database)) {
    return [];
  }

  return database
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      _recommendationScore:
        scoreItem(item, answers) + index * 0.000001,
    }))
    .sort(
      (a, b) =>
        b._recommendationScore -
        a._recommendationScore
    );
}

/*
 * گرفتن پیشنهاد از یک دیتابیس
 */
export function getRecommendations(
  database,
  answers,
  limit = 2
) {
  const sorted = scoreAndSort(database, answers);

  return sorted
    .slice(0, limit)
    .map(({ _recommendationScore, ...item }) => item);
}

/*
 * پیشنهاد فیلم ایرانی
 */
export function getFilmRecommendations(
  films,
  answers,
  limit = 2
) {
  return getRecommendations(
    films,
    answers,
    limit
  );
}

/*
 * پیشنهاد از هر دیتابیس دلخواه
 */
export function getRecommendationsForDatabase(
  database,
  answers,
  limit = 2
) {
  return getRecommendations(
    database,
    answers,
    limit
  );
}

/*
 * پیشنهاد بر اساس نوع محتوا
 */
export function getRecommendationsByType(
  databases = {},
  type,
  answers = {},
  limit = 2
) {
  const typeMap = {
    iran_film: databases.films || [],
    foreign_film: databases.foreignFilms || [],
    short_film: databases.shortFilms || [],
    series: databases.series || [],
    podcast: databases.podcasts || [],
    book: databases.books || [],
    instrumental_music:
      databases.instrumentalMusic || [],
  };

  const database = typeMap[type] || [];

  return getRecommendations(
    database,
    answers,
    limit
  );
}

/*
 * پیشنهادهای دسته‌بندی‌شده برای صفحه نتایج
 *
 * نکته مهم:
 * خروجی این تابع باید یک آرایه تخت از خود آیتم‌ها باشد،
 * نه آرایه‌ای از آبجکت‌هایی که داخلشان items وجود دارد.
 *
 * App.jsx بعداً خودش نتایج را بر اساس category گروه‌بندی می‌کند.
 */
export function getCategorizedRecommendations(
  databases,
  answers
) {
  const allResults = [];

  const categories = [
    {
      key: "iran_film",
      data: databases?.films || [],
    },
    {
      key: "foreign_film",
      data: databases?.foreignFilms || [],
    },
    {
      key: "short_film",
      data: databases?.shortFilms || [],
    },
    {
      key: "series",
      data: databases?.series || [],
    },
    {
      key: "podcast",
      data: databases?.podcasts || [],
    },
    {
      key: "book",
      data: databases?.books || [],
    },
    {
      key: "instrumental_music",
      data:
        databases?.instrumentalMusic || [],
    },
  ];

  for (const category of categories) {
    const items = getRecommendations(
      category.data,
      answers,
      2
    );

    for (const item of items) {
      allResults.push({
        ...item,
        category: category.key,
      });
    }
  }

  return allResults;
}