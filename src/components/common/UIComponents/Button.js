export default function Button({ text, onClick, disabled }) {
  return (
    <button
      className="font-Poppins bg-[#2C95BE] rounded-lg text-white px-4 py-3 h-fit m-1 min-w-max flex-wrap disabled:cursor-not-allowed disabled:bg-slate-400"
      style={{ boxShadow: '8px 8px 16px -4px rgba(0, 0, 0, 0.12)' }}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="font-medium ">{text || 'Click'}</span>
    </button>
  );
}
