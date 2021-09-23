import React from 'react';
import { FormControl, TextField, Select } from 'native-base';

function KBA({ label, questions = [], val, setter }) {
  return (
    <>
      <FormControl.Label>{label}</FormControl.Label>
      <Select
        accessibilityLabel="Select Security Question"
        placeholder="Select Security Question"
        selectedValue={val.question}
        onValueChange={(itemValue) => setter({ ...val, question: itemValue })}>
        {questions.map((question) => (
          <Select.Item label={question} key={question} value={question} />
        ))}
      </Select>
      <TextField
        onChangeText={(itemValue) => setter({ ...val, answer: itemValue })}
      />
    </>
  );
}

export { KBA };
