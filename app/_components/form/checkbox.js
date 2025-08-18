import { forwardRef } from 'react';
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';

const Checkbox = forwardRef(function Checkbox(props, ref) {
  return (
    <ChakraCheckbox.Root
      ref={ref}
      checked={props.value}
      onCheckedChange={props.onCheckedChange}
      variant={props.variant || 'solid'}
      colorPalette={props.colorPalette || 'gray'}
      cursor="pointer"
    >
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control />
      <ChakraCheckbox.Label>
        {props.label}
      </ChakraCheckbox.Label>
    </ChakraCheckbox.Root>
  );
});

export default Checkbox;
