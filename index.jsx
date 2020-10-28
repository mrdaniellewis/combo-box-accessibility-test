import React, { useEffect, useState, useContext, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { ComboBox, useTokenSearch, TokenHighlight, Context } from '@citizensadvice/react-combo-boxes/cjs';
import fruits from './fruits.json';

function ComboBoxField({ id, label, ...props }) {
  const [value, setValue] = useState(null);
  console.log(fruits);
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
        aria-labelledby={`${id}-label`}
        value={value}
        options={options}
        onSearch={onSearch}
        onValue={setValue}
        ValueComponent={TokenHighlight}
        optionProps={{ tabIndex: 1 }}
        {...props}
      />
    </>
  );
}

function FoundDescriptionPolite(props) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      {...props}
      hidden={false}
      className="react-combo-boxes-sr-only"
    />
  );
}

function FoundDescriptionAssertive(props) {
  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      {...props}
      hidden={false}
      className="react-combo-boxes-sr-only"
    />
  );
}

function NotFound({ hidden, className, ...props }) {
  return (
    <div
      {...props}
      className={hidden ? 'react-combo-boxes-sr-only' : className}
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
        aria-atomic="true"
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
        NotFoundComponent={NotFound}
        FoundDescriptionComponent={FoundDescriptionPolite}
      />
      <h2>Description has aria-live assertive</h2>
      <ComboBoxField
        label="Fruits - assertive"
        id="fruits-assertive"
        notFoundProps={{ 'aria-live': 'assertive', className: 'react-combo-boxes-sr-only' }}
        NotFoundComponent={NotFound}
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
