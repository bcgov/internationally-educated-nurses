import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { Button, buttonBase, buttonColor } from '@/components/Button';
import addIcon from '@assets/img/add.svg';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button as UiButton } from '@/components/ui/button';
import { addMilestone, updateMilestone, useGetMilestoneOptions } from '@services';
import { IENApplicantAddStatusDTO, IENApplicantUpdateStatusDTO, StatusCategory } from '@ien/common';
import { cn } from '@/lib/utils';
import { useApplicantContext } from '@/components/applicant/ApplicantContext';
import { useSystem } from './SystemContext';

const formSchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  start_date: z.date(),
  notes: z.string().optional(),
});

const DEFAULT_VALUES = {
  id: undefined,
  status: '',
  start_date: new Date(),
  notes: '',
};

export function SystemForm() {
  const { open, setOpen, selectedMilestone, setSelectedMilestone } = useSystem();

  const milestones = useGetMilestoneOptions(StatusCategory.SYSTEM);
  const { applicant, fetchApplicant } = useApplicantContext();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleCreateMilestone = async (id: string, values: IENApplicantAddStatusDTO) => {
    const milestone = await addMilestone(id, values);
    if (milestone) {
      fetchApplicant();
    }
    setOpen(false);
  };

  const handleUpdateMilestone = async (id: string, values: IENApplicantUpdateStatusDTO) => {
    const milestone = await updateMilestone(applicant.id, id, values);
    if (milestone) {
      fetchApplicant();
    }
    setOpen(false);
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // update
    if (selectedMilestone) {
      return await handleUpdateMilestone(selectedMilestone.id, {
        ...values,
        start_date: format(values.start_date, 'yyyy-MM-dd'),
      });
    }

    // create
    await handleCreateMilestone(applicant.id, {
      ...values,
      start_date: format(values.start_date, 'yyyy-MM-dd'),
    });
  }

  useEffect(() => {
    if (selectedMilestone) {
      form.reset({
        ...selectedMilestone,
        start_date: selectedMilestone?.start_date
          ? parseISO(selectedMilestone.start_date)
          : new Date(),
      });
    }
  }, [selectedMilestone, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type='button'
          id='add-system-milestone'
          className={`mr-2 ${buttonColor.secondary} ${buttonBase}`}
          onClick={() => {
            setOpen(true);
            setSelectedMilestone(null);
            form.reset(DEFAULT_VALUES);
          }}
        >
          <img src={addIcon.src} alt='add' className='mr-2' />
          <span>Add Milestone</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Milestone</DialogTitle>
            </DialogHeader>

            <section className='flex flex-col gap-4 py-6'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Milestone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {milestones?.map(({ status, id }) => (
                          <SelectItem key={id} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Start date</FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <UiButton
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </UiButton>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          className='rounded-md border'
                          mode='single'
                          showOutsideDays
                          selected={field.value}
                          autoFocus
                          onSelect={value => {
                            field.onChange(value);
                            setCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className='border-t-2 mt-2 py-2'></span>
            </section>
            <DialogFooter className='sm:justify-start md:justify-around gap-2'>
              <DialogClose asChild>
                <Button variant='outline' forModal={true} type='button'>
                  Cancel
                </Button>
              </DialogClose>
              <Button variant='primary' forModal={true} type='submit'>
                {selectedMilestone ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
