import { formatPhone } from '../utils/formatPhone.js';

export function PhoneInput({ value = '', onChange, required, placeholder, name }) {
  const handleChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onChange({ target: { name, value: formatted } });
  };

  return (
    <input
      type="tel"
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      placeholder={placeholder}
      autoComplete="tel"
    />
  );
}
