import Table from '@/components/table';
import PATH from '@/routes/paths';
import { DeleteEmployee, ListEmployees } from '@/services/employeeService';
import { colorMapping, employeeColums, swrKeys } from '@/utils/constants';
import { debounce, notify } from '@/utils/helpers/helpers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Modals from '../../modals';

const Agents = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IEmployee>();
  const [isDLoading, setIsDLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const { data, isLoading, mutate } = useSWR(
    `${swrKeys.AGENTS}-${page}`,
    () =>
      ListEmployees({ limit: 10, page, type: 'Agents', search: searchValue }),
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

  const handleEmployeeDelete = () => {
    setIsDLoading(true);
    DeleteEmployee(selectedRow?.id!)
      .then((value) => {
        notify(value.message, { type: 'success' });
        setShowDeleteModal(false);
        mutate();
      })
      .finally(() => setIsDLoading(false));
  };

  const handleRowActions = (action: string, rowData: IEmployee) => {
    const { id, username, ...rest } = rowData;
    setSelectedRow(rowData);
    if (action === 'edit') {
      localStorage.setItem('emp', JSON.stringify(rest));
      navigate(`/employees/edit-employee/${id}`);
    } else if (action === 'delete') {
      setShowDeleteModal(true);
    }
  };

  return (
    <section className="h-full overflow-hidden p-2 slideIn">
      <Table
        btnLabel="Add Agent"
        rows={data?.results}
        colums={employeeColums}
        currentPage={page}
        showingLimit={10}
        isLoading={isLoading}
        totalCount={data?.count}
        setCurrentPage={setPage}
        onBtnClick={() => navigate(PATH.addEmployees)}
        colorMapping={colorMapping}
        showFilter={false}
        checkboxSelection={false}
        showEyeBtn={false}
        showDownloadBtn={false}
        isSearchable={true}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleRowAction={handleRowActions}
        showBtn={false}
        placeholder="Search Agent"
      />
      <Modals.ConfirmationModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        isSubmitting={isDLoading}
        content="Are sure to delete agent?"
        title="Delete Agent"
        onSubmit={handleEmployeeDelete}
      />
    </section>
  );
};

export default Agents;
