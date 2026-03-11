export const SITE_NAME = "梓郡的Digital Garden";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const CATEGORIES = {
  digital: {
    slug: "digital",
    name: "IT生涯",
    description: "IT职场小白的行路自述",
    tags: ["RPA", "MDM", "主数据", "信息化架构"],
  },
  herb: {
    slug: "herb",
    name: "本草与中医",
    description: "植物图谱、方剂、传统中医理论",
    tags: ["丹参", "枸杞", "植物识别", "方剂"],
  },
  metaphysics: {
    slug: "metaphysics",
    name: "中国传统文化与哲学",
    description: '"君子食无求饱，居无求安，敏于事而慎于言。"苦行僧自述',
    tags: ["八字", "面相", "宏观规律"],
  },
  hardware: {
    slug: "hardware",
    name: "机械与能源",
    description: "",
    tags: [],
  },
  journey: {
    slug: "journey",
    name: "行路与提升",
    description: "自驾游、自我成长、运动健康、效率工具",
    tags: ["神农架", "武当山", "自驾", "效率工具"],
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
