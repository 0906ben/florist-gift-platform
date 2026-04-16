import { useEffect, useState } from "react";
import { getAdminProfiles } from "../../api";
import { formatDateOnly } from "../../utils/formatters";

export function AdminProfilesPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getAdminProfiles().then((items) => setProfiles(items));
  }, []);

  return (
    <div className="stack-lg">
      <section className="panel panel--banner">
        <span className="eyebrow">收件人檔案總覽</span>
        <h1>後台可以快速理解偏好與重要日期</h1>
        <p>這裡先提供營運端查閱資料，未來若要做提醒排程或推薦規則，資料結構已經備好。</p>
      </section>

      <section className="profile-card-grid">
        {profiles.map((profile) => (
          <article key={profile.id} className="panel stack-sm">
            <div className="section-header">
              <div>
                <span className="eyebrow">{profile.relationship}</span>
                <h2>{profile.name}</h2>
              </div>
            </div>
            <p>{profile.note}</p>
            <div className="tag-row">
              {profile.preferredColors.map((color) => (
                <span key={color} className="tag-chip">
                  {color}
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
  );
}
