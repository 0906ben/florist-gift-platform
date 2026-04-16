import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatters";
import { getOccasionLabel, getProductCategoryLabel } from "../data/options";

export function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getProduct(slug).then((item) => {
      if (active) {
        setProduct(item);
      }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (!product) {
    return <p className="loading-state">正在讀取商品資料...</p>;
  }

  return (
    <div className="stack-lg">
      <section className="product-hero">
        <div
          className="product-hero__visual"
          style={
            product.imageUrl
              ? undefined
              : {
                  background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`
                }
          }
        >
          {product.imageUrl ? (
            <img className="product-hero__image" src={product.imageUrl} alt={product.name} />
          ) : null}
          <div className="product-hero__stamp">
            <span>花材</span>
            <strong>{product.flowerTypes.join(" / ")}</strong>
          </div>
        </div>

        <div className="product-hero__content">
          <span className="eyebrow">{getProductCategoryLabel(product.category)}</span>
          <h1>{product.name}</h1>
          <p className="lead">{product.subtitle}</p>

          <div className="price-block">
            <strong>{formatCurrency(product.price)}</strong>
            {product.compareAt > product.price ? (
              <span>{formatCurrency(product.compareAt)}</span>
            ) : null}
          </div>

          <div className="tag-row">
            {product.occasionTags.map((tag) => (
              <span key={tag} className="tag-chip">
                {getOccasionLabel(tag)}
              </span>
            ))}
          </div>

          <div className="product-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                addItem(product, 1);
                setMessage("已加入購物車");
              }}
            >
              加入購物車
            </button>
            <span className="stock-note">目前庫存 {product.stock} 件</span>
          </div>

          {message ? <p className="success-note">{message}</p> : null}
        </div>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <span className="eyebrow">為什麼選這個</span>
          <h2>安全感很高的理由</h2>
          <p>{product.whyItWorks}</p>
        </article>
        <article className="panel">
          <span className="eyebrow">誰會喜歡</span>
          <h2>適合對象</h2>
          <p>{product.whoWillLoveIt}</p>
        </article>
        <article className="panel">
          <span className="eyebrow">送禮提醒</span>
          <h2>避免出錯的小細節</h2>
          <p>{product.reminder}</p>
        </article>
      </section>

      <section className="panel">
        <span className="eyebrow">商品說明</span>
        <h2>內容與安排方式</h2>
        <p>{product.description}</p>
        <p>建議預留 {product.leadTimeDays} 天安排，適合在重要日程前先完成下單。</p>
      </section>
    </div>
  );
}
