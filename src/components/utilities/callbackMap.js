import React from 'react';
import { Username } from '../common/username';
import { Password } from '../common/password';
import { KBA } from '../Register/kba';
import { TextField } from '../Register/text-field';
import { Specials } from '../Register/specials';

const callbackTypeToComponent = {
  ValidatedCreateUsernameCallback: ({ label, setter, output }) => (
    <Username label={label} setUsername={setter} key={label} output={output} />
  ),
  StringAttributeInputCallback: ({ label, setter, val, output }) => (
    <TextField
      label={label}
      setter={setter}
      key={label}
      val={val}
      output={output}
    />
  ),
  BooleanAttributeInputCallback: ({ label, setter, val, output }) => (
    <Specials
      label={label}
      setter={setter}
      val={val}
      key={label}
      output={output}
    />
  ),
  ValidatedCreatePasswordCallback: ({ label, setter, val, output }) => (
    <Password
      label={label}
      setter={setter}
      val={val}
      key={label}
      output={output}
    />
  ),
  TermsAndConditionsCallback: ({ label, setter, val, terms, output }) => (
    <Specials
      label={label}
      setter={setter}
      val={val}
      terms={terms}
      key={label}
      output={output}
    />
  ),
  KbaCreateCallback: ({ label, setter, val, questions, output }) => (
    <KBA
      label={label}
      setter={setter}
      val={val}
      questions={questions}
      key={label}
      output={output}
    />
  ),
};

export { callbackTypeToComponent };
