import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatters";
import { getOccasionLabel, getProductCategoryLabel } from "../data/options";

export function ProductCard({ product, compact = false }) {
  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""}`}>
      <div
        className="product-visual"
        style={
          product.imageUrl
            ? undefined
            : {
                background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`
              }
        }
      >
        {product.imageUrl ? (
          <img className="product-visual__image" src={product.imageUrl} alt={product.name} />
        ) : null}
        <div className="product-visual__ring" />
        <div className="product-visual__label">
          <span>{getProductCategoryLabel(product.category)}</span>
          <strong>{product.flowerTypes.join(" / ")}</strong>
        </div>
      </div>

      <div className="product-card__body">
        <div className="product-card__topline">
          <span>{product.featured ? "主打推薦" : "精選花禮"}</span>
          <span>{product.rating.toFixed(1)} / 5</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <div className="tag-row">
          {product.occasionTags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-chip">
              {getOccasionLabel(tag)}
            </span>
          ))}
        </div>
        <div className="product-card__footer">
          <div>
            <strong>{formatCurrency(product.price)}</strong>
            {product.compareAt > product.price ? (
              <span>{formatCurrency(product.compareAt)}</span>
            ) : null}
          </div>
          <Link className="primary-button primary-button--small" to={`/product/${product.slug}`}>
            查看商品
          </Link>
        </div>
      </div>
    </article>
  );
}
