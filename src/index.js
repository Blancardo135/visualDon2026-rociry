import "./style.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { select, selectAll } from "d3-selection";
import { scaleLinear, scalePoint } from "d3-scale";
import { max } from "d3-array";
import { axisLeft, axisBottom } from "d3-axis";

gsap.registerPlugin(ScrollTrigger);

const QUIZ_TARGET = 48;

const ROMAND_CANTONS = [
  {
    id: "geneve",
    name: "Université de Genève",
    canton: "Genève",
    x: 12,
    y: 70
  },
  {
    id: "lausanne",
    name: "Université de Lausanne",
    canton: "Vaud",
    x: 28,
    y: 54
  },
  {
    id: "epfl",
    name: "EPFL",
    canton: "Vaud",
    x: 31,
    y: 58
  },
  {
    id: "fribourg",
    name: "Université de Fribourg",
    canton: "Fribourg",
    x: 45,
    y: 48
  },
  {
    id: "neuchatel",
    name: "Université de Neuchâtel",
    canton: "Neuchâtel",
    x: 36,
    y: 38
  },
  {
    id: "sion",
    name: "HES-SO Valais",
    canton: "Valais",
    x: 60,
    y: 74
  }
];

const avatarEmoji = {
  louis: "🧑",
  chloe: "👩",
  thomas: "🧑‍💻",
  bruna: "👩‍🎓"
};

function getByPath(object, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], object);
}

