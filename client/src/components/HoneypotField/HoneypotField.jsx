// A field hidden from people; bots fill it in, and the server then drops the message.
export default function HoneypotField({ value, onChange }) {
  return (
    <input
      type="text"
      name="hpCheck"
      value={value}
      onChange={onChange}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', opacity: 0 }}
    />
  );
}
