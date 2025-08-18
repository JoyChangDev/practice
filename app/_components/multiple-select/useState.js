'use client';

import { Flex } from '@chakra-ui/react';
import { useState } from 'react';

import Checkbox from '@/components/form/checkbox';

export default function UseState({ initialValues }) {
  const [values, setValues] = useState(initialValues);

  const allChecked = values.every((value) => value.checked);

  const handleChecked = (index, nextChecked) => {
    setValues((current) => {
      const newValues = [...current];
      newValues[index] = {
        ...newValues[index],
        checked: !!nextChecked,
      };
      return newValues;
    });
  };

  return (
    <Flex gap="20px">
      <Checkbox
        value={allChecked}
        label="Weekdays"
        variant="subtle"
        colorPalette="purple"
        onCheckedChange={(e) => {
          setValues((current) =>
            current.map((value) => ({
              ...value,
              checked: !!e.checked,
            }))
          );
        }}
      />
      {values.map((item, index) => (
        <Checkbox
          key={item.value}
          value={item.checked}
          label={item.label}
          variant="subtle"
          colorPalette="blue"
          onCheckedChange={(e) =>
            handleChecked(index, e.checked)
          }
        />
      ))}
    </Flex>
  );
}
