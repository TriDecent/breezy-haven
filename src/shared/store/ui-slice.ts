import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isValid, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';

type ISODateRange = Record<keyof DateRange, string | undefined>;
interface UIState {
  readonly isoDateRange: ISODateRange | undefined;
  readonly query: string | null;
}

const initialState: UIState = {
  isoDateRange: undefined,
  query: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    updateDateRange: (
      state,
      action: PayloadAction<UIState['isoDateRange']>
    ) => {
      state.isoDateRange = action.payload;
    },
    setQuery: (state, action: PayloadAction<UIState['query']>) => {
      state.query = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export function fromISOToDateRange(iso: ISODateRange): DateRange {
  return {
    from: parseISO(iso.from ?? ''),
    to: parseISO(iso.to ?? ''),
  };
}
export function fromDateRangeToISO(dateRange: DateRange): ISODateRange {
  return {
    from: isValid(dateRange.from) ? dateRange.from?.toISOString() : undefined,
    to: isValid(dateRange.to) ? dateRange.to?.toISOString() : undefined,
  };
}

export default uiSlice;
