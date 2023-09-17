export const replaceColors = (text: string) => {
  return text
    .replace(/~r~/g, '<span class="text-red">')
    .replace(/~g~/g, '<span class="text-green">')
    .replace(/~b~/g, '<span class="text-blue">')
    .replace(/~y~/g, '<span class="text-yellow">')
    .replace(/~p~/g, '<span class="text-purple">')
    .replace(/~o~/g, '<span class="text-orange">')
    .replace(/~c~/g, '<span class="text-cyan">')
    .replace(/~m~/g, '<span class="text-magenta">')
    .replace(/~u~/g, '<span class="text-black">')
    .replace(/~s~/g, '<span class="text-white">')
    .replace(/~n~/g, '</span>');
};
