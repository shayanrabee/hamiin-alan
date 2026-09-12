const shortFilms = [
  {
    id: "short-001",
    title: "The Present",
    director: "Jacob Frey",
    year: 2014,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "emotional", "uplifting"],
    goals: ["feel_better", "discovery"],
    energy: "low",
    image: ""
  },

  {
    id: "short-002",
    title: "For the Birds",
    director: "Ralph Eggleston",
    year: 2000,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["funny", "fun", "uplifting"],
    goals: ["fun", "feel_better"],
    energy: "low",
    image: ""
  },

  {
    id: "short-003",
    title: "Lights Out",
    director: "David F. Sandberg",
    year: 2013,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["dark", "tense", "strange"],
    goals: ["excitement", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-004",
    title: "In a Heartbeat",
    director: "Beth David",
    year: 2017,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "emotional", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-005",
    title: "Geri's Game",
    director: "Jan Pinkava",
    year: 1997,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["funny", "fun", "thoughtful"],
    goals: ["fun", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-006",
    title: "Negative Space",
    director: "Max Porter & Ru Kuwahata",
    year: 2017,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["emotional", "melancholic", "thoughtful"],
    goals: ["discovery", "calm"],
    energy: "low",
    image: ""
  },

  {
    id: "short-007",
    title: "Piper",
    director: "Alan Barillaro",
    year: 2016,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["uplifting", "warm", "fun"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-008",
    title: "Feast",
    director: "Patrick Osborne",
    year: 2014,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "funny", "emotional", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-009",
    title: "Day & Night",
    director: "Teddy Newton",
    year: 2010,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["fun", "warm", "uplifting", "thoughtful"],
    goals: ["fun", "discovery"],
    energy: "low",
    image: ""
  },

  {
    id: "short-010",
    title: "Paperman",
    director: "John Kahrs",
    year: 2012,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["romantic", "warm", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-011",
    title: "Hair Love",
    director: "Matthew A. Cherry",
    year: 2019,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "emotional", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-012",
    title: "Lou",
    director: "Dave Mullins",
    year: 2017,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["funny", "warm", "emotional", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-013",
    title: "Kitbull",
    director: "Rosana Sullivan",
    year: 2019,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "emotional", "uplifting"],
    goals: ["feel_better", "discovery"],
    energy: "low",
    image: ""
  },

  {
    id: "short-014",
    title: "Father and Daughter",
    director: "Michael Dudok de Wit",
    year: 2000,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["emotional", "melancholic", "calm", "thoughtful"],
    goals: ["calm", "discovery"],
    energy: "low",
    image: ""
  },

  {
    id: "short-015",
    title: "One Small Step",
    director: "Andrew Chesworth & Bobby Pontillas",
    year: 2018,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["emotional", "inspiring", "uplifting"],
    goals: ["feel_better", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-016",
    title: "Bao",
    director: "Domee Shi",
    year: 2018,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "emotional", "funny"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-017",
    title: "Mr. Hublot",
    director: "Laurent Witz & Alexandre Espigares",
    year: 2013,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["strange", "warm", "thoughtful"],
    goals: ["discovery", "calm"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-018",
    title: "The House of Small Cubes",
    director: "Kunio Katō",
    year: 2008,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["melancholic", "emotional", "thoughtful", "calm"],
    goals: ["calm", "discovery"],
    energy: "low",
    image: ""
  },

  {
    id: "short-019",
    title: "Stutterer",
    director: "Benjamin Cleary",
    year: 2015,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "warm", "thoughtful", "uplifting"],
    goals: ["feel_better", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-020",
    title: "The Most Beautiful Thing",
    director: "Cameron Sawyer",
    year: 2012,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["warm", "romantic", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-021",
    title: "Memorable",
    director: "Bruno Collet",
    year: 2019,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["strange", "emotional", "thoughtful", "melancholic"],
    goals: ["discovery", "learning"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-022",
    title: "Room 8",
    director: "James W. Griffiths",
    year: 2013,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["strange", "tense", "thoughtful"],
    goals: ["excitement", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-023",
    title: "The Fantastic Flying Books of Mr. Morris Lessmore",
    director: "William Joyce & Brandon Oldenburg",
    year: 2011,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["warm", "emotional", "inspiring", "uplifting"],
    goals: ["feel_better", "discovery", "learning"],
    energy: "low",
    image: ""
  },

  {
    id: "short-024",
    title: "Animal",
    director: "Bahram Ark",
    year: 2017,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["strange", "dark", "thoughtful", "tense"],
    goals: ["excitement", "discovery"],
    energy: "high",
    image: ""
  },

  {
    id: "short-025",
    title: "Un Chien Andalou",
    director: "Luis Buñuel & Salvador Dalí",
    year: 1929,
    type: "short_film",
    origin: "foreign",
    format: "experimental",
    moods: ["strange", "dark", "thoughtful"],
    goals: ["discovery", "excitement"],
    energy: "high",
    image: ""
  },

  {
    id: "short-026",
    title: "Nefta Football Club",
    director: "Yves Piat",
    year: 2018,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["fun", "strange", "dark", "tense"],
    goals: ["fun", "excitement", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-027",
    title: "Fauve",
    director: "Jérémy Comte",
    year: 2018,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["tense", "dark", "thoughtful"],
    goals: ["excitement", "discovery"],
    energy: "high",
    image: ""
  },

  {
    id: "short-028",
    title: "Retouch",
    director: "Kaveh Mazaheri",
    year: 2017,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["dark", "tense", "thoughtful", "strange"],
    goals: ["excitement", "discovery"],
    energy: "high",
    image: ""
  },

  {
    id: "short-029",
    title: "The Silent Child",
    director: "Chris Overton",
    year: 2017,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "thoughtful", "warm", "melancholic"],
    goals: ["discovery", "feel_better"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-030",
    title: "The Neighbors' Window",
    director: "Marshall Curry",
    year: 2019,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "thoughtful", "melancholic"],
    goals: ["discovery", "learning"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-031",
    title: "The Phone Call",
    director: "Mat Kirkby",
    year: 2013,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "tense", "thoughtful"],
    goals: ["discovery", "excitement"],
    energy: "high",
    image: ""
  },

  {
    id: "short-032",
    title: "Helium",
    director: "Anders Walter",
    year: 2013,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "warm", "melancholic", "inspiring"],
    goals: ["feel_better", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-033",
    title: "Saria",
    director: "Bryan Buckley",
    year: 2019,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["dark", "tense", "emotional", "thoughtful"],
    goals: ["discovery", "learning"],
    energy: "high",
    image: ""
  },

  {
    id: "short-034",
    title: "Sing",
    director: "Kristóf Deák",
    year: 2016,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["uplifting", "emotional", "inspiring"],
    goals: ["feel_better", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-035",
    title: "La Jetée",
    director: "Chris Marker",
    year: 1962,
    type: "short_film",
    origin: "foreign",
    format: "experimental",
    moods: ["melancholic", "thoughtful", "strange", "dark"],
    goals: ["discovery", "learning"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-036",
    title: "The Shore",
    director: "Terry George & Oorlagh George",
    year: 2011,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "warm", "melancholic", "uplifting"],
    goals: ["feel_better", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-037",
    title: "Wallace & Gromit: The Wrong Trousers",
    director: "Nick Park",
    year: 1993,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["funny", "fun", "tense", "uplifting"],
    goals: ["fun", "excitement"],
    energy: "high",
    image: ""
  },

  {
    id: "short-038",
    title: "Wallace & Gromit: A Grand Day Out",
    director: "Nick Park",
    year: 1989,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["funny", "fun", "strange", "uplifting"],
    goals: ["fun", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-039",
    title: "Death of a Shadow",
    director: "Tom Van Avermaet",
    year: 2012,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["dark", "strange", "thoughtful", "melancholic"],
    goals: ["discovery", "excitement"],
    energy: "high",
    image: ""
  },

  {
    id: "short-040",
    title: "Meshes of the Afternoon",
    director: "Maya Deren & Alexander Hammid",
    year: 1943,
    type: "short_film",
    origin: "foreign",
    format: "experimental",
    moods: ["strange", "dark", "thoughtful", "tense"],
    goals: ["discovery", "learning"],
    energy: "high",
    image: ""
  },

  {
    id: "short-041",
    title: "A Trip to the Moon",
    director: "Georges Méliès",
    year: 1902,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["fun", "strange", "uplifting", "playful"],
    goals: ["fun", "discovery", "learning"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-042",
    title: "The Employment",
    director: "Santiago 'Bou' Grasso",
    year: 2008,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["dark", "thoughtful", "strange"],
    goals: ["discovery", "learning"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-043",
    title: "Partly Cloudy",
    director: "Peter Sohn",
    year: 2009,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["funny", "warm", "emotional", "uplifting"],
    goals: ["feel_better", "fun"],
    energy: "low",
    image: ""
  },

  {
    id: "short-044",
    title: "Validation",
    director: "Kurt Kuenne",
    year: 2007,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["funny", "uplifting", "warm", "inspiring"],
    goals: ["feel_better", "fun"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-045",
    title: "Head Over Heels",
    director: "Timothy Reckart",
    year: 2012,
    type: "short_film",
    origin: "foreign",
    format: "animation",
    moods: ["emotional", "thoughtful", "melancholic", "warm"],
    goals: ["discovery", "feel_better"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-046",
    title: "73 Cows",
    director: "Alex Lockwood",
    year: 2018,
    type: "short_film",
    origin: "foreign",
    format: "documentary",
    moods: ["inspiring", "thoughtful", "uplifting"],
    goals: ["learning", "discovery"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-047",
    title: "Skin",
    director: "Guy Nattiv",
    year: 2018,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["dark", "tense", "thoughtful"],
    goals: ["excitement", "discovery", "learning"],
    energy: "high",
    image: ""
  },

  {
    id: "short-048",
    title: "The Nature of Daylight",
    director: "Unknown",
    year: 2016,
    type: "short_film",
    origin: "foreign",
    format: "experimental",
    moods: ["calm", "melancholic", "emotional"],
    goals: ["calm", "discovery"],
    energy: "low",
    image: ""
  },

  {
    id: "short-049",
    title: "My Wife's Relations",
    director: "Buster Keaton",
    year: 1922,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["funny", "fun", "uplifting"],
    goals: ["fun", "feel_better"],
    energy: "medium",
    image: ""
  },

  {
    id: "short-050",
    title: "The Silence",
    director: "Ali Asgari",
    year: 2016,
    type: "short_film",
    origin: "foreign",
    format: "live_action",
    moods: ["emotional", "thoughtful", "melancholic"],
    goals: ["discovery", "learning"],
    energy: "medium",
    image: ""
  }
];

export default shortFilms;