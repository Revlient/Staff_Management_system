import Button from '@/components/button';
import CheckBox from '@/components/checkbox';
import Menu from '@/components/dropdown';
import {
  DeleteNotification,
  GetNotifications,
} from '@/services/notificationService';
import useStore from '@/store/store';
import { notify } from '@/utils/helpers/helpers';
import React, { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWRInfinite from 'swr/infinite';
import Modals from '../../modals';
const Notifications: React.FC = () => {
  const {
    userDetails: { is_admin },
    notifications,
    setNotifications,
  } = useStore((state) => state);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [dltBtnLoader, setDltBtnLoader] = useState<boolean>(false);
  const [ids, setIds] = useState<string[]>([]);
  const [selectedNot, setselectedNot] = useState<{
    id: string;
    text: string;
  } | null>(null);

  /**Clear the selected notification once editing modal is closed */
  useEffect(() => {
    if (!showModal && selectedNot?.id) {
      setselectedNot(null);
    }
  }, [showModal]);

  const { size, setSize, mutate } = useSWRInfinite<{
    count: number;
    results: INotification[];
  }>(
    (index) => `notifications?page=${index + 1}`,
    async (key) => {
      const page = parseInt(key.split('=')[1]);
      const data = await GetNotifications({ page, page_size: 10 });
      return data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      onSuccess(data) {
        setNotifications({
          count: data[0]?.count,
          results: Array.from(
            new Map(
              data
                .flatMap((page) => page.results)
                .map((item) => [item.id, item])
            ).values()
          ),
        });
      },
    }
  );

  const handleDelete = async () => {
    setDltBtnLoader(true);
    DeleteNotification(selectedNot?.id ? [selectedNot.id] : ids)
      .then((data) => {
        notify(data.message, { type: 'success' });
        setNotifications({
          ...notifications,
          results: notifications.results.filter((v) =>
            selectedNot?.id ? selectedNot?.id !== v.id : !ids.includes(v.id)
          ),
        });
      })
      .finally(() => {
        setDltBtnLoader(false);
        setselectedNot(null);
        setIds([]);
        setShowDeleteModal(false);
      });
  };

  const handleRowSelection = (
    _e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setIds((cv) =>
      cv.includes(id) ? cv.filter((item) => item != id) : [...cv, id]
    );
  };

  const handleActions = (action: TOption, not: INotification) => {
    if (action.value === 'edit') {
      setselectedNot({
        text: not.notification_message,
        id: not.id,
      });
      setShowModal(true);
    } else {
      setselectedNot({
        text: not.notification_message,
        id: not.id,
      });
      setShowDeleteModal(true);
    }
  };

  return (
    <Fragment>
      <div className="p-4 m-3 bg-white rounded-2xl flex flex-col gap-3 h-full overflow-hidden">
        <div className="flex justify-between gap-4 items-center">
          <h4 className="font-bold text-base">Notifications</h4>
          {is_admin && (
            <Fragment>
              <Button
                label="Add New"
                type="submit"
                className="w-fit bg-primary text-white ml-auto"
                onClick={() => setShowModal(true)}
              />
              {!!ids.length && (
                <Button
                  label="Delete All"
                  type="submit"
                  className="w-fit bg-primary text-white"
                  onClick={() => setShowDeleteModal(true)}
                />
              )}
            </Fragment>
          )}
        </div>

        <div
          className="flex-1 overflow-auto scroll-smooth pr-1 py-1 h-full"
          id="scrollable-div"
        >
          <InfiniteScroll
            dataLength={notifications.results?.length}
            next={() => {
              setSize((cv) => cv + 1);
            }}
            hasMore={Math.ceil(notifications.count / 10) > size}
            loader={<h4>Loading...</h4>}
            scrollThreshold={0.8}
            className="flex flex-col gap-2 h-full"
            scrollableTarget="scrollable-div"
          >
            {notifications.results?.map((not, index) => (
              <div
                key={index}
                className="bg-primary-50 rounded-lg p-3 flex gap-2 items-center"
              >
                {is_admin && (
                  <CheckBox
                    id={`child_${index}`}
                    onChange={(e) => handleRowSelection(e, not?.id)}
                    isSelected={not?.id ? ids?.includes(not?.id) : false}
                  />
                )}
                <div className="flex flex-col">
                  {not?.notification_message}
                  <span className="text-gray-400 text-small">
                    {not?.updated_at?.toLocaleString()}
                  </span>
                </div>

                {is_admin && (
                  <Menu
                    showLabel={false}
                    menuClass="!w-fit"
                    options={[
                      { label: 'Edit', value: 'edit' },
                      { label: 'Delete', value: 'delete' },
                    ]}
                    isKebabMenu={true}
                    containerClass="!w-fit ml-auto relative"
                    onSelectItem={(option) => handleActions(option, not)}
                  />
                )}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
      <Modals.NotificationModal
        mutate={mutate}
        isOpen={showModal}
        details={selectedNot}
        setIsOpen={setShowModal}
      />
      <Modals.ConfirmationModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        content="Are sure to delete?"
        title="Delete Notifications"
        onSubmit={handleDelete}
        isSubmitting={dltBtnLoader}
      />
    </Fragment>
  );
};

export default Notifications;
