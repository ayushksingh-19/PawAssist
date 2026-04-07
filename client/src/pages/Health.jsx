import { useMemo, useState } from "react";
import useAppData from "../services/useAppData";

const activityByRange = {
  week: [
    { label: "Mon", value: 36 },
    { label: "Tue", value: 48 },
    { label: "Wed", value: 44 },
    { label: "Thu", value: 51 },
    { label: "Fri", value: 57 },
    { label: "Sat", value: 68 },
    { label: "Sun", value: 61 },
  ],
  month: [
    { label: "W1", value: 42 },
    { label: "W2", value: 55 },
    { label: "W3", value: 51 },
    { label: "W4", value: 64 },
  ],
  year: [
    { label: "Jan", value: 34 },
    { label: "Feb", value: 41 },
    { label: "Mar", value: 47 },
    { label: "Apr", value: 53 },
    { label: "May", value: 49 },
    { label: "Jun", value: 58 },
  ],
};

const defaultVaccinations = [
  {
    id: "vac-1",
    title: "Rabies Booster",
    date: "Apr 10, 2026",
    due: "3 days remaining",
    doctor: "Dr. Priya Sharma",
    location: "PetCare Clinic, Mumbai",
    status: "Upcoming",
  },
  {
    id: "vac-2",
    title: "Distemper Vaccine",
    date: "May 15, 2026",
    due: "38 days remaining",
    doctor: "Dr. Rajesh Mehta",
    location: "VetCare Hospital, Andheri",
    status: "Upcoming",
  },
  {
    id: "vac-3",
    title: "Parvovirus Shot",
    date: "Jan 20, 2026",
    due: "Completed on time",
    doctor: "Dr. Priya Sharma",
    location: "PetCare Clinic, Mumbai",
    status: "Done",
  },
];

const defaultDietPlan = [
  { id: "meal-1", meal: "Breakfast", detail: "Royal Canin Adult - 150g", time: "7:00 AM", calories: 450 },
  { id: "meal-2", meal: "Lunch", detail: "Chicken & Rice - 200g", time: "1:00 PM", calories: 600 },
  { id: "meal-3", meal: "Dinner", detail: "Royal Canin Adult - 150g", time: "7:30 PM", calories: 450 },
  { id: "meal-4", meal: "Snacks", detail: "Dental Chews, Carrots - 50g", time: "Throughout day", calories: 150 },
];

const recentActivitiesSeed = [
  { id: "act-1", title: "Morning Walk", subtitle: "2 hours ago", meta: "45 mins", calories: 350, tone: "violet" },
  { id: "act-2", title: "Meal Time", subtitle: "5 hours ago", meta: "15 mins", calories: 450, tone: "clay" },
  { id: "act-3", title: "Play Session", subtitle: "8 hours ago", meta: "30 mins", calories: 280, tone: "rose" },
];

const summaryByPetName = {
  bruno: {
    breed: "Labrador Retriever",
    score: 95,
    scoreNote: "Excellent condition",
    weight: "28 kg",
    weightTarget: "Target: 27 kg",
    weightDelta: "+0.5 kg",
    activity: "12,543",
    activityTarget: "Target: 10,000",
    activityDelta: "+1,234",
    heartRate: "85 bpm",
    heartTarget: "Target: 80-100 bpm",
    heartDelta: "Normal",
    calories: "1,450",
    caloriesTarget: "Target: 1,600",
    caloriesDelta: "-150",
    hydration: "2.5 L",
    hydrationTarget: "Target: 2.0 L",
    hydrationDelta: "+0.3 L",
    temperature: "38.5°C",
    temperatureTarget: "Target: 38-39°C",
    temperatureDelta: "Normal",
    goals: [
      { id: "goal-1", title: "Weight Management", detail: "Lose 1 kg", progress: 75, tone: "sky" },
      { id: "goal-2", title: "Increase Activity", detail: "12k steps/day", progress: 85, tone: "green" },
      { id: "goal-3", title: "Balanced Diet", detail: "1600 kcal/day", progress: 90, tone: "clay" },
      { id: "goal-4", title: "Heart Health", detail: "Maintain rate", progress: 95, tone: "rose" },
    ],
  },
  misty: {
    breed: "Persian Cat",
    score: 88,
    scoreNote: "Good and stable",
    weight: "4 kg",
    weightTarget: "Target: 4.2 kg",
    weightDelta: "+0.2 kg",
    activity: "8,640",
    activityTarget: "Target: 7,500",
    activityDelta: "+840",
    heartRate: "128 bpm",
    heartTarget: "Target: 120-140 bpm",
    heartDelta: "Healthy",
    calories: "920",
    caloriesTarget: "Target: 1,000",
    caloriesDelta: "-80",
    hydration: "1.4 L",
    hydrationTarget: "Target: 1.2 L",
    hydrationDelta: "+0.2 L",
    temperature: "38.3°C",
    temperatureTarget: "Target: 38-39°C",
    temperatureDelta: "Optimal",
    goals: [
      { id: "goal-5", title: "Weight Balance", detail: "Maintain current", progress: 82, tone: "sky" },
      { id: "goal-6", title: "Play Time", detail: "3 sessions/day", progress: 78, tone: "green" },
      { id: "goal-7", title: "Hydration", detail: "1.2L daily", progress: 89, tone: "clay" },
      { id: "goal-8", title: "Coat Health", detail: "Omega routine", progress: 92, tone: "rose" },
    ],
  },
};

