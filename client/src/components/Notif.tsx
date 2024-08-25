import ReactDOM from 'react-dom';
import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

export enum NotifType {
	SUCCESS,
	ERROR,
	WARNING,
	INFO
}

function Notif({ type = NotifType.SUCCESS, headline = "Notification", message = "", onClose = () => {} }) {
	const [show, setShow] = useState(true);
	const [icon, setIcon] = useState(<></>);

	useEffect(() => {

		if (type === NotifType.SUCCESS)
			setIcon(<CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />);
		else if (type === NotifType.ERROR)
			setIcon(<XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />);
		else if (type === NotifType.WARNING)
			setIcon(<ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />);
		else if (type === NotifType.INFO)
			setIcon(<InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />);

		const timeout = setTimeout(() => {
			setShow(false);
			onClose();
		}, 5000)
		return () => clearTimeout(timeout)
	}, [onClose, type]);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex px-4 py-6 items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
					{icon}
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{ headline }</p>
                    <p className="mt-1 text-sm text-gray-500">{ message }</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

// Function to render the notification
export const showNotification = (type: NotifType, headline: string, message?: string) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const onClose = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  };
 
  ReactDOM.render(
    <Notif type={type} headline={headline} message={message} onClose={onClose} />,
    container
  );
};