function formatPct(value) {
  if (value === null || value === undefined || Number.isNaN(+value)) return "";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${rounded}`
    : `${rounded}`.replace(".", ".");
}

function createPeopleRow(total = 20, active = 10) {
  const wrap = document.createElement("div");
  wrap.className = "people-grid";

  for (let i = 0; i < total; i += 1) {
    const person = document.createElement("span");
    person.className = `person-dot ${i < active ? "is-active" : "is-inactive"}`;
    person.textContent = "⚉";
    wrap.appendChild(person);
  }

  return wrap;
}

function injectStats(data) {
  document.querySelectorAll("[data-stat]").forEach((node) => {
    const path = node.dataset.stat;
    const value = getByPath(data, path);
    node.textContent = formatPct(value);
  });
}

function setupAvatars() {
  document.querySelectorAll(".character").forEach((character) => {
    const avatar = character.querySelector(".character__avatar");
    const name = character.dataset.name;
    if (!avatar) return;

    avatar.innerHTML = `
      <span class="avatar-emoji">${avatarEmoji[name] || "🙂"}</span>
      <span class="avatar-name">${name || ""}</span>
    `;
  });
}

function buildGymnaseReasons(data) {
  const list = document.getElementById("gymnase-reasons-list");
  if (!list) return;

  list.innerHTML = "";
  data.gymnasiens.top3_raisons_arret.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.raison;
    list.appendChild(li);
  });
}

function buildMasterReasons(data) {
  const list = document.getElementById("master-reasons-list");
  if (!list) return;

  list.innerHTML = "";
  data.master.top3_raisons_pratiques_logistiques.raisons.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.raison;
    list.appendChild(li);
  });
}

function buildBachelorReasons(data) {
  const container = document.getElementById("bachelor-reasons-pictogram");
  if (!container) return;

  container.innerHTML = "";
  const top3 = data.bachelor.top5_raisons_pratique_quizz.slice(0, 3);

  top3.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `
      <div class="reason-card__icon">${["💚", "🤝", "⚡"][index] || "•"}</div>
      <p class="reason-card__label">${item.raison}</p>
      <div class="reason-card__people"></div>
    `;

    const people = card.querySelector(".reason-card__people");
    people.appendChild(createPeopleRow(10, Math.round(item.pct / 10)));

    container.appendChild(card);
  });
}

function buildBachelorDropout(data) {
  const dropout = Math.round((100 - QUIZ_TARGET) * 10) / 10;
  const pctNode = document.getElementById("bachelor-dropout-pct");
  const pictogram = document.getElementById("bachelor-dropout-pictogram");

  if (pctNode) pctNode.textContent = formatPct(dropout);

  if (pictogram) {
    pictogram.innerHTML = "";
    pictogram.appendChild(createPeopleRow(20, Math.round(dropout / 5)));
  }
}

function buildRevealTicker() {
  const ticker = document.querySelector(".reveal-banner__ticker");
  if (!ticker) return;

  ticker.textContent = Array.from({ length: 14 }, () => `${QUIZ_TARGET}%`).join("   ");
  const answer = document.querySelector('#fold-6 [data-stat="bachelor.pratiquent_sport_regulier.source_quizz.pratiquent_regulier_pct"]');
  if (answer) answer.textContent = `${QUIZ_TARGET}%`;
}

function buildBarChart(data) {
  const mount = document.getElementById("inactivite-bar-chart");
  if (!mount) return;

  mount.innerHTML = "";

  data.inactivite_globale.top5_raisons_inactivite_2025.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar-chart__item";
    bar.innerHTML = `
      <div class="bar-chart__col">
        <span class="bar-chart__value">${formatPct(item.pct_2025)}%</span>
        <div class="bar-chart__bar" style="height:${item.pct_2025 * 5}px"></div>
      </div>
      <p class="bar-chart__label">${item.raison}</p>
    `;
    mount.appendChild(bar);
  });
}

function buildImpactChart(data) {
  const mount = document.getElementById("master-impact-chart");
  if (!mount) return;

  mount.innerHTML = "";

  data.master.top5_impacts_positifs_etudes.raisons.forEach((item) => {
    const row = document.createElement("div");
    row.className = "impact-row";
    row.innerHTML = `
      <div class="impact-row__top">
        <span>${item.raison}</span>
        <span>${formatPct(item.tres_important_pct)}%</span>
      </div>
      <div class="impact-row__track">
        <div class="impact-row__fill" data-width="${item.tres_important_pct}"></div>
      </div>
    `;
    mount.appendChild(row);
  });
}

function buildMap(data) {
  const mount = document.getElementById("map-switzerland");
  const tooltip = document.getElementById("map-tooltip");
  if (!mount || !tooltip) return;

  const nameNode = tooltip.querySelector(".map-tooltip__name");
  const activeNode = tooltip.querySelector(".map-tooltip__tres-actifs");
  const participationNode = tooltip.querySelector(".map-tooltip__participation");

  mount.innerHTML = `
    <div class="map-shape">
      <div class="map-region map-region--geneve"></div>
      <div class="map-region map-region--vaud"></div>
      <div class="map-region map-region--fribourg"></div>
      <div class="map-region map-region--neuchatel"></div>
      <div class="map-region map-region--valais"></div>
    </div>
  `;

  const uniData = data.par_universite.tres_actifs_2025_et_participation_sport_univ;

  ROMAND_CANTONS.forEach((spot) => {
    const match =
      uniData.find((d) =>
        d.universite.toLowerCase().includes(spot.canton.toLowerCase())
      ) ||
      uniData.find((d) =>
        d.universite.toLowerCase().includes(spot.name.toLowerCase().replace("université de ", ""))
      ) ||
      uniData[0];

    const point = document.createElement("button");
    point.className = "map-point";
    point.style.left = `${spot.x}%`;
    point.style.top = `${spot.y}%`;
    point.setAttribute("type", "button");
    point.setAttribute("aria-label", `${spot.name}`);

    point.addEventListener("mouseenter", () => {
      tooltip.hidden = false;
      nameNode.textContent = match.universite || spot.name;
      activeNode.textContent = `Bachelor : ${formatPct(match.tres_actifs_pct_bachelor)}%`;
      participationNode.textContent = `Master : ${formatPct(match.tres_actifs_pct_master)}%`;
    });

    point.addEventListener("mousemove", (event) => {
      const rect = mount.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - rect.left + 20}px`;
      tooltip.style.top = `${event.clientY - rect.top - 10}px`;
    });

    point.addEventListener("mouseleave", () => {
      tooltip.hidden = true;
    });

    mount.appendChild(point);
  });
}

