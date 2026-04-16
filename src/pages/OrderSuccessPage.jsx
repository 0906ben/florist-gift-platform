import { useLocation, useParams } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/formatters";
import { getFulfillmentStatusLabel, getPaymentStatusLabel } from "../data/options";

export function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const cached =
    location.state?.order ||
    JSON.parse(window.sessionStorage.getItem("lazy-bloom-last-order") || "null");

  if (!cached || cached.id !== orderId) {
    return (
      <section className="panel">
        <h1>訂單已建立</h1>
        <p>訂單資料已送出，若畫面沒有保留明細，可以稍後回到首頁或購物車再繼續瀏覽。</p>
      </section>
    );
  }

  return (
    <section className="panel stack-md">
      <span className="eyebrow">訂單完成</span>
      <h1>訂單 {cached.orderNo} 已建立</h1>
      <p>我們已收到你的訂單，接下來會依照你選擇的日期與配送需求安排花禮製作。</p>

      <div className="inline-stat">
        <strong>建立時間</strong>
        <span>{formatDate(cached.createdAt)}</span>
      </div>
      <div className="inline-stat">
        <strong>付款狀態</strong>
        <span>{getPaymentStatusLabel(cached.paymentStatus)}</span>
      </div>
      <div className="inline-stat">
        <strong>配送狀態</strong>
        <span>{getFulfillmentStatusLabel(cached.fulfillmentStatus)}</span>
      </div>
      <div className="inline-stat inline-stat--strong">
        <strong>訂單總額</strong>
        <span>{formatCurrency(cached.totals.total)}</span>
      </div>
    </section>
  );
}
