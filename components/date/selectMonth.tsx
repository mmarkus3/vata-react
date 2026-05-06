import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';

interface SelectMonthProps {
  date: Date;
  onChange: (month: string) => void;
}

export function SelectMonth({ date, onChange }: SelectMonthProps) {
  const [month, setMonth] = useState(format(date, 'yyyy-MM'));

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const monthValue = e.target.value;
    onChange(monthValue);
    setMonth(monthValue);
  };

  return (
    <div className="mb-4 w-40">
      <label htmlFor="month" className="block text-sm font-medium text-gray-700">
        Valitse kuukausi
      </label>
      <input
        type="month"
        id="month"
        name="month"
        value={month}
        pattern="[0-9]{4}-[0-9]{2}"
        onChange={handleMonthChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
}