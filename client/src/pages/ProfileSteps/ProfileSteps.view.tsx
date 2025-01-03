import { useState, useEffect, ReactElement } from 'react';
import { useAuth } from '../../contexts/authProvider';
import { useSearchParams } from 'react-router-dom';
import { CheckIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid'

import StepLocation from './Location';
import StepPreferences from './Preferences';
import StepBiography from './Biography';
import StepInterests from './Interests';
import StepPictures from './Pictures';

type Step = {
	id: string;
	name: string;
	status: string;
	element?: ReactElement;
};

export default function ProfileSteps() {

	const { logout } = useAuth();

	const [searchParams] = useSearchParams();

	const [currStep, setCurrStep] = useState<ReactElement | undefined>(<></>);

	const [steps, setSteps] = useState([
		{ id: '1', name: 'Location', status: 'current', element: <StepLocation /> },
		{ id: '2', name: 'Preferences', status: 'upcoming', element: <StepPreferences /> },
		{ id: '3', name: 'Biography', status: 'upcoming', element: <StepBiography /> },
		{ id: '4', name: 'Interests', status: 'upcoming', element: <StepInterests /> },
		{ id: '5', name: 'Pictures', status: 'upcoming', element: <StepPictures /> },
	]);

	useEffect(() => {
		if (!searchParams.get('step')) {
			setCurrStep(steps[0].element);
			setSteps(steps.map((s, i) => {
				s.status = i === 0 ? 'current' : i < 1 ? 'complete' : 'upcoming';
				return s;
			}));
		}
		else {
			const step = searchParams.get('step');
			const stepIndex = steps.findIndex((s) => s.id === step);
			if (stepIndex !== -1) {
				const updated = steps.map((s, i) => {
					s.status = i < stepIndex ? 'complete' : i === stepIndex ? 'current' : 'upcoming';
					return s;
				});
				setSteps(updated);
			}
			setCurrStep(steps[stepIndex].element);
		}
	}, [searchParams]);

	return (
		<>
			<button className="absolute top-4 right-6 " onClick={() => logout()}>
				<ArrowRightStartOnRectangleIcon className="h-6 w-6 text-gray-200" />
			</button>
			<div className="min-h-screen py-4 px-2 sm:px-16 flex flex-col justify-between">
					{currStep}
					<StepsIndicator steps={steps} />
			</div>
		</>
	);
}

function StepsIndicator({ steps }: { steps: Step[] }) {

	const [_, setURLSearchParams] = useSearchParams();

	function clickOnStep(step: Step) {
		if (step.status === 'upcoming' || step.status === 'current') return;
		setURLSearchParams({ step: step.id });
	}

	return (
		<nav aria-label="Progress">
			<ol role="list" className="divide-gray-300 rounded-md border border-indigo-400 flex divide-y-0 overflow-x-scroll lg:overflow-hidden">
				{steps.map((step, stepIdx) => (
					<li key={step.name} className="relative flex flex-1">
						{step.status === 'complete' ? (
							<a onClick={() => clickOnStep(step)} className="group flex w-full items-center cursor-pointer">
								<span className="flex items-center px-6 py-4 text-sm font-medium">
									<span className="flex h-8 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 group-hover:bg-indigo-500">
										<CheckIcon aria-hidden="true" className="h-6 w-6 text-white" />
									</span>
									<span className="ml-4 text-sm font-medium text-indigo-500">{step.name}</span>
								</span>
							</a>
						) : step.status === 'current' ? (
							<a onClick={() => clickOnStep(step)} aria-current="step" className="flex items-center px-6 py-4 text-sm font-medium">
								<span className="flex h-8 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-400">
									<span className="text-indigo-400">{step.id}</span>
								</span>
								<span className="ml-4 text-sm font-medium text-indigo-400">{step.name}</span>
							</a>
						) : (
							<a onClick={() => clickOnStep(step)} className="group flex items-center">
								<span className="flex items-center px-6 py-4 text-sm font-medium">
									<span className="flex h-8 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-500 group-hover:border-gray-400">
										<span className="text-gray-500 group-hover:text-gray-400">{step.id}</span>
									</span>
									<span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-400">{step.name}</span>
								</span>
							</a>
						)}

						{stepIdx !== steps.length - 1 ? (
							<>
								{/* Arrow separator for lg screens and up */}
								<div aria-hidden="true" className="absolute right-0 top-0 h-full w-5 block">
									<svg
										fill="none"
										viewBox="0 0 22 80"
										preserveAspectRatio="none"
										className="h-full w-full text-indigo-400"
									>
										<path
											d="M0 -2L20 40L0 82"
											stroke="currentcolor"
											vectorEffect="non-scaling-stroke"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</>
						) : null}
					</li>
				))}
			</ol>
		</nav>
	)
}
