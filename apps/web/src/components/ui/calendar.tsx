'use client';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';
import {
  DayFlag,
  DayPicker,
  DropdownProps,
  SelectionState,
  UI,
  DropdownNavProps,
} from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      captionLayout='dropdown'
      showOutsideDays={showOutsideDays}
      className={cn('p-3 bg-white', className)}
      classNames={{
        [UI.Months]: 'relative',
        [UI.Month]: 'space-y-4 ml-0',
        [UI.MonthCaption]: 'flex justify-center items-center h-7',
        [UI.CaptionLabel]: 'text-sm font-medium',
        [UI.PreviousMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        [UI.NextMonthButton]: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        [UI.MonthGrid]: 'w-full border-collapse space-y-1',
        [UI.Weekdays]: 'flex',
        [UI.Weekday]: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        [UI.Week]: 'flex w-full mt-2',
        [UI.Day]:
          'h-9 w-9 text-center rounded-md text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        [UI.DayButton]: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground',
        ),
        [SelectionState.range_end]: 'day-range-end',
        [SelectionState.selected]:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        [SelectionState.range_middle]:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        [DayFlag.today]: 'bg-accent text-accent-foreground',
        [DayFlag.outside]:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        [DayFlag.disabled]: 'text-muted-foreground opacity-50',
        [DayFlag.hidden]: 'invisible',
        ...classNames,
      }}
      components={{
        Dropdown: ({ value, onChange, options }: DropdownProps) => {
          const selected = options?.find(child => child.value === value);
          const isYearDropdown = options && options.length > 12;
          const sortedOptions = isYearDropdown
            ? options?.sort((a, b) => b.value - a.value)
            : options;
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };
          return (
            <Select
              value={value?.toString()}
              onValueChange={value => {
                handleChange(value);
              }}
            >
              <SelectTrigger
                className={cn('pr-1.5 focus:ring-0', isYearDropdown ? 'w-auto' : 'w-[104px]')}
              >
                <SelectValue>{selected?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent position='popper'>
                <ScrollArea className='h-80'>
                  {sortedOptions?.map((option, id: number) => (
                    <SelectItem
                      key={`${option.value}-${id}`}
                      value={option.value?.toString() ?? ''}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
        Chevron: ({ ...props }) => <Chevron {...props} />,
        DropdownNav: ({ className, children, ...props }: DropdownNavProps) => (
          <div
            className={`${className} flex gap-2`}
            {...(props as React.HTMLAttributes<HTMLDivElement>)}
          >
            {children as React.ReactNode}
          </div>
        ),
      }}
      {...props}
    />
  );
};

const Chevron = ({ orientation = 'left' }) => {
  switch (orientation) {
    case 'left':
      return <ChevronLeftIcon className='h-4 w-4' />;
    case 'right':
      return <ChevronRightIcon className='h-4 w-4' />;
    case 'up':
      return <ChevronUpIcon className='h-4 w-4' />;
    case 'down':
      return <ChevronDownIcon className='h-4 w-4' />;
    default:
      return null;
  }
};
