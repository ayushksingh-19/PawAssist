import { useMemo, useRef, useState } from "react";
import { FiAward, FiCheckCircle, FiChevronRight, FiDownload, FiDollarSign, FiFileText, FiHeart, FiPhone, FiPlus, FiShield, FiUploadCloud, FiX, FiZap } from "react-icons/fi";

const overviewStats = [
  { label: "Total Coverage", value: "Rs 2.5L", tone: "teal", icon: FiShield },
  { label: "Active Policies", value: "2", tone: "sage", icon: FiCheckCircle },
  { label: "Total Claims", value: "3", tone: "clay", icon: FiFileText },
  { label: "Claimed Amount", value: "Rs 20K", tone: "gold", icon: FiDollarSign },
];

const policyBenefits = [
  { title: "Comprehensive Protection", detail: "Cover consultations, surgery, emergencies, and recovery care in one plan.", icon: FiShield },
  { title: "Instant Claim Flow", detail: "Submit bills and reports in-app with quick approval guidance.", icon: FiZap },
  { title: "Preventive Support", detail: "Selected plans include routine checkups, vaccines, and annual screenings.", icon: FiHeart },
  { title: "24/7 Care Team", detail: "Reach support anytime for claim help, renewals, or coverage questions.", icon: FiPhone },
];

const plans = [
  { id: "basic", name: "Basic Care", price: "Rs 299", yearly: "or Rs 2,990/year", save: "Save 17%", accent: "sage", cover: "Coverage up to Rs 50,000", subtitle: "Ideal for healthy pets needing dependable everyday coverage.", items: ["Accident coverage", "Basic surgery", "Hospitalization up to 5 days", "Emergency care", "Annual health checkup"] },
  { id: "complete", name: "Complete Care", price: "Rs 599", yearly: "or Rs 5,990/year", save: "Save 17%", accent: "brand", cover: "Coverage up to Rs 2,00,000", subtitle: "Balanced protection for pet parents who want broader peace of mind.", featured: true, items: ["Everything in Basic", "Illness coverage", "Advanced surgery", "Cancer treatment", "Chronic disease care", "Dental care", "Specialist consultations", "Hospitalization up to 15 days"] },
  { id: "lifetime", name: "Lifetime Care", price: "Rs 999", yearly: "or Rs 9,990/year", save: "Save 17%", accent: "clay", cover: "Coverage up to Rs 5,00,000", subtitle: "Extended support for multi-condition, senior, or premium-care needs.", items: ["Everything in Complete", "Lifetime coverage", "Alternative therapies", "Physiotherapy", "International coverage", "No claim bonus", "Unlimited hospitalization", "Free ambulance support"] },
];

const initialPolicies = [
  { id: "policy-bruno", petName: "Bruno", avatar: "B", plan: "Complete Care", policyNumber: "INS-2026-45821", amount: "Rs 2,00,000", premium: "Rs 599/month", used: 15000, total: 200000, startDate: "Jan 15, 2026", endDate: "Jan 14, 2027", status: "Active" },
  { id: "policy-luna", petName: "Luna", avatar: "L", plan: "Basic Care", policyNumber: "INS-2026-45822", amount: "Rs 50,000", premium: "Rs 299/month", used: 5000, total: 50000, startDate: "Feb 1, 2026", endDate: "Jan 31, 2027", status: "Active" },
];

const initialClaims = [
  { id: "claim-1", title: "ACL Repair Surgery", petName: "Bruno", type: "Surgery", claimNumber: "CLM-2026-1234", filedOn: "Mar 20, 2026", processedOn: "Mar 21, 2026", amount: "Rs 12,000", documents: "4 files", status: "Approved" },
  { id: "claim-2", title: "Teeth Cleaning & Extraction", petName: "Luna", type: "Dental Care", claimNumber: "CLM-2026-1156", filedOn: "Mar 10, 2026", processedOn: "Mar 11, 2026", amount: "Rs 5,000", documents: "3 files", status: "Approved" },
  { id: "claim-3", title: "Emergency Vet Visit", petName: "Bruno", type: "Consultation", claimNumber: "CLM-2026-1089", filedOn: "Feb 15, 2026", processedOn: "Feb 16, 2026", amount: "Rs 3,000", documents: "2 files", status: "Paid" },
];

