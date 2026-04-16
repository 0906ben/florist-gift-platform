export const occasions = [
  { id: "", label: "全部場合", helper: "先看看全部花禮" },
  {
    id: "birthday",
    label: "生日",
    helper: "明亮、有記憶點",
    description: "適合送出開心、輕快又有照片感的花禮。"
  },
  {
    id: "valentine",
    label: "情人節",
    helper: "浪漫優先",
    description: "偏向玫瑰、永生花與更濃一點的節日氛圍。"
  },
  {
    id: "anniversary",
    label: "紀念日",
    helper: "穩穩加分",
    description: "經典不失手，適合想把儀式感做得自然好看。"
  },
  {
    id: "apology",
    label: "道歉",
    helper: "真誠修復氣氛",
    description: "適合較柔和、低壓、以誠意為主的花束與花盒。"
  },
  {
    id: "surprise",
    label: "平日驚喜",
    helper: "突然送也合理",
    description: "適合沒有節日也想讓今天更溫柔一點的時刻。"
  },
  {
    id: "other",
    label: "其他",
    helper: "泛用不踩雷",
    description: "先從好搭、好送、接受度高的花禮開始挑。"
  }
];

export const budgetTiers = [
  { id: "", label: "全部預算" },
  {
    id: "under_1500",
    label: "1500 以下",
    helper: "輕巧心意",
    description: "適合平日驚喜、小型花盒或簡潔花束。"
  },
  {
    id: "from_1500_to_2500",
    label: "1500 - 2500",
    helper: "經典首選",
    description: "多數熱門花束都落在這個區間，體面又好下手。"
  },
  {
    id: "from_2500_to_4000",
    label: "2500 - 4000",
    helper: "更有份量",
    description: "適合生日、紀念日主禮，花量與存在感更完整。"
  },
  {
    id: "above_4000",
    label: "4000 以上",
    helper: "盛大時刻",
    description: "適合想把排面、記憶點與儀式感一次做到位。"
  }
];

export const productCategories = [
  { id: "bouquet", label: "花束" },
  { id: "box", label: "花盒" },
  { id: "basket", label: "提籃" },
  { id: "arrangement", label: "瓶花" },
  { id: "preserved", label: "永生花" }
];

export const occasionLabelMap = Object.fromEntries(
  occasions.filter((item) => item.id).map((item) => [item.id, item.label])
);

export const productCategoryLabelMap = Object.fromEntries(
  productCategories.map((item) => [item.id, item.label])
);

export const profileRelationshipOptions = ["女友", "太太", "曖昧對象", "家人", "朋友"];

export const paymentMethods = [
  { id: "credit-card", label: "信用卡" },
  { id: "bank-transfer", label: "銀行轉帳" },
  { id: "cash-on-delivery", label: "貨到付款" }
];

export const orderStatusOptions = ["confirmed", "preparing", "shipping", "delivered", "cancelled"];

export const fulfillmentStatusOptions = [
  "queued",
  "arranging",
  "scheduled",
  "shipping",
  "delivered",
  "cancelled"
];

export const paymentStatusOptions = [
  "authorized_demo",
  "awaiting_manual_confirmation",
  "pending_collection",
  "paid",
  "failed"
];

export function getOccasionLabel(value) {
  return occasionLabelMap[value] || value;
}

export function getProductCategoryLabel(value) {
  return productCategoryLabelMap[value] || value;
}

export function getPaymentStatusLabel(value) {
  const labels = {
    authorized_demo: "付款資料已送出",
    awaiting_manual_confirmation: "待確認入帳",
    pending_collection: "待收款",
    paid: "已付款",
    failed: "付款失敗"
  };
  return labels[value] || value;
}

export function getFulfillmentStatusLabel(value) {
  const labels = {
    queued: "訂單成立",
    arranging: "花禮製作中",
    scheduled: "已排入配送",
    shipping: "配送途中",
    delivered: "已送達",
    cancelled: "已取消"
  };
  return labels[value] || value;
}
