export default function NumberInput({
  value,
  setValue,
  allowFloat = false,
  ...props
}) {
  const handleChange = (e) => {
    const newValue = e.target.value;

    // Validate based on allowFloat
    const floatPattern = /^\d*\.?\d*$/;
    const intPattern = /^\d*$/;

    if (allowFloat ? floatPattern.test(newValue) : intPattern.test(newValue)) {
      setValue(newValue);
    }
  };

  const handleKeyDown = (e) => {
    const invalidKeys = allowFloat
      ? ["e", "E", "+", "-"]
      : ["e", "E", "+", "-", ".", ","];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
