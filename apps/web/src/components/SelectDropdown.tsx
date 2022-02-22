interface OptionType {
  label: string;
  value: string;
}

interface SelectProps {
  name: string;
  label: string;
  options: OptionType[];
  disabled?: boolean;
}

export const SelectDropdown: React.FC<SelectProps> = () => {
  return <></>;
};