function buildGlobalLineChart(data) {
  const mount = document.getElementById("chart-global");
  if (!mount) return;

  mount.innerHTML = "";

  const width = mount.clientWidth || 700;
  const height = 320;
  const margin = { top: 20, right: 20, bottom: 40, left: 45 };

  const svg = select(mount)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("class", "chart-svg");

  const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const values = data.evolution_temporelle_2010_2025.tous_etudiants_evolution;
  const x = scalePoint()
    .domain(values.map((d) => String(d.annee)))
    .range([0, innerWidth]);

  const y = scaleLinear().domain([0, 100]).range([innerHeight, 0]);

  chart
    .append("g")
    .attr("class", "chart-axis")
    .call(axisLeft(y).ticks(5).tickFormat((d) => `${d}%`));

  chart
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .attr("class", "chart-axis")
    .call(axisBottom(x));

  const path = values
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(String(d.annee))} ${y(d.tres_actifs_pct)}`)
    .join(" ");

  chart
    .append("path")
    .attr("d", path)
    .attr("class", "line-path line-path--primary");

  chart
    .selectAll(".line-dot")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "line-dot")
    .attr("cx", (d) => x(String(d.annee)))
    .attr("cy", (d) => y(d.tres_actifs_pct))
    .attr("r", 4);
}

function buildLevelLineChart(data) {
  const mount = document.getElementById("chart-by-level");
  if (!mount) return;

  mount.innerHTML = "";

  const width = mount.clientWidth || 700;
  const height = 340;
  const margin = { top: 20, right: 20, bottom: 40, left: 45 };

  const svg = select(mount)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("class", "chart-svg");

  const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const official = data.evolution_temporelle_2010_2025.par_niveau_officiel;
  const quiz = data.evolution_temporelle_2010_2025.gymnase_apprentissage_quizz;

  const years = official.map((d) => String(d.annee));

  const series = [
    {
      name: "Master",
      className: "line-path--master",
      values: official.map((d) => ({ annee: d.annee, value: d.master_tres_actifs_pct }))
    },
    {
      name: "Bachelor",
      className: "line-path--bachelor",
      values: official.map((d) => ({ annee: d.annee, value: d.bachelor_tres_actifs_pct }))
    },
    {
      name: "Gymnase",
      className: "line-path--gymnase",
      values: [
        { annee: 2010, value: 62 },
        { annee: 2015, value: 64 },
        { annee: 2020, value: 65 },
        { annee: 2025, value: quiz.gymnase_sport_regulier_pct }
      ]
    },
    {
      name: "Apprentissage",
      className: "line-path--apprentissage",
      values: [
        { annee: 2010, value: 56 },
        { annee: 2015, value: 59 },
        { annee: 2020, value: 61 },
        { annee: 2025, value: quiz.apprentissage_sport_regulier_pct }
      ]
    }
  ];

  const x = scalePoint().domain(years).range([0, innerWidth]);
  const y = scaleLinear().domain([0, 100]).range([innerHeight, 0]);

  chart
    .append("g")
    .attr("class", "chart-axis")
    .call(axisLeft(y).ticks(5).tickFormat((d) => `${d}%`));

  chart
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .attr("class", "chart-axis")
    .call(axisBottom(x));

  series.forEach((serie) => {
    const path = serie.values
      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(String(d.annee))} ${y(d.value)}`)
      .join(" ");

    chart
      .append("path")
      .attr("d", path)
      .attr("class", `line-path ${serie.className}`);
  });

  const legend = document.createElement("div");
  legend.className = "chart-legend";
  legend.innerHTML = `
    <span class="legend-item legend-item--master">Master</span>
    <span class="legend-item legend-item--bachelor">Bachelor</span>
    <span class="legend-item legend-item--gymnase">Gymnase</span>
    <span class="legend-item legend-item--apprentissage">Apprentissage</span>
  `;
  mount.appendChild(legend);
}

function setupFold1() {
  const characters = gsap.utils.toArray("#fold-1 .character");
  gsap.set(characters, { autoAlpha: 0, y: 50 });

  ScrollTrigger.create({
    trigger: "#fold-1",
    start: "top 70%",
    once: true,
    onEnter: () => {
      gsap.to(characters, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.35,
        ease: "power2.out"
      });
    }
  });
}

function setupFold2() {
  gsap.from("#fold-2 .fold__title", {
    scrollTrigger: {
      trigger: "#fold-2",
      start: "top 75%",
      once: true
    },
    x: -220,
    opacity: 0,
    duration: 1
  });

  gsap.from("#fold-2 .stat-block", {
    scrollTrigger: {
      trigger: "#fold-2",
      start: "top 65%",
      once: true
    },
    y: 60,
    opacity: 0,
    stagger: 0.25,
    duration: 0.8
  });
}

