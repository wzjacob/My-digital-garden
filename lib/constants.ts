export const SITE_NAME = "梓郡的Digital Garden";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const CATEGORIES = {
  digital: {
    slug: "digital",
    name: "数字化与工程管理",
    description: "集团级信息化建设、RPA、主数据管理",
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
    name: "玄学与哲学",
    description: "八字排盘、面相分析、宏观规律",
    tags: ["八字", "面相", "宏观规律"],
  },
  hardware: {
    slug: "hardware",
    name: "硬核理工与机械",
    description: "消费电子、房车、柴火炉、芯片规格",
    tags: ["消费电子", "房车", "柴火炉", "芯片规格"],
  },
  journey: {
    slug: "journey",
    name: "行路与提升",
    description: "自驾游、自我成长、运动健康、效率工具",
    tags: ["神农架", "武当山", "自驾", "效率工具"],
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
