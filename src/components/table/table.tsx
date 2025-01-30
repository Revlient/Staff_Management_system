import GetIcons from '@/assets/icons';
import Checkbox from '@/components/checkbox';
import Pagination from '@/components/pagination';
import TableHeader, { TableHeaderProps } from '@/components/tableHeader';
import useStore from '@/store/store';
import { Avatar, Tooltip } from '@nextui-org/react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Switch from '../switch';
import Menu from '../dropdown';
import { TableOptions } from '@/utils/constants';
interface TableProps<T> extends TableHeaderProps {
  id?: string;
  rows: T[];
  colums: TColumn[];
  selectAll?: boolean;
  currentPage: number;
  showingLimit: number;
  unCheckedIds?: string[];
  selectedRowIds?: string[];
  fakedSelectAll?: boolean;
  showEditBtn?: boolean;
  showDeleteBtn?: boolean;
  showDownloadBtn?: boolean;
  showEyeBtn?: boolean;
  isLoading: boolean;
  totalCount: number;
  showSerialNumber?: boolean;
  checkboxSelection?: boolean;
  colorMapping?: { [status: string]: string };
  onRowClick?: (data: T) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handleRowCheck?: (e: Event) => void;
  handleSelectAll?: (e: Event) => void;
  handleSort?: (colName: string) => void;
  handleRowAction?: (action: string, row: T) => void;
  isRowActionDisabled?: (
    data: T,
    action: 'delete' | 'edit' | 'view' | 'download'
  ) => boolean;
}
const Table = <
  T extends {
    profile_icon_url?: keyof T;
    id: string;
  },