const activityInitialForm = {
  type: "Walk",
  duration: "30",
  calories: "250",
  notes: "",
};

export default function Health() {
  const { data, loading } = useAppData();
  const pets = data?.pets || [];
  const [selectedPetId, setSelectedPetId] = useState("");
  const [range, setRange] = useState("week");
  const [showAllVaccines, setShowAllVaccines] = useState(false);
  const [activities, setActivities] = useState(recentActivitiesSeed);
  const [vaccinations] = useState(defaultVaccinations);
  const [dietPlan, setDietPlan] = useState(defaultDietPlan);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [activityForm, setActivityForm] = useState(activityInitialForm);
  const [dietTarget, setDietTarget] = useState("1650");
  const [actionMessage, setActionMessage] = useState("");

  const resolvedPetId = selectedPetId || pets[0]?.id || "";
  const selectedPet = pets.find((pet) => pet.id === resolvedPetId) || pets[0];
  const summaryKey = selectedPet?.name?.toLowerCase() === "misty" ? "misty" : "bruno";
  const summary = summaryByPetName[summaryKey];
  const activityData = activityByRange[range];
  const visibleVaccinations = showAllVaccines ? vaccinations : vaccinations.slice(0, 3);

  const totalDietCalories = useMemo(
    () => dietPlan.reduce((sum, meal) => sum + meal.calories, 0),
    [dietPlan],
  );

  const metrics = [
    { id: "metric-1", title: "Weight", value: summary.weight, target: summary.weightTarget, delta: summary.weightDelta, tone: "sky" },
    { id: "metric-2", title: "Activity", value: summary.activity, target: summary.activityTarget, delta: summary.activityDelta, tone: "green" },
    { id: "metric-3", title: "Heart Rate", value: summary.heartRate, target: summary.heartTarget, delta: summary.heartDelta, tone: "rose" },
    { id: "metric-4", title: "Calories", value: summary.calories, target: summary.caloriesTarget, delta: summary.caloriesDelta, tone: "clay" },
    { id: "metric-5", title: "Hydration", value: summary.hydration, target: summary.hydrationTarget, delta: summary.hydrationDelta, tone: "teal" },
    { id: "metric-6", title: "Temperature", value: summary.temperature, target: summary.temperatureTarget, delta: summary.temperatureDelta, tone: "lavender" },
  ];

  if (loading || !data) {
    return <div className="panel">Loading health tracker...</div>;
  }

  const handleHeaderAction = (type) => {
    setActionMessage(
      type === "alerts"
        ? "Health alerts checked."
        : type === "share"
          ? "Health summary ready to share."
          : "Health report exported.",
    );
  };

  const handleLogActivity = () => {
    const newActivity = {
      id: `act-${Date.now()}`,
      title: activityForm.type,
      subtitle: "Just now",
      meta: `${activityForm.duration} mins`,
      calories: Number(activityForm.calories || 0),
      tone: "green",
    };

    setActivities((current) => [newActivity, ...current]);
    setActionMessage("New activity logged.");
    setActivityForm(activityInitialForm);
    setShowActivityModal(false);
  };

  const handleDietSave = () => {
    const nextTarget = Number(dietTarget || 0);
    if (!nextTarget) {
      return;
    }

    const difference = nextTarget - totalDietCalories;
    setDietPlan((current) =>
      current.map((meal, index) => {
        if (index !== 1) {
          return meal;
        }

        return {
          ...meal,
          calories: Math.max(50, meal.calories + difference),
        };
      }),
    );
    setActionMessage("Diet plan updated.");
    setShowDietModal(false);
  };

  return (
    <div className="care-page health-tracker-page">
      <header className="health-tracker-hero">
        <div>
          <h1>Health Tracker</h1>
          <p>Monitor your pet's health and wellness journey</p>
        </div>

        <div className="health-tracker-hero-actions">
          <button type="button" className="health-hero-icon-button" onClick={() => handleHeaderAction("alerts")}>
            Alerts
          </button>
          <button type="button" className="health-hero-icon-button" onClick={() => handleHeaderAction("share")}>
            Share
          </button>
          <button type="button" className="health-hero-icon-button" onClick={() => handleHeaderAction("export")}>
            Export
          </button>
        </div>

        <div className="health-pet-tabs">
          {pets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              className={`health-pet-tab${resolvedPetId === pet.id ? " active" : ""}`}
              onClick={() => setSelectedPetId(pet.id)}
            >
              <img
                src={pet.name?.toLowerCase() === "misty"
                  ? "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=200&q=80"
                  : "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80"}
                alt={pet.name}
              />
              <div>
                <strong>{pet.name}</strong>
                <span>{summaryByPetName[pet.name?.toLowerCase() === "misty" ? "misty" : "bruno"].breed}</span>
              </div>
            </button>
          ))}
        </div>
      </header>

      {actionMessage ? <p className="success-text">{actionMessage}</p> : null}

      <section className="health-score-card">
        <div className="health-score-copy">
          <span>Overall Health Score</span>
          <p>{summary.scoreNote}</p>
          <strong>{summary.score}<small>/100</small></strong>
          <em>+5 points this week</em>
        </div>
        <div className="health-score-visual">
          <div className="health-score-ring">
            <div style={{ "--score": `${summary.score}` }} />
          </div>
          <img
            src={selectedPet?.name?.toLowerCase() === "misty"
              ? "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=240&q=80"
              : "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=240&q=80"}
            alt={selectedPet?.name}
          />
        </div>
      </section>

      <section className="health-metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.id} className="health-metric-card">
            <div className={`health-metric-icon tone-${metric.tone}`}>{metric.title.slice(0, 2).toUpperCase()}</div>
            <span>{metric.title}</span>
            <strong>{metric.value}</strong>
            <p>{metric.target}</p>
            <em>{metric.delta}</em>
          </article>
        ))}
      </section>

      <section className="health-tracker-grid">
        <article className="health-card large">
          <div className="health-card-head">
            <div>
              <h2>Weekly Activity Overview</h2>
              <p>Track daily steps, calories, and active minutes</p>
            </div>
            <button type="button" className="health-primary-button" onClick={() => setShowActivityModal(true)}>
              + Log Activity
            </button>
          </div>

          <div className="health-activity-chart">
            {activityData.map((item) => (
              <div key={item.label} className="health-activity-bar-item">
                <div className="health-activity-bar-track">
                  <div className="health-activity-bar-fill" style={{ height: `${item.value}%` }} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="health-activity-summary">
            <div>
              <span>Avg Steps</span>
              <strong>{range === "week" ? "10,520" : range === "month" ? "9,860" : "9,430"}</strong>
            </div>
            <div>
              <span>Avg Calories</span>
              <strong>{range === "week" ? "1361" : range === "month" ? "1298" : "1215"}</strong>
            </div>
            <div>
              <span>Avg Active Time</span>
              <strong>{range === "week" ? "48 min" : range === "month" ? "42 min" : "39 min"}</strong>
            </div>
          </div>
        </article>

        <article className="health-card">
          <div className="health-card-head">
            <div>
              <h2>Weight Tracking</h2>
              <p>Progress overview</p>
            </div>
            <div className="health-segmented-tabs">
              {["week", "month", "year"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={range === item ? "active" : ""}
                  onClick={() => setRange(item)}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="health-mini-chart">
            {activityData.map((item) => (
              <div key={item.label} className="health-mini-bar-item">
                <div className="health-mini-bar-fill" style={{ height: `${item.value}%` }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="health-card">
          <div className="health-card-head">
            <div>
              <h2>Health Goals</h2>
              <p>Daily and long term targets</p>
            </div>
          </div>

          <div className="health-goals-list">
            {summary.goals.map((goal) => (
              <div key={goal.id} className="health-goal-item">
                <div className="health-goal-top">
                  <div className={`health-goal-icon tone-${goal.tone}`}>{goal.title.slice(0, 1)}</div>
                  <div>
                    <strong>{goal.title}</strong>
                    <p>{goal.detail}</p>
                  </div>
                  <span>{goal.progress}%</span>
                </div>
                <div className="health-goal-track">
                  <div className={`health-goal-fill tone-${goal.tone}`} style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="health-card">
          <div className="health-card-head">
            <div>
              <h2>Vaccination Schedule</h2>
              <p>Keep track of upcoming shots</p>
            </div>
            <button type="button" className="health-link-button" onClick={() => setShowAllVaccines((current) => !current)}>
              {showAllVaccines ? "Show Less" : "View All"}
            </button>
          </div>

          <div className="health-list-stack">
            {visibleVaccinations.map((item) => (
              <div key={item.id} className={`health-list-card ${item.status === "Done" ? "done" : "upcoming"}`}>
                <div className="health-list-card-head">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.date}</p>
                  </div>
                  <span className={`health-badge ${item.status === "Done" ? "done" : "upcoming"}`}>{item.status}</span>
                </div>
                <small>{item.due}</small>
                <footer>
                  <span>{item.doctor}</span>
                  <span>{item.location}</span>
                </footer>
              </div>
            ))}
          </div>
        </article>

        <article className="health-card">
          <div className="health-card-head">
            <div>
              <h2>Daily Diet Plan</h2>
              <p>Customized nutrition schedule</p>
            </div>
            <button type="button" className="health-link-button" onClick={() => setShowDietModal(true)}>
              Edit Plan
            </button>
          </div>

          <div className="health-total-intake">
            <div>
              <span>Total Daily Intake</span>
              <p>Water: 2.0 - 2.5 L</p>
            </div>
            <strong>{totalDietCalories} kcal</strong>
          </div>

          <div className="health-meals-list">
            {dietPlan.map((meal) => (
              <div key={meal.id} className="health-meal-item">
                <div className="health-goal-icon tone-clay">{meal.meal.slice(0, 1)}</div>
                <div>
                  <strong>{meal.meal}</strong>
                  <p>{meal.detail}</p>
                  <small>{meal.time}</small>
                </div>
                <span>{meal.calories} kcal</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="health-card">
        <div className="health-card-head">
          <div>
            <h2>Recent Activities</h2>
            <p>Latest movement and meal logs</p>
          </div>
        </div>

        <div className="health-recent-grid">
          {activities.map((item) => (
            <div key={item.id} className="health-recent-card">
              <div className={`health-goal-icon tone-${item.tone}`}>{item.title.slice(0, 1)}</div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.subtitle}</p>
                <small>{item.meta}</small>
              </div>
              <span>{item.calories} cal</span>
            </div>
          ))}
        </div>
      </section>

      {showActivityModal ? (
        <div className="health-modal-overlay" role="presentation" onClick={() => setShowActivityModal(false)}>
          <div className="health-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="health-modal-head">
              <h2>Log New Activity</h2>
              <button type="button" className="health-modal-close" onClick={() => setShowActivityModal(false)}>X</button>
            </div>

            <label className="health-modal-field">
              <span>Activity Type</span>
              <select value={activityForm.type} onChange={(event) => setActivityForm((current) => ({ ...current, type: event.target.value }))}>
                <option>Walk</option>
                <option>Run</option>
                <option>Play Session</option>
                <option>Meal Time</option>
                <option>Training</option>
              </select>
            </label>
            <label className="health-modal-field">
              <span>Duration (minutes)</span>
              <input value={activityForm.duration} onChange={(event) => setActivityForm((current) => ({ ...current, duration: event.target.value }))} />
            </label>
            <label className="health-modal-field">
              <span>Calories Burned</span>
              <input value={activityForm.calories} onChange={(event) => setActivityForm((current) => ({ ...current, calories: event.target.value }))} />
            </label>
            <label className="health-modal-field">
              <span>Notes (optional)</span>
              <textarea value={activityForm.notes} onChange={(event) => setActivityForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Add any additional notes..." />
            </label>

            <div className="health-modal-actions">
              <button type="button" className="health-secondary-button" onClick={() => setShowActivityModal(false)}>
                Cancel
              </button>
              <button type="button" className="health-primary-button" onClick={handleLogActivity}>
                Log Activity
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDietModal ? (
        <div className="health-modal-overlay" role="presentation" onClick={() => setShowDietModal(false)}>
          <div className="health-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="health-modal-head">
              <h2>Edit Daily Diet Plan</h2>
              <button type="button" className="health-modal-close" onClick={() => setShowDietModal(false)}>X</button>
            </div>

            <label className="health-modal-field">
              <span>Target Daily Calories</span>
              <input value={dietTarget} onChange={(event) => setDietTarget(event.target.value)} />
            </label>

            <div className="health-modal-actions">
              <button type="button" className="health-secondary-button" onClick={() => setShowDietModal(false)}>
                Cancel
              </button>
              <button type="button" className="health-primary-button" onClick={handleDietSave}>
                Save Plan
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
