import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Image, Avatar } from '@nextui-org/react';
import useSWR from 'swr';
import { swrKeys } from '@/utils/constants';
import { GetEmployeeRanking } from '@/services/employeeService';
import GetIcons from '@/assets/icons';
import Pagination from '@/components/pagination';

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  /********************************SERVICE CALLS************************************** */
  const { data } = useSWR(
    `${swrKeys.DASHBOARD}-${currentPage}`,
    () => GetEmployeeRanking({ limit: 5, page: currentPage }),
    {
      keepPreviousData: true,
      revalidateIfStale: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return (
    <section className="p-4 h-full overflow-hidden flex flex-col gap-3">
      <div className="flex-1 overflow-auto pr-1">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {data?.results?.map((employee: IDashboardEmployee, index: number) => (
            <Card className="py-4 !shadow-none" key={index}>
              <CardHeader className="flex items-center gap-3 py-2">
                {!employee?.profile_photo ? (
                  <Avatar classNames={{ base: 'block shrink-0' }} />
                ) : (
                  <Image
                    alt="Card background"
                    className="object-cover rounded-full"
                    src="https://nextui.org/images/hero-card-complete.jpeg"
                    width={50}
                    height={50}
                  />
                )}
                <h4 className="font-bold text-large mr-auto">
                  {employee.employee_name}
                </h4>

                {[1, 2, 3].includes(employee.rank) && (
                  <div>
                    {GetIcons(
                      employee.rank === 1
                        ? 'Gold'
                        : employee.rank === 2
                          ? 'Silver'
                          : 'Bronze'
                    )}
                  </div>
                )}
              </CardHeader>
              <CardBody className="pb-0 pt-2 px-4 flex justify-between items-start">
                <div className="flex flex-col items-start">
                  <small className="text-default-500">
                    Rank : {employee.rank}
                  </small>
                  <small className="text-default-500">
                    Admitted Students : {employee.number_of_admitted_students}
                  </small>

                  <p className="text-tiny uppercase font-bold">
                    Reference Number: {employee.employee_reference_number}
                  </p>
                  {employee.last_admitted_student_at && (
                    <small className="text-default-500">
                      Last admitted date: {employee.last_admitted_student_at}
                    </small>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        showingLimit={5}
        totalCount={data?.count || 0}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
};

export default Dashboard;