const claimSteps = [
  { title: "Visit Partner Vet", detail: "Get treatment at partner clinics or approved hospitals across India." },
  { title: "Upload Bills & Documents", detail: "Submit invoices, prescriptions, and reports in one place." },
  { title: "Get Instant Approval", detail: "Most standard claims are reviewed within 24 hours or less." },
  { title: "Receive Payment", detail: "Approved amounts land directly in your selected payout account." },
];

const defaultClaimForm = { petId: "", policyNumber: "", claimType: "", treatmentDate: "", treatmentDetails: "", hospitalName: "", doctorName: "", amount: "", additionalDetails: "" };

export default function Insurance() {
  const [policies] = useState(initialPolicies);
  const [claims, setClaims] = useState(initialClaims);
  const [activeTab, setActiveTab] = useState("policies");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("complete");
  const [statusMessage, setStatusMessage] = useState("");
  const [claimForm, setClaimForm] = useState(defaultClaimForm);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const selectedPolicy = useMemo(() => policies.find((policy) => policy.id === selectedPolicyId) || null, [policies, selectedPolicyId]);
  const selectedClaim = useMemo(() => claims.find((claim) => claim.id === selectedClaimId) || null, [claims, selectedClaimId]);
  const announce = (message) => setStatusMessage(message);

  const createDownload = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleClaimInput = (event) => {
    const { name, value } = event.target;
    if (name === "petId") {
      const linkedPolicy = policies.find((policy) => policy.id === value);
      setClaimForm((current) => ({ ...current, petId: value, policyNumber: linkedPolicy?.policyNumber || "" }));
      return;
    }
    if (name === "policyNumber") {
      const linkedPolicy = policies.find((policy) => policy.policyNumber === value);
      setClaimForm((current) => ({ ...current, policyNumber: value, petId: linkedPolicy?.id || "" }));
      return;
    }
    setClaimForm((current) => ({ ...current, [name]: value }));
  };

  const openClaimModal = () => setIsClaimModalOpen(true);
  const closeClaimModal = () => {
    setIsClaimModalOpen(false);
    setClaimForm(defaultClaimForm);
    setUploadedFiles([]);
  };
  const closePolicyModal = () => setSelectedPolicyId(null);
  const closeClaimDetailsModal = () => setSelectedClaimId(null);
  const handleOfferClick = () => {
    setActiveTab("plans");
    setSelectedPlanId("complete");
    announce("Annual offer ready on Complete Care.");
  };
  const handleSelectPlan = (planId) => {
    const plan = plans.find((item) => item.id === planId);
    setSelectedPlanId(planId);
    setActiveTab("plans");
    announce(`${plan?.name || "Plan"} selected for review.`);
  };
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileSelection = (event) => {
    const nextFiles = Array.from(event.target.files || []).map((file) => file.name);
    setUploadedFiles(nextFiles);
    if (nextFiles.length) announce(`${nextFiles.length} document${nextFiles.length > 1 ? "s" : ""} attached.`);
  };

  const downloadPolicyFile = (policy) => {
    createDownload(`${policy.policyNumber}.txt`, ["PawAssist Insurance Policy", `Pet: ${policy.petName}`, `Plan: ${policy.plan}`, `Policy Number: ${policy.policyNumber}`, `Coverage Amount: ${policy.amount}`, `Monthly Premium: ${policy.premium}`, `Used Amount: Rs ${policy.used.toLocaleString("en-IN")}`, `Remaining Amount: Rs ${(policy.total - policy.used).toLocaleString("en-IN")}`, `Start Date: ${policy.startDate}`, `Expiry Date: ${policy.endDate}`, `Status: ${policy.status}`].join("\n"));
    announce(`Downloaded ${policy.petName}'s policy file.`);
  };

  const downloadClaimFile = (claim) => {
    createDownload(`${claim.claimNumber}.txt`, ["PawAssist Claim Summary", `Claim: ${claim.title}`, `Claim Number: ${claim.claimNumber}`, `Pet: ${claim.petName}`, `Type: ${claim.type}`, `Filed On: ${claim.filedOn}`, `Processed On: ${claim.processedOn}`, `Claimed Amount: ${claim.amount}`, `Documents: ${claim.documents}`, `Status: ${claim.status}`].join("\n"));
    announce(`Downloaded claim file for ${claim.claimNumber}.`);
  };

  const handleSubmitClaim = () => {
    const requiredFields = ["petId", "policyNumber", "claimType", "treatmentDate", "treatmentDetails", "amount"];
    const missingField = requiredFields.find((field) => !claimForm[field]);
    if (missingField) {
      announce("Please fill the required claim fields before submitting.");
      return;
    }
    const linkedPolicy = policies.find((policy) => policy.id === claimForm.petId);
    const petName = linkedPolicy?.petName || "Pet";
    const nextClaimNumber = `CLM-2026-${String(1200 + claims.length + 1)}`;
    const title = claimForm.treatmentDetails.trim();
    const newClaim = {
      id: `claim-${claims.length + 1}`,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      petName,
      type: claimForm.claimType,
      claimNumber: nextClaimNumber,
      filedOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      processedOn: "In review",
      amount: `Rs ${Number(claimForm.amount || 0).toLocaleString("en-IN")}`,
      documents: `${Math.max(uploadedFiles.length, 1)} file${Math.max(uploadedFiles.length, 1) > 1 ? "s" : ""}`,
      status: "Submitted",
    };
    setClaims((current) => [newClaim, ...current]);
    setActiveTab("claims");
    closeClaimModal();
    announce(`Claim ${nextClaimNumber} submitted for ${petName}.`);
  };

  const claimStatusClass = (status) => {
    if (status === "Paid") return "paid";
    if (status === "Submitted") return "submitted";
    return "approved";
  };

  return (
    <div className="insurance-hub-page">
      {statusMessage ? <div className="insurance-hub-status-banner"><span>{statusMessage}</span><button type="button" onClick={() => setStatusMessage("")} aria-label="Dismiss insurance status"><FiX /></button></div> : null}
      <section className="insurance-hub-hero">
        <div>
          <span className="insurance-hub-kicker">PawAssist Protection</span>
          <h1>Pet Insurance</h1>
          <p>Protect your furry family with comprehensive coverage designed around your existing care experience.</p>
        </div>
        <button type="button" className="insurance-hub-hero-action" onClick={openClaimModal}><FiPlus />File Claim</button>
      </section>
      <section className="insurance-hub-offer">
        <div className="insurance-hub-offer-icon"><FiAward /></div>
        <div><strong>Limited Time Offer: Get 2 Months Free!</strong><p>Subscribe to annual plans and get zero waiting period plus instant coverage onboarding.</p></div>
        <button type="button" onClick={handleOfferClick}>Claim Offer</button>
      </section>
      <section className="insurance-hub-tabs">
        <button type="button" className={activeTab === "policies" ? "active" : ""} onClick={() => setActiveTab("policies")}>My Policies</button>
        <button type="button" className={activeTab === "plans" ? "active" : ""} onClick={() => setActiveTab("plans")}>Available Plans</button>
        <button type="button" className={activeTab === "claims" ? "active" : ""} onClick={() => setActiveTab("claims")}>Claims History</button>
      </section>
      <section className="insurance-hub-stats">
        {overviewStats.map((item) => {
          const Icon = item.icon;
          return <article key={item.label} className="insurance-hub-stat-card"><div className={`insurance-hub-stat-icon ${item.tone}`}><Icon /></div><div><span>{item.label}</span><strong>{item.value}</strong></div></article>;
        })}
      </section>
      {activeTab === "policies" ? <div className="insurance-hub-stack">
        <section className="insurance-hub-panel">
          <div className="insurance-hub-panel-head"><div><h2>Why Choose PawAssist Insurance?</h2><p>Coverage built to feel as thoughtful and reassuring as the rest of your care experience.</p></div></div>
          <div className="insurance-hub-benefits">
            {policyBenefits.map((item) => {
              const Icon = item.icon;
              return <article key={item.title} className="insurance-hub-benefit-card"><div className="insurance-hub-benefit-icon"><Icon /></div><h3>{item.title}</h3><p>{item.detail}</p></article>;
            })}
          </div>
        </section>
        <section className="insurance-hub-panel">
          <div className="insurance-hub-panel-head"><div><h2>Active Insurance Policies</h2><p>Track coverage, premium details, and your remaining protection for each pet.</p></div></div>
          <div className="insurance-hub-policy-grid">
            {policies.map((policy) => {
              const coveragePercent = Math.max(6, Math.round((policy.used / policy.total) * 100));
              const remaining = policy.total - policy.used;
              return <article key={policy.id} className="insurance-hub-policy-card">
                <div className="insurance-hub-policy-top"><div className="insurance-hub-policy-pet"><div className="insurance-hub-pet-avatar">{policy.avatar}</div><div><strong>{policy.petName}</strong><span>{policy.plan}</span></div></div><span className="insurance-hub-policy-badge">{policy.status}</span></div>
                <div className="insurance-hub-policy-meta"><div><span>Policy Number</span><strong>{policy.policyNumber}</strong></div><div><span>Coverage Amount</span><strong>{policy.amount}</strong></div><div><span>Monthly Premium</span><strong>{policy.premium}</strong></div></div>
                <div className="insurance-hub-usage"><div className="insurance-hub-usage-head"><span>Coverage Used</span><strong>Rs {policy.used.toLocaleString("en-IN")} / Rs {policy.total.toLocaleString("en-IN")}</strong></div><div className="insurance-hub-progress-track"><div className="insurance-hub-progress-fill" style={{ width: `${coveragePercent}%` }} /></div></div>
                <div className="insurance-hub-policy-dates"><div><span>Start Date</span><strong>{policy.startDate}</strong></div><div><span>Remaining Coverage</span><strong>Rs {remaining.toLocaleString("en-IN")}</strong></div><div><span>Expiry Date</span><strong>{policy.endDate}</strong></div></div>
                <div className="insurance-hub-policy-actions"><button type="button" className="insurance-hub-primary-button" onClick={openClaimModal}>File Claim</button><button type="button" className="insurance-hub-secondary-button" onClick={() => setSelectedPolicyId(policy.id)}>View Details</button><button type="button" className="insurance-hub-icon-button" aria-label={`Download ${policy.petName} policy`} onClick={() => downloadPolicyFile(policy)}><FiDownload /></button></div>
              </article>;
            })}
          </div>
        </section>
      </div> : null}
      {activeTab === "plans" ? <div className="insurance-hub-stack">
        <section className="insurance-hub-panel">
          <div className="insurance-hub-panel-head"><div><h2>Why Get Covered?</h2><p>Choose the protection tier that best fits your pet's routine, risk level, and long-term care needs.</p></div></div>
          <div className="insurance-hub-benefits compact">
            {policyBenefits.map((item) => {
              const Icon = item.icon;
              return <article key={item.title} className="insurance-hub-benefit-card"><div className="insurance-hub-benefit-icon"><Icon /></div><h3>{item.title}</h3><p>{item.detail}</p></article>;
            })}
          </div>
        </section>
        <section className="insurance-hub-panel">
          <div className="insurance-hub-panel-head"><div><h2>Choose Your Plan</h2><p>All plans work inside the PawAssist ecosystem and are designed to feel consistent with your care flow.</p></div></div>
          <div className="insurance-hub-plan-grid">
            {plans.map((plan) => <article key={plan.id} className={`insurance-hub-plan-card ${plan.accent}${plan.featured ? " featured" : ""}${selectedPlanId === plan.id ? " selected" : ""}`}>
              {plan.featured ? <span className="insurance-hub-plan-badge">Most Popular</span> : null}
              <h3>{plan.name}</h3><div className="insurance-hub-plan-price"><strong>{plan.price}</strong><span>/month</span></div><small>{plan.yearly}</small><em>{plan.save}</em><div className={`insurance-hub-plan-cover ${plan.accent}`}>{plan.cover}</div><p>{plan.subtitle}</p>
              <div className="insurance-hub-plan-list">{plan.items.map((item) => <div key={item} className="insurance-hub-plan-item"><span><FiCheckCircle /></span><p>{item}</p></div>)}</div>
              <button type="button" className={`insurance-hub-primary-button ${plan.accent}`} onClick={() => handleSelectPlan(plan.id)}>Select Plan</button>
            </article>)}
          </div>
        </section>
        <section className="insurance-hub-panel insurance-hub-claims-process"><h2>How to File a Claim</h2><div className="insurance-hub-step-grid">{claimSteps.map((step, index) => <div key={step.title} className="insurance-hub-step-card"><span>{index + 1}</span><strong>{step.title}</strong><p>{step.detail}</p></div>)}</div></section>
      </div> : null}
      {activeTab === "claims" ? <section className="insurance-hub-panel">
        <div className="insurance-hub-panel-head"><div><h2>Claims History</h2><p>Track your filed insurance claims and their current payout status.</p></div><button type="button" className="insurance-hub-hero-action small" onClick={openClaimModal}><FiPlus />File New Claim</button></div>
        <div className="insurance-hub-claims-list">{claims.map((claim) => <article key={claim.id} className="insurance-hub-claim-card">
          <div className="insurance-hub-claim-top"><div><div className="insurance-hub-claim-title-row"><strong>{claim.title}</strong><span className={`insurance-hub-claim-status ${claimStatusClass(claim.status)}`}>{claim.status}</span></div><p>Claim Number: {claim.claimNumber}<span className="insurance-hub-dot">•</span>Pet: {claim.petName}<span className="insurance-hub-dot">•</span>Type: {claim.type}</p></div><div className="insurance-hub-claim-amount"><strong>{claim.amount}</strong><span>Approved Amount</span></div></div>
          <div className="insurance-hub-claim-meta"><div><span>Filed On</span><strong>{claim.filedOn}</strong></div><div><span>Processed On</span><strong>{claim.processedOn}</strong></div><div><span>Claimed Amount</span><strong>{claim.amount}</strong></div><div><span>Documents</span><strong>{claim.documents}</strong></div></div>
          <div className="insurance-hub-claim-actions"><button type="button" className="insurance-hub-primary-button" onClick={() => setSelectedClaimId(claim.id)}><FiFileText />View Details</button><button type="button" className="insurance-hub-secondary-button" onClick={() => downloadClaimFile(claim)}><FiDownload />Download</button></div>
        </article>)}</div>
      </section> : null}
      {isClaimModalOpen ? <div className="insurance-hub-modal-overlay" role="presentation" onClick={closeClaimModal}><div className="insurance-hub-modal-card" role="dialog" aria-modal="true" aria-label="File new claim" onClick={(event) => event.stopPropagation()}>
        <div className="insurance-hub-modal-head"><div><h2>File New Claim</h2><p>Share the treatment details and supporting documents to begin the review process.</p></div><button type="button" className="insurance-hub-close-button" onClick={closeClaimModal} aria-label="Close claim form"><FiX /></button></div>
        <div className="insurance-hub-form-grid two">
          <label className="insurance-hub-field"><span>Pet Name</span><select name="petId" value={claimForm.petId} onChange={handleClaimInput}><option value="">Select Pet</option>{policies.map((policy) => <option key={policy.id} value={policy.id}>{policy.petName}</option>)}</select></label>
          <label className="insurance-hub-field"><span>Policy Number</span><select name="policyNumber" value={claimForm.policyNumber} onChange={handleClaimInput}><option value="">Select Policy</option>{policies.map((policy) => <option key={policy.policyNumber} value={policy.policyNumber}>{policy.policyNumber}</option>)}</select></label>
          <label className="insurance-hub-field"><span>Claim Type</span><select name="claimType" value={claimForm.claimType} onChange={handleClaimInput}><option value="">Select Type</option><option value="Surgery">Surgery</option><option value="Consultation">Consultation</option><option value="Emergency">Emergency</option><option value="Dental Care">Dental Care</option><option value="Hospitalization">Hospitalization</option><option value="Medication">Medication</option><option value="Diagnostic Tests">Diagnostic Tests</option></select></label>
          <label className="insurance-hub-field"><span>Treatment Date</span><input type="date" name="treatmentDate" value={claimForm.treatmentDate} onChange={handleClaimInput} /></label>
        </div>
        <label className="insurance-hub-field"><span>Treatment Details</span><input type="text" name="treatmentDetails" value={claimForm.treatmentDetails} onChange={handleClaimInput} placeholder="E.g. ACL repair surgery, dental cleaning" /></label>
        <div className="insurance-hub-form-grid two">
          <label className="insurance-hub-field"><span>Hospital/Clinic Name</span><input type="text" name="hospitalName" value={claimForm.hospitalName} onChange={handleClaimInput} placeholder="Enter hospital name" /></label>
          <label className="insurance-hub-field"><span>Doctor Name</span><input type="text" name="doctorName" value={claimForm.doctorName} onChange={handleClaimInput} placeholder="Enter doctor name" /></label>
        </div>
        <label className="insurance-hub-field"><span>Claim Amount (Rs)</span><input type="number" name="amount" value={claimForm.amount} onChange={handleClaimInput} placeholder="Enter amount" /></label>
        <label className="insurance-hub-field"><span>Additional Details</span><textarea name="additionalDetails" value={claimForm.additionalDetails} onChange={handleClaimInput} placeholder="Provide any additional information about the treatment, recommendations, or follow-up." /></label>
        <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileSelection} />
        <div className="insurance-hub-upload-box" role="button" tabIndex={0} onClick={handleUploadClick} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleUploadClick(); } }}><FiUploadCloud /><strong>Click to upload or drag and drop</strong><p>{uploadedFiles.length ? `Attached: ${uploadedFiles.join(", ")}` : "Bills, prescriptions, and medical reports (PDF, JPG, PNG)"}</p></div>
        <div className="insurance-hub-required-docs"><strong>Required Documents</strong><ul><li>Original bills and receipts</li><li>Medical reports and prescriptions</li><li>Diagnostic test results, if applicable</li></ul></div>
        <div className="insurance-hub-modal-actions"><button type="button" className="insurance-hub-secondary-button" onClick={closeClaimModal}>Cancel</button><button type="button" className="insurance-hub-primary-button" onClick={handleSubmitClaim}>Submit Claim</button></div>
      </div></div> : null}
      {selectedPolicy ? <div className="insurance-hub-modal-overlay" role="presentation" onClick={closePolicyModal}><div className="insurance-hub-policy-modal" role="dialog" aria-modal="true" aria-label="Policy details" onClick={(event) => event.stopPropagation()}>
        <div className="insurance-hub-modal-head"><h2>Policy Details</h2><button type="button" className="insurance-hub-close-button" onClick={closePolicyModal} aria-label="Close policy details"><FiX /></button></div>
        <div className="insurance-hub-modal-pet"><div className="insurance-hub-pet-avatar large">{selectedPolicy.avatar}</div><div><strong>{selectedPolicy.petName}</strong><span>{selectedPolicy.plan}</span><small>Policy: {selectedPolicy.policyNumber}</small></div></div>
        <div className="insurance-hub-modal-stats"><div><span>Total Coverage</span><strong>{selectedPolicy.amount}</strong></div><div><span>Premium</span><strong>{selectedPolicy.premium}</strong></div><div><span>Used Amount</span><strong>Rs {selectedPolicy.used.toLocaleString("en-IN")}</strong></div><div><span>Remaining</span><strong>Rs {(selectedPolicy.total - selectedPolicy.used).toLocaleString("en-IN")}</strong></div></div>
        <div className="insurance-hub-modal-period"><div><span>Start Date</span><strong>{selectedPolicy.startDate}</strong></div><FiChevronRight /><div><span>Expiry Date</span><strong>{selectedPolicy.endDate}</strong></div></div>
        <div className="insurance-hub-modal-summary"><span>Claims Summary</span><strong>{claims.filter((claim) => claim.petName === selectedPolicy.petName).length}</strong></div>
        <div className="insurance-hub-modal-actions"><button type="button" className="insurance-hub-primary-button" onClick={() => downloadPolicyFile(selectedPolicy)}><FiDownload />Download Policy</button><button type="button" className="insurance-hub-secondary-button" onClick={closePolicyModal}>Close</button></div>
      </div></div> : null}
      {selectedClaim ? <div className="insurance-hub-modal-overlay" role="presentation" onClick={closeClaimDetailsModal}><div className="insurance-hub-policy-modal" role="dialog" aria-modal="true" aria-label="Claim details" onClick={(event) => event.stopPropagation()}>
        <div className="insurance-hub-modal-head"><div><h2>Claim Details</h2><p>{selectedClaim.claimNumber}</p></div><button type="button" className="insurance-hub-close-button" onClick={closeClaimDetailsModal} aria-label="Close claim details"><FiX /></button></div>
        <div className="insurance-hub-modal-pet"><div className="insurance-hub-pet-avatar large">{selectedClaim.petName.slice(0, 1)}</div><div><strong>{selectedClaim.title}</strong><span>{selectedClaim.petName}</span><small>{selectedClaim.type}</small></div></div>
        <div className="insurance-hub-modal-stats"><div><span>Status</span><strong>{selectedClaim.status}</strong></div><div><span>Claimed Amount</span><strong>{selectedClaim.amount}</strong></div><div><span>Filed On</span><strong>{selectedClaim.filedOn}</strong></div><div><span>Processed On</span><strong>{selectedClaim.processedOn}</strong></div></div>
        <div className="insurance-hub-modal-summary"><span>Documents</span><strong>{selectedClaim.documents}</strong></div>
        <div className="insurance-hub-modal-actions"><button type="button" className="insurance-hub-primary-button" onClick={() => downloadClaimFile(selectedClaim)}><FiDownload />Download Claim</button><button type="button" className="insurance-hub-secondary-button" onClick={closeClaimDetailsModal}>Close</button></div>
      </div></div> : null}
    </div>
  );
}
