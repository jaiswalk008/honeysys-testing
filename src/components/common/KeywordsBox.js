import { CopyIconFilledWhite, CopyIconFilled } from '../../utils/icons';

export default function KeywordsBox({ tagResponseData, isCopy, onClick }) {
  return (
    <div
      className="font-Poppins bg-[#3AA6BA] rounded-lg text-white px-4 py-3 h-fit  mt-3 w-full flex"
      style={{ boxShadow: '8px 8px 16px -4px rgba(0, 0, 0, 0.12)' }}
    >
      <div className="flex flex-wrap flex-1 gap-2">
        {tagResponseData &&
          tagResponseData.split(',').map((data) => {
            return <div className="p-2 rounded whitespace-nowrap bg-atlantis/75 ">{data}</div>;
          })}
      </div>
      {tagResponseData && (
        <img
          src={!isCopy ? CopyIconFilledWhite : CopyIconFilled}
          className="cursor-pointer w-[30px] h-[30px] text-center"
          alt="CopyIconFilledWhite"
          onClick={onClick}
        />
      )}
    </div>
  );
}
