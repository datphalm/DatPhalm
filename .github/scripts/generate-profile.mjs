#!/usr/bin/env node
/**
 * Singularity — Antigravity Horizon Edition
 * Self-contained zero-dependency profile README + animated SVG generator for @datphalm.
 *
 * Adapted & enhanced from Dr-At0mic/README-Templates (MIT License) with:
 * - Log-quantile Keplerian accretion disk scaling (preserves visibility across 320+ active days alongside 500+ supernova spikes)
 * - 6-panel Mission Telemetry HUD with orbital uptime, peak thrust & spectral stack composition
 * - 2x2 HUD Flight Deck mission cards for public & stealth flagship systems
 * - Dual Dark (Interstellar Black Hole) & Light (Astronomical Survey Plate) SVG themes
 * - Automatic GitHub GraphQL + REST/Contributions API fallback for zero-config GitHub Actions runs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const CONFIG = {
  login: 'datphalm',
  name: 'Dat Pham',
  headline: 'AI Agent Security  ·  Systems Engineering  ·  Multimodal Tooling',
  roleShort: 'AI Agent Security, Systems & Multimodal Tooling',
  missionName: 'Antigravity III',
  signoff: 'Fail-closed systems · Zero-dep craft · See you beyond the horizon',
  email: 'datphalm13@gmail.com',
  joinedYear: 2023,
  coreStack: ['Go', 'Rust', 'Python', 'JavaScript', 'TypeScript', 'C++'],
  intro:
    'Systems & AI engineer building fail-closed agent sandboxes, out-of-core columnar data engines, multimodal MCP skills, and physics-driven desktop craft — from OS-level security proxies in **Go** & **Rust** to audio-visual reasoning pipelines in **Python** & **WebGL**.',
  now:
    'Advancing autonomous AI agent security (`ghostcage`), semantic Parquet/CSV diffing (`parqdiff`), multimodal video perception (`YVS`), and tactile Windows desktop experiences (`antigravity-liftoff`).',
  missions: [
    {
      code: 'MSN-01',
      name: 'antigravity-liftoff',
      url: 'https://github.com/datphalm/antigravity-liftoff',
      status: 'PUBLIC // LIVE',
      isPublic: true,
      stack: 'JavaScript · Python · WebGL',
      langColor: '#f1e05a',
      shortDesc: 'Cinematic gravity-to-antigravity intro launcher for Google Antigravity on Windows with 2D physics, WebGL FX & Silver Ink theme.',
    },
    {
      code: 'MSN-02',
      name: 'YVS — YouTube Vision Skill',
      repoName: 'YVS---Youtube-Vision-Skill',
      url: 'https://github.com/datphalm/YVS---Youtube-Vision-Skill',
      status: 'PUBLIC // MCP',
      isPublic: true,
      stack: 'Python · MCP · Gemini · Whisper',
      langColor: '#3572A5',
      shortDesc: 'Multimodal MCP server & AI agent skill enabling agents to see and hear YouTube streams via scene extraction & timeline alignment.',
    },
    {
      code: 'MSN-03',
      name: 'ghostcage',
      url: null,
      status: 'STEALTH // CORE',
      isPublic: false,
      stack: 'Go · MITM Proxy · OS Sandbox',
      langColor: '#00ADD8',
      shortDesc: 'Zero-trust secret-blind MITM proxy and OS sandbox for running autonomous AI coding agents without exposing credentials.',
    },
    {
      code: 'MSN-04',
      name: 'parqdiff',
      url: null,
      status: 'STEALTH // CORE',
      isPublic: false,
      stack: 'Rust · Apache Arrow · Parquet',
      langColor: '#dea584',
      shortDesc: 'Semantic, out-of-core Parquet/CSV diff engine with zero-scan remote metadata inspection and native git diff integration.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Deterministic PRNG & Math Helpers
// ---------------------------------------------------------------------------

function hashString(input) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seededRandom = (key) => mulberry32(hashString(String(key)));
const r1 = (n) => Math.round(n * 10) / 10;
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const TAU = Math.PI * 2;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const THIN = "'Helvetica Neue', 'Segoe UI', ui-sans-serif, -apple-system, Helvetica, Arial, sans-serif";
const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
const REDUCED = '@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }';

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxChars, maxLines = 2) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/[\s,;:]*\S*$/, '') + '…';
    return kept;
  }
  return lines;
}

function monthlySeries(days) {
  const byMonth = new Map();
  for (const d of days) {
    const key = d.date.slice(0, 7);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(d.count);
  }
  return [...byMonth.entries()].slice(-12).map(([key, counts]) => ({
    key,
    label: MONTHS[Number(key.slice(5, 7)) - 1],
    counts,
    total: counts.reduce((a, b) => a + b, 0),
  }));
}

// ---------------------------------------------------------------------------
// Live GitHub Telemetry Fetcher (GraphQL primary + Public REST fallback)
// ---------------------------------------------------------------------------

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'datphalm-singularity-profile-updater',
      Accept: 'application/json',
      ...headers,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchViaGraphQL(login, token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        login
        name
        createdAt
        followers { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
          nodes {
            name
            stargazerCount
            languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name } }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }
  `;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'datphalm-singularity-profile-updater',
    },
    body: JSON.stringify({ query, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const payload = await res.json();
  if (payload.errors?.length || !payload.data?.user) {
    throw new Error(payload.errors?.[0]?.message || 'No GraphQL user data');
  }
  const u = payload.data.user;
  const bytes = new Map();
  let stars = 0;
  const repoStars = new Map();
  for (const repo of u.repositories.nodes) {
    stars += repo.stargazerCount || 0;
    repoStars.set(repo.name, repo.stargazerCount || 0);
    if (repo.name.toLowerCase() === login.toLowerCase()) continue;
    for (const edge of repo.languages.edges) {
      bytes.set(edge.node.name, (bytes.get(edge.node.name) || 0) + edge.size);
    }
  }
  const days = u.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));

  return {
    joinedYear: new Date(u.createdAt).getFullYear(),
    followers: u.followers.totalCount,
    totalStars: stars,
    repoStars,
    languages: toLanguageShares(bytes),
    contributions: {
      total: u.contributionsCollection.contributionCalendar.totalContributions,
      days,
    },
  };
}

async function fetchViaPublicApis(login, token) {
  const ghHeaders = token
    ? { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    : { Accept: 'application/vnd.github+json' };

  const [user, repos, contrib] = await Promise.all([
    fetchJson(`https://api.github.com/users/${login}`, ghHeaders),
    fetchJson(`https://api.github.com/users/${login}/repos?per_page=100&type=owner`, ghHeaders),
    fetchJson(`https://github-contributions-api.jogruber.de/v4/${login}?y=last`),
  ]);

  const bytes = new Map();
  let totalStars = 0;
  const repoStars = new Map();
  const nonFork = repos.filter((r) => !r.fork);

  await Promise.all(
    nonFork.map(async (r) => {
      totalStars += r.stargazers_count || 0;
      repoStars.set(r.name, r.stargazers_count || 0);
      if (r.name.toLowerCase() === login.toLowerCase()) return;
      try {
        const langObj = await fetchJson(r.languages_url, ghHeaders);
        for (const [lang, size] of Object.entries(langObj)) {
          bytes.set(lang, (bytes.get(lang) || 0) + size);
        }
      } catch {
        if (r.language) bytes.set(r.language, (bytes.get(r.language) || 0) + 10000);
      }
    })
  );

  const days = (contrib.contributions || []).map((d) => ({
    date: d.date,
    count: Number(d.count) || 0,
  }));
  const total = contrib.total?.lastYear ?? days.slice(-365).reduce((s, d) => s + d.count, 0);

  return {
    joinedYear: user.created_at ? new Date(user.created_at).getFullYear() : CONFIG.joinedYear,
    followers: user.followers || 0,
    totalStars,
    repoStars,
    languages: toLanguageShares(bytes),
    contributions: { total, days },
  };
}

function toLanguageShares(bytes) {
  const total = [...bytes.values()].reduce((a, b) => a + b, 0) || 1;
  return [...bytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, size]) => ({ name, share: size / total }));
}

async function loadProfileData() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
  if (token) {
    try {
      console.log('Fetching telemetry via GitHub GraphQL API...');
      return await fetchViaGraphQL(CONFIG.login, token);
    } catch (err) {
      console.warn(`GraphQL unavailable (${err.message}), falling back to REST + Contributions API...`);
    }
  }
  console.log('Fetching telemetry via public GitHub REST + Contributions APIs...');
  return fetchViaPublicApis(CONFIG.login, token);
}

// ---------------------------------------------------------------------------
// Theme Palettes (Dark: Interstellar Gargantua | Light: Sky-Survey Negative)
// ---------------------------------------------------------------------------

const THEMES = {
  dark: {
    bg: '#04050a',
    cardBg: '#080b14',
    fg: '#f4f1ea',
    muted: '#8a94a8',
    hud: '#7dd3fc',
    hudSoft: '#38bdf8',
    amber: '#ffb257',
    faint: '#192132',
    faintHi: '#263249',
    bar: '#000000',
    barText: '#c3c8d4',
    shadow: '#000000',
    diskLo: '#8c5425',
    diskMid: '#ffb257',
    diskHi: '#fff5e4',
    supernova: '#bae6fd',
    halo: '#ffc47a',
    haze: '#ff9a45',
    hazeOpacity: 0.17,
    star: '#ffffff',
    planet: '#05060b',
    badgeLiveBg: '#092436',
    badgeLiveText: '#7dd3fc',
    badgeStealthBg: '#1d1829',
    badgeStealthText: '#c4b5fd',
  },
  light: {
    bg: '#f3f1ec',
    cardBg: '#ebe8e0',
    fg: '#14161c',
    muted: '#555c6e',
    hud: '#0b5cad',
    hudSoft: '#0369a1',
    amber: '#9a5b13',
    faint: '#d4d7df',
    faintHi: '#b9beca',
    bar: '#0c0d10',
    barText: '#d3d6dd',
    shadow: '#f3f1ec',
    diskLo: '#a29b8e',
    diskMid: '#3d3832',
    diskHi: '#0c0b0a',
    supernova: '#0b5cad',
    halo: '#2a2723',
    haze: '#14161c',
    hazeOpacity: 0.07,
    star: '#14161c',
    planet: '#e4e1d9',
    badgeLiveBg: '#dceafb',
    badgeLiveText: '#0b5cad',
    badgeStealthBg: '#e6e1f5',
    badgeStealthText: '#5b21b6',
  },
};

function computeTelemetry(data) {
  const days = (data.contributions?.days || []).slice(-365);
  const total = data.contributions?.total || days.reduce((s, d) => s + d.count, 0);
  let streak = 0;
  let run = 0;
  let peakDay = 0;
  for (const d of days) {
    if (d.count > 0) {
      run++;
      if (run > streak) streak = run;
      if (d.count > peakDay) peakDay = d.count;
    } else {
      run = 0;
    }
  }
  const active = days.filter((d) => d.count > 0).length;
  const uptimePct = days.length ? ((active / days.length) * 100).toFixed(1) : '0.0';
  const nowYear = new Date().getUTCFullYear();
  const years = Math.max(1, nowYear - (data.joinedYear || CONFIG.joinedYear));

  // Compute 97th percentile of active days so outlier 500-commit days don't dim the rest of the disk
  const activeCounts = days
    .map((d) => d.count)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);
  const p97 = activeCounts.length
    ? Math.max(8, activeCounts[Math.min(activeCounts.length - 1, Math.floor(activeCounts.length * 0.97))])
    : 10;

  return {
    days,
    total,
    active,
    streak,
    peakDay,
    p97,
    uptimePct,
    years,
    stars: data.totalStars || 0,
    followers: data.followers || 0,
  };
}

// ---------------------------------------------------------------------------
// 1. Hero SVG — Gargantua Black Hole & Keplerian Contribution Disk
// ---------------------------------------------------------------------------

function heroSvg(data, themeName) {
  const c = THEMES[themeName];
  const W = 1200;
  const H = 560;
  const BAR = 56;
  const cx = 600;
  const cy = 258;
  const TILT = -7;
  const SQUASH = 0.195;
  const Rs = 84;
  const Rin = 118;
  const Rout = 344;
  const rand = seededRandom(`singularity:${CONFIG.login}`);
  const n = computeTelemetry(data);

  // Starfield (loop 1 of 2: gentle starlight twinkle)
  let stars = '';
  let twinklers = '';
  for (let i = 0; i < 190; i++) {
    const x = r1(rand() * W);
    const y = r1(BAR + rand() * (H - BAR * 2));
    const big = rand() > 0.92;
    const r = r1(big ? 1.2 + rand() * 0.85 : 0.4 + rand() * 0.7);
    const o = (0.25 + rand() * 0.72).toFixed(2);
    if (i % 9 === 0) {
      twinklers += `<circle class="tw" style="animation-delay:${(rand() * 4.2).toFixed(2)}s" cx="${x}" cy="${y}" r="${r}" fill="${c.star}" opacity="${o}"/>`;
    } else {
      stars += `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`;
    }
  }

  // Accretion disk particles: 365 days mapped with log-quantile normalization
  const bands = ['', '', ''];
  const third = (Rout - Rin) / 3;
  const arc = (r, a, len, width, color, opacity) => {
    const x1 = r1(Math.cos(a) * r);
    const y1 = r1(Math.sin(a) * r);
    const x2 = r1(Math.cos(a + len) * r);
    const y2 = r1(Math.sin(a + len) * r);
    const band = r < Rin + third ? 0 : r < Rin + third * 2 ? 1 : 2;
    bands[band] += `<path d="M${x1} ${y1}A${r1(r)} ${r1(r)} 0 0 1 ${x2} ${y2}" stroke="${color}" stroke-width="${r1(width)}" stroke-opacity="${opacity}"/>`;
  };

  const denom = Math.log1p(n.p97);
  n.days.forEach((d, i) => {
    const isSupernova = d.count >= 25;
    const v = d.count === 0 ? 0 : Math.min(1, Math.log1p(d.count) / denom);
    // High-output days orbit closer to the relativistic inner photon ring
    const r = isSupernova
      ? Rin + 3 + rand() * 24
      : Rin + (Rout - Rin) * Math.pow(rand(), 0.72 + v * 1.65);
    const a = (i / Math.max(1, n.days.length)) * TAU + rand() * 0.035;
    const color = isSupernova
      ? c.supernova
      : v === 0
      ? c.diskLo
      : v < 0.42
      ? c.diskMid
      : c.diskHi;
    const opacity = v === 0 ? '0.30' : (0.52 + 0.48 * v).toFixed(2);
    const arcLen = isSupernova ? 0.24 : 0.055 + 0.13 * v + rand() * 0.05;
    const strokeW = isSupernova ? 7.8 : 1.4 + 5.6 * Math.sqrt(v);
    arc(r, a, arcLen, strokeW, color, opacity);
  });

  // Ambient relativistic dust filaments
  for (let i = 0; i < 165; i++) {
    arc(
      Rin + (Rout - Rin) * rand(),
      rand() * TAU,
      0.03 + rand() * 0.08,
      1 + rand() * 2,
      rand() > 0.45 ? c.diskMid : c.diskLo,
      (0.16 + rand() * 0.26).toFixed(2)
    );
  }

  let rings = '';
  for (let r = Rin; r <= Rout; r += 12) {
    const t = (r - Rin) / (Rout - Rin);
    const o = (0.56 * Math.pow(1 - t, 1.6) + 0.04).toFixed(3);
    rings += `<circle r="${r}" fill="none" stroke="${t < 0.19 ? c.diskHi : c.diskMid}" stroke-width="13" stroke-opacity="${o}"/>`;
  }
  rings += `<circle r="${Rin}" fill="none" stroke="${c.diskHi}" stroke-width="5.2" stroke-opacity="0.92"/>`;

  const disk = (clip) => `<g clip-path="url(#${clip})" mask="url(#doppler)">
  <g transform="translate(${cx} ${cy}) rotate(${TILT}) scale(1 ${SQUASH})">
    <use xlink:href="#rings" filter="url(#diskGlow)"/>
    <use xlink:href="#rings"/>
    <g class="spin s0"><use xlink:href="#b0"/></g>
    <g class="spin s1"><use xlink:href="#b1"/></g>
    <g class="spin s2"><use xlink:href="#b2"/></g>
  </g>
</g>`;

  const name = CONFIG.name.toUpperCase();
  const nameSize = 42;
  const tracking = 18;
  const sub = CONFIG.headline.toUpperCase();
  const bottomLine = `${fmt(n.total)} CONTRIBUTIONS  ·  ${fmt(n.active)} DAYS IN ORBIT (${n.uptimePct}%)  ·  LONGEST BURN ${n.streak} DAYS`;

  const css = `
.scene{animation:fade 2.2s ease-out both}
.bar-top{animation:barTop 1.3s ${EXPO} .12s both}
.bar-bot{animation:barBot 1.3s ${EXPO} .12s both}
.title{animation:rise 1.7s ${EXPO} .95s both}
.sub{animation:rise 1.6s ${EXPO} 1.35s both}
.hud{animation:fade 1.2s ease-out 1.7s both}
.spin{animation-name:spin;animation-timing-function:linear;animation-iteration-count:infinite}
.s0{animation-duration:26s}.s1{animation-duration:44s}.s2{animation-duration:74s}
.tw{animation:twinkle 4.4s ease-in-out infinite}
@keyframes fade{from{opacity:0}}
@keyframes barTop{from{transform:translateY(-${BAR}px)}}
@keyframes barBot{from{transform:translateY(${BAR}px)}}
@keyframes rise{from{opacity:0;transform:translateY(12px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes twinkle{0%,100%{opacity:1}50%{opacity:.15}}
${REDUCED}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(`${CONFIG.name} (@${CONFIG.login}) — ${CONFIG.roleShort}. Gargantua black hole accretion disk generated from ${fmt(n.total)} contributions across ${n.active} active days.`)}">
<style>${css}</style>
<defs>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="16"/></clipPath>
  <clipPath id="back"><rect x="-800" y="${cy - 1400}" width="2800" height="1400" transform="rotate(${TILT} ${cx} ${cy})"/></clipPath>
  <clipPath id="front"><rect x="-800" y="${cy}" width="2800" height="1400" transform="rotate(${TILT} ${cx} ${cy})"/></clipPath>
  <linearGradient id="dop" gradientUnits="userSpaceOnUse" x1="${cx - Rout}" y1="0" x2="${cx + Rout}" y2="0">
    <stop offset="0" stop-color="#fff"/><stop offset="0.52" stop-color="#c8c8c8"/><stop offset="1" stop-color="#484848"/>
  </linearGradient>
  <mask id="doppler" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#dop)"/></mask>
  <radialGradient id="haze" cx="${cx}" cy="${cy}" r="440" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${c.haze}" stop-opacity="${c.hazeOpacity}"/><stop offset="1" stop-color="${c.haze}" stop-opacity="0"/>
  </radialGradient>
  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="diskGlow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="14 3"/></filter>
  <g id="rings">${rings}</g>
  <g id="b0" fill="none" stroke-linecap="round">${bands[0]}</g>
  <g id="b1" fill="none" stroke-linecap="round">${bands[1]}</g>
  <g id="b2" fill="none" stroke-linecap="round">${bands[2]}</g>
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <g class="scene">
    <rect width="${W}" height="${H}" fill="url(#haze)"/>
    <g fill="${c.star}">${stars}</g>
    ${twinklers}
    <g mask="url(#doppler)">
      <g clip-path="url(#back)">
        <ellipse cx="${cx}" cy="${cy}" rx="${Rs * 1.5}" ry="${Rs * 1.4}" fill="none" stroke="${c.halo}" stroke-width="40" stroke-opacity="0.55" filter="url(#glow)"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${Rs * 1.42}" ry="${Rs * 1.32}" fill="none" stroke="${c.halo}" stroke-width="14" stroke-opacity="0.82"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${Rs * 1.33}" ry="${Rs * 1.22}" fill="none" stroke="${c.diskHi}" stroke-width="3" stroke-opacity="0.92"/>
      </g>
      <ellipse cx="${cx}" cy="${cy}" rx="${Rs * 1.3}" ry="${Rs * 1.2}" fill="none" stroke="${c.halo}" stroke-width="10" stroke-opacity="0.35" filter="url(#glow)"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${Rs * 1.24}" ry="${Rs * 1.15}" fill="none" stroke="${c.halo}" stroke-width="3" stroke-opacity="0.78"/>
    </g>
    ${disk('back')}
    <circle cx="${cx}" cy="${cy}" r="${Rs}" fill="${c.shadow}"/>
    <circle cx="${cx}" cy="${cy}" r="${Rs * 1.05}" fill="none" stroke="${c.diskHi}" stroke-width="2" stroke-opacity="0.92" mask="url(#doppler)"/>
    ${disk('front')}
    <text class="title" x="${cx + tracking / 2}" y="448" text-anchor="middle" font-family="${THIN}" font-weight="300" font-size="${nameSize}" letter-spacing="${tracking}" fill="${c.fg}">${escapeXml(name)}</text>
    <text class="sub" x="${cx + 1.2}" y="482" text-anchor="middle" font-family="${MONO}" font-size="12.5" letter-spacing="2.4" fill="${c.hud}">${escapeXml(sub)}</text>
  </g>
  <g class="bar-top">
    <rect width="${W}" height="${BAR}" fill="${c.bar}"/>
    <g class="hud" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${c.barText}">
      <text x="36" y="34">MISSION LOG  //  ${escapeXml(CONFIG.missionName.toUpperCase())}</text>
      <circle cx="${W - 246}" cy="30" r="3.5" fill="#34d399"/>
      <text x="${W - 36}" y="34" text-anchor="end">T+ ${n.years} YR  ·  @${escapeXml(CONFIG.login.toUpperCase())}</text>
    </g>
  </g>
  <g class="bar-bot">
    <rect y="${H - BAR}" width="${W}" height="${BAR}" fill="${c.bar}"/>
    <text class="hud" x="${cx}" y="${H - 23}" text-anchor="middle" font-family="${MONO}" font-size="12" letter-spacing="2.4" fill="${c.barText}">${escapeXml(bottomLine)}</text>
  </g>
</g>
</svg>`;
}

// ---------------------------------------------------------------------------
// 2. Mission Telemetry HUD SVG — 12-Month Orbit + 6 Readouts + Stack Spectrum
// ---------------------------------------------------------------------------

function brackets(x, y, w, h, s, color, opacity = 1) {
  return `<path d="M${x} ${y + s}V${y}H${x + s} M${x + w - s} ${y}H${x + w}V${y + s} M${x + w} ${y + h - s}V${y + h}H${x + w - s} M${x + s} ${y + h}H${x}V${y + h - s}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.5"/>`;
}

function closedCurve(points, samples = 12) {
  const out = [];
  const N = points.length;
  for (let i = 0; i < N; i++) {
    const p0 = points[(i - 1 + N) % N];
    const p1 = points[i];
    const p2 = points[(i + 1) % N];
    const p3 = points[(i + 2) % N];
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c2, d) =>
        0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  let length = 0;
  for (let i = 0; i < out.length; i++) {
    const [ax, ay] = out[i];
    const [bx, by] = out[(i + 1) % out.length];
    length += Math.hypot(bx - ax, by - ay);
  }
  return { d: `M${out.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L')} Z`, length: Math.ceil(length) };
}

function telemetrySvg(data, themeName) {
  const c = THEMES[themeName];
  const W = 1200;
  const H = 468;
  const n = computeTelemetry(data);
  const months = monthlySeries(n.days);
  // Log-smoothed radius for monthly orbit so a single 500-commit month doesn't collapse 11 active months to the center
  const maxLogMonth = Math.max(1, ...months.map((m) => Math.log1p(m.total)));
  const busiest = months.reduce((best, m, i) => (m.total > months[best].total ? i : best), 0);

  const ox = 236;
  const oy = 248;
  const R = 134;
  const angleOf = (i) => ((-90 + (i * 360) / Math.max(1, months.length)) * Math.PI) / 180;
  const pts = months.map((m, i) => {
    const norm = Math.log1p(m.total) / maxLogMonth;
    const r = 34 + (R - 34) * Math.pow(norm, 0.85);
    return [ox + Math.cos(angleOf(i)) * r, oy + Math.sin(angleOf(i)) * r];
  });
  const orbit = pts.length > 2 ? closedCurve(pts) : { d: '', length: 1 };
  const grid = [R / 3, (R * 2) / 3, R]
    .map((r) => `<circle cx="${ox}" cy="${oy}" r="${r1(r)}" fill="none" stroke="${c.faint}" stroke-dasharray="3 3"/>`)
    .join('');
  const spokes = months
    .map((m, i) => {
      const a = angleOf(i);
      const lx = ox + Math.cos(a) * (R + 20);
      const ly = oy + Math.sin(a) * (R + 20) + 3.5;
      const isPeak = i === busiest;
      return `<line x1="${ox}" y1="${oy}" x2="${r1(ox + Math.cos(a) * R)}" y2="${r1(oy + Math.sin(a) * R)}" stroke="${c.faint}"/><text x="${r1(lx)}" y="${r1(ly)}" text-anchor="middle" font-family="${MONO}" font-size="10" font-weight="${isPeak ? '700' : '400'}" letter-spacing="1" fill="${isPeak ? c.amber : c.muted}">${m.label}</text>`;
    })
    .join('');
  const peak = pts[busiest];

  const sixthMetric =
    n.stars >= 10
      ? ['PAYLOAD', fmt(n.stars), 'STARS EARNED']
      : ['ORBITAL UPTIME', `${n.uptimePct}%`, 'ACTIVE YEAR RATIO'];

  const readouts = [
    ['MISSION ELAPSED', `${n.years} YR`, `SINCE ${data.joinedYear || CONFIG.joinedYear}`],
    ['TOTAL IMPULSE', fmt(n.total), 'CONTRIBUTIONS · 12 MO'],
    ['TIME IN ORBIT', fmt(n.active), 'ACTIVE DAYS / 365'],
    ['LONGEST BURN', `${fmt(n.streak)}D`, 'CONSECUTIVE STREAK'],
    ['PEAK THRUST', fmt(n.peakDay), 'MAX SINGLE-DAY COMMITS'],
    sixthMetric,
  ];

  const rx0 = 468;
  const colW = 232;
  const readoutSvg = readouts
    .map(([label, value, unit], i) => {
      const x = rx0 + (i % 3) * colW;
      const y = 88 + Math.floor(i / 3) * 110;
      const accent = i === 1 || i === 3 ? c.amber : c.hud;
      return `<g class="ro" style="animation-delay:${(0.45 + i * 0.11).toFixed(2)}s">
  <rect x="${x}" y="${y}" width="${colW - 16}" height="96" rx="6" fill="${c.cardBg}" fill-opacity="0.65" stroke="${c.faint}"/>
  ${brackets(x, y, colW - 16, 96, 10, accent)}
  <text x="${x + 16}" y="${y + 25}" font-family="${MONO}" font-size="10.5" letter-spacing="1.8" fill="${c.muted}">${label}</text>
  <text x="${x + 15}" y="${y + 64}" font-family="${THIN}" font-weight="300" font-size="35" fill="${c.fg}">${escapeXml(value)}</text>
  <text x="${x + 16}" y="${y + 83}" font-family="${MONO}" font-size="9.8" letter-spacing="1.4" fill="${accent}">${escapeXml(unit)}</text>
</g>`;
    })
    .join('');

  // Public repository language spectrum + Systems/AI core stack badges
  let langs = (data.languages || []).slice(0, 5);
  if (!langs.length) {
    langs = [
      { name: 'JavaScript', share: 0.66 },
      { name: 'Python', share: 0.26 },
      { name: 'CSS', share: 0.04 },
      { name: 'PowerShell', share: 0.04 },
    ];
  }
  const rest = 1 - langs.reduce((sum, l) => sum + l.share, 0);
  if (rest > 0.01) langs = [...langs, { name: 'Other', share: rest }];

  const sx = rx0;
  const sw = colW * 3 - 16;
  const shades = [1, 0.74, 0.54, 0.38, 0.26, 0.16];
  let cursor = sx;
  const spectrum = langs
    .map((l, i) => {
      const w = Math.max(4, l.share * sw - 2);
      const seg = `<g class="seg" style="animation-delay:${(1.25 + i * 0.1).toFixed(2)}s"><rect x="${r1(cursor)}" y="344" width="${r1(w)}" height="13" rx="2" fill="${i === 0 ? c.hud : i === 1 ? c.amber : c.hud}" fill-opacity="${shades[i] ?? 0.16}"/>${
        w > 78
          ? `<text x="${r1(cursor)}" y="376" font-family="${MONO}" font-size="10.5" letter-spacing="1" fill="${c.muted}">${escapeXml(l.name.toUpperCase())} ${Math.max(1, Math.round(l.share * 100))}%</text>`
          : ''
      }</g>`;
      cursor += w + 2;
      return seg;
    })
    .join('');

  // Core Arsenal pills row at bottom right
  let pillX = rx0;
  const arsenalPills = CONFIG.coreStack
    .map((tech) => {
      const pw = tech.length * 8.4 + 24;
      const el = `<g transform="translate(${r1(pillX)} 406)">
        <rect width="${r1(pw)}" height="24" rx="4" fill="${c.cardBg}" stroke="${c.faintHi}"/>
        <text x="${r1(pw / 2)}" y="16" text-anchor="middle" font-family="${MONO}" font-size="10.5" letter-spacing="1.2" fill="${c.fg}">${escapeXml(tech.toUpperCase())}</text>
      </g>`;
      pillX += pw + 8;
      return el;
    })
    .join('');

  const css = `
.frame{animation:fade 1s ease-out both}
.orbit{stroke-dasharray:${orbit.length};animation:draw 2.6s ${EXPO} .35s both}
.orbit-fill{animation:fade 1.2s ease-out 2.1s both}
.peak{animation:fade .6s ease-out 2.3s both}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.6s ease-out 2.7s infinite}
.ro{animation:rise .85s ${EXPO} both}
.seg{transform-box:fill-box;transform-origin:left center;animation:grow 1s ${EXPO} both}
.scan{animation:scan 2.2s cubic-bezier(.4,0,.2,1) .2s both}
@keyframes fade{from{opacity:0}}
@keyframes draw{from{stroke-dashoffset:${orbit.length}}}
@keyframes ping{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(3.2)}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}}
@keyframes grow{from{transform:scaleX(0)}}
@keyframes scan{0%{opacity:.9;transform:translateX(0)}85%{opacity:.5}100%{opacity:0;transform:translateX(${W - 40}px)}}
${REDUCED}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(
    `Mission telemetry for ${CONFIG.missionName}: ${n.years} years on GitHub, ${fmt(n.total)} contributions, ${n.active} active days (${n.uptimePct}%), longest streak ${n.streak} days, peak day ${n.peakDay} commits.`
  )}">
<style>${css}</style>
<defs>
  <linearGradient id="scanTrail" x1="0" x2="1"><stop offset="0" stop-color="${c.hud}" stop-opacity="0"/><stop offset="1" stop-color="${c.hud}" stop-opacity="0.32"/></linearGradient>
</defs>
<g class="frame">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${c.bg}" stroke="${c.faint}"/>
  ${brackets(14, 14, W - 28, H - 28, 22, c.hud)}
  <text x="40" y="50" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${c.hud}">MISSION TELEMETRY  //  INSTRUMENTATION</text>
  <text x="${W - 40}" y="50" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="2" fill="${c.muted}">${escapeXml(CONFIG.missionName.toUpperCase())}  ·  @${escapeXml(CONFIG.login.toUpperCase())}</text>
  <line x1="40" y1="64" x2="${W - 40}" y2="64" stroke="${c.faint}"/>
  ${grid}${spokes}
  <circle cx="${ox}" cy="${oy}" r="3" fill="${c.muted}"/>
  <text x="${ox}" y="${H - 36}" text-anchor="middle" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${c.muted}">ORBIT · LOG-SCALED MONTHLY IMPULSE</text>
  <text x="${ox}" y="${H - 20}" text-anchor="middle" font-family="${MONO}" font-size="9.5" letter-spacing="1.5" fill="${c.amber}">PEAK SECTOR: ${months[busiest]?.label || 'OCT'} (${fmt(months[busiest]?.total || 0)} COMMITS)</text>
  <text x="${rx0}" y="331" font-family="${MONO}" font-size="10.5" letter-spacing="2" fill="${c.muted}">PUBLIC REPOSITORY SPECTRUM</text>
  <text x="${rx0}" y="398" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${c.muted}">PRIMARY SYSTEMS ARSENAL</text>
  ${arsenalPills}
</g>
<path class="orbit-fill" d="${orbit.d}" fill="${c.hud}" fill-opacity="0.09"/>
<path class="orbit" d="${orbit.d}" fill="none" stroke="${c.hud}" stroke-width="2.2" stroke-linejoin="round"/>
${peak ? `<g class="peak"><circle class="ping" cx="${r1(peak[0])}" cy="${r1(peak[1])}" r="5.5" fill="none" stroke="${c.amber}" stroke-width="1.6"/><circle cx="${r1(peak[0])}" cy="${r1(peak[1])}" r="4.2" fill="${c.amber}"/></g>` : ''}
${readoutSvg}
${spectrum}
<g class="scan" opacity="0"><rect x="0" y="14" width="80" height="${H - 28}" fill="url(#scanTrail)"/><rect x="79" y="14" width="1.5" height="${H - 28}" fill="${c.hud}"/></g>
</svg>`;
}

// ---------------------------------------------------------------------------
// 3. Flight Deck SVG — 2x2 HUD Cards for Public & Stealth Flagship Missions
// ---------------------------------------------------------------------------

function missionsSvg(data, themeName) {
  const c = THEMES[themeName];
  const W = 1200;
  const H = 340;
  const padX = 36;
  const gapX = 24;
  const gapY = 20;
  const cardW = (W - padX * 2 - gapX) / 2;
  const cardH = 116;
  const startY = 74;

  const cards = CONFIG.missions
    .map((m, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = padX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const stars = data.repoStars?.get(m.repoName || m.name) || 0;
      const badgeBg = m.isPublic ? c.badgeLiveBg : c.badgeStealthBg;
      const badgeFg = m.isPublic ? c.badgeLiveText : c.badgeStealthText;
      const lines = wrapText(m.shortDesc, 68, 2);

      return `<g class="mc" style="animation-delay:${(0.2 + idx * 0.12).toFixed(2)}s">
  <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="8" fill="${c.cardBg}" stroke="${c.faint}"/>
  ${brackets(x, y, cardW, cardH, 10, m.isPublic ? c.hud : c.amber, 0.85)}
  <text x="${x + 18}" y="${y + 27}" font-family="${MONO}" font-size="10.5" letter-spacing="1.6" fill="${c.muted}">${escapeXml(m.code)}</text>
  <text x="${x + 82}" y="${y + 27}" font-family="${THIN}" font-weight="600" font-size="16" fill="${c.fg}">${escapeXml(m.name)}</text>
  <rect x="${x + cardW - 134}" y="${y + 12}" width="118" height="20" rx="4" fill="${badgeBg}"/>
  <text x="${x + cardW - 75}" y="${y + 25.5}" text-anchor="middle" font-family="${MONO}" font-size="9.5" font-weight="600" letter-spacing="1.1" fill="${badgeFg}">${escapeXml(m.status)}</text>
  <text x="${x + 18}" y="${y + 52}" font-family="${THIN}" font-size="12.8" fill="${c.muted}">${escapeXml(lines[0] || '')}</text>
  ${lines[1] ? `<text x="${x + 18}" y="${y + 70}" font-family="${THIN}" font-size="12.8" fill="${c.muted}">${escapeXml(lines[1])}</text>` : ''}
  <circle cx="${x + 23}" cy="${y + 96}" r="4.5" fill="${m.langColor}"/>
  <text x="${x + 35}" y="${y + 100}" font-family="${MONO}" font-size="10.5" letter-spacing="1" fill="${c.fg}">${escapeXml(m.stack)}</text>
  ${stars > 0 ? `<text x="${x + cardW - 18}" y="${y + 100}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${c.amber}">★ ${stars}</text>` : ''}
</g>`;
    })
    .join('');

  const css = `
.mc{animation:rise .9s ${EXPO} both}
@keyframes rise{from{opacity:0;transform:translateY(10px)}}
${REDUCED}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(
    'Flight Deck: antigravity-liftoff, YVS YouTube Vision Skill, ghostcage, and parqdiff.'
  )}">
<style>${css}</style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${c.bg}" stroke="${c.faint}"/>
${brackets(14, 14, W - 28, H - 28, 18, c.hud, 0.7)}
<text x="${padX}" y="46" font-family="${MONO}" font-size="12" letter-spacing="3" fill="${c.hud}">FLIGHT DECK  //  SELECTED SYSTEMS &amp; PAYLOADS</text>
<text x="${W - padX}" y="46" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1.8" fill="${c.muted}">PUBLIC REPOS &amp; STEALTH ENGINES</text>
<line x1="${padX}" y1="58" x2="${W - padX}" y2="58" stroke="${c.faint}"/>
${cards}
</svg>`;
}

// ---------------------------------------------------------------------------
// 4. End of Transmission SVG — Planetary Horizon Sunrise
// ---------------------------------------------------------------------------

function transmissionEndSvg(themeName) {
  const c = THEMES[themeName];
  const W = 1200;
  const H = 170;
  const css = `
.sun{transform-box:fill-box;transform-origin:center bottom;animation:sunrise 3.2s ${EXPO} .3s both}
.end{animation:rise 1.6s ${EXPO} .85s both}
@keyframes sunrise{from{opacity:0;transform:scale(.4,.2)}}
@keyframes rise{from{opacity:0;transform:translateY(8px)}}
${REDUCED}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(`End of transmission. ${CONFIG.signoff}`)}">
<style>${css}</style>
<defs>
  <clipPath id="frame"><rect width="${W}" height="${H}" rx="14"/></clipPath>
  <radialGradient id="sun" cx="600" cy="134" r="440" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 134) scale(1 0.32) translate(-600 -134)">
    <stop offset="0" stop-color="${c.diskHi}" stop-opacity="${themeName === 'dark' ? 0.95 : 0.35}"/><stop offset="0.28" stop-color="${c.diskMid}" stop-opacity="${themeName === 'dark' ? 0.45 : 0.12}"/><stop offset="1" stop-color="${c.diskMid}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="limb" x1="0" x2="1"><stop offset="0" stop-color="${c.hud}" stop-opacity="0"/><stop offset="0.5" stop-color="${c.hud}" stop-opacity="0.92"/><stop offset="1" stop-color="${c.hud}" stop-opacity="0"/></linearGradient>
</defs>
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <ellipse class="sun" cx="600" cy="134" rx="440" ry="134" fill="url(#sun)"/>
  <circle cx="600" cy="${134 + 2400}" r="2400" fill="${c.planet}"/>
  <circle cx="600" cy="${134 + 2400}" r="2400" fill="none" stroke="url(#limb)" stroke-width="2"/>
  <g class="end" text-anchor="middle">
    <text x="606" y="60" font-family="${THIN}" font-weight="300" font-size="21" letter-spacing="12" fill="${c.fg}">END OF TRANSMISSION</text>
    <text x="600" y="90" font-family="${MONO}" font-size="10.8" letter-spacing="2.2" fill="${c.muted}">@${escapeXml(CONFIG.login.toUpperCase())}  ·  ${escapeXml(CONFIG.signoff.toUpperCase())}</text>
  </g>
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${c.faint}"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// 5. Self-Hosted Crisp Contact Badges
// ---------------------------------------------------------------------------

function badgeSvg({ label, bg, fg, iconPath, stroked = false }) {
  const height = 28;
  const padding = 11;
  const iconSize = 14;
  const gap = 7;
  const textWidth = Math.ceil(label.length * 7.1);
  const width = padding + iconSize + gap + textWidth + padding;
  const shape = stroked
    ? `fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
    : `fill="${fg}"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="6" fill="${bg}" stroke="#30363d" stroke-opacity="0.65"/>
  <g transform="translate(${padding} ${(height - iconSize) / 2}) scale(${iconSize / 24})"><path d="${iconPath}" ${shape}/></g>
  <text x="${padding + iconSize + gap}" y="18.2" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="12" font-weight="600" fill="${fg}" textLength="${textWidth}" lengthAdjust="spacingAndGlyphs">${escapeXml(label)}</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// 6. Assemble README.md & Write All Assets
// ---------------------------------------------------------------------------

function pictureBlock(darkPath, lightPath, alt) {
  return [
    '<p align="center">',
    '<picture>',
    `  <source media="(prefers-color-scheme: dark)" srcset="./${darkPath}">`,
    `  <img alt="${escapeXml(alt)}" src="./${lightPath}" width="100%">`,
    '</picture>',
    '</p>',
  ].join('\n');
}

function buildReadme(data) {
  const n = computeTelemetry(data);
  const missionRows = CONFIG.missions.map((m) => {
    const stars = data.repoStars?.get(m.repoName || m.name) || 0;
    const starBadge = stars > 0 ? ` · ★ ${stars}` : '';
    const title = m.url ? `**[${m.name}](${m.url})**` : `**${m.name}** *(Stealth / Private)*`;
    return `- \`${m.code}\` ${title} — ${m.shortDesc}  \n  <sub>\`${m.stack}\`${starBadge}</sub>`;
  });

  return [
    pictureBlock(
      'assets/singularity-hero-dark.svg',
      'assets/singularity-hero-light.svg',
      `${CONFIG.name} (@${CONFIG.login}): ${CONFIG.roleShort}. Cinematic Gargantua black hole accretion disk drawn from ${fmt(n.total)} contributions across ${fmt(n.active)} active days.`
    ),
    '',
    `<p align="center"><b>${CONFIG.name} (@${CONFIG.login})</b> · ${CONFIG.roleShort}</p>`,
    '<p align="center">',
    `  <a href="mailto:${CONFIG.email}"><img src="./assets/links/email.svg" alt="Email ${CONFIG.email}" height="28"></a>`,
    `  <a href="https://github.com/${CONFIG.login}?tab=repositories"><img src="./assets/links/repos.svg" alt="Public Repositories" height="28"></a>`,
    '</p>',
    '',
    `> **Mission brief.** ${CONFIG.intro}`,
    '>',
    `> **Current objective.** ${CONFIG.now}`,
    '',
    '#### Telemetry',
    '',
    pictureBlock(
      'assets/singularity-telemetry-dark.svg',
      'assets/singularity-telemetry-light.svg',
      `Mission telemetry for ${CONFIG.missionName}: ${n.years} years on GitHub, ${fmt(n.total)} contributions in the last 12 months, ${fmt(n.active)} active days (${n.uptimePct}%), longest streak ${n.streak} days, peak day ${n.peakDay} commits.`
    ),
    '',
    '<details>',
    '<summary><sub>Reading the instruments</sub></summary>',
    '',
    '- **Accretion disk:** one relativistic particle arc per day of the last 365 days (log-quantile normalized); busier days glow brighter and orbit closer to the photon ring across three Keplerian speed bands.',
    '- **Orbital plot:** log-scaled monthly contribution trajectory with a live radar beacon locked onto the peak output month.',
    '- **Auto-updated daily:** regenerated automatically via GitHub Actions every 24 hours directly from live GitHub telemetry.',
    '- **Dual-theme plates:** Interstellar black hole in Dark Mode; astronomical sky-survey negative plate in Light Mode.',
    '',
    '</details>',
    '',
    '#### Flight Deck',
    '',
    pictureBlock(
      'assets/singularity-missions-dark.svg',
      'assets/singularity-missions-light.svg',
      'Flight Deck featuring antigravity-liftoff, YVS YouTube Vision Skill, ghostcage, and parqdiff.'
    ),
    '',
    ...missionRows,
    '',
    pictureBlock(
      'assets/singularity-end-dark.svg',
      'assets/singularity-end-light.svg',
      `End of transmission. ${CONFIG.signoff}.`
    ),
    '',
  ].join('\n');
}

async function main() {
  const data = await loadProfileData();
  const n = computeTelemetry(data);
  console.log(
    `Telemetry locked: ${n.total} contributions | ${n.active} active days (${n.uptimePct}%) | ${n.streak}d streak | ${n.peakDay} peak day`
  );

  const files = {
    'assets/singularity-hero-dark.svg': heroSvg(data, 'dark'),
    'assets/singularity-hero-light.svg': heroSvg(data, 'light'),
    'assets/singularity-telemetry-dark.svg': telemetrySvg(data, 'dark'),
    'assets/singularity-telemetry-light.svg': telemetrySvg(data, 'light'),
    'assets/singularity-missions-dark.svg': missionsSvg(data, 'dark'),
    'assets/singularity-missions-light.svg': missionsSvg(data, 'light'),
    'assets/singularity-end-dark.svg': transmissionEndSvg('dark'),
    'assets/singularity-end-light.svg': transmissionEndSvg('light'),
    'assets/links/email.svg': badgeSvg({
      label: CONFIG.email,
      bg: '#111827',
      fg: '#f3f4f6',
      stroked: true,
      iconPath: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM22 7l-10 6L2 7',
    }),
    'assets/links/repos.svg': badgeSvg({
      label: 'github.com/datphalm',
      bg: '#0c2336',
      fg: '#7dd3fc',
      stroked: false,
      iconPath:
        'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z',
    }),
    'README.md': buildReadme(data),
  };

  for (const [relPath, content] of Object.entries(files)) {
    const abs = path.join(ROOT, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  }
  console.log(`Generated ${Object.keys(files).length} files in ${ROOT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
