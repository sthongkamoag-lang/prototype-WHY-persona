// ============================================
// WELFARE MASTER — Pilot Campaign App Logic
// ============================================

// === Google Forms Config ===
// Replace with your real Form ID and entry IDs after creating the Google Form
const GOOGLE_FORM_CONFIG = {
  actionUrl: "https://docs.google.com/forms/d/e/1ROnROBge-GVHA4b4c73QGhWGlAUf4_ZnDNZ5EMIRdLM/formResponse",
  fields: {
    persona: "entry.794780842",
    rating: "entry.970064483",
    ratingLabel: "entry.29748376",
    confusedSection: "entry.1292890477",
    comment: "entry.3807243",
    time: "entry.1170085915",
  },
};

// State
let currentPersona = 'genz';
const feedbackState = {
  genz: { rating: null, ratingLabel: null, confusedSections: [], submitted: false },
  mom: { rating: null, ratingLabel: null, confusedSections: [], submitted: false },
};

// === PERSONA SWITCHING ===
function switchPersona(persona) {
  currentPersona = persona;
  // Update tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.persona === persona);
  });
  // Show/hide views
  document.getElementById('genz-view').classList.toggle('hidden', persona !== 'genz');
  document.getElementById('mom-view').classList.toggle('hidden', persona !== 'mom');
  // Update body class for theme
  document.body.classList.toggle('mom-active', persona === 'mom');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize default persona
document.querySelector('.tab-btn[data-persona="genz"]').classList.add('active');

// === SCENARIO COMPARISON (Gen Z) ===
const scenarioData = {
  0:  { sum: '฿0.86M', monthly: '฿2,700', age: '53.8 ปี', label: 'เหมือนกัน · ยังไม่เลื่อน' },
  5:  { sum: '฿1.05M', monthly: '฿3,400', age: '50.2 ปี', label: '🔥 ถ้าเพิ่มออม +5%' },
  10: { sum: '฿1.28M', monthly: '฿4,200', age: '47.1 ปี', label: '🚀 ถ้าเพิ่มออม +10%' },
  15: { sum: '฿1.54M', monthly: '฿5,100', age: '44.3 ปี', label: '💎 ถ้าเพิ่มออม +15%' },
  20: { sum: '฿1.83M', monthly: '฿6,200', age: '41.8 ปี', label: '🏆 ถ้าเพิ่มออม +20%' },
};

function updateScenario(val) {
  const v = parseInt(val);
  document.getElementById('gz-slider-val').textContent = v === 0 ? '+0%' : `+${v}%`;
  const data = scenarioData[v];
  const boostedCol = document.getElementById('gz-boosted-col');
  
  document.getElementById('gz-boosted-label').textContent = data.label;
  document.getElementById('gz-boosted-sum').textContent = data.sum;
  document.getElementById('gz-boosted-monthly').textContent = data.monthly;
  document.getElementById('gz-boosted-age').textContent = data.age;
  
  if (v > 0) {
    boostedCol.classList.add('active');
  } else {
    boostedCol.classList.remove('active');
  }
}

// === LIFESTYLE SLIDER (Mom) ===
const lifestyleData = [
  {
    label: '🌱 ประหยัด',
    years: 18, months: 2,
    coverage: 85,
    cost: '18,000',
    detail: 'ใช้ชีวิตแบบพอเพียง ประหยัดค่าใช้จ่ายให้น้อยที่สุด',
    note: '💡 ไลฟ์สไตล์ประหยัด ช่วยให้วันแห่งศักดิ์ศรียาวนานขึ้นมาก แต่อาจต้องจำกัดการใช้จ่ายบางอย่าง',
  },
  {
    label: '🏠 มาตรฐาน',
    years: 12, months: 4,
    coverage: 68,
    cost: '28,000',
    detail: 'ใช้จ่ายตามสบายแบบมาตรฐาน สมดุลระหว่างความสุขและความมั่นคง',
    note: '💡 ไลฟ์สไตล์มาตรฐาน สมดุลระหว่างความสุขและความมั่นคง',
  },
  {
    label: '✨ สบาย',
    years: 7, months: 8,
    coverage: 45,
    cost: '42,000',
    detail: 'ใช้ชีวิตสบายๆ มีค่าใช้จ่ายเพื่อความสุขเพิ่มเติม',
    note: '💡 ไลฟ์สไตล์สบาย ต้องวางแผนเพิ่มเติมเพื่อให้ครอบคลุมค่าใช้จ่ายที่สูงขึ้น',
  },
];

