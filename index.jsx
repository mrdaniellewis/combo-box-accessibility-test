import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ComboBox, useTokenSearch, TokenHighlight } from '@citizensadvice/react-combo-boxes';
import fruits from './fruits.json';

function OptionComponent(props) {
  return (
    <li
      {...props}
      aria-selected={props['aria-selected'] ? 'true' : 'false'}
    />
  );
}

function ComboBoxField({ id, label, ...props }) {
  const [value, setValue] = useState(null);
  const [options, onSearch] = useTokenSearch(fruits);

  return (
    <>
      <label
        htmlFor={id}
      >
        {label}
      </label>
      <ComboBox
        id={id}
        value={value}
        options={options}
        onSearch={onSearch}
        onValue={setValue}
        ValueComponent={TokenHighlight}
        listBoxProps={{ 'aria-activedescendant': null }}
        inputsProps={{ 'aria-activedescendant': null }}
        OptionComponent={OptionComponent}
        {...props}
      />
    </>
  );
}

function FoundDescriptionPolite(props) {
  return (
    <div
      aria-live="polite"
      {...props}
    />
  );
}

function FoundDescriptionAssertive(props) {
  return (
    <div
      aria-live="assertive"
      {...props}
    />
  );
}

function App() {
  return (
    <>
      <ComboBoxField
        label="Fruits"
        id="fruits"
      />
      <ComboBoxField
        label="Fruits - polite"
        id="fruits-polite"
        FoundDescriptionComponent={FoundDescriptionPolite}
      />
      <ComboBoxField
        label="Fruits - assertive"
        id="fruits-assertive"
        notFoundProps={{ 'aria-live': 'assertive', hidden: false, className: 'sr-only' }}
        FoundDescriptionComponent={FoundDescriptionAssertive}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
