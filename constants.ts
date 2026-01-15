import { Region, Story, StoryStatus } from "./types";

export const APP_NAME = "TechSimplified";

export const REGION_COLORS: Record<Region, string> = {
  [Region.GLOBAL]: "bg-blue-100 text-blue-800",
  [Region.NORTH_AMERICA]: "bg-indigo-100 text-indigo-800",
  [Region.EUROPE]: "bg-purple-100 text-purple-800",
  [Region.ASIA_PACIFIC]: "bg-rose-100 text-rose-800",
  [Region.LATIN_AMERICA]: "bg-orange-100 text-orange-800",
  [Region.AFRICA]: "bg-emerald-100 text-emerald-800",
};

export const INITIAL_STORIES: Story[] = [
  {
    id: "1",
    title: "New Robot Helps Plant Trees Faster",
    sourceName: "EcoTech Daily",
    sourceUrl: "#",
    region: Region.LATIN_AMERICA, // Mapped generally
    imageUrl: "https://picsum.photos/800/600?random=1",
    publishedAt: new Date().toISOString(),
    summary: "A new robot has been built to help plant trees in the Amazon rainforest. This robot can dig holes and place seeds much faster than humans can. Scientists hope this will help the forest grow back quickly and give animals new homes.",
    translations: {},
    status: StoryStatus.APPROVED,
    topics: ["Robotics", "Environment"],
    likes: 42
  },
  {
    id: "2",
    title: "Super Computer Discovers New Medicine",
    sourceName: "Global Science News",
    sourceUrl: "#",
    region: Region.EUROPE,
    imageUrl: "https://picsum.photos/800/600?random=2",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    summary: "A very powerful computer used artificial intelligence to find a new type of medicine. This medicine might help cure common colds much faster. Doctors are excited to test it safely to see if it works for everyone.",
    translations: {},
    status: StoryStatus.APPROVED,
    topics: ["AI", "Health"],
    likes: 128
  },
  {
    id: "3",
    title: "Battery Breakthrough for Electric Cars",
    sourceName: "AutoFuture",
    sourceUrl: "#",
    region: Region.ASIA_PACIFIC,
    imageUrl: "https://picsum.photos/800/600?random=3",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    summary: "Engineers in Japan have made a car battery that charges in just five minutes. This means electric cars can drive for a long time without waiting hours to charge. It makes clean travel easier for families.",
    translations: {},
    status: StoryStatus.APPROVED,
    topics: ["Energy", "Transport"],
    likes: 85
  }
];