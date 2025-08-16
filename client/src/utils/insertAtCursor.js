// export default function insertAtCursor(textarea, text) {
//   if (!textarea) return;
//   const start = textarea.selectionStart ?? textarea.value.length;
//   const end = textarea.selectionEnd ?? textarea.value.length;
//   const value = textarea.value || "";
//   const next = value.slice(0, start) + text + value.slice(end);
//   textarea.value = next;

//   // put caret after inserted text
//   const pos = start + text.length;
//   requestAnimationFrame(() => {
//     textarea.focus();
//     textarea.selectionStart = textarea.selectionEnd = pos;
//   });

//   // If any listeners depend on the input event:
//   try {
//     const evt = new Event("input", { bubbles: true });
//     textarea.dispatchEvent(evt);
//   } catch {}
// }
export default function insertAtCursor(el, text) {
  if (!el) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const value = el.value || "";

  el.value = value.slice(0, start) + text + value.slice(end);

  const caret = start + text.length;
  el.setSelectionRange(caret, caret);
  el.focus();

  // let React know the value changed (important for uncontrolled/controlled mixes)
  el.dispatchEvent(new Event("input", { bubbles: true }));
}