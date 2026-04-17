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
  const [notice, setNotice] = useState("");
  const [editorNotice, setEditorNotice] = useState("");
  const [editorError, setEditorError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  function loadProducts() {
    return getAdminProducts().then((items) => setProducts(items));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetEditorState() {
    setEditingId("");
    setDraft(createEmptyDraft());
    setEditorNotice("");
    setEditorError("");
  }

  function closeEditor() {
    setEditorOpen(false);
    resetEditorState();
  }

  function openCreateEditor() {
    setNotice("");
    resetEditorState();
    setEditorOpen(true);
  }

  function openEditEditor(product) {
    setNotice("");
    setEditingId(product.id);
    setDraft(productToDraft(product));
    setEditorNotice("");
    setEditorError("");
    setEditorOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setEditorNotice("");
    setEditorError("");

    try {
      const wasEditing = Boolean(editingId);
      if (wasEditing) {
        await updateAdminProduct(editingId, draft);
      } else {
        await createAdminProduct(draft);
      }

      await loadProducts();
      setNotice(wasEditing ? "商品已更新" : "商品已新增");
      closeEditor();
    } catch (error) {
      setEditorError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setEditorNotice("");
    setEditorError("");

    try {
      const result = await uploadAdminImage(file);
      setDraft((current) => ({ ...current, imageUrl: result.imageUrl }));
      setEditorNotice("主視覺圖已上傳");
    } catch (error) {
      setEditorError(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="stack-lg">
      <section className="panel panel--banner">
        <span className="eyebrow">後台商品管理</span>
        <h1>商品列表與編輯流程分開，設定會更清楚</h1>
        <p>先在列表中瀏覽商品，再透過右側二級面板進入新增或編輯，避免表單把主畫面擠在一起。</p>
      </section>

      <section className="panel">
        <div className="admin-toolbar">
          <div>
            <span className="eyebrow">商品列表</span>
            <h2>目前資料庫內容</h2>
          </div>

          <button className="primary-button" type="button" onClick={openCreateEditor}>
            新增商品
          </button>
        </div>

        {notice ? <p className="success-note">{notice}</p> : null}

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
                      onClick={() => openEditEditor(product)}
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

      {editorOpen ? (
        <div className="editor-drawer-overlay" onClick={closeEditor}>
          <aside className="editor-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="editor-drawer__header">
              <div>
                <span className="eyebrow">商品表單</span>
                <h2>{editingId ? "編輯商品" : "新增商品"}</h2>
              </div>

              <button className="ghost-button" type="button" onClick={closeEditor}>
                關閉
              </button>
            </div>

            <form className="stack-md" onSubmit={handleSubmit}>
              <section className="admin-form-section stack-sm">
                <div>
                  <span className="field-label">主視覺圖</span>
                  <p className="muted-text">先上傳商品主要照片，預覽會保留原始比例顯示。</p>
                </div>

                <div className="image-upload-row">
                  <label className="secondary-button image-upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
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
              </section>

              <section className="admin-form-section stack-sm">
                <div>
                  <span className="field-label">主要調整</span>
                  <p className="muted-text">商品名稱、價格、庫存和類別先在這裡整理好。</p>
                </div>

                <div className="form-grid admin-form-grid">
                  <label className="field field--wide">
                    <span>商品名稱</span>
                    <input
                      required
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </label>

                  <label className="field field--wide">
                    <span>副標</span>
                    <input
                      value={draft.subtitle}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, subtitle: event.target.value }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>類別</span>
                    <select
                      value={draft.category}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, category: event.target.value }))
                      }
                    >
                      {productCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span>售價</span>
                    <input
                      type="number"
                      value={draft.price}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, price: Number(event.target.value) }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>原價</span>
                    <input
                      type="number"
                      value={draft.compareAt}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          compareAt: Number(event.target.value)
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>庫存</span>
                    <input
                      type="number"
                      value={draft.stock}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, stock: Number(event.target.value) }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>狀態</span>
                    <select
                      value={draft.status}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, status: event.target.value }))
                      }
                    >
                      <option value="active">上架中</option>
                      <option value="draft">草稿</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>備貨天數</span>
                    <input
                      type="number"
                      value={draft.leadTimeDays}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          leadTimeDays: Number(event.target.value)
                        }))
                      }
                    />
                  </label>

                  <label className="field field--wide">
                    <span>花材</span>
                    <input
                      value={draft.flowerTypes}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, flowerTypes: event.target.value }))
                      }
                      placeholder="逗號分隔"
                    />
                  </label>

                  <label className="field field--wide">
                    <span>場合標籤</span>
                    <input
                      value={draft.occasionTags}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, occasionTags: event.target.value }))
                      }
                      placeholder="birthday, anniversary"
                    />
                  </label>

                  <label className="field field--wide">
                    <span>情緒標籤</span>
                    <input
                      value={draft.moodTags}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, moodTags: event.target.value }))
                      }
                      placeholder="儀式感, 穩妥"
                    />
                  </label>

                  <label className="field field--wide">
                    <span>色票</span>
                    <input
                      value={draft.palette}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, palette: event.target.value }))
                      }
                      placeholder="#ffe6ee, #f3b8c8, #7f445b"
                    />
                  </label>
                </div>
              </section>

              <section className="admin-form-section stack-sm">
                <div>
                  <span className="field-label">首頁主打</span>
                  <p className="muted-text">若想讓這個商品出現在首頁精選區，再打開這個選項即可。</p>
                </div>

                <label className="toggle-row admin-toggle-row">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, featured: event.target.checked }))
                    }
                  />
                  <span>設為首頁主打推薦</span>
                </label>
              </section>

              <section className="admin-form-section stack-sm">
                <div>
                  <span className="field-label">文案內容</span>
                  <p className="muted-text">補上商品說明與送禮語氣，前台頁面會直接讀取這些內容。</p>
                </div>

                <label className="field">
                  <span>商品說明</span>
                  <textarea
                    rows="4"
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                </label>

                <label className="field">
                  <span>為什麼選這個</span>
                  <textarea
                    rows="3"
                    value={draft.whyItWorks}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, whyItWorks: event.target.value }))
                    }
                  />
                </label>

                <label className="field">
                  <span>誰會喜歡</span>
                  <textarea
                    rows="3"
                    value={draft.whoWillLoveIt}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, whoWillLoveIt: event.target.value }))
                    }
                  />
                </label>

                <label className="field">
                  <span>送禮提醒</span>
                  <textarea
                    rows="3"
                    value={draft.reminder}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, reminder: event.target.value }))
                    }
                  />
                </label>
              </section>

              <div className="form-actions">
                <button className="primary-button" disabled={saving} type="submit">
                  {saving ? "儲存中..." : editingId ? "更新商品" : "新增商品"}
                </button>
                <button className="ghost-button" type="button" onClick={closeEditor}>
                  取消
                </button>
              </div>

              {editorNotice ? <p className="success-note">{editorNotice}</p> : null}
              {editorError ? <p className="error-note">{editorError}</p> : null}
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
