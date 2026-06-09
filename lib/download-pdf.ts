/** Turn a base64-encoded PDF into a blob URL (revoke when done). */
export function base64PdfToObjectUrl(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}

/** iOS Safari ignores `download` on blob/data URLs — open in a new tab instead. */
export function prefersPdfInNewTab(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(ua) ||
    (ua.includes("Mac") && navigator.maxTouchPoints > 1)
  );
}
