import { useEffect, useState } from "react";
import { getProfiles, saveProfile } from "../api";
import { profileRelationshipOptions } from "../data/options";
import { formatDateOnly } from "../utils/formatters";

function createEmptyProfile() {
  return {
    name: "",
    relationship: "女友",
    ageRange: "",
    stylePreference: "",
    sweetTooth: "",
    surprisePreference: "",
    preferredColors: "",
    favoriteFlowers: "",
    note: "",
    lastGift: "",
    importantDates: [
      { label: "生日", date: "" },
      { label: "紀念日", date: "" }
    ]
  };
}

export function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [draft, setDraft] = useState(createEmptyProfile());
  const [editingId, setEditingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function loadProfiles() {
    return getProfiles().then((items) => setProfiles(items));
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  function hydrateProfile(profile) {
    setEditingId(profile.id);
    setDraft({
      ...profile,
      preferredColors: profile.preferredColors.join(", "),
      favoriteFlowers: profile.favoriteFlowers.join(", ")
    });
  }

  function updateDate(index, key, value) {
    setDraft((current) => ({
      ...current,
      importantDates: current.importantDates.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await saveProfile(
        {
          ...draft,
          preferredColors: draft.preferredColors,
          favoriteFlowers: draft.favoriteFlowers
        },
        editingId || undefined
      );
      await loadProfiles();
      setDraft(createEmptyProfile());
      setEditingId("");
      setMessage(editingId ? "檔案已更新" : "檔案已建立");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="stack-lg">
      <section className="panel panel--banner">
        <span className="eyebrow">她的檔案</span>
        <h1>把重要偏好和重要日期先記住</h1>
        <p>先記下她喜歡的花、偏好的色系和重要日子，下次挑花時會省下很多重新思考的時間。</p>
      </section>

      <div className="two-column">
        <section className="panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">建立檔案</span>
              <h2>{editingId ? "編輯收件人檔案" : "新增收件人檔案"}</h2>
            </div>
          </div>

          <form className="stack-md" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field">
                <span>名稱</span>
                <input
                  required
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                />
              </label>

              <label className="field">
                <span>關係</span>
                <select
                  value={draft.relationship}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, relationship: event.target.value }))
                  }
                >
                  {profileRelationshipOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>年齡區間</span>
                <input
                  value={draft.ageRange}
                  onChange={(event) => setDraft((current) => ({ ...current, ageRange: event.target.value }))}
                  placeholder="例如 26-30"
                />
              </label>

              <label className="field">
                <span>風格偏好</span>
                <input
                  value={draft.stylePreference}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, stylePreference: event.target.value }))
                  }
                  placeholder="例如 儀式感派"
                />
              </label>

              <label className="field">
                <span>甜點偏好</span>
                <input
                  value={draft.sweetTooth}
                  onChange={(event) => setDraft((current) => ({ ...current, sweetTooth: event.target.value }))}
                />
              </label>

              <label className="field">
                <span>驚喜接受度</span>
                <input
                  value={draft.surprisePreference}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, surprisePreference: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>偏好色系</span>
                <input
                  value={draft.preferredColors}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, preferredColors: event.target.value }))
                  }
                  placeholder="逗號分隔"
                />
              </label>

              <label className="field">
                <span>喜歡花材</span>
                <input
                  value={draft.favoriteFlowers}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, favoriteFlowers: event.target.value }))
                  }
                  placeholder="逗號分隔"
                />
              </label>
            </div>

            <label className="field">
              <span>補充備註</span>
              <textarea
                rows="4"
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                placeholder="例如 不喜歡太亮的大紅色，喜歡能放在辦公桌的款式"
              />
            </label>

            <div className="stack-sm">
              <span className="field-label">重要日期</span>
              {draft.importantDates.map((item, index) => (
                <div key={`${item.label}-${index}`} className="date-row">
                  <input
                    value={item.label}
                    onChange={(event) => updateDate(index, "label", event.target.value)}
                    placeholder="日期名稱"
                  />
                  <input
                    type="date"
                    value={item.date}
                    onChange={(event) => updateDate(index, "date", event.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button className="primary-button" disabled={submitting} type="submit">
                {submitting ? "儲存中..." : editingId ? "更新檔案" : "新增檔案"}
              </button>
              {editingId ? (
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    setDraft(createEmptyProfile());
                    setEditingId("");
                  }}
                >
                  取消編輯
                </button>
              ) : null}
            </div>
            {message ? <p className="success-note">{message}</p> : null}
          </form>
        </section>

        <section className="stack-md">
          {profiles.map((profile) => (
            <article key={profile.id} className="panel">
              <div className="section-header">
                <div>
                  <span className="eyebrow">{profile.relationship}</span>
                  <h3>{profile.name}</h3>
                </div>
                <button className="ghost-button" type="button" onClick={() => hydrateProfile(profile)}>
                  編輯
                </button>
              </div>
              <p>{profile.note}</p>
              <div className="tag-row">
                {profile.favoriteFlowers.map((flower) => (
                  <span key={flower} className="tag-chip">
                    {flower}
                  </span>
                ))}
              </div>
              <div className="stack-sm">
                {profile.importantDates.map((item) => (
                  <div key={`${profile.id}-${item.label}`} className="inline-stat">
                    <strong>{item.label}</strong>
                    <span>{formatDateOnly(item.date)}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
