import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export type OptionType = {
	id: number,
	value: string
}

export default function Select({ value = undefined, onChange, placeholder = "Select", options, className }: { value: OptionType | undefined, onChange: (val: OptionType) => void, placeholder: string, options: OptionType[], className?: string }) {

  return (
	<div className={className}>
		<Listbox value={value} onChange={onChange}>
		{/* <Label className="block text-sm font-medium leading-6 text-white">Assigned to</Label> */}
		<div className="relative">
			<Listbox.Button className="relative w-full cursor-default rounded-md bg-[#505050] py-1 pl-3 pr-4 text-left text-white shadow-sm ring-1 ring-inset ring-gray-500/20 focus:outline-none focus:ring-2 focus:ring-gray-200/50 sm:text-sm sm:leading-6">
			{ value ? <span className="block truncate">{value.value}</span> : <span className="block truncate">{placeholder}</span> }
			<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
				<ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
			</span>
			</Listbox.Button>

			<Listbox.Options
				className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#505050] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
				>
				{options.map((option) => (
					<Listbox.Option
					key={option.id}
					value={option}
					className="group relative cursor-default select-none py-2 pl-3 pr-9 text-white data-[focus]:bg-indigo-600 data-[focus]:text-white"
					>
					<span className="block truncate font-normal group-data-[selected]:font-semibold">{option.value}</span>

					<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
						<CheckIcon aria-hidden="true" className="h-5 w-5" />
					</span>
					</Listbox.Option>
				))}
			</Listbox.Options>
		</div>
		</Listbox>
	</div>
  )
}