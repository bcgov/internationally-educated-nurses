import { Switch } from '@headlessui/react';

interface ToggleSwitchProps {
  checked: boolean;
  screenReaderText: string;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch = ({ checked, screenReaderText, onChange }: ToggleSwitchProps) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-bcBlueIndicator border-bcBlueBorder' : 'bg-white border-bcGrayDisabled'
      } relative inline-flex h-6 w-10 border items-center rounded-full`}
    >
      <span className='sr-only'>{screenReaderText}</span>
      <span
        className={`${
          checked ? 'translate-x-5 bg-white' : 'translate-x-1 bg-bcGrayDisabled'
        } inline-block h-4 w-4 transform rounded-full transition duration-500 ease-in-out`}
      />
    </Switch>
  );
};
