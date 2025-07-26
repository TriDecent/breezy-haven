import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRange } from 'react-day-picker';

type ISODateRange = Record<keyof DateRange, string | undefined>;
interface UIState {
  readonly isoDateRange: ISODateRange | undefined;
}

const initialState: UIState = {
  isoDateRange: undefined,
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
  },
});

export const uiActions = uiSlice.actions;

export function fromISOToDateRange(iso: ISODateRange): DateRange {
  return {
    from: iso.from ? new Date(iso.from) : undefined,
    to: iso.to ? new Date(iso.to) : undefined,
  };
}
export function fromDateRangeToISO(dateRange: DateRange): ISODateRange {
  return {
    from: dateRange.from?.toISOString(),
    to: dateRange.to?.toISOString(),
  };
}

export default uiSlice;
