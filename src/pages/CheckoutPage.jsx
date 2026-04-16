import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getProfiles } from "../api";
import { useCart } from "../context/CartContext";
import { paymentMethods } from "../data/options";
import { formatCurrency } from "../utils/formatters";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [profiles, setProfiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [shipping, setShipping] = useState({
    recipientName: "",
    phone: "",
    city: "台北市",
    district: "",
    addressLine1: "",
    addressLine2: "",
    deliveryDate: "",
    deliverySlot: "19:00-21:00",
    note: ""
  });
  const [addOns, setAddOns] = useState({
    giftWrap: true,
    handwriteCard: true,
    cardMessage: "",
    deliveryDecoration: "霧面緞帶"
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardForm, setCardForm] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvc: ""
  });

  useEffect(() => {
    getProfiles().then((items) => setProfiles(items));
  }, []);

  const estimate = useMemo(() => {
    const shippingFee = subtotal >= 3000 ? 0 : 240;
    const wrapFee = addOns.giftWrap ? 180 : 0;
    const cardFee = addOns.handwriteCard ? 120 : 0;
    const scheduleFee = shipping.deliveryDate && shipping.deliverySlot ? 150 : 0;
    return {
      shippingFee,
      wrapFee,
      cardFee,
      scheduleFee,
      total: subtotal + shippingFee + wrapFee + cardFee + scheduleFee
    };
  }, [subtotal, addOns.giftWrap, addOns.handwriteCard, shipping.deliveryDate, shipping.deliverySlot]);

  if (!items.length) {
    return (
      <section className="panel">
        <h1>購物車是空的</h1>
        <p>請先加入商品再進行結帳。</p>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (paymentMethod === "credit-card") {
      const cardFields = [cardForm.holder, cardForm.number, cardForm.expiry, cardForm.cvc];
      if (cardFields.some((value) => !value.trim())) {
        setSubmitting(false);
        setError("請完整填寫信用卡付款資訊");
        return;
      }
    }

    try {
      const order = await createOrder({
        items,
        customer,
        shipping,
        addOns,
        paymentMethod,
        recipientProfileId: selectedProfileId || undefined
      });
      window.sessionStorage.setItem("lazy-bloom-last-order", JSON.stringify(order));
      clearCart();
      navigate(`/order/${order.id}`, { state: { order } });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="two-column">
      <form className="stack-lg" onSubmit={handleSubmit}>
        <section className="panel stack-md">
          <div className="section-header">
            <div>
              <span className="eyebrow">收件人檔案</span>
              <h2>可直接套用既有資料</h2>
            </div>
          </div>

          <label className="field">
            <span>套用檔案</span>
            <select
              value={selectedProfileId}
              onChange={(event) => {
                const profileId = event.target.value;
                setSelectedProfileId(profileId);
                const profile = profiles.find((item) => item.id === profileId);
                if (profile) {
                  setShipping((current) => ({
                    ...current,
                    recipientName: profile.name,
                    note: profile.note || current.note
                  }));
                }
              }}
            >
              <option value="">不套用</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} / {profile.relationship}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="panel stack-md">
          <span className="eyebrow">訂購人資訊</span>
          <div className="form-grid">
            <label className="field">
              <span>姓名</span>
              <input required value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field">
              <span>Email</span>
              <input required type="email" value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="field">
              <span>手機</span>
              <input required value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} />
            </label>
          </div>
        </section>

        <section className="panel stack-md">
          <span className="eyebrow">收件資訊</span>
          <div className="form-grid">
            <label className="field">
              <span>收件人</span>
              <input required value={shipping.recipientName} onChange={(event) => setShipping((current) => ({ ...current, recipientName: event.target.value }))} />
            </label>
            <label className="field">
              <span>收件電話</span>
              <input required value={shipping.phone} onChange={(event) => setShipping((current) => ({ ...current, phone: event.target.value }))} />
            </label>
            <label className="field">
              <span>城市</span>
              <input required value={shipping.city} onChange={(event) => setShipping((current) => ({ ...current, city: event.target.value }))} />
            </label>
            <label className="field">
              <span>地區</span>
              <input required value={shipping.district} onChange={(event) => setShipping((current) => ({ ...current, district: event.target.value }))} />
            </label>
            <label className="field field--wide">
              <span>地址</span>
              <input required value={shipping.addressLine1} onChange={(event) => setShipping((current) => ({ ...current, addressLine1: event.target.value }))} />
            </label>
            <label className="field field--wide">
              <span>地址補充</span>
              <input value={shipping.addressLine2} onChange={(event) => setShipping((current) => ({ ...current, addressLine2: event.target.value }))} />
            </label>
            <label className="field">
              <span>配送日期</span>
              <input type="date" value={shipping.deliveryDate} onChange={(event) => setShipping((current) => ({ ...current, deliveryDate: event.target.value }))} />
            </label>
            <label className="field">
              <span>配送時段</span>
              <select value={shipping.deliverySlot} onChange={(event) => setShipping((current) => ({ ...current, deliverySlot: event.target.value }))}>
                <option value="10:00-13:00">10:00 - 13:00</option>
                <option value="14:00-18:00">14:00 - 18:00</option>
                <option value="19:00-21:00">19:00 - 21:00</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>配送備註</span>
            <textarea rows="3" value={shipping.note} onChange={(event) => setShipping((current) => ({ ...current, note: event.target.value }))} />
          </label>
        </section>

        <section className="panel stack-md">
          <span className="eyebrow">加值服務</span>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={addOns.giftWrap}
              onChange={(event) => setAddOns((current) => ({ ...current, giftWrap: event.target.checked }))}
            />
            <span>精裝包裝 + {formatCurrency(180)}</span>
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={addOns.handwriteCard}
              onChange={(event) => setAddOns((current) => ({ ...current, handwriteCard: event.target.checked }))}
            />
            <span>代寫卡片 + {formatCurrency(120)}</span>
          </label>
          <label className="field">
            <span>包裝風格</span>
            <input
              value={addOns.deliveryDecoration}
              onChange={(event) => setAddOns((current) => ({ ...current, deliveryDecoration: event.target.value }))}
            />
          </label>
          <label className="field">
            <span>卡片內容</span>
            <textarea rows="3" value={addOns.cardMessage} onChange={(event) => setAddOns((current) => ({ ...current, cardMessage: event.target.value }))} />
          </label>
        </section>

        <section className="panel stack-md">
          <span className="eyebrow">付款方式</span>
          <div className="payment-option-grid">
            {paymentMethods.map((method) => (
              <label key={method.id} className={`payment-option ${paymentMethod === method.id ? "active" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>

          {paymentMethod === "credit-card" ? (
            <div className="form-grid">
              <label className="field field--wide">
                <span>持卡人</span>
                <input value={cardForm.holder} onChange={(event) => setCardForm((current) => ({ ...current, holder: event.target.value }))} />
              </label>
              <label className="field field--wide">
                <span>卡號</span>
                <input value={cardForm.number} onChange={(event) => setCardForm((current) => ({ ...current, number: event.target.value }))} placeholder="4111 1111 1111 1111" />
              </label>
              <label className="field">
                <span>有效期限</span>
                <input value={cardForm.expiry} onChange={(event) => setCardForm((current) => ({ ...current, expiry: event.target.value }))} placeholder="12/29" />
              </label>
              <label className="field">
                <span>CVC</span>
                <input value={cardForm.cvc} onChange={(event) => setCardForm((current) => ({ ...current, cvc: event.target.value }))} placeholder="123" />
              </label>
            </div>
          ) : (
            <p className="muted-text">送出訂單後，我們會先為你保留花禮並以人工方式確認後續付款資訊。</p>
          )}
        </section>

        {error ? <p className="error-note">{error}</p> : null}

        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? "建立訂單中..." : "送出訂單"}
        </button>
      </form>

      <aside className="panel order-summary stack-md">
        <span className="eyebrow">確認明細</span>
        <h2>本次結帳摘要</h2>
        {items.map((item) => (
          <div key={item.productId} className="inline-stat">
            <strong>
              {item.name} x {item.quantity}
            </strong>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="summary-divider" />
        <div className="inline-stat">
          <strong>商品小計</strong>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="inline-stat">
          <strong>運費</strong>
          <span>{estimate.shippingFee ? formatCurrency(estimate.shippingFee) : "免運"}</span>
        </div>
        <div className="inline-stat">
          <strong>精裝包裝</strong>
          <span>{estimate.wrapFee ? formatCurrency(estimate.wrapFee) : "未選擇"}</span>
        </div>
        <div className="inline-stat">
          <strong>手寫卡</strong>
          <span>{estimate.cardFee ? formatCurrency(estimate.cardFee) : "未選擇"}</span>
        </div>
        <div className="inline-stat">
          <strong>指定配送</strong>
          <span>{estimate.scheduleFee ? formatCurrency(estimate.scheduleFee) : "未選擇"}</span>
        </div>
        <div className="summary-divider" />
        <div className="inline-stat inline-stat--strong">
          <strong>總計</strong>
          <span>{formatCurrency(estimate.total)}</span>
        </div>
      </aside>
    </div>
  );
}
