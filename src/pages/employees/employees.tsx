import Table from '@/components/table';
import PATH from '@/routes/paths';
import { DeleteEmployee, ListEmployees } from '@/services/employeeService';
import { colorMapping, employeeColums, swrKeys } from '@/utils/constants';
import { debounce, notify } from '@/utils/helpers/helpers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Modals from '../../modals';
import useStore from '@/store/store';
const Employees = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IEmployee>();
  const [isDLoading, setIsDLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const [selectedFilter, setSelectedFilter] = useState<{
    [key: string]: string[];
  }>({ Roles: [''] });
  /********************************STORE************************************** */
  const { setSelectedRowIds } = useStore((state) => state);

  const { data, isLoading, mutate } = useSWR(
    `${swrKeys.EMPLOYEES}-${page}`,
    () =>
      ListEmployees({
        limit: 10,
        page,
        type: selectedFilter.Roles[0],
        search: searchValue,
      }),
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
  }, [searchValue]);

  useEffect(() => {
    return () => {
      setSelectedRowIds({});
    };
  }, []);

  const handleEmployeeDelete = () => {
    setIsDLoading(true);
    //@ts-ignore
    DeleteEmployee(selectedRow?.id)
      .then((value) => {
        notify(value.message, { type: 'success' });
        setShowDeleteModal(false);
        mutate();
      })
      .finally(() => setIsDLoading(false));
  };

  /********************************CUSTOM METHODS************************************** */

  const handleRowActions = (action: string, rowData: IEmployee) => {
    const { id, username, ...rest } = rowData;
    setSelectedRow(rowData);
    if (action === 'edit') {
      localStorage.setItem('emp', JSON.stringify(rest));
      navigate(`edit-employee/${id}`);
    } else if (action === 'delete') {
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
  console.log(selectedFilter);

  return (
    <section className="h-full overflow-hidden p-2 slideIn">
      {/* @ts-ignore */}
      <Table
        btnLabel="Add Employee"
        rows={data?.results}
        colums={employeeColums}
        currentPage={page}
        showingLimit={10}
        isLoading={isLoading}
        totalCount={data?.count}
        setCurrentPage={setPage}
        onBtnClick={() => navigate(PATH.addEmployees)}
        colorMapping={colorMapping}
        isSearchable={true}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        checkboxSelection={false}
        showEyeBtn={false}
        showFilter={true}
        accOptions={[
          {
            //@ts-ignore
            label: 'Roles',
            iterables: [
              { label: 'All', value: '' },
              { label: 'Agents', value: 'Agents' },
              { label: 'Admins', value: 'Admins' },
              { label: 'Employees', value: 'Employees' },
            ],
          },
        ]}
        showDownloadBtn={false}
        placeholder="Search Employee"
        handleRowAction={handleRowActions}
        //@ts-ignore
        selectedItems={selectedFilter}
        handleApplyButton={() => mutate()}
        //@ts-ignore
        setSelectedItems={handleFilterSelection}
        reset={() => {
          setSelectedFilter({ Roles: [] });
        }}
      />
      <Modals.ConfirmationModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        isSubmitting={isDLoading}
        content="Are sure to delete employee"
        title="Delete Employee"
        onSubmit={handleEmployeeDelete}
      />
    </section>
  );
};

export default Employees;
