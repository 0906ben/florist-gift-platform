import { useEffect, useState } from "react";
import {
  createAdminProduct,
  getAdminProducts,
  updateAdminProduct,
  uploadAdminImage
} from "../../api";
import { productCategories } from "../../data/options";
import { formatCurrency, formatDate } from "../../utils/formatters";

function createEmptyDraft() {
  return {
    name: "",
    subtitle: "",
    category: "bouquet",
    price: 0,
    compareAt: 0,
    stock: 0,
    status: "active",
    featured: false,
    imageUrl: "",
    flowerTypes: "",
    occasionTags: "",
    moodTags: "",
    palette: "#ffe6ee, #f3b8c8, #7f445b",
    description: "",
    whyItWorks: "",
    whoWillLoveIt: "",
    reminder: "",
    leadTimeDays: 2
  };
}

function productToDraft(product) {
  return {
    ...product,
    flowerTypes: product.flowerTypes.join(", "),
    occasionTags: product.occasionTags.join(", "),
    moodTags: product.moodTags.join(", "),
    palette: product.palette.join(", ")
  };
}

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [draft, setDraft] = useState(createEmptyDraft());
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function loadProducts() {
    return getAdminProducts().then((items) => setProducts(items));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await updateAdminProduct(editingId, draft);
      } else {
        await createAdminProduct(draft);
      }
      await loadProducts();
      setDraft(createEmptyDraft());
      setEditingId("");
      setMessage(editingId ? "商品已更新" : "商品已新增");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack-lg">
      <section className="panel panel--banner">
        <span className="eyebrow">後台商品管理</span>
        <h1>新增商品是這個平台的核心管理功能</h1>
        <p>表單會直接寫入模擬後端資料檔，前台清單和商品頁也會即時吃到新商品。</p>
      </section>

      <div className="admin-products-grid">
        <section className="panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">商品表單</span>
              <h2>{editingId ? "編輯商品" : "新增商品"}</h2>
            </div>
          </div>

          <form className="stack-md" onSubmit={handleSubmit}>
            <div className="stack-sm">
              <span className="field-label">主視覺圖</span>
              <div className="image-upload-row">
                <label className="secondary-button image-upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      setUploading(true);
                      setMessage("");
                      try {
                        const result = await uploadAdminImage(file);
                        setDraft((current) => ({ ...current, imageUrl: result.imageUrl }));
                        setMessage("主視覺圖已上傳");
                      } catch (error) {
                        setMessage(error.message);
                      } finally {
                        setUploading(false);
                        event.target.value = "";
                      }
                    }}
                  />
                  {uploading ? "上傳中..." : "上傳照片"}
                </label>
                {draft.imageUrl ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, imageUrl: "" }))}
                  >
                    清除照片
                  </button>
                ) : null}
              </div>
              {draft.imageUrl ? (
                <div className="image-preview">
                  <img src={draft.imageUrl} alt={draft.name || "商品主圖預覽"} />
                </div>
              ) : (
                <p className="muted-text">若未上傳照片，前台會改用抽象色塊當作商品視覺。</p>
              )}
            </div>

            <div className="form-grid">
              <label className="field field--wide">
                <span>商品名稱</span>
                <input required value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="field field--wide">
                <span>副標</span>
                <input value={draft.subtitle} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} />
              </label>
              <label className="field">
                <span>類別</span>
                <select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>
                  {productCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>售價</span>
                <input type="number" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value) }))} />
              </label>
              <label className="field">
                <span>原價</span>
                <input type="number" value={draft.compareAt} onChange={(event) => setDraft((current) => ({ ...current, compareAt: Number(event.target.value) }))} />
              </label>
              <label className="field">
                <span>庫存</span>
                <input type="number" value={draft.stock} onChange={(event) => setDraft((current) => ({ ...current, stock: Number(event.target.value) }))} />
              </label>
              <label className="field">
                <span>狀態</span>
                <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
                  <option value="active">上架中</option>
                  <option value="draft">草稿</option>
                </select>
              </label>
              <label className="field">
                <span>備貨天數</span>
                <input type="number" value={draft.leadTimeDays} onChange={(event) => setDraft((current) => ({ ...current, leadTimeDays: Number(event.target.value) }))} />
              </label>
              <label className="field field--wide">
                <span>花材</span>
                <input value={draft.flowerTypes} onChange={(event) => setDraft((current) => ({ ...current, flowerTypes: event.target.value }))} placeholder="逗號分隔" />
              </label>
              <label className="field field--wide">
                <span>場合標籤</span>
                <input value={draft.occasionTags} onChange={(event) => setDraft((current) => ({ ...current, occasionTags: event.target.value }))} placeholder="birthday, anniversary" />
              </label>
              <label className="field field--wide">
                <span>情緒標籤</span>
                <input value={draft.moodTags} onChange={(event) => setDraft((current) => ({ ...current, moodTags: event.target.value }))} placeholder="儀式感, 穩妥" />
              </label>
              <label className="field field--wide">
                <span>色票</span>
                <input value={draft.palette} onChange={(event) => setDraft((current) => ({ ...current, palette: event.target.value }))} placeholder="#ffe6ee, #f3b8c8, #7f445b" />
              </label>
            </div>

            <label className="toggle-row">
              <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))} />
              <span>設為首頁主打推薦</span>
            </label>

            <label className="field">
              <span>商品說明</span>
              <textarea rows="4" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
            </label>
            <label className="field">
              <span>為什麼選這個</span>
              <textarea rows="3" value={draft.whyItWorks} onChange={(event) => setDraft((current) => ({ ...current, whyItWorks: event.target.value }))} />
            </label>
            <label className="field">
              <span>誰會喜歡</span>
              <textarea rows="3" value={draft.whoWillLoveIt} onChange={(event) => setDraft((current) => ({ ...current, whoWillLoveIt: event.target.value }))} />
            </label>
            <label className="field">
              <span>送禮提醒</span>
              <textarea rows="3" value={draft.reminder} onChange={(event) => setDraft((current) => ({ ...current, reminder: event.target.value }))} />
            </label>

            <div className="form-actions">
              <button className="primary-button" disabled={saving} type="submit">
                {saving ? "儲存中..." : editingId ? "更新商品" : "新增商品"}
              </button>
              {editingId ? (
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setDraft(createEmptyDraft());
                  }}
                >
                  取消編輯
                </button>
              ) : null}
            </div>

            {message ? <p className="success-note">{message}</p> : null}
          </form>
        </section>

        <section className="panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">商品列表</span>
              <h2>目前資料庫內容</h2>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>價格</th>
                  <th>庫存</th>
                  <th>狀態</th>
                  <th>更新時間</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <div>{product.category}</div>
                      <div>{product.imageUrl ? "已有主圖" : "未上傳主圖"}</div>
                    </td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.status}</td>
                    <td>{formatDate(product.updatedAt)}</td>
                    <td>
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => {
                          setEditingId(product.id);
                          setDraft(productToDraft(product));
                        }}
                      >
                        編輯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
