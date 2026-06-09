/** Hidden field — must stay empty; bots that fill it are rejected server-side. */
export function HoneypotField() {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor="_hp">Ne pas remplir</label>
      <input
        id="_hp"
        name="_hp"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
