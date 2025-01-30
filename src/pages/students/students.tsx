import Table from '@/components/table';
import PATH from '@/routes/paths';
import {
  deleteStudents,
  downloadStudentPdf,
  ListStudents,
} from '@/services/studentService';
import useStore from '@/store/store';
import {
  colorMapping,
  studentColums,
  studentFilterOptions,
  swrKeys,
} from '@/utils/constants';
import { debounce, notify } from '@/utils/helpers/helpers';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Modals from '../../modals';

const Students = () => {
  const navigate = useNavigate();
  const {
    userDetails: { id, is_admin, is_employee },
  } = useStore((state) => state);
  /********************************STORE************************************** */
  const { selectedRowIds, setSelectedRowIds } = useStore((state) => state);

  /******************************** REACT-HOOKS ************************************** */

  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAdmitStudentModal, setShowAdmitStudentModal] =
    useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IStudent>();
  const [isDltLoading, setIsDltLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<{
    [key: string]: string[];
  }>({});

  /********************************SERVICE CALLS************************************** */
  const { data, isLoading, mutate } = useSWR(
    `${swrKeys.STUDENTS}-${page}`,
    async () => {
      const response = await ListStudents({
        limit: 10,
        page,
        //@ts-ignore
        type: selectedFilter['Admission Status'] || 'all',
        //@ts-ignore
        id: is_admin ? '' : id,
        //@ts-ignore
        student_status: selectedFilter['Student Status'] || '',
        search: searchValue,
      });
      //@ts-ignore
      return {
        ...response,
        results: response?.results?.map((item: any) => ({
          ...item,
          ...(item?.approval_status ? { status: item.approval_status } : {}),
          ...(item?.course_status
            ? { course_status: item.course_status }
            : { course_status: '' }),
        })),
      };
    },
    {
      keepPreviousData: true,
      revalidateIfStale: true,
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

  const handleHeaderActions = (action: TOption) => {
    if (action.value === 'delete') {
      if (confirm("Only students with status 'Not accepted' will be deleted")) {
        deleteStudents({
          student_ids: Object.keys(selectedRowIds).flatMap(
            // @ts-ignore
            (item) => selectedRowIds[item]
          ),
        }).then((data) => {
          notify(data.message, { type: 'success' });
        });
      }
    }
  };

  const handleStudentDelete = () => {
    setIsDltLoading(true);
    //@ts-ignore
    deleteStudents({ student_ids: [selectedRow?.id] })
      .then((value) => notify(value, { type: 'success' }))
      .finally(() => {
        setIsDltLoading(false);
        setShowDeleteModal(false);
        mutate();
      });
  };

  /********************************CUSTOM METHODS************************************** */

  const handleStudentActions = (action: string, rowData: IStudent) => {
    setSelectedRow(rowData);
    if (action === 'edit') {
      is_admin
        ? notify(`You don't have permission to admit students`, {
            type: 'warning',
          })
        : rowData.is_admitted
          ? notify('Student is already admitted', { type: 'warning' })
          : setShowAdmitStudentModal(true);
    } else if (action === 'delete') {
      setShowDeleteModal(true);
    } else if (action === 'download') {
      rowData.is_admitted
        ? handleDownloadPdf(rowData.id)
        : notify('Details are available only for admitted students', {
            type: 'warning',
          });
    }
  };

  const handleDownloadPdf = async (studentId: string) => {
    try {
      const pdfData = await downloadStudentPdf(studentId); // Call the API function
      const url = window.URL.createObjectURL(new Blob([pdfData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Student_${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download PDF', error);
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

  const isRowEditDisabled = useMemo(
    () =>
      (_data?: IStudent, action?: 'edit' | 'delete' | 'view' | 'download') => {
        return action === 'edit' ? is_admin : false;
      },
    [is_admin]
  );

  const onRowClick = ({ id, is_admitted }: IStudent) => {
    navigate(`edit-student/${id}`, { state: { id, is_admitted } });
  };

  const handleFilterApply = () => {
    page === 1 ? mutate(true) : setPage(1);
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
        <Table
          btnLabel="Add Students"
          rows={data?.results}
          colums={studentColums}
          currentPage={page}
          showingLimit={10}
          isLoading={isLoading}
          totalCount={data?.count}
          accOptions={studentFilterOptions}
          setCurrentPage={setPage}
          isSearchable={true}
          showDownloadBtn={true}
          //@ts-ignore
          selectedItems={selectedFilter}
          //@ts-ignore
          setSelectedItems={handleFilterSelection}
          handleApplyButton={handleFilterApply}
          reset={() => {
            //@ts-ignore
            setSelectedFilter([]);
          }}
          onBtnClick={() =>
            navigate(is_admin ? PATH.addStudents : PATH.addAdmittedStudents)
          }
          placeholder="Search Students"
          isBtnDisabled={is_employee}
          colorMapping={colorMapping}
          showFilter={true}
          handleRowAction={handleStudentActions}
          checkboxSelection={true}
          showEyeBtn={false}
          showActions={showActions}
          searchValue={searchValue}
          showBtn={!is_employee}
          setSearchValue={setSearchValue}
          handleHeaderAction={handleHeaderActions}
          isRowActionDisabled={isRowEditDisabled}
          onRowClick={onRowClick}
        />
      </section>
      <Modals.AdmitStudentConfirmation
        isOpen={showAdmitStudentModal}
        //@ts-ignore
        admittedState={{ id: selectedRow?.id, state: selectedRow?.is_admitted }}
        setIsOpen={setShowAdmitStudentModal}
        //@ts-ignore
        setAdmittedState={setSelectedRow}
        mutate={mutate}
      />
      <Modals.ConfirmationModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        isSubmitting={isDltLoading}
        content="Are sure to delete student?"
        title="Delete Student"
        onSubmit={handleStudentDelete}
      />
    </Fragment>
  );
};

export default Students;
