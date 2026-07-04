// High-fidelity fallback media data representing standard popular movies, TV shows, cast, and trailers.
export interface MediaItem {
  id: string;
  title: string;
  name?: string; // for TV shows
  overview: string;
  backdrop_path: string;
  poster_path: string;
  media_type: "movie" | "tv";
  genre_ids: number[];
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  popularity: number;
  tagline?: string;
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  budget?: number;
  revenue?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating?: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export const GENRE_MAP: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10765: "Sci-Fi & Fantasy",
};

export const MOCK_MOVIES: MediaItem[] = [
  {
    id: "27205",
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    backdrop_path: "/8ZgRnsn52C6z4amC59TTzsCj5u.jpg",
    poster_path: "/o0solCr486IHI7Rg2u4hQ1yYrDO.jpg",
    media_type: "movie",
    genre_ids: [28, 878, 12],
    vote_average: 8.4,
    release_date: "2010-07-15",
    popularity: 98.5,
    tagline: "Your mind is the scene of the crime.",
    runtime: 148,
    status: "Released",
    budget: 160000000,
    revenue: 825532764,
  },
  {
    id: "157336",
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    backdrop_path: "/xJHokDu8GoCvOK56v41nuPj4v6r.jpg",
    poster_path: "/gEU2QvH3ICfg7v1o5bZ2eC14LL1.jpg",
    media_type: "movie",
    genre_ids: [12, 18, 878],
    vote_average: 8.4,
    release_date: "2014-11-05",
    popularity: 112.4,
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    runtime: 169,
    status: "Released",
    budget: 165000000,
    revenue: 701729206,
  },
  {
    id: "155",
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    backdrop_path: "/nMKdUUepfeZv76B49dflz044tUK.jpg",
    poster_path: "/qJ2tWGB2XclmAECh8n7o7m21wV1.jpg",
    media_type: "movie",
    genre_ids: [28, 80, 18, 53],
    vote_average: 8.5,
    release_date: "2008-07-16",
    popularity: 88.6,
    tagline: "Why So Serious?",
    runtime: 152,
    status: "Released",
    budget: 185000000,
    revenue: 1004558444,
  },
  {
    id: "507089",
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    backdrop_path: "/xOMo8j320ZWw62T2j6165YSqb2U.jpg",
    poster_path: "/czemb3hm1Ymq6z5r5hZPxua831g.jpg",
    media_type: "movie",
    genre_ids: [878, 12],
    vote_average: 8.2,
    release_date: "2024-02-27",
    popularity: 145.2,
    tagline: "Long live the fighters.",
    runtime: 166,
    status: "Released",
    budget: 190000000,
    revenue: 712000000,
  },
  {
    id: "315162",
    title: "Puss in Boots: The Last Wish",
    overview: "Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left. Puss sets out on an epic journey to find the mythical Wishing Star in the Black Forest and restore his lost lives.",
    backdrop_path: "/r9t4EvCY6mt7AydHjkgFYz6oXyY.jpg",
    poster_path: "/kuf6HgcVUGlUWrx3Vi7koBnclgd.jpg",
    media_type: "movie",
    genre_ids: [16, 12, 35, 14, 10751],
    vote_average: 8.3,
    release_date: "2022-12-07",
    popularity: 78.4,
    tagline: "Say hola to his second to last life.",
    runtime: 102,
    status: "Released",
    budget: 90000000,
    revenue: 480000000,
  },
];

