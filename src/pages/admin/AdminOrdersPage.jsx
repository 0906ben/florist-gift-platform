import { useEffect, useMemo, useState } from "react";
import { getAdminOrders, updateAdminOrder } from "../../api";
import {
  fulfillmentStatusOptions,
  orderStatusOptions,
  paymentStatusOptions
} from "../../data/options";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  function loadOrders() {
    return getAdminOrders().then((items) => {
      setOrders(items);
      if (!selectedId && items[0]) {
        setSelectedId(items[0].id);
      }
    });
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedId) || orders[0],
    [orders, selectedId]
  );

  async function updateStatus(field, value) {
    if (!selectedOrder) {
      return;
    }

    const nextOrder = await updateAdminOrder(selectedOrder.id, { [field]: value });
    setOrders((current) => current.map((item) => (item.id === nextOrder.id ? nextOrder : item)));
    setMessage("訂單狀態已更新");
  }

  return (
    <div className="two-column">
      <section className="panel">
        <div className="section-header">
          <div>
            <span className="eyebrow">訂單列表</span>
            <h2>所有訂單</h2>
          </div>
        </div>

        <div className="stack-sm">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              className={`order-list-item ${selectedOrder?.id === order.id ? "active" : ""}`}
              onClick={() => setSelectedId(order.id)}
            >
              <div>
                <strong>{order.orderNo}</strong>
                <p>{order.shipping.recipientName}</p>
              </div>
              <div className="list-card__meta">
                <span>{formatCurrency(order.totals.total)}</span>
                <span>{order.fulfillmentStatus}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel stack-md">
        {selectedOrder ? (
          <>
            <div className="section-header">
              <div>
                <span className="eyebrow">訂單詳情</span>
                <h2>{selectedOrder.orderNo}</h2>
              </div>
            </div>

            <div className="inline-stat">
              <strong>建立時間</strong>
              <span>{formatDate(selectedOrder.createdAt)}</span>
            </div>
            <div className="inline-stat">
              <strong>訂購人</strong>
              <span>{selectedOrder.customer.name} / {selectedOrder.customer.phone}</span>
            </div>
            <div className="inline-stat">
              <strong>收件地址</strong>
              <span>
                {selectedOrder.shipping.city}
                {selectedOrder.shipping.district}
                {selectedOrder.shipping.addressLine1}
              </span>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>訂單狀態</span>
                <select value={selectedOrder.status} onChange={(event) => updateStatus("status", event.target.value)}>
                  {orderStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>付款狀態</span>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(event) => updateStatus("paymentStatus", event.target.value)}
                >
                  {paymentStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>出貨狀態</span>
                <select
                  value={selectedOrder.fulfillmentStatus}
                  onChange={(event) => updateStatus("fulfillmentStatus", event.target.value)}
                >
                  {fulfillmentStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="stack-sm">
              {selectedOrder.items.map((item) => (
                <div key={item.productId} className="inline-stat">
                  <strong>
                    {item.name} x {item.quantity}
                  </strong>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />
            <div className="inline-stat inline-stat--strong">
              <strong>總計</strong>
              <span>{formatCurrency(selectedOrder.totals.total)}</span>
            </div>
            {message ? <p className="success-note">{message}</p> : null}
          </>
        ) : (
          <p className="loading-state">目前沒有訂單資料</p>
        )}
      </section>
    </div>
  );
}
