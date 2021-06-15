import React from 'react';

interface JSONFieldProps {
  json: any;
  replacement?: Record<string, any>;
}

type JSONElementProps = {
  label: string;
  value: any;
  indent?: boolean;
};

const JSONElement: React.FC<JSONElementProps> = ({ label, value, indent }) => {
  const style = indent ? { paddingLeft: '15px' } : undefined;
  return (
    <div style={style}>
      {JSON.stringify(label)}: {value}
    </div>
  );
};

export const JSONField: React.FC<JSONFieldProps> = ({ json, replacement }) => {
  if (Array.isArray(json)) {
    return (
      <>
        {'['}
        {json.map((val, i) => (
          <JSONField key={i} json={val} replacement={replacement} />
        ))}
        {']'}
      </>
    );
  }

  if (typeof json === 'object') {
    return (
      <>
        {'{'}
        {Object.entries(json).map(([label, value], i) => {
          const valueComponent =
            replacement && replacement[label] ? (
              replacement[label]
            ) : (
              <JSONField json={value} replacement={replacement} />
            );

          return <JSONElement indent key={i} label={label} value={valueComponent} />;
        })}
        {'}'}
      </>
    );
  }

  return (
    <>
      {JSON.stringify(json)}
      {','}
    </>
  );
};
