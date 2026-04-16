import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatters";

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <section className="panel stack-md">
        <span className="eyebrow">購物車</span>
        <h1>目前還沒有花禮</h1>
        <p>先從首頁推薦或商品清單挑一束適合的花，再回來完成結帳。</p>
        <Link className="primary-button" to="/catalog">
          去挑商品
        </Link>
      </section>
    );
  }

  return (
    <div className="two-column">
      <section className="stack-md">
        {items.map((item) => (
          <article key={item.productId} className="panel cart-item">
            <div
              className="cart-item__visual"
              style={
                item.imageUrl
                  ? undefined
                  : {
                      background: `linear-gradient(135deg, ${item.palette[0]}, ${item.palette[1]}, ${item.palette[2]})`
                    }
              }
            >
              {item.imageUrl ? (
                <img className="cart-item__image" src={item.imageUrl} alt={item.name} />
              ) : null}
            </div>
            <div className="cart-item__content">
              <div>
                <h2>{item.name}</h2>
                <p>{item.subtitle}</p>
              </div>
              <div className="cart-item__actions">
                <div className="quantity-control">
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
                <button className="ghost-button" type="button" onClick={() => removeItem(item.productId)}>
                  移除
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="panel order-summary">
        <span className="eyebrow">訂單摘要</span>
        <h2>準備結帳</h2>
        <div className="inline-stat">
          <strong>商品小計</strong>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="inline-stat">
          <strong>預估運費</strong>
          <span>{subtotal >= 3000 ? "免運" : formatCurrency(240)}</span>
        </div>
        <p>加購包裝、代寫卡與指定配送會在結帳頁再計算。</p>
        <Link className="primary-button" to="/checkout">
          前往結帳
        </Link>
      </aside>
    </div>
  );
}
