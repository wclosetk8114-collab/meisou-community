const P = { fill: "none", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };
export const IHome = () => <svg {...P}><path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z" /></svg>;
export const IMed = () => <svg {...P}><circle cx="12" cy="12" r="3.2" /><circle cx="12" cy="12" r="7.5" opacity=".5" /></svg>;
export const IBook = () => <svg {...P}><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h10" /></svg>;
export const IMoon = () => <svg {...P}><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" /></svg>;
export const IAsk = () => <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 5h14v10H10l-4 4v-4H5z" /></svg>;
export const IMore = () => <svg {...P}><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></svg>;
