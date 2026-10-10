"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSectionNav from "./AdminSectionNav";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type OpeningHoursSlot = {
  enabled: boolean;
  open: string;
  close: string;
};

type WeeklyOpeningHours = Record<DayKey, OpeningHoursSlot>;

type StoreSettings = {
  schemaReady: boolean;
  orderingPaused: boolean;
  collectionEnabled: boolean;
  deliveryEnabled: boolean;
  prepTimeMinutes: number | null;
  openingHoursEnabled: boolean;
  openingHours: WeeklyOpeningHours;
};

const DAYS: Array<{ key: DayKey; label: string }> = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" }
];

export default function AdminStoreSettings({
  settings,
  loadError
}: {
  settings: StoreSettings | null;
  loadError?: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(settings);
  const [hoursDraft, setHoursDraft] = useState(settings?.openingHours ?? null);
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const patch = async (
    changes: Partial<Omit<StoreSettings, "schemaReady">>,
    key: string
  ) => {
    if (!current?.schemaReady) return;

    setBusy(key);
    setActionError("");
    setSavedMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Could not update store settings.");
      }

      setCurrent(result);
      setHoursDraft(result.openingHours);
      setSavedMessage("Settings saved.");
      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update store settings."
      );
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <span className="admin-star" aria-hidden="true">★</span>
          <div>
            <strong>STAR PIZZA</strong>
            <span>RESTAURANT ADMIN</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <button type="button" onClick={() => router.refresh()}>Refresh</button>
          <form action="/api/admin/session" method="post">
            <input type="hidden" name="action" value="logout" />
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <AdminSectionNav active="settings" />

      <section className="admin-dashboard admin-settings-page">
        <div className="admin-dashboard-heading admin-settings-heading">
          <div>
            <span className="admin-eyebrow">STORE SETTINGS</span>
            <h1>Control when orders come in.</h1>
            <p>
              Pause ordering in one tap, control collection availability and set the
              weekly online-ordering schedule.
            </p>
          </div>

          {current && (
            <div className={`admin-store-live-state${current.orderingPaused ? " paused" : ""}`}>
              <i />
              <div>
                <span>Online ordering</span>
                <strong>{current.orderingPaused ? "Paused" : "Live"}</strong>
              </div>
            </div>
          )}
        </div>

        {(loadError || actionError) && (
          <div className="admin-alert">{actionError || loadError}</div>
        )}

        {savedMessage && <div className="admin-settings-success">{savedMessage}</div>}

        {current && !current.schemaReady && (
          <div className="admin-settings-migration">
            <strong>One database update is required.</strong>
            <span>
              The settings screen is ready, but the new store-control columns need
              adding to Neon before these switches can be changed.
            </span>
          </div>
        )}

        {!current ? (
          <div className="admin-column-empty">Store settings could not be loaded.</div>
        ) : (
          <div className="admin-settings-grid">
            <section className="admin-settings-card admin-settings-card--pause">
              <div>
                <span className="admin-eyebrow">EMERGENCY CONTROL</span>
                <h2>{current.orderingPaused ? "Ordering is paused" : "Ordering is live"}</h2>
                <p>
                  Use this when the kitchen is overloaded or you need to stop new web
                  orders immediately. Existing orders stay on the Order Desk.
                </p>
              </div>
              <button
                type="button"
                className={current.orderingPaused ? "resume" : "pause"}
                disabled={!current.schemaReady || Boolean(busy)}
                onClick={() => patch({ orderingPaused: !current.orderingPaused }, "pause")}
              >
                {busy === "pause"
                  ? "Updating…"
                  : current.orderingPaused
                    ? "Resume online ordering"
                    : "Pause online ordering"}
              </button>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-card-head">
                <div>
                  <span className="admin-eyebrow">ORDER CHANNELS</span>
                  <h2>Collection &amp; delivery</h2>
                </div>
              </div>

              <div className="admin-setting-row">
                <div>
                  <strong>Collection orders</strong>
                  <span>Allow customers to place collection orders online.</span>
                </div>
                <button
                  type="button"
                  className={`admin-switch${current.collectionEnabled ? " on" : ""}`}
                  aria-pressed={current.collectionEnabled}
                  disabled={!current.schemaReady || Boolean(busy)}
                  onClick={() => patch({ collectionEnabled: !current.collectionEnabled }, "collection")}
                >
                  <i />
                </button>
              </div>

              <div className="admin-setting-row muted">
                <div>
                  <strong>Delivery orders</strong>
                  <span>
                    Prepared here, but delivery-zone validation still needs connecting
                    before this can be enabled.
                  </span>
                </div>
                <button type="button" className="admin-switch" aria-pressed="false" disabled>
                  <i />
                </button>
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-card-head">
                <div>
                  <span className="admin-eyebrow">PREP TIME</span>
                  <h2>ASAP estimate</h2>
                </div>
              </div>

              <label className="admin-prep-select">
                <span>Typical collection prep time</span>
                <select
                  value={current.prepTimeMinutes ?? ""}
                  disabled={!current.schemaReady || Boolean(busy)}
                  onChange={(event) =>
                    patch(
                      { prepTimeMinutes: event.target.value ? Number(event.target.value) : null },
                      "prep"
                    )
                  }
                >
                  <option value="">Don&apos;t show an estimate yet</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </label>
              <p className="admin-setting-help">
                When set, checkout tells customers roughly how long an ASAP
                collection should take.
              </p>
            </section>

            <section className="admin-settings-card admin-settings-card--hours">
              <div className="admin-settings-card-head">
                <div>
                  <span className="admin-eyebrow">OPENING HOURS</span>
                  <h2>Weekly online-ordering schedule</h2>
                </div>

                <button
                  type="button"
                  className={`admin-switch${current.openingHoursEnabled ? " on" : ""}`}
                  aria-pressed={current.openingHoursEnabled}
                  disabled={!current.schemaReady || Boolean(busy)}
                  onClick={() =>
                    patch({ openingHoursEnabled: !current.openingHoursEnabled }, "hours-enabled")
                  }
                >
                  <i />
                </button>
              </div>

              <p className="admin-setting-help">
                Leave this off until the real weekly hours are entered. The manual
                pause switch still works at any time.
              </p>

              {hoursDraft && (
                <div className="admin-hours-list">
                  {DAYS.map(({ key, label }) => {
                    const slot = hoursDraft[key];

                    return (
                      <div className="admin-hours-row" key={key}>
                        <label className="admin-hours-day">
                          <input
                            type="checkbox"
                            checked={slot.enabled}
                            disabled={!current.schemaReady || Boolean(busy)}
                            onChange={(event) =>
                              setHoursDraft({
                                ...hoursDraft,
                                [key]: { ...slot, enabled: event.target.checked }
                              })
                            }
                          />
                          <strong>{label}</strong>
                        </label>

                        <div className="admin-hours-times">
                          <input
                            type="time"
                            value={slot.open}
                            disabled={!slot.enabled || !current.schemaReady || Boolean(busy)}
                            onChange={(event) =>
                              setHoursDraft({
                                ...hoursDraft,
                                [key]: { ...slot, open: event.target.value }
                              })
                            }
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={slot.close}
                            disabled={!slot.enabled || !current.schemaReady || Boolean(busy)}
                            onChange={(event) =>
                              setHoursDraft({
                                ...hoursDraft,
                                [key]: { ...slot, close: event.target.value }
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                className="admin-save-hours"
                disabled={!current.schemaReady || Boolean(busy) || !hoursDraft}
                onClick={() => hoursDraft && patch({ openingHours: hoursDraft }, "hours")}
              >
                {busy === "hours" ? "Saving hours…" : "Save opening hours"}
              </button>
            </section>
          </div>
        )}
      </section>
    </>
  );
}
