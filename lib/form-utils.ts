export function readHoneypot(form: HTMLFormElement): string {
  return (form.querySelector<HTMLInputElement>('input[name="_hp"]')?.value ?? "").trim();
}

/** Scroll to and focus the first invalid field after client-side validation. */
export function scrollToFirstFormError(
  form: HTMLFormElement,
  fieldErrors: Record<string, string>,
): void {
  const firstKey = Object.keys(fieldErrors)[0];
  if (!firstKey) return;
  const el =
    form.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
    form.querySelector<HTMLElement>(`#field-${firstKey}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    el.focus();
  }
}
