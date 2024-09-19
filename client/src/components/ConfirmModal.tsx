export default function ConfirmModal({ isOpen, text, littleText, onConfirm, onCancel }: { isOpen: boolean, text: string, littleText: string, onConfirm: any, onCancel: any }) {

	return ( isOpen &&
		<>
		<div className="fixed inset-0 z-50 flex justify-center items-center overflow-auto">
			<div className="flex flex-col min-w-5xl rounded-lg shadow-lg bg-white w-4/5 sm:w-3/5 lg:w-2/5">
				<h3 className="text-lg font-semibold text-indigo-600 pt-6 !text-center">{ text }</h3>
				{ littleText && <p className="text-sm font-semibold text-center text-gray-500">
					{ littleText }
				</p> }
				<div className="px-12 py-6 flex justify-center items-center">
					<button onClick={() => onCancel()} className="flex w-full justify-center rounded-md bg-indigo-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mr-5">
						Cancel
					</button>
					
					<button onClick={() => onConfirm()} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
						Confirm
					</button>
				</div>
			</div>
		</div>
		<div className="opacity-50 fixed inset-0 z-40 bg-gray-900"></div>
		</>
	)

}
