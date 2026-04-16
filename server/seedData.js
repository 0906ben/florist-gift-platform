export const defaultStoreData = {
  meta: {
    brandName: "Lazy Bloom",
    currency: "TWD",
    nextOrderSequence: 104
  },
  products: [
    {
      id: "prod_rose_whisper",
      slug: "rose-whisper-bouquet",
      name: "暮光玫瑰花束",
      subtitle: "經典玫瑰搭配桔梗與柔霧包裝，安全感很高的首選。",
      category: "bouquet",
      price: 1680,
      compareAt: 1880,
      stock: 14,
      status: "active",
      featured: true,
      rating: 4.9,
      reviewCount: 128,
      palette: ["#ffe8ef", "#efb1c0", "#93465f"],
      flowerTypes: ["玫瑰", "桔梗", "尤加利"],
      occasionTags: ["anniversary", "valentine", "surprise"],
      moodTags: ["儀式感", "穩妥", "不出錯"],
      description:
        "以粉霧玫瑰為主角，搭配桔梗和尤加利層次，適合第一次送花也想穩穩拿分的人。",
      whyItWorks: "玫瑰辨識度高，搭配柔和色系不會太浮誇，浪漫但不尷尬。",
      whoWillLoveIt: "喜歡儀式感、重視照片質感、偏好經典派的她。",
      reminder: "建議搭配手寫卡與晚間送達，效果最好。",
      leadTimeDays: 2,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z"
    },
    {
      id: "prod_white_cloud",
      slug: "white-cloud-apology",
      name: "雲霧白道歉花束",
      subtitle: "白玫瑰與洋桔梗的低壓組合，適合想要真誠修補氣氛。",
      category: "bouquet",
      price: 1480,
      compareAt: 1680,
      stock: 9,
      status: "active",
      featured: true,
      rating: 4.8,
      reviewCount: 89,
      palette: ["#f5f4ef", "#d8d5cb", "#72806e"],
      flowerTypes: ["白玫瑰", "洋桔梗", "雪柳"],
      occasionTags: ["apology", "anniversary", "other"],
      moodTags: ["柔和", "真誠", "修復關係"],
      description:
        "白色系花材降低壓迫感，讓重點回到你的心意本身，適合道歉或想重新開始的時刻。",
      whyItWorks: "白色花束乾淨誠懇，不容易踩到過度熱烈的誤區。",
      whoWillLoveIt: "喜歡極簡美感、討厭太張揚、重視誠意勝過排場的人。",
      reminder: "建議卡片內容真誠直接，避免太多玩笑。",
      leadTimeDays: 1,
      createdAt: "2026-04-01T09:10:00.000Z",
      updatedAt: "2026-04-01T09:10:00.000Z"
    },
    {
      id: "prod_tulip_box",
      slug: "tulip-dawn-box",
      name: "晨光鬱金香花盒",
      subtitle: "鬱金香、銀葉菊與奶油盒裝，乾淨又有朝氣。",
      category: "box",
      price: 1280,
      compareAt: 1480,
      stock: 18,
      status: "active",
      featured: false,
      rating: 4.7,
      reviewCount: 66,
      palette: ["#fff0d8", "#ffc67d", "#c17737"],
      flowerTypes: ["鬱金香", "銀葉菊", "小蒼蘭"],
      occasionTags: ["birthday", "surprise", "other"],
      moodTags: ["活力", "清新", "自然派"],
      description:
        "鬱金香花盒適合平日驚喜或生日祝福，保有花禮質感又更方便擺放。",
      whyItWorks: "花盒體積友善、配色輕盈，送到辦公室或家裡都不會太高調。",
      whoWillLoveIt: "喜歡清爽色調、工作忙碌、重視實用與擺設便利的她。",
      reminder: "盒花適合中午或下午送達，便於即時擺放。",
      leadTimeDays: 2,
      createdAt: "2026-04-01T09:20:00.000Z",
      updatedAt: "2026-04-01T09:20:00.000Z"
    },
    {
      id: "prod_preserved_dome",
      slug: "preserved-blush-dome",
      name: "永生花玻璃罩",
      subtitle: "永生玫瑰與乾燥花材組成，可長時間保存的穩定浪漫。",
      category: "preserved",
      price: 2380,
      compareAt: 2680,
      stock: 7,
      status: "active",
      featured: true,
      rating: 4.9,
      reviewCount: 54,
      palette: ["#fce9ef", "#d993ae", "#6e4259"],
      flowerTypes: ["永生玫瑰", "繡球花", "索拉花"],
      occasionTags: ["anniversary", "valentine", "birthday"],
      moodTags: ["收藏感", "高質感", "耐看"],
      description:
        "適合想送一份能留下來的浪漫，玻璃罩呈現穩定且具有展示感。",
      whyItWorks: "不用擔心鮮花保存期短，對重視紀念意義的人特別加分。",
      whoWillLoveIt: "喜歡擺設、收藏、長久保留心意的她。",
      reminder: "送前先確認收件地址有人可代收，避免玻璃罩來回碰撞。",
      leadTimeDays: 3,
      createdAt: "2026-04-01T09:30:00.000Z",
      updatedAt: "2026-04-01T09:30:00.000Z"
    },
    {
      id: "prod_sunlit_basket",
      slug: "sunlit-smile-basket",
      name: "晴日向日葵提籃",
      subtitle: "向日葵、洋甘菊與奶油提籃，送出很有精神的好心情。",
      category: "basket",
      price: 1880,
      compareAt: 2080,
      stock: 11,
      status: "active",
      featured: false,
      rating: 4.6,
      reviewCount: 72,
      palette: ["#fff0a8", "#f9b233", "#8b6236"],
      flowerTypes: ["向日葵", "洋甘菊", "尤加利"],
      occasionTags: ["birthday", "surprise", "other"],
      moodTags: ["明亮", "療癒", "開心"],
      description:
        "適合想讓對方一收到就笑出來的場合，提籃形式也更有生活感。",
      whyItWorks: "向日葵辨識度高，氣氛正向，對不想太嚴肅的送禮特別好用。",
      whoWillLoveIt: "喜歡自然系、明亮配色、偏好居家風格的她。",
      reminder: "若搭配卡片，可用較輕鬆的語氣，效果更自然。",
      leadTimeDays: 2,
      createdAt: "2026-04-01T09:40:00.000Z",
      updatedAt: "2026-04-01T09:40:00.000Z"
    },
    {
      id: "prod_midnight_orchid",
      slug: "midnight-orchid-vase",
      name: "夜色蘭語瓶花",
      subtitle: "蘭花、深紫桔梗與黑灰瓶器組成的成熟派作品。",
      category: "arrangement",
      price: 3280,
      compareAt: 3580,
      stock: 5,
      status: "active",
      featured: true,
      rating: 4.9,
      reviewCount: 31,
      palette: ["#ece6f8", "#8f78b5", "#31324d"],
      flowerTypes: ["蘭花", "深紫桔梗", "銀葉"],
      occasionTags: ["anniversary", "birthday", "other"],
      moodTags: ["成熟", "低調奢華", "高級感"],
      description:
        "成熟色調搭配瓶器，適合想送出有品味、稍微正式一點的氛圍。",
      whyItWorks: "已含花器，收到即可擺放，省去照顧與整理的負擔。",
      whoWillLoveIt: "喜歡深色系、俐落居家風格、成熟質感路線的她。",
      reminder: "庫存較少，紀念日檔期建議至少提前三天下單。",
      leadTimeDays: 3,
      createdAt: "2026-04-01T09:50:00.000Z",
      updatedAt: "2026-04-01T09:50:00.000Z"
    },
    {
      id: "prod_hydrangea_letter",
      slug: "hydrangea-letter-bloom",
      name: "繡球信箋花禮",
      subtitle: "繡球花盒結合手寫信卡槽，適合想說多一點的時候。",
      category: "box",
      price: 2180,
      compareAt: 2380,
      stock: 10,
      status: "active",
      featured: false,
      rating: 4.8,
      reviewCount: 47,
      palette: ["#eef4ff", "#90add7", "#4b5f8f"],
      flowerTypes: ["繡球花", "小玫瑰", "棉花"],
      occasionTags: ["anniversary", "apology", "birthday"],
      moodTags: ["細膩", "溫柔", "適合寫字"],
      description:
        "花盒內建信箋卡槽，讓你不必額外想包裝，就能把心意一起送出。",
      whyItWorks: "適合有話想說但不想把整件事搞得太戲劇化的場合。",
      whoWillLoveIt: "喜歡溫柔藍調、在意文字與細節、重視紀念感的她。",
      reminder: "若要手寫卡片，建議至少預留 20 個字以上內容。",
      leadTimeDays: 2,
      createdAt: "2026-04-01T10:00:00.000Z",
      updatedAt: "2026-04-01T10:00:00.000Z"
    },
    {
      id: "prod_peony_deluxe",
      slug: "celebration-peony-deluxe",
      name: "盛綻牡丹豪華款",
      subtitle: "牡丹、花園玫瑰與層次包材的大尺寸紀念款。",
      category: "bouquet",
      price: 4580,
      compareAt: 4980,
      stock: 4,
      status: "active",
      featured: true,
      rating: 5,
      reviewCount: 19,
      palette: ["#fff1f3", "#f2abb7", "#ad4b66"],
      flowerTypes: ["牡丹", "花園玫瑰", "洋牡丹"],
      occasionTags: ["valentine", "anniversary", "birthday"],
      moodTags: ["高規格", "大場面", "超有感"],
      description:
        "適合重要紀念日、生日或想一次把排面做到位的情境。",
      whyItWorks: "大尺寸花束在視覺上很有記憶點，適合高重視度場合。",
      whoWillLoveIt: "喜歡盛大儀式、拍照氛圍、花量豐富感的她。",
      reminder: "建議指定晚間送達，並加購精裝包裝更完整。",
      leadTimeDays: 4,
      createdAt: "2026-04-01T10:10:00.000Z",
      updatedAt: "2026-04-01T10:10:00.000Z"
    }
  ],
  profiles: [
    {
      id: "profile_zoe",
      name: "Zoe",
      relationship: "女友",
      ageRange: "26-30",
      stylePreference: "儀式感派",
      sweetTooth: "喜歡甜點",
      surprisePreference: "喜歡驚喜",
      preferredColors: ["奶油白", "霧粉", "鼠尾草綠"],
      favoriteFlowers: ["玫瑰", "繡球花"],
      note: "討厭太鮮豔的紅，喜歡照片拍起來柔和的禮物。",
      importantDates: [
        {
          label: "生日",
          date: "2026-07-18"
        },
        {
          label: "交往紀念日",
          date: "2026-10-03"
        }
      ],
      lastGift: "永生花玻璃罩",
      updatedAt: "2026-04-02T10:00:00.000Z"
    },
    {
      id: "profile_mia",
      name: "Mia",
      relationship: "太太",
      ageRange: "31-35",
      stylePreference: "實用派",
      sweetTooth: "普通",
      surprisePreference: "不喜歡太浮誇",
      preferredColors: ["白色", "灰藍", "米色"],
      favoriteFlowers: ["白玫瑰", "蘭花"],
      note: "平日工作很忙，喜歡擺放方便、看起來乾淨的花禮。",
      importantDates: [
        {
          label: "生日",
          date: "2026-11-25"
        },
        {
          label: "結婚紀念日",
          date: "2026-05-09"
        }
      ],
      lastGift: "夜色蘭語瓶花",
      updatedAt: "2026-04-03T14:20:00.000Z"
    }
  ],
  orders: [
    {
      id: "order_101",
      orderNo: "LB-20260401-0101",
      createdAt: "2026-04-01T11:00:00.000Z",
      status: "confirmed",
      paymentStatus: "paid",
      fulfillmentStatus: "scheduled",
      paymentMethod: "credit-card",
      customer: {
        name: "Kevin Lin",
        email: "kevin@example.com",
        phone: "0912-000-123"
      },
      shipping: {
        recipientName: "Zoe",
        phone: "0922-000-456",
        city: "台北市",
        district: "大安區",
        addressLine1: "信義路四段 100 號",
        addressLine2: "8 樓",
        deliveryDate: "2026-04-05",
        deliverySlot: "19:00-21:00",
        note: "請先電話聯絡。"
      },
      addOns: {
        giftWrap: true,
        handwriteCard: true,
        cardMessage: "謝謝妳一直都在。",
        deliveryDecoration: "霧面緞帶"
      },
      items: [
        {
          productId: "prod_rose_whisper",
          name: "暮光玫瑰花束",
          price: 1680,
          quantity: 1
        }
      ],
      totals: {
        subtotal: 1680,
        shippingFee: 240,
        wrapFee: 180,
        cardFee: 120,
        scheduleFee: 150,
        total: 2370
      }
    },
    {
      id: "order_102",
      orderNo: "LB-20260403-0102",
      createdAt: "2026-04-03T09:30:00.000Z",
      status: "preparing",
      paymentStatus: "awaiting_manual_confirmation",
      fulfillmentStatus: "arranging",
      paymentMethod: "bank-transfer",
      customer: {
        name: "Jason Chen",
        email: "jason@example.com",
        phone: "0936-222-111"
      },
      shipping: {
        recipientName: "Mia",
        phone: "0918-234-567",
        city: "新北市",
        district: "板橋區",
        addressLine1: "文化路一段 88 號",
        addressLine2: "",
        deliveryDate: "2026-04-10",
        deliverySlot: "14:00-18:00",
        note: "公司櫃台代收。"
      },
      addOns: {
        giftWrap: true,
        handwriteCard: false,
        cardMessage: "",
        deliveryDecoration: "簡約灰紙"
      },
      items: [
        {
          productId: "prod_midnight_orchid",
          name: "夜色蘭語瓶花",
          price: 3280,
          quantity: 1
        }
      ],
      totals: {
        subtotal: 3280,
        shippingFee: 0,
        wrapFee: 180,
        cardFee: 0,
        scheduleFee: 150,
        total: 3610
      }
    },
    {
      id: "order_103",
      orderNo: "LB-20260404-0103",
      createdAt: "2026-04-04T17:45:00.000Z",
      status: "delivered",
      paymentStatus: "paid",
      fulfillmentStatus: "delivered",
      paymentMethod: "credit-card",
      customer: {
        name: "Alan Wu",
        email: "alan@example.com",
        phone: "0900-123-321"
      },
      shipping: {
        recipientName: "Amy",
        phone: "0920-333-444",
        city: "台中市",
        district: "西區",
        addressLine1: "公益路 123 號",
        addressLine2: "管理室",
        deliveryDate: "2026-04-06",
        deliverySlot: "10:00-13:00",
        note: ""
      },
      addOns: {
        giftWrap: false,
        handwriteCard: true,
        cardMessage: "生日快樂，今天一定要開心。",
        deliveryDecoration: "無"
      },
      items: [
        {
          productId: "prod_tulip_box",
          name: "晨光鬱金香花盒",
          price: 1280,
          quantity: 1
        },
        {
          productId: "prod_sunlit_basket",
          name: "晴日向日葵提籃",
          price: 1880,
          quantity: 1
        }
      ],
      totals: {
        subtotal: 3160,
        shippingFee: 0,
        wrapFee: 0,
        cardFee: 120,
        scheduleFee: 150,
        total: 3430
      }
    }
  ]
};