>({
  rows,
  id,
  colums,
  currentPage,
  showEditBtn = true,
  showingLimit,
  unCheckedIds,
  fakedSelectAll,
  showDeleteBtn = true,
  showDownloadBtn = false,
  totalCount,
  showEyeBtn = true,
  isLoading = true,
  showSerialNumber = true,
  checkboxSelection = false,
  colorMapping,
  onRowClick,
  setCurrentPage,
  handleSort,
  handleRowCheck,
  handleRowAction,
  isRowActionDisabled = () => false,
  ...rest
}: TableProps<T>) => {
  /********************************STORE************************************** */

  const { selectedRowIds, setSelectedRowIds } = useStore((state) => state);

  /********************************REACT-HOOKS************************************** */

  const scrollingDiv = useRef<HTMLDivElement>(null);
  const [horizontallyScrolling, setHorizontallyScrolling] =
    useState<boolean>(false);

  /**
   * @description detects horizontal scrolling on scrollingDiv component
   */
  useEffect(() => {
    const handleScroll = () => {
      const divElement = scrollingDiv.current;
      if (divElement) {
        const isScrolling = divElement.scrollWidth > divElement.clientWidth;
        const isAtLeftEnd = divElement.scrollLeft === 0;
        setHorizontallyScrolling(isScrolling && !isAtLeftEnd);
      }
    };
    const divElement = scrollingDiv.current;
    if (divElement) {
      divElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  /********************************CUSTOM METHODS************************************** */

  const validateChecked: (item: T) => boolean = (item) => {
    const isChecked = selectedRowIds?.[currentPage]?.includes(item['id']);
    return !!isChecked;
  };

  //@ts-ignore
  const handleRowSelection = (
    _e: React.ChangeEvent<HTMLInputElement>,
    { id }: { id: string }
  ) => {
    const currentIds = Array.from(selectedRowIds?.[currentPage] || []);

    const _ids = currentIds?.includes(id)
      ? currentIds?.filter((_id) => _id !== id)
      : [...currentIds, id];

    setSelectedRowIds({
      ...selectedRowIds,
      [currentPage]: _ids,
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds({
        ...selectedRowIds,
        [currentPage]: rows?.map(({ id }) => id),
      });
    } else {
      setSelectedRowIds({
        ...selectedRowIds,
        [currentPage]: [],
      });
    }
  };

  return (
    <section className="flex flex-col gap-2 h-full rounded-md ">
      <TableHeader {...rest} />

      <div
        ref={scrollingDiv}
        className="overflow-auto h-[calc(100%-4px)] rounded bg-white "
      >
        {!isLoading && rows?.length === 0 ? (
          <div className="flex justify-center items-center py-5">
            No data found
          </div>
        ) : (
          <>
            {checkboxSelection && (
              <div className="px-4 py-2 md:hidden">
                <Checkbox
                  id="selectAll"
                  onChange={handleSelectAll}
                  isSelected={rows?.every(({ id }) =>
                    selectedRowIds?.[currentPage]?.includes(id)
                  )}
                >
                  Select All
                </Checkbox>
              </div>
            )}
            <div className="p-4 flex flex-col gap-2 md:hidden">
              {rows?.map((rowEntry, ind) => (
                <div
                  className="shadow p-2"
                  key={ind}
                  onClick={() => onRowClick && onRowClick(rowEntry)}
                >
                  <div className="flex justify-between">
                    <Checkbox
                      id={`child_${ind}`}
                      onChange={(e) => handleRowSelection(e, rowEntry)}
                      isSelected={validateChecked(rowEntry)}
                    />
                    <Menu
                      containerClass="!w-fit relative"
                      showLabel={false}
                      isKebabMenu={true}
                      menuClass="!min-w-fit"
                      options={TableOptions({
                        isEdit: showEditBtn,
                        isDelete: showDeleteBtn,
                        isDownload: showDownloadBtn,
                        isView: showEyeBtn,
                      })}
                      onSelectItem={(action) =>
                        handleRowAction &&
                        //@ts-ignore
                        handleRowAction(action.value, rowEntry)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    {colums?.map((col: TColumn, index: number) => (
                      <div className="flex items-center">
                        <span className="w-1/3 text-xs font-semibold">
                          {col.title.label}
                        </span>
                        {['string', 'date'].includes(col.type) ? (
                          <div
                            key={index}
                            className="px-3 max-w-[250px] min-w-[12rem] whitespace-break-spaces overflow-hidden text-ellipsis"
                          >
                            <span>
                              {col.type === 'string'
                                ? rowEntry[col.d_name as keyof typeof rowEntry]
                                    ?.toString()
                                    //@ts-ignore
                                    .replaceAll('_', ' ')
                                : rowEntry[
                                    col.d_name as keyof typeof rowEntry
                                  ] &&
                                  //@ts-ignore
                                  moment(rowEntry[col.d_name]).format(
                                    'DD MMM YYYY, h:mm A'
                                  )}
                            </span>
                          </div>
                        ) : col.type === 'compound' ? (
                          <div
                            key={index}
                            className="px-3 py-2 max-w-[250px] min-w-[12rem]"
                          >
                            <div className="flex h-full gap-3 items-center">
                              <span className="h-10 w-10 bg-[#36363626] rounded-[1.25rem] flex items-center justify-center flex-shrink-0">
                                {/* @ts-ignore  */}
                                {rowEntry?.profile_icon_url ? (
                                  <img
                                    src={String(
                                      rowEntry?.profile_icon_url as keyof typeof rowEntry
                                    )}
                                    className="m-auto h-[inherit] w-[inherit] rounded-[inherit]"
                                    // alt="img"
                                  />
                                ) : (
                                  <Avatar />
                                )}
                              </span>
                              <div className="flex flex-col w-3/4">
                                <span className="font-semibold whitespace-break-spaces overflow-hidden text-ellipsis">
                                  {String(
                                    rowEntry[
                                      col.d_name as keyof typeof rowEntry
                                    ]
                                  )}
                                </span>
                                <span className="font-medium text-xs text-dark-grey-faded whitespace-break-spaces overflow-hidden text-ellipsis">
                                  {String(
                                    rowEntry[
                                      col.title
                                        .additional as keyof typeof rowEntry
                                    ]
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : col.type === 'status' ? (
                          <div
                            key={index}
                            className="px-3 py-2 text-white max-w-[250px] min-w-[12rem]"
                          >
                            <div
                              className={`bg-${
                                colorMapping?.[
                                  String(
                                    rowEntry[
                                      col.d_name as keyof typeof rowEntry
                                    ]
                                  )?.toUpperCase()
                                ]
                              } px-3 py-2 text-[0.625rem] font-bold leading-3 rounded-xl w-fit uppercase`}
                            >
                              {String(
                                rowEntry[col.d_name as keyof typeof rowEntry]
                              )?.replace('_', ' ')}
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="px-3 py-2 max-w-[250px] min-w-[12rem]"
                          >
                            <Switch
                              checked={Boolean(
                                rowEntry[col.d_name as keyof typeof rowEntry]
                              )}
                            ></Switch>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <table className="w-full border-separate border-spacing-0 hidden md:table">
              <thead className="w-full sticky top-0 z-10 rounded-t-lg bg-primary text-white text-xs leading-[0.875rem] h-10 border-b-2">
                <tr className="rounded-t-lg">
                  {checkboxSelection && (
                    <th
                      aria-label="col-checkbox"
                      className="border-r  px-3 text-left rounded-tl-lg border-b-2  sticky left-0 top-0 z-20 bg-primary"
                      style={{
                        boxShadow: horizontallyScrolling
                          ? '4px 0px 8px 0px rgba(0, 0, 0, 0.10)'
                          : 'none',
                      }}
                    >
                      <Checkbox
                        id="selectAll"
                        onChange={handleSelectAll}
                        isSelected={rows?.every(({ id }) =>
                          selectedRowIds?.[currentPage]?.includes(id)
                        )}
                      />
                    </th>
                  )}
                  {showSerialNumber && (
                    <th
                      aria-label="col-slNo"
                      className={`min-w-[3.0625rem] border-r text-left px-3  bg-primary border-b-2  ${
                        !checkboxSelection &&
                        'rounded-tl-md sticky left-0 top-0 z-20'
                      }`}
                      style={{
                        boxShadow:
                          !checkboxSelection && horizontallyScrolling
                            ? '4px 0px 8px 0px rgba(0, 0, 0, 0.10)'
                            : 'none',
                      }}
                    >
                      Sl. #
                    </th>
                  )}

                  {colums?.map((col, index) => (
                    <th
                      key={index}
                      className={`max-w-[250px] min-w-[12rem] border-b-2 font-normal border-r
                  px-3 text-left capitalize ${
                    !showDeleteBtn &&
                    !showEditBtn &&
                    colums.length - 1 === index &&
                    'rounded-tr-lg'
                  }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{col.title.label}</span>
                        {col?.isSort ? (
                          <span
                            aria-label="sortIcon"
                            className={'cursor-pointer'}
                            role="button"
                            onClick={() => handleSort && handleSort(col.d_name)}
                          >
                            {GetIcons('Sort')}
                          </span>
                        ) : null}
                      </div>
                    </th>
                  ))}
                  {(showDeleteBtn ||
                    showEditBtn ||
                    showEyeBtn ||
                    showDownloadBtn) && (
                    <th className="min-w-[10rem] px-3 rounded-tr-lg border-b-2 ">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white body">
                {isLoading
                  ? [...Array(7)].map((_v, index) => (
                      <tr
                        aria-label="loader-row"
                        key={index}
                        className={`h-[4.5rem] text-sm text-dark-grey font-normal border-b border-white-smoke hover:bg-snow-drift hover:cursor-pointer group`}
                      >
                        {showSerialNumber ? (
                          <td className="px-2">
                            <Skeleton height={30} containerClassName="flex-1" />
                          </td>
                        ) : null}
                        {colums.map((_col, index) => (
                          <td key={index} className="px-4">
                            <Skeleton height={30} containerClassName="flex-1" />
                          </td>
                        ))}
                        <td className="px-4">
                          <Skeleton height={30} containerClassName="flex-1" />
                        </td>
                      </tr>
                    ))
                  : rows?.map((rowEntry: T, rowIndex: number) => (
                      <tr
                        aria-label="data-row"
                        onClick={() => onRowClick && onRowClick(rowEntry)}
                        key={rowIndex}
                        className={`${
                          rows.length - 1 === rowIndex && 'rounded-b-md'
                        } h-[4.5rem] rounded-t-lg text-sm text-dark-grey font-normal hover:bg-blue-50 hover:cursor-pointer group`}
                      >
                        {checkboxSelection && (
                          <td
                            className={`px-3 py-2 text-left border-b border-white-smoke sticky  left-0  ${
                              rows.length - 1 === rowIndex && 'rounded-bl-md'
                            }`}
                            style={{
                              background: horizontallyScrolling
                                ? 'white'
                                : 'inherit',
                              boxShadow: horizontallyScrolling
                                ? '4px 0px 8px 0px rgba(0, 0, 0, 0.10)'
                                : 'none',
                            }}
                          >
                            <Checkbox
                              id={`child_${rowIndex}`}
                              onChange={(e) => handleRowSelection(e, rowEntry)}
                              isSelected={validateChecked(rowEntry)}
                            />
                          </td>
                        )}
                        {showSerialNumber && (
                          <td
                            aria-label="body-slNo"
                            className={`px-3 text-center border-b border-white-smoke ${
                              !checkboxSelection &&
                              rows.length - 1 === rowIndex &&
                              'rounded-bl-md'
                            } ${!checkboxSelection && 'sticky left-0 bg-white'}`}
                            style={{
                              boxShadow:
                                !checkboxSelection && horizontallyScrolling
                                  ? '4px 0px 8px 0px rgba(0, 0, 0, 0.10)'
                                  : 'none',
                            }}
                          >
                            {(currentPage - 1) * Number(showingLimit) +
                              1 +
                              rowIndex}
                          </td>
                        )}
                        {colums?.map((col: TColumn, index: number) => {
                          if (['string', 'date'].includes(col.type)) {
                            return (
                              <td
                                key={index}
                                className="px-3 max-w-[250px] min-w-[12rem] whitespace-break-spaces overflow-hidden text-ellipsis border-b border-white-smoke"
                              >
                                <span>
                                  {col.type === 'string'
                                    ? rowEntry[
                                        col.d_name as keyof typeof rowEntry
                                      ]
                                        ?.toString()
                                        //@ts-ignore
                                        .replaceAll('_', ' ')
                                    : rowEntry[
                                        col.d_name as keyof typeof rowEntry
                                      ] &&
                                      //@ts-ignore
                                      moment(rowEntry[col.d_name]).format(
                                        'DD MMM YYYY, h:mm A'
                                      )}
                                </span>
                              </td>
                            );
                          } else if (col.type === 'compound') {
                            return (
                              <td
                                key={index}
                                className="px-3 py-2 max-w-[250px] min-w-[12rem] border-b border-white-smoke"
                              >
                                <div className="flex h-full gap-3 items-center">
                                  <span className="h-10 w-10 bg-[#36363626] rounded-[1.25rem] flex items-center justify-center flex-shrink-0">
                                    {/* @ts-ignore  */}
                                    {rowEntry?.profile_icon_url ? (
                                      <img
                                        src={String(
                                          rowEntry?.profile_icon_url as keyof typeof rowEntry
                                        )}
                                        className="m-auto h-[inherit] w-[inherit] rounded-[inherit]"
                                        // alt="img"
                                      />
                                    ) : (
                                      <Avatar />
                                    )}
                                  </span>
                                  <div className="flex flex-col w-3/4">
                                    <span className="font-semibold whitespace-break-spaces overflow-hidden text-ellipsis">
                                      {String(
                                        rowEntry[
                                          col.d_name as keyof typeof rowEntry
                                        ]
                                      )}
                                    </span>
                                    <span className="font-medium text-xs text-dark-grey-faded whitespace-break-spaces overflow-hidden text-ellipsis">
                                      {String(
                                        rowEntry[
                                          col.title
                                            .additional as keyof typeof rowEntry
                                        ]
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            );
                          } else if (col.type === 'status') {
                            return (
                              <td
                                key={index}
                                className="px-3 py-2 text-white max-w-[250px] min-w-[12rem] border-b border-white-smoke"
                              >
                                <div
                                  className={`bg-${
                                    colorMapping?.[
                                      String(
                                        rowEntry[
                                          col.d_name as keyof typeof rowEntry
                                        ]
                                      )?.toUpperCase()
                                    ]
                                  } px-3 py-2 text-[0.625rem] font-bold leading-3 rounded-xl w-fit uppercase`}
                                >
                                  {String(
                                    rowEntry[
                                      col.d_name as keyof typeof rowEntry
                                    ]
                                  )?.replace('_', ' ')}
                                </div>
                              </td>
                            );
                          } else
                            return (
                              <td
                                key={index}
                                className="px-3 py-2 max-w-[250px] min-w-[12rem] border-b border-white-smoke"
                              >
                                <Switch
                                  checked={Boolean(
                                    rowEntry[
                                      col.d_name as keyof typeof rowEntry
                                    ]
                                  )}
                                ></Switch>
                              </td>
                            );
                        })}
                        {(showEditBtn ||
                          showDeleteBtn ||
                          showEyeBtn ||
                          showDownloadBtn) && (
                          <td
                            className={`${rows.length - 1 === rowIndex && 'rounded-br-md'} border-b border-white-smoke `}
                          >
                            <div
                              className={`flex justify-end items-center gap-2 min-w-[10rem] px-3`}
                            >
                              {showEyeBtn && (
                                <Tooltip content="Details">
                                  <span
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowAction &&
                                        handleRowAction('view', rowEntry);
                                    }}
                                  >
                                    {GetIcons('eye')}
                                  </span>
                                </Tooltip>
                              )}

                              {showEditBtn && (
                                <Tooltip content="Edit">
                                  <button
                                    className={`text-lg text-default-400 active:opacity-50 ${isRowActionDisabled(rowEntry, 'edit') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowAction &&
                                        handleRowAction('edit', rowEntry);
                                    }}
                                    disabled={isRowActionDisabled(
                                      rowEntry,
                                      'edit'
                                    )}
                                  >
                                    {GetIcons('edit')}
                                  </button>
                                </Tooltip>
                              )}

                              {showDownloadBtn && (
                                <Tooltip content="Download">
                                  <button
                                    className={`text-lg text-default-400 active:opacity-50 ${isRowActionDisabled(rowEntry, 'download') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      handleRowAction &&
                                        handleRowAction('download', rowEntry);
                                    }}
                                    disabled={isRowActionDisabled(
                                      rowEntry,

                                      'download'
                                    )}
                                  >
                                    {GetIcons('download')}{' '}
                                  </button>
                                </Tooltip>
                              )}

                              {showDeleteBtn && (
                                <Tooltip color="danger" content="Delete">
                                  <button
                                    className={`text-lg text-danger cursor-pointer active:opacity-50  ${isRowActionDisabled(rowEntry, 'delete') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowAction &&
                                        handleRowAction('delete', rowEntry);
                                    }}
                                    disabled={isRowActionDisabled(
                                      rowEntry,
                                      'delete'
                                    )}
                                  >
                                    {GetIcons('delete')}
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        showingLimit={showingLimit}
        totalCount={totalCount}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
};

export default Table;
