import * as RSwitch from '@radix-ui/react-switch'

interface SwitchProps {
  checked?: boolean,
  onCheckedChange?: (checked: boolean) => void,
}

const Switch = ({
  checked = false,
  onCheckedChange = () => {},
}: SwitchProps) => {
  return (
    <RSwitch.Root
      className='w-10 h-6 bg-fill shadow-md rounded-full relative data-[state=checked]:bg-accent-active transition-colors hover:cursor-pointer hover:bg-fill-hover'
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <RSwitch.Thumb className='block w-4 h-4 bg-text rounded-full translate-x-1 data-[state=checked]:translate-x-5 transition-transform'/>
    </RSwitch.Root>
  )
}

export default Switch
