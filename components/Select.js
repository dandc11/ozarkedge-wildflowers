import React, { useState } from 'react';
import cx from 'classnames'

const Select = ({ options, onChange, value = [], label = '' }) => {
    const [selectedValue, setSelectedValue] = useState(value);
    const id = label.replace(' ', '-').toLowerCase();
    const handleOnChange = (event) => {
        const newValue = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedValue(newValue);
        onChange(newValue);
    };

    return (
        <div className='flex w-full justify-between mb-2 text-base bp-1000:w-auto'>
            <label className='py-2 mr-2 whitespace-nowrap bp-1000:ml-4 ' for={id}>{label}</label>
            <select multiple id={id} className='px-2 py-2 rounded-md border-solid border-2 border-oe-green-700' value={selectedValue} onChange={handleOnChange}>
                {options.map((option, index, key={id}) => (
                    <option key={index} value={option.value} className={cx({'bg-blue-200': selectedValue.includes(option.value)})}>
                        {option.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;