// TR33D - temiz, tek biçimli çizgi ikon seti (emoji yerine).
// Her ikon 24x24 viewBox, stroke="currentColor" — CSS'ten renklendirilebilir.
const WRAP_OPEN = (extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>`;
const WRAP_CLOSE = "</svg>";

export const ICONS = {
  search: `${WRAP_OPEN()}<circle cx="10" cy="10" r="6.5"/><line x1="14.8" y1="14.8" x2="20" y2="20"/>${WRAP_CLOSE}`,

  cart: `${WRAP_OPEN()}<path d="M2.5 3h2.2l1.1 3M5.8 6l2.1 9.2a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.3L20 7H5.8z"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none"/>${WRAP_CLOSE}`,

  close: `${WRAP_OPEN()}<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>${WRAP_CLOSE}`,

  chevronLeft: `${WRAP_OPEN()}<polyline points="15,5 8,12 15,19"/>${WRAP_CLOSE}`,
  chevronRight: `${WRAP_OPEN()}<polyline points="9,5 16,12 9,19"/>${WRAP_CLOSE}`,

  star: `${WRAP_OPEN()}<polygon points="12,3 14.23,8.93 20.56,9.22 15.61,13.17 17.29,19.28 12,15.8 6.71,19.28 8.39,13.17 3.44,9.22 9.77,8.93"/>${WRAP_CLOSE}`,

  gift: `${WRAP_OPEN()}<rect x="4" y="11" width="16" height="9" rx="1"/><rect x="3" y="7" width="18" height="4" rx="1"/><line x1="12" y1="7" x2="12" y2="20"/><path d="M12 7C10.5 3.5 6 4 6 6.5S9 8 12 7Z"/><path d="M12 7c1.5-3.5 6-3 6-.5S15 8 12 7Z"/>${WRAP_CLOSE}`,

  home: `${WRAP_OPEN()}<polyline points="3,11 12,4 21,11"/><rect x="5" y="11" width="14" height="9"/><rect x="10" y="15" width="4" height="5"/>${WRAP_CLOSE}`,

  blocks: `${WRAP_OPEN()}<rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/><rect x="8.5" y="4" width="7" height="7"/>${WRAP_CLOSE}`,

  sliders: `${WRAP_OPEN()}<line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="7" cy="18" r="2" fill="currentColor" stroke="none"/>${WRAP_CLOSE}`,

  gear: `${WRAP_OPEN()}<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.6"/><g>
    <rect x="10.5" y="1.6" width="3" height="3.4" rx="0.6" transform="rotate(0 12 12)"/>
    <rect x="10.5" y="1.6" width="3" height="3.4" rx="0.6" transform="rotate(60 12 12)"/>
    <rect x="10.5" y="1.6" width="3" height="3.4" rx="0.6" transform="rotate(120 12 12)"/>
    <rect x="10.5" y="1.6" width="3" height="3.4" rx="0.6" transform="rotate(180 12 12)"/>
    <rect x="10.5" y="1.6" width="3" height="3.4" rx="0.6" transform="rotate(240 12 12)"/>
    <rect x="10.5" y="1.6" width="3" height="3.4" rx="0.6" transform="rotate(300 12 12)"/>
  </g>${WRAP_CLOSE}`,

  drone: `${WRAP_OPEN()}<rect x="10" y="10" width="4" height="4" rx="0.6"/><line x1="10" y1="10" x2="4.2" y2="4.2"/><line x1="14" y1="10" x2="19.8" y2="4.2"/><line x1="10" y1="14" x2="4.2" y2="19.8"/><line x1="14" y1="14" x2="19.8" y2="19.8"/><circle cx="4.2" cy="4.2" r="2.4"/><circle cx="19.8" cy="4.2" r="2.4"/><circle cx="4.2" cy="19.8" r="2.4"/><circle cx="19.8" cy="19.8" r="2.4"/>${WRAP_CLOSE}`,

  car: `${WRAP_OPEN()}<polyline points="6,11 8,6 16,6 18,11"/><rect x="3" y="11" width="18" height="6" rx="1.6"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/>${WRAP_CLOSE}`,

  cube: `${WRAP_OPEN()}<polygon points="12,4 19,7.5 12,11 5,7.5"/><line x1="5" y1="7.5" x2="5" y2="14.5"/><line x1="19" y1="7.5" x2="19" y2="14.5"/><line x1="12" y1="11" x2="12" y2="18"/><line x1="5" y1="14.5" x2="12" y2="18"/><line x1="19" y1="14.5" x2="12" y2="18"/>${WRAP_CLOSE}`,

  truck: `${WRAP_OPEN()}<rect x="2" y="8" width="13" height="8" rx="1"/><path d="M15 11h4l3 3v2h-7z"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>${WRAP_CLOSE}`,

  checkCircle: `${WRAP_OPEN()}<circle cx="12" cy="12" r="9"/><polyline points="8,12.5 11,15.5 16,9"/>${WRAP_CLOSE}`,

  upload: `${WRAP_OPEN()}<polyline points="7,9 12,4 17,9"/><line x1="12" y1="4" x2="12" y2="16"/><polyline points="4,16 4,20 20,20 20,16"/>${WRAP_CLOSE}`,

  chat: `${WRAP_OPEN()}<rect x="3" y="4" width="18" height="13" rx="6"/><polygon points="8,17 8,21 13,17"/><circle cx="9" cy="10.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="12" cy="10.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="15" cy="10.5" r="1.15" fill="currentColor" stroke="none"/>${WRAP_CLOSE}`,
};

export function icon(name, extraClass = "") {
  const svg = ICONS[name] || "";
  return extraClass ? svg.replace("<svg ", `<svg class="${extraClass}" `) : svg;
}