function setupFold3() {
  gsap.from("#fold-3 .character", {
    scrollTrigger: {
      trigger: "#fold-3",
      start: "top 70%",
      once: true
    },
    x: -120,
    opacity: 0,
    duration: 0.9
  });

  gsap.from("#fold-3 .big-stat", {
    scrollTrigger: {
      trigger: "#fold-3",
      start: "top 65%",
      once: true
    },
    y: 80,
    opacity: 0,
    duration: 0.9
  });
}

function setupFold4() {
  gsap.from("#fold-4 .big-stat, #fold-4 .reasons-list", {
    scrollTrigger: {
      trigger: "#fold-4",
      start: "top 70%",
      once: true
    },
    x: 180,
    opacity: 0,
    stagger: 0.2,
    duration: 0.9
  });
}

function setupFold5() {
  const slider = document.getElementById("quiz-slider");
  const output = document.querySelector(".quiz-block__output");
  const button = document.querySelector(".quiz-block__submit");

  if (!slider || !output || !button) return;

  slider.addEventListener("input", () => {
    output.textContent = `${slider.value}%`;
  });

  const goToFold6 = () => {
    slider.value = QUIZ_TARGET;
    output.textContent = `${QUIZ_TARGET}%`;

    gsap.to(window, {
      duration: 1,
      scrollTo: "#fold-6"
    });
  };

  button.addEventListener("click", goToFold6);

  slider.addEventListener("change", () => {
    if (Number(slider.value) === QUIZ_TARGET) {
      goToFold6();
    }
  });
}

