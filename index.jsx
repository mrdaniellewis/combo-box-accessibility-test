import React, { useEffect, useState, useContext, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { ComboBox, useTokenSearch, TokenHighlight, Context } from '@citizensadvice/react-combo-boxes';
import fruits from './fruits.json';

function ComboBoxField({ id, label, ...props }) {
  const [value, setValue] = useState(null);
  const [options, onSearch] = useTokenSearch(fruits);

  return (
    <>
      <label
        htmlFor={id}
        id={`${id}-label`}
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

function FoundDescriptionDebouncePolite({ live = 'polite', children, ...props }) {
  const [message, setMessage] = useState(children);
  const { props: { options } } = useContext(Context);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage(children || (options.length === 0 ? 'No options found' : ''));
    }, 500);

    return () => clearTimeout(timeout);
  }, [children, options]);

  return (
    <>
      <div
        {...props}
      >
        {children}
      </div>
      <div
        aria-live={live}
        className="react-combo-boxes-sr-only"
      >
        {message}
      </div>
    </>
  );
}

function FoundDescriptionDebounceAssertive(props) {
  return (
    <FoundDescriptionDebouncePolite
      {...props}
      live="assertive"
    />
  );
}

function App() {
  return (
    <>
      <h1>Combo box accessibility tests</h1>
      <h2>Result number in the description</h2>
      <ComboBoxField
        label="Fruits"
        id="fruits"
      />
      <h2>Description has aria-live polite</h2>
      <ComboBoxField
        label="Fruits - polite"
        id="fruits-polite"
        notFoundProps={{ 'aria-live': 'polite', className: 'react-combo-boxes-sr-only' }}
        FoundDescriptionComponent={FoundDescriptionPolite}
      />
      <h2>Description has aria-live assertive</h2>
      <ComboBoxField
        label="Fruits - assertive"
        id="fruits-assertive"
        notFoundProps={{ 'aria-live': 'assertive', className: 'react-combo-boxes-sr-only' }}
        FoundDescriptionComponent={FoundDescriptionAssertive}
      />
      <h2>Debounced polite message</h2>
      <p>Number of results message is debounced by 0.5 seconds</p>
      <ComboBoxField
        label="Fruits - assertive"
        id="fruits-debounce-polite"
        FoundDescriptionComponent={FoundDescriptionDebouncePolite}
      />
      <h2>Debounced assertive message</h2>
      <p>Number of results message is debounced by 0.5 seconds</p>
      <ComboBoxField
        label="Fruits - assertive"
        id="fruits-debounce-assertive"
        FoundDescriptionComponent={FoundDescriptionDebounceAssertive}
      />
      <h2>Labelled list-box</h2>
      <p>Testing if labelling the list-box makes any difference</p>
      <ComboBoxField
        label="Fruits"
        id="fruits-label-list-box"
        listBoxProps={{ 'aria-labelledby': 'fruits-label-list-box-label' }}
      />
      <h2>Active descendant test</h2>
      <p>Testing if active descendant works</p>
      <ComboBoxField
        label="Fruits"
        id="fruits-active-descendant"
        managedFocus={false}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