export const MOCK_SHOWS: MediaItem[] = [
  {
    id: "66732",
    title: "Stranger Things",
    name: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    backdrop_path: "/56v2Kj2Fa6Ir7n46VNMszuKiKiB.jpg",
    poster_path: "/49WJfeN0mhmZuuRjFjV60wfvKG6.jpg",
    media_type: "tv",
    genre_ids: [10765, 18, 9648],
    vote_average: 8.6,
    first_air_date: "2016-07-15",
    popularity: 120.3,
    tagline: "One summer can change everything.",
    number_of_seasons: 4,
    number_of_episodes: 34,
    status: "Returning Series",
  },
  {
    id: "1396",
    title: "Breaking Bad",
    name: "Breaking Bad",
    overview: "Walter White, a New Mexico chemistry teacher, learns he has inoperable lung cancer and begins producing and selling methamphetamine with a former student, Jesse Pinkman, to secure his family's financial future.",
    backdrop_path: "/9faXYm4y412Zu62o2vfg6xg4067.jpg",
    poster_path: "/ztkUQewnB7ArsrCd4J2688UE9iH.jpg",
    media_type: "tv",
    genre_ids: [18, 80],
    vote_average: 9.3,
    first_air_date: "2008-01-20",
    popularity: 95.8,
    tagline: "All Hail the King.",
    number_of_seasons: 5,
    number_of_episodes: 62,
    status: "Ended",
  },
  {
    id: "100088",
    title: "The Last of Us",
    name: "The Last of Us",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both must traverse the U.S. and depend on each other for survival.",
    backdrop_path: "/uD414nS92592T59mC65nAX58n59.jpg",
    poster_path: "/uKvH5j2tnV86uzR11Q767gqi5CJ.jpg",
    media_type: "tv",
    genre_ids: [18, 10765],
    vote_average: 8.6,
    first_air_date: "2023-01-15",
    popularity: 110.5,
    tagline: "When you're lost in the darkness, look for the light.",
    number_of_seasons: 1,
    number_of_episodes: 9,
    status: "Returning Series",
  },
  {
    id: "94605",
    title: "Arcane",
    name: "Arcane",
    overview: "Amidst the escalating discord between the rich, gilded city of Piltover and the seedy, oppressed underbelly of Zaun, two sisters fight on opposing sides of a war in which clash magical technologies and clashing convictions.",
    backdrop_path: "/7qUZjNp4688q25161z1R7vT4051.jpg",
    poster_path: "/c5Sc25161z1R7vT4051.jpg",
    media_type: "tv",
    genre_ids: [16, 10765, 28, 18],
    vote_average: 8.7,
    first_air_date: "2021-11-06",
    popularity: 82.4,
    tagline: "Every legend has a beginning.",
    number_of_seasons: 1,
    number_of_episodes: 9,
    status: "Returning Series",
  },
];

export const MOCK_CAST: { [mediaId: string]: CastMember[] } = {
  "27205": [
    { id: 1, name: "Leonardo DiCaprio", character: "Cobb", profile_path: "/wo2hJv01zT0Zk0stIEjUjKFQfhq.jpg" },
    { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "/dhv9fW9u1LlS41w7QQf1WnKkC4h.jpg" },
    { id: 3, name: "Elliot Page", character: "Ariadne", profile_path: "/e01Wz1LlS41w7QQf1WnKkC4h.jpg" },
    { id: 4, name: "Tom Hardy", character: "Eames", profile_path: "/4E57Wz1LlS41w7QQf1WnKkC4h.jpg" },
    { id: 5, name: "Ken Watanabe", character: "Saito", profile_path: "/s857Wz1LlS41w7QQf1WnKkC4h.jpg" },
  ],
  "157336": [
    { id: 6, name: "Matthew McConaughey", character: "Cooper", profile_path: "/wo2hJv01zT0Zk0stIEjUjKFQfhq.jpg" },
    { id: 7, name: "Anne Hathaway", character: "Brand", profile_path: "/dhv9fW9u1LlS41w7QQf1WnKkC4h.jpg" },
    { id: 8, name: "Jessica Chastain", character: "Murph", profile_path: "/e01Wz1LlS41w7QQf1WnKkC4h.jpg" },
    { id: 9, name: "Michael Caine", character: "Professor Brand", profile_path: "/4E57Wz1LlS41w7QQf1WnKkC4h.jpg" },
  ],
};

export const MOCK_REVIEWS: { [mediaId: string]: Review[] } = {
  "27205": [
    {
      id: "r1",
      author: "John Doe",
      content: "An absolute masterpiece! Christopher Nolan takes you on a mind-bending journey that leaves you questioning reality. The visual effects and sound design are stellar.",
      created_at: "2020-05-12T14:32:00Z",
      rating: 10,
    },
    {
      id: "r2",
      author: "Jane Smith",
      content: "Very intricate plot with complex layers. Leonardo DiCaprio is phenomenal, and Hans Zimmer's score is iconic. Truly one of the best sci-fi movies ever made.",
      created_at: "2021-08-20T09:15:00Z",
      rating: 9,
    },
  ],
};

export const MOCK_VIDEOS: { [mediaId: string]: Video[] } = {
  "27205": [{ id: "v1", key: "YoHD9XEInc0", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "157336": [{ id: "v2", key: "zSWdZAIB3nY", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "155": [{ id: "v3", key: "LDG9bisJEaI", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "507089": [{ id: "v4", key: "Way9Dexny3w", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "66732": [{ id: "v5", key: "b9EkMc79ZSU", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "1396": [{ id: "v6", key: "HhesaDFLuRY", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "100088": [{ id: "v7", key: "uLtkt8BonwM", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
  "94605": [{ id: "v8", key: "fXmAurh012s", name: "Official Trailer", site: "YouTube", type: "Trailer" }],
};

export function getMockDetails(mediaId: string, mediaType: "movie" | "tv"): MediaItem | null {
  const dataset = mediaType === "movie" ? MOCK_MOVIES : MOCK_SHOWS;
  return dataset.find((item) => item.id === mediaId) || null;
}
