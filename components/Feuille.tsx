// Logo feuille de la charte VEGESOFT.
// La couleur suit la couleur de texte du parent (currentColor).
export default function Feuille({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.5 3.5c-6.9-.6-11.8 1-14.4 4C3.9 10 3.6 13.4 5.3 16.2c.3.4.6.9 1 1.3l-2 2a1 1 0 0 0 1.4 1.4l2-2c.4.4.9.7 1.3 1 2.8 1.7 6.2 1.4 8.7-.8 3-2.6 4.6-7.5 4-14.4a1.2 1.2 0 0 0-1.2-1.2z"
      />
    </svg>
  );
}