function setLifestyle(level) {
  const data = lifestyleData[level];
  
  // Update buttons
  document.querySelectorAll('.lifestyle-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === level);
  });
  
  // Update dignity clock with animation
  const yearsEl = document.getElementById('mom-years');
  const monthsEl = document.getElementById('mom-months');
  yearsEl.style.transition = 'all 0.3s ease';
  monthsEl.style.transition = 'all 0.3s ease';
  yearsEl.textContent = data.years;
  monthsEl.textContent = data.months;
  
  // Update label
  document.getElementById('mom-lifestyle-label').textContent = data.label;
  
  // Update coverage
  document.getElementById('mom-coverage').textContent = data.coverage + '%';
  document.getElementById('mom-coverage-bar').style.width = data.coverage + '%';
  
  // Update cost
  document.getElementById('mom-cost').textContent = data.cost;
  
  // Update detail
  const detailEl = document.getElementById('mom-lifestyle-detail');
  detailEl.innerHTML = `
    <div class="ls-detail-item"><span>${data.detail}</span></div>
    <div class="ls-detail-item">
      <span class="ls-cost-label">ค่าใช้จ่ายประมาณ</span>
      <span class="ls-cost-val">${data.cost}</span>
      <span class="ls-cost-unit"> บาท/เดือน</span>
    </div>
    <div class="ls-detail-item note"><span>${data.note}</span></div>
  `;
}

// === FEEDBACK FORM ===
function selectEmoji(btn, persona) {
  const rating = parseInt(btn.dataset.rating);
  const label = btn.dataset.label;
  
  // Update state
  feedbackState[persona].rating = rating;
  feedbackState[persona].ratingLabel = label;
  
  // Update UI
  const container = document.getElementById(persona === 'genz' ? 'gz-emoji-rating' : 'mom-emoji-rating');
  container.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  
  // Show conditional questions if rating <= 2
  const confusedEl = document.getElementById(persona === 'genz' ? 'gz-confused' : 'mom-confused');
  if (rating <= 2) {
    confusedEl.classList.remove('hidden');
  } else {
    confusedEl.classList.add('hidden');
    feedbackState[persona].confusedSections = [];
    // Deselect all pills
    confusedEl.querySelectorAll('.pill-btn').forEach(p => p.classList.remove('active'));
  }
}

function togglePill(btn) {
  btn.classList.toggle('active');
}

function submitFeedback(persona) {
  const state = feedbackState[persona];
  
  if (!state.rating) {
    alert('กรุณาเลือก Emoji ก่อนส่งฟีดแบคนะครับ');
    return;
  }
  
  // Gather confused sections
  const pillContainer = document.getElementById(persona === 'genz' ? 'gz-pills' : 'mom-pills');
  const activePills = pillContainer.querySelectorAll('.pill-btn.active');
  state.confusedSections = Array.from(activePills).map(p => p.textContent);
  
  // Gather comment
  const commentEl = document.getElementById(persona === 'genz' ? 'gz-comment' : 'mom-comment');
  const comment = commentEl.value.trim();
  
  // Build form data
  const personaName = persona === 'genz' ? 'น้องใหม่ไฟแรง' : 'คุณแม่สายสู้';
  const time = new Date().toISOString();
  
  const formData = new FormData();
  formData.append(GOOGLE_FORM_CONFIG.fields.persona, personaName);
  formData.append(GOOGLE_FORM_CONFIG.fields.rating, state.rating);
  formData.append(GOOGLE_FORM_CONFIG.fields.ratingLabel, state.ratingLabel);
  formData.append(GOOGLE_FORM_CONFIG.fields.confusedSection, state.confusedSections.join(', ') || '-');
  formData.append(GOOGLE_FORM_CONFIG.fields.comment, comment || '-');
  formData.append(GOOGLE_FORM_CONFIG.fields.time, time);
  
  // Send to Google Forms (no-cors, fire and forget)
  if (GOOGLE_FORM_CONFIG.actionUrl.indexOf('YOUR_FORM_ID') === -1) {
    fetch(GOOGLE_FORM_CONFIG.actionUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    }).catch(() => {});
  }
  
  // Also log to console for demo
  console.log('Feedback submitted:', {
    persona: personaName,
    rating: state.rating,
    ratingLabel: state.ratingLabel,
    confusedSections: state.confusedSections,
    comment: comment,
    time: time,
  });
  
  // Show thank you
  state.submitted = true;
  const feedbackCard = document.getElementById(persona + '-feedback');
  const form = feedbackCard.querySelectorAll('.emoji-rating, .confused-section, .feedback-comment, .submit-btn, .feedback-question, .feedback-privacy');
  form.forEach(el => el.classList.add('hidden'));
  document.getElementById(persona === 'genz' ? 'gz-thankyou' : 'mom-thankyou').classList.remove('hidden');
}

// === INIT ===
console.log('Welfare Master Pilot Campaign loaded');