function setupFold6() {
  gsap.from("#fold-6 .reveal-content", {
    scrollTrigger: {
      trigger: "#fold-6",
      start: "top 70%",
      once: true
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8
  });

  gsap.to(".reveal-banner__ticker", {
    xPercent: -50,
    repeat: -1,
    ease: "none",
    duration: 16
  });
}

function setupFold7() {
  gsap.from("#fold-7 .reason-card", {
    scrollTrigger: {
      trigger: "#fold-7",
      start: "top 70%",
      once: true
    },
    y: 80,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8
  });
}

function setupFold8() {
  gsap.from("#fold-8 .fold__statement, #fold-8 .dropout-pictogram", {
    scrollTrigger: {
      trigger: "#fold-8",
      start: "top 75%",
      once: true
    },
    opacity: 0,
    y: 70,
    stagger: 0.15,
    duration: 0.8
  });
}

function setupFold9() {
  gsap.from("#fold-9 .bar-chart__item", {
    scrollTrigger: {
      trigger: "#fold-9",
      start: "top 75%",
      once: true
    },
    opacity: 0,
    y: 90,
    stagger: 0.15,
    duration: 0.8
  });
}

function setupFold10() {
  gsap.from("#fold-10 .fold__title", {
    scrollTrigger: {
      trigger: "#fold-10",
      start: "top 75%",
      once: true
    },
    x: -220,
    opacity: 0,
    duration: 1
  });

  gsap.from("#fold-10 .character", {
    scrollTrigger: {
      trigger: "#fold-10",
      start: "top 65%",
      once: true
    },
    y: 60,
    opacity: 0,
    duration: 0.8
  });
}

function setupFold11() {
  const fills = document.querySelectorAll(".impact-row__fill");

  ScrollTrigger.create({
    trigger: "#fold-11",
    start: "top 75%",
    once: true,
    onEnter: () => {
      fills.forEach((fill, index) => {
        gsap.to(fill, {
          width: `${fill.dataset.width}%`,
          duration: 1,
          delay: index * 0.15,
          ease: "power2.out"
        });
      });
    }
  });
}

function setupFold12() {
  gsap.from("#fold-12 .fold__title", {
    scrollTrigger: {
      trigger: "#fold-12",
      start: "top 75%",
      once: true
    },
    x: -220,
    opacity: 0,
    duration: 1
  });

  gsap.from("#fold-12 .map-point", {
    scrollTrigger: {
      trigger: "#fold-12",
      start: "top 65%",
      once: true
    },
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5
  });
}

function setupFold13() {
  gsap.from("#fold-13 .bias-block", {
    scrollTrigger: {
      trigger: "#fold-13",
      start: "top 75%",
      once: true
    },
    scale: 0.85,
    opacity: 0,
    duration: 0.9
  });
}

function setupFold14And15() {
  gsap.from("#chart-global svg", {
    scrollTrigger: {
      trigger: "#fold-14",
      start: "top 75%",
      once: true
    },
    clipPath: "inset(0 100% 0 0)",
    duration: 1.2
  });

  gsap.from("#chart-by-level svg", {
    scrollTrigger: {
      trigger: "#fold-15",
      start: "top 75%",
      once: true
    },
    clipPath: "inset(0 100% 0 0)",
    duration: 1.2
  });

  gsap.from("#chart-by-level .chart-legend", {
    scrollTrigger: {
      trigger: "#fold-15",
      start: "top 60%",
      once: true
    },
    y: 30,
    opacity: 0,
    duration: 0.7
  });
}

function setupFold16to18() {
  const dialogLeft = document.querySelector("#fold-17 .dialogue__left");
  const dialogRight = document.querySelector("#fold-17 .dialogue__right");
  const bubbles = gsap.utils.toArray("#fold-17 .speech");

  if (dialogLeft && dialogRight) {
    gsap.fromTo(
      dialogLeft,
      { x: 0 },
      {
        x: -120,
        scrollTrigger: {
          trigger: "#fold-17",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    gsap.fromTo(
      dialogRight,
      { x: 0 },
      {
        x: 120,
        scrollTrigger: {
          trigger: "#fold-17",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }

  gsap.from(bubbles, {
    scrollTrigger: {
      trigger: "#fold-17",
      start: "top 75%",
      once: true
    },
    opacity: 0,
    y: 25,
    stagger: 0.25,
    duration: 0.7
  });

  gsap.from("#fold-18 .final-message", {
    scrollTrigger: {
      trigger: "#fold-18",
      start: "top 80%",
      once: true
    },
    opacity: 0,
    y: 50,
    duration: 0.9
  });
}

function addDialogueIfMissing() {
  const fold17 = document.getElementById("fold-17");
  const fold18 = document.getElementById("fold-18");

  if (fold17 && !fold17.querySelector(".dialogue")) {
    fold17.innerHTML = `
      <div class="dialogue">
        <div class="dialogue__left">
          <div class="character character--inline" data-name="bruna">
            <div class="character__avatar"></div>
          </div>
          <div class="speech">Je trouve que c’est cool pour la santé mentale.</div>
          <div class="speech">Moi ça m’aide à me changer les idées.</div>
          <div class="speech">Oui c’est vrai, chacun trouve son propre équilibre.</div>
        </div>

        <div class="dialogue__right">
          <div class="character character--inline" data-name="louis">
            <div class="character__avatar"></div>
          </div>
          <div class="speech">Oui, mais ça prend beaucoup de temps.</div>
          <div class="speech">Chacun peut faire comme il préfère.</div>
        </div>
      </div>
    `;
  }

  if (fold18 && !fold18.querySelector(".final-message")) {
    fold18.innerHTML = `
      <div class="final-message">
        Au final, nous avons tous des chemins différents.
      </div>
    `;
  }

  setupAvatars();
}

async function init() {
  const response = await fetch("/data-sport.json");
  const data = await response.json();

  addDialogueIfMissing();
  setupAvatars();
  injectStats(data);
  buildGymnaseReasons(data);
  buildMasterReasons(data);
  buildBachelorReasons(data);
  buildBachelorDropout(data);
  buildRevealTicker();
  buildBarChart(data);
  buildImpactChart(data);
  buildMap(data);
  buildGlobalLineChart(data);
  buildLevelLineChart(data);

  setupFold1();
  setupFold2();
  setupFold3();
  setupFold4();
  setupFold5();
  setupFold6();
  setupFold7();
  setupFold8();
  setupFold9();
  setupFold10();
  setupFold11();
  setupFold12();
  setupFold13();
  setupFold14And15();
  setupFold16to18();

  ScrollTrigger.refresh();
}

init().catch((error) => {
  console.error("Erreur d'initialisation :", error);
});
