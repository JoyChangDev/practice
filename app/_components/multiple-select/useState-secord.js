"use client";

import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Checkbox from "@/components/form/checkbox";

export default function UseStateSecond({ initialValues }) {
  const [values, setValues] = useState(initialValues);

  const allChecked = values.every((v) => v.checked);
  const noneChecked = values.every((v) => !v.checked);

  useEffect(() => {
    if (allChecked || noneChecked) {
      setTimeout(() => {
        setValues((current) => current.map((v) => ({ ...v, checked: false })));
      }, 100);
    }
  }, [allChecked, noneChecked]);

  const handleChecked = (index, nextChecked) => {
    setValues((current) => {
      return current.map((v, i) =>
        i === index ? { ...v, checked: !!nextChecked } : v
      );
    });
  };

  return (
    <Flex gap="20px">
      <Checkbox
        value={allChecked || noneChecked}
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
          onCheckedChange={(e) => handleChecked(index, e.checked)}
        />
      ))}
    </Flex>
  );
}
