import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, getRecommendations } from "../api";
import { ProductCard } from "../components/ProductCard";
import { budgetTiers, occasions } from "../data/options";

export function HomePage() {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState("anniversary");
  const [budgetTier, setBudgetTier] = useState("from_1500_to_2500");
  const [recommendations, setRecommendations] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      getRecommendations({ occasion, budgetTier }),
      getProducts({ featured: true })
    ])
      .then(([recommendedItems, featuredItems]) => {
        if (!active) {
          return;
        }
        setRecommendations(recommendedItems);
        setFeatured(featuredItems.slice(0, 4));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [occasion, budgetTier]);

  const heroFeature = featured[0];
  const heroSecondary = featured.slice(1, 3);
  const selectableOccasions = occasions.filter((item) => item.id);
  const selectableBudgets = budgetTiers.filter((item) => item.id);
  const activeOccasion = selectableOccasions.find((item) => item.id === occasion);
  const activeBudget = selectableBudgets.find((item) => item.id === budgetTier);

  return (
    <div className="stack-lg">
      <section className="hero-panel hero-panel--brand">
        <div className="hero-panel__copy">
          <span className="eyebrow">Lazy Bloom Floral House</span>
          <h1>把重要時刻，交給一束值得被記住的花。</h1>
          <p>
            以乾淨的色調、剛剛好的份量和細緻包裝，整理出更容易挑選的花禮系列。
            不論是紀念日、生日，或只是想讓今天變得溫柔一點，都能在這裡找到合適的表達方式。
          </p>
          <div className="hero-panel__actions">
            <Link className="primary-button" to="/catalog">
              瀏覽本季花禮
            </Link>
            <Link className="secondary-button" to="/profiles">
              建立送禮備忘
            </Link>
          </div>

          <div className="hero-service-strip">
            <article>
              <strong>質感包裝</strong>
              <span>霧面紙材、緞帶與卡片一起完成</span>
            </article>
            <article>
              <strong>指定配送</strong>
              <span>支援日期與時段安排，重要時刻更安心</span>
            </article>
            <article>
              <strong>花禮備忘</strong>
              <span>把喜歡的花和重要日子先存起來</span>
            </article>
          </div>
        </div>

        <div className="hero-editorial">
          {heroFeature ? (
            <article
              className="hero-editorial__primary"
              style={{
                background: heroFeature.imageUrl
                  ? `linear-gradient(180deg, rgba(26, 18, 22, 0.08), rgba(26, 18, 22, 0.42)), url(${heroFeature.imageUrl}) center/cover`
                  : `linear-gradient(135deg, ${heroFeature.palette[0]}, ${heroFeature.palette[1]}, ${heroFeature.palette[2]})`
              }}
            >
              <span>Season Signature</span>
              <strong>{heroFeature.name}</strong>
              <p>{heroFeature.subtitle}</p>
            </article>
          ) : null}

          <div className="hero-editorial__aside">
            {heroSecondary.map((product) => (
              <article
                key={product.id}
                className="hero-editorial__mini"
                style={{
                  background: product.imageUrl
                    ? `linear-gradient(180deg, rgba(24, 17, 20, 0.12), rgba(24, 17, 20, 0.44)), url(${product.imageUrl}) center/cover`
                    : `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`
                }}
              >
                <span>{product.category}</span>
                <strong>{product.name}</strong>
              </article>
            ))}

            <article className="hero-editorial__quote">
              <span>Our Promise</span>
              <p>每一份花禮都以「收到當下就有感」為標準，讓心意既自然，也體面。</p>
            </article>
          </div>
        </div>
      </section>

      <section className="panel panel--finder">
        <div className="section-header">
          <div>
            <span className="eyebrow">Curated Finder</span>
            <h2>從場合與預算開始，快速找到合適的花禮</h2>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() =>
              navigate(`/catalog?occasion=${occasion}&budgetTier=${budgetTier}`)
            }
          >
            看完整清單
          </button>
        </div>

        <div className="finder-shell">
          <div className="finder-block">
            <div className="finder-block__header">
              <span>1. Occasion</span>
              <h3>先決定今天想送出的感覺</h3>
            </div>

            <div className="selection-grid selection-grid--occasion">
              {selectableOccasions.map((item) => (
                <button
                  key={item.id}
                  className={`selection-card ${occasion === item.id ? "active" : ""}`}
                  type="button"
                  onClick={() => setOccasion(item.id)}
                  aria-pressed={occasion === item.id}
                >
                  <span className="selection-card__label">{item.label}</span>
                  <strong>{item.helper}</strong>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="finder-block">
            <div className="finder-block__header">
              <span>2. Budget</span>
              <h3>再挑一個剛剛好的預算區間</h3>
            </div>

            <div className="selection-grid selection-grid--budget">
              {selectableBudgets.map((item) => (
                <button
                  key={item.id}
                  className={`selection-card selection-card--budget ${budgetTier === item.id ? "active" : ""}`}
                  type="button"
                  onClick={() => setBudgetTier(item.id)}
                  aria-pressed={budgetTier === item.id}
                >
                  <span className="selection-card__label">{item.label}</span>
                  <strong>{item.helper}</strong>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <aside className="finder-summary">
            <span className="eyebrow">Selected Pairing</span>
            <h3>
              {activeOccasion?.label} / {activeBudget?.label}
            </h3>
            <p>
              {activeOccasion?.description}
              {activeBudget ? ` ${activeBudget.description}` : ""}
            </p>
            <div className="finder-summary__chips">
              <span>{activeOccasion?.helper}</span>
              <span>{activeBudget?.helper}</span>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={() =>
                navigate(`/catalog?occasion=${occasion}&budgetTier=${budgetTier}`)
              }
            >
              查看這組推薦
            </button>
          </aside>
        </div>

        {loading ? <p className="loading-state">正在整理推薦...</p> : null}

        <div className="product-grid">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="promise-grid">
        <article className="panel panel--soft">
          <span className="eyebrow">Anniversary</span>
          <h3>適合重要日子的經典選擇</h3>
          <p>以玫瑰、永生花和細緻色調為主，適合想把儀式感做得自然又好看。</p>
        </article>
        <article className="panel panel--soft">
          <span className="eyebrow">Birthday</span>
          <h3>明亮一點，也更有記憶點</h3>
          <p>向日葵、鬱金香和花盒系列，適合送進辦公室、家裡，收到時會立刻有好心情。</p>
        </article>
        <article className="panel panel--soft">
          <span className="eyebrow">Just Because</span>
          <h3>不是節日，也值得送一束花</h3>
          <p>當想念、想道歉、想安慰或只是想讓一天好一點時，輕盈花禮更容易表達心意。</p>
        </article>
      </section>

      <section className="editorial-grid">
        <article className="panel editorial-story">
          <span className="eyebrow">Brand Note</span>
          <h2>花不只是送禮，也是在說話。</h2>
          <p>
            我們偏好耐看而不過度張揚的花型，讓每一份花禮都能同時保有溫度、品味與送出的輕鬆感。
            從包裝層次、花材配色到卡片用字，都以「收到的人會感到被好好對待」為核心。
          </p>
        </article>

        <article className="panel editorial-menu">
          <span className="eyebrow">Floral Services</span>
          <div className="editorial-menu__list">
            <div>
              <strong>手寫卡片服務</strong>
              <p>把想說的話留在花禮裡，讓心意更完整。</p>
            </div>
            <div>
              <strong>精裝包裝加購</strong>
              <p>以奶油白、灰粉與霧面材質呈現更體面的送禮感。</p>
            </div>
            <div>
              <strong>重要日子預先整理</strong>
              <p>把她喜歡的花和關鍵日期先記下來，下次更從容。</p>
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">Featured Collection</span>
            <h2>本季精選花禮</h2>
          </div>
          <Link className="ghost-link" to="/catalog">
            查看全系列
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      <section className="brand-banner">
        <div>
          <span className="eyebrow">For Thoughtful Delivery</span>
          <h2>把想說的話，交給花先說。</h2>
          <p>從選花、包裝到配送安排，讓重要的人在剛剛好的時間收到剛剛好的心意。</p>
        </div>
        <div className="hero-panel__actions">
          <Link className="primary-button" to="/catalog">
            立即選購
          </Link>
          <Link className="secondary-button" to="/profiles">
            整理送禮備忘
          </Link>
        </div>
      </section>
    </div>
  );
}
