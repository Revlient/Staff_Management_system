import GetIcons from '@/assets/icons';
import React, { memo } from 'react';
import { DOTS, usePagination } from '@/hooks/usePagination';

interface PaginationProps {
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  showingLimit: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const Pagination: React.FC<PaginationProps> = ({
  totalCount = 0,
  siblingCount = 1,
  currentPage = 1,
  showingLimit,
  setCurrentPage,
}) => {
  /******************************************************************
   *         Custom Functions
   *****************************************************************/

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize: showingLimit,
  });

  const getLimitRange = () => {
    const currentPageNumber = Number(currentPage);
    const limitValue = showingLimit;
    const calculatedLimit = (currentPageNumber - 1) * limitValue + limitValue;
    const higherLimit = Math.min(calculatedLimit, totalCount);

    return `${(currentPageNumber - 1) * limitValue + 1}-${higherLimit} `;
  };
  const handleNavigation = (direction: 'BACK' | 'FORWARD') => {
    direction === 'BACK'
      ? setCurrentPage((cv) => Number(cv) - 1)
      : setCurrentPage((cv) => Number(cv) + 1);
  };

  return (
    <section className="flex items-center justify-between mt-auto p-3 text-sm font-normal leading-4 bg-white rounded-lg">
      <div className="flex items-center gap-2">
        <span className="hidden md:block">Showing</span>

        <p aria-label="showing-range">
          <span className="font-semibold">{getLimitRange()}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> results
        </p>
      </div>
      <ul className="flex items-center gap-3">
        <li
          key={'leftIcon'}
          aria-label="leftNav"
          className={` rounded-lg w-8 h-8 flex items-center justify-center ${
            currentPage == 1 ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => {
            currentPage != 1 && handleNavigation('BACK');
          }}
        >
          {GetIcons('backward')}
        </li>
        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber.toString() === DOTS) {
            return (
              <li
                aria-label="dots"
                key={index}
                className="rounded-lg w-8 h-8 hidden md:flex items-center justify-center"
              >
                &#8230;
              </li>
            );
          }

          return (
            <li
              aria-label="pageNos"
              key={index}
              role="menuitem"
              onClick={() => {
                setCurrentPage(pageNumber);
              }}
              className={`${
                pageNumber == currentPage
                  ? 'bg-primary text-white'
                  : 'bg-white-smoke'
              } rounded-lg w-8 h-8 md:flex items-center justify-center hidden cursor-pointer`}
            >
              {pageNumber}
            </li>
          );
        })}

        <li
          aria-label="rightNav"
          key={'rightIcon'}
          className={`bg-white-smoke rounded-lg w-8 h-8 flex items-center justify-center ${
            Math.ceil(totalCount / showingLimit) == currentPage
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          onClick={() =>
            Math.ceil(totalCount / showingLimit) != currentPage &&
            handleNavigation('FORWARD')
          }
        >
          {GetIcons('forward')}
        </li>
      </ul>
    </section>
  );
};

export default memo(Pagination);
