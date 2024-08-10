import { TrueIcon } from '../../utils/icons';
import '../../assets/style/style.css';
export default function Toast({ text, color }) {
  return (
    <div
      className={`h-full rounded-lg ${
        color === 'success' ? 'bg-[#9BC530]' : color === 'red' ? 'bg-[#C12F2F]' : ''
      }`}
    >
      <div className="flex rounded-xl items-center justify-center py-2">
        <img src={TrueIcon} alt="TrueIcon" />
        <div className="pl-2 text-white">{text || 'Successful'}</div>
      </div>
    </div>
  );
}
