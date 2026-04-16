import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api";
import { ProductCard } from "../components/ProductCard";
import { budgetTiers, occasions, productCategories } from "../data/options";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = {
    q: searchParams.get("q") || "",
    occasion: searchParams.get("occasion") || "",
    category: searchParams.get("category") || "",
    budgetTier: searchParams.get("budgetTier") || ""
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    getProducts(filters)
      .then((items) => {
        if (active) {
          setProducts(items);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters.q, filters.occasion, filters.category, filters.budgetTier]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  }

  return (
    <div className="stack-lg">
      <section className="panel panel--banner">
        <span className="eyebrow">花禮選品</span>
        <h1>用場合和預算快速縮小範圍</h1>
        <p>先用場合、預算或花材篩一輪，再慢慢比較你想送出的感覺。</p>
      </section>

      <section className="panel">
        <div className="filter-grid">
          <label className="field">
            <span>關鍵字</span>
            <input
              value={filters.q}
              onChange={(event) => updateFilter("q", event.target.value)}
              placeholder="搜尋玫瑰、繡球花、永生花..."
            />
          </label>

          <label className="field">
            <span>場合</span>
            <select
              value={filters.occasion}
              onChange={(event) => updateFilter("occasion", event.target.value)}
            >
              {occasions.map((item) => (
                <option key={item.id || "all"} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>預算</span>
            <select
              value={filters.budgetTier}
              onChange={(event) => updateFilter("budgetTier", event.target.value)}
            >
              {budgetTiers.map((item) => (
                <option key={item.id || "all"} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>類別</span>
            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="">全部類型</option>
              {productCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? <p className="loading-state">正在讀取商品...</p> : null}

      <section className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      {!loading && products.length === 0 ? (
        <section className="panel">
          <h2>目前沒有符合條件的花禮</h2>
          <p>可以先放寬預算或場合條件，我們正在整理更多適合不同心意的花禮。</p>
        </section>
      ) : null}
    </div>
  );
}
