import Table from '@/components/table';
import PATH from '@/routes/paths';
import {
  DeleteCollege,
  ListColleges,
  ListCourses,
} from '@/services/collegeService';
import useStore from '@/store/store';
import { collegeColums, swrKeys } from '@/utils/constants';
import { debounce, notify } from '@/utils/helpers/helpers';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Modals from '../../modals';

const Colleges: React.FC = () => {
  const {
    userDetails: { is_admin },
    filterSearch,
  } = useStore((state) => state);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [collegeName, setCollegeName] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<
    {
      label: string;
      iterables: TOption[];
    }[]
  >();
  const [selectedFilter, setSelectedFilter] = useState<{
    [key: string]: string[];
  }>({});

  /********************************STORE************************************** */
  const { selectedRowIds, setSelectedRowIds } = useStore((state) => state);

  /********************************SERVICE CALLS************************************** */
  const { data, isLoading, mutate } = useSWR(
    `${swrKeys.COLLEGES}-${page}`,
    () => {
      return ListColleges({
        college: collegeName,
        course: selectedFilter?.Courses?.join(),
        limit: 10,
        page,
      });
    },
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    const debouncedMutate = debounce(() => mutate());
    debouncedMutate();
    return () => {
      debouncedMutate.cancel();
    };
  }, [collegeName]);

  useEffect(() => {
    return () => {
      setSelectedRowIds({});
    };
  }, []);
  useEffect(() => {
    const debouncedMutate = debounce(() => courseMutate());
    debouncedMutate();
    return () => {
      debouncedMutate.cancel();
    };
  }, [filterSearch]);

  const handleCollegeDelete = () => {
    DeleteCollege(Object.keys(selectedRowIds).flatMap((v) => selectedRowIds[v]))
      .then((data) => {
        notify(data.message, { type: 'success' });
      })
      .finally(() => {
        setShowDeleteModal(false);
        mutate();
      });
  };

  const { mutate: courseMutate } = useSWR(
    `${swrKeys.COURSES}`,
    async () => {
      const resp = await ListCourses({
        search: filterSearch?.find((l) => l.label === 'Courses')?.key || '',
      });
      setFilterOptions(() => [
        {
          label: 'Courses',
          iterables: resp?.map((v: string) => ({ label: v, value: v })),
        },
      ]);
    },
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  /********************************CUSTOM METHODS************************************** */

  const handleStudentActions = (action: string, rowData: ICollege) => {
    if (action === 'edit' && is_admin) {
      navigate(`edit-college/${rowData.id}`);
    } else if (action === 'delete') {
      setSelectedRowIds({ page: [rowData.id] });
      setShowDeleteModal(true);
    }
  };
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

  const handleRowClick = (data: ICollege) => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Your WebApp Title',
          text: 'Check out this link!',
          url: data.brochure,
        })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard
        .writeText('https://yourapp.com')
        .then(() => {
          alert('Link copied to clipboard! You can paste it to share.');
        })
        .catch((error) => console.log('Copy failed:', error));
    }
  };

  const handleHeaderActions = (action: TOption) => {
    if (action.value === 'delete') {
      if (confirm('Are you sure to delete all the selected courses?')) {
        handleCollegeDelete();
      }
    }
  };

  const showActions = useMemo(() => {
    return Object.keys(selectedRowIds)?.some(
      //@ts-ignore
      (key) => selectedRowIds[key]?.length > 0
    );
  }, [page, selectedRowIds]);

  return (
    <Fragment>
      <section className="h-full overflow-hidden p-2 slideIn">
        {/* @ts-ignore */}
        <Table
          btnLabel="Add College"
          rows={data?.results}
          colums={collegeColums}
          currentPage={page}
          showingLimit={10}
          isLoading={isLoading}
          totalCount={data?.count}
          setCurrentPage={setPage}
          handleApplyButton={() => mutate()}
          onBtnClick={() => navigate(PATH.addColleges)}
          isBtnDisabled={!is_admin}
          showFilter={true}
          handleRowAction={handleStudentActions}
          checkboxSelection={is_admin}
          showEditBtn={is_admin}
          showDeleteBtn={is_admin}
          showEyeBtn={false}
          isSearchable={true}
          searchValue={collegeName}
          setSearchValue={setCollegeName}
          accOptions={filterOptions}
          showBtn={is_admin}
          //@ts-ignore
          selectedItems={selectedFilter}
          //@ts-ignore
          setSelectedItems={handleFilterSelection}
          reset={() => {
            //@ts-ignore
            setSelectedFilter([]);
            mutate();
          }}
          onRowClick={handleRowClick}
          placeholder="Search College"
          isFSearchable={true}
          showActions={showActions}
          handleHeaderAction={handleHeaderActions}
        />
      </section>
      <Modals.ConfirmationModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        content="Are sure to delete college(s)"
        title="Delete Students"
        onSubmit={handleCollegeDelete}
      />
    </Fragment>
  );
};

export default Colleges;
