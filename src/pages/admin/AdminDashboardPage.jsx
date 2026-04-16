import { useEffect, useState } from "react";
import { getAdminSummary } from "../../api";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAdminSummary().then((data) => setSummary(data));
  }, []);

  if (!summary) {
    return <p className="loading-state">正在讀取後台資料...</p>;
  }

  const metricCards = [
    { label: "累計營收", value: formatCurrency(summary.metrics.revenue) },
    { label: "訂單總數", value: `${summary.metrics.orders} 筆` },
    { label: "上架商品", value: `${summary.metrics.activeProducts} 項` },
    { label: "收件人檔案", value: `${summary.metrics.profiles} 份` },
    { label: "低庫存商品", value: `${summary.metrics.lowStockCount} 項` },
    { label: "待處理訂單", value: `${summary.metrics.pendingOrders} 筆` }
  ];

  return (
    <div className="stack-lg">
      <section className="metric-grid">
        {metricCards.map((item) => (
          <article key={item.label} className="metric-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <div className="two-column">
        <section className="panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">近期訂單</span>
              <h2>最近五筆</h2>
            </div>
          </div>

          <div className="stack-sm">
            {summary.recentOrders.map((order) => (
              <article key={order.id} className="list-card">
                <div>
                  <strong>{order.orderNo}</strong>
                  <p>{order.customer.name} / {order.shipping.recipientName}</p>
                </div>
                <div className="list-card__meta">
                  <span>{order.fulfillmentStatus}</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">低庫存提醒</span>
              <h2>需要優先補貨</h2>
            </div>
          </div>
          <div className="stack-sm">
            {summary.lowStockProducts.map((product) => (
              <article key={product.id} className="list-card">
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.category}</p>
                </div>
                <div className="list-card__meta">
                  <span>庫存 {product.stock}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
