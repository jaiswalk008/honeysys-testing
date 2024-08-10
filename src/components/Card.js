import classNames from 'classnames';
import React from 'react';

export default function Card({ children, extraPadding, className }) {
  return (
    <div
      className={classNames(
        `rounded-[20px] border border-solid border-gray shadow-[4px_4px_12px_rgba(0,0,0,0.12)] ${className}`,
        {
          'p-10': extraPadding,
        },
        { 'px-[20px] py-[10px] ': !extraPadding }
      )}
    >
      {children}
    </div>
  );
}
