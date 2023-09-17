export function InstructionalButtons() {
  return (
    <div className="fixed bottom-0 right-0 m-5 mr-10 menu-instructional-buttons bg-black/75 rounded-sm p-2 flex items-center gap-3">
      <InstructionalButton
        text="Up"
        keybind="UP"
      />
      <InstructionalButton
        text="Down"
        keybind="DOWN"
      />
      <InstructionalButton
        text="Select"
        keybind="ENTER"
      />
    </div>
  );
}

function InstructionalButton({
  text,
  keybind,
}: {
  text: string;
  keybind: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div>{text}</div>
      <div className="p-2 h-7 bg-white rounded-sm text-black flex items-center justify-center">
        {keybind}
      </div>
    </div>
  );
}
