'use client';

import React from 'react';

interface StepIndicatorProps {
  steps: { id: number; title: string; description: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <li key={step.id} className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : isCompleted
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </span>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold leading-none">{step.title}</p>
                  <p className={`text-[10px] mt-0.5 ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                    {step.description}
                  </p>
                </div>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 shrink-0 transition-colors duration-300 ${
                    isCompleted ? 'bg-blue-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
