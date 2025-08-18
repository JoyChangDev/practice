'use client';

import { Flex } from '@chakra-ui/react';
import { useState } from 'react';

import Checkbox from '@/components/form/checkbox';

export default function UseStateSecond({ initialValues }) {
  const [values, setValues] = useState(initialValues);

  const allChecked =
    values.every((v) => v.checked) ||
    values.every((v) => !v.checked);

  const handleChecked = (index, nextChecked) => {
    setValues((current) => {
      const newValues = current.map((v, i) =>
        i === index ? { ...v, checked: !!nextChecked } : v
      );

      const allCheck = newValues.every((v) => v.checked);
      const noneCheck = newValues.every((v) => !v.checked);

      if (allCheck || noneCheck) {
        return newValues.map((v) => {
          return { ...v, checked: false };
        });
      }

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
        onCheckedChange={() => {
          setValues((current) =>
            current.map((value) => ({
              ...value,
              checked: false,
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
