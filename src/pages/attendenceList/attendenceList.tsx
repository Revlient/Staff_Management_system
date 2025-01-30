import Button from '@/components/button';
import Table from '@/components/table';
import { ListAttendence } from '@/services/setttingsService';
import {
  AttendenceColums,
  attendenceOptions,
  colorMappingAttendence,
  swrKeys,
} from '@/utils/constants';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import Modals from '../../modals';

const AttendenceList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [empName, setEmpName] = useState<string>('');
  const [showPage, setShowPage] = useState<boolean>(false);
  const [type, setType] = useState<string>('any');
  const [dates, setDates] = useState<{ sd: Date; ed: Date; cd: Date }>({
    cd: new Date(),
    ed: new Date(),
    sd: new Date(),
  });
  const [selectedFilter, setSelectedFilter] = useState<{
    [key: string]: string[];
  }>({});
  /********************************SERVICE CALLS************************************** */
  const { data, isLoading, mutate } = useSWR(
    `${swrKeys.ATTENDENCE}-${page}`,
    () =>
      ListAttendence({
        page,
        count: '30',
        username: empName,
        ...(type === 'range' && {
          end_date: moment(dates.ed).format('DD-MM-YYYY'),
          start_date: moment(dates?.sd)?.format('DD-MM-YYYY'),
        }),
        ...(type === 'date' && { date: moment(dates.sd).format('DD-MM-YYYY') }),
        status: selectedFilter?.Status?.[0],
      }),
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    mutate();
  }, [empName]);

  const handleFilterSelection = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => {
    setSelectedFilter((cv) => {
      return {
        ...cv,
        [label]: [value],
      };
    });
  };

  const RenderDateFilter: () => React.ReactNode = () => {
    return (
      <Button
        label="Choose a date"
        onClick={() => setShowPage(true)}
        color="warning"
      />
    );
  };

  return (
    <Fragment>
      <section className="h-full overflow-hidden p-2 slideIn">
        <Table
          showBtn={false}
          isSearchable={true}
          rows={data?.results}
          colums={AttendenceColums}
          currentPage={page}
          showingLimit={30}
          isLoading={isLoading}
          totalCount={data?.count}
          setCurrentPage={setPage}
          accOptions={attendenceOptions}
          //@ts-ignore
          setSelectedItems={handleFilterSelection}
          //@ts-ignore
          selectedItems={selectedFilter}
          reset={() => {
            //@ts-ignore
            setSelectedFilter([]);
          }}
          handleApplyButton={() => mutate()}
          colorMapping={colorMappingAttendence}
          showDeleteBtn={false}
          showEditBtn={false}
          showEyeBtn={false}
          searchValue={empName}
          showFilter={true}
          setSearchValue={setEmpName}
          extraComponents={RenderDateFilter()}
          placeholder="Search Employee"
        />
      </section>
      <Modals.DatePickerModal
        isOpen={showPage}
        type={type}
        setType={setType}
        setOpen={setShowPage}
        setData={mutate}
        setDates={setDates}
        dates={dates}
      />
    </Fragment>
  );
};

export default AttendenceList;
