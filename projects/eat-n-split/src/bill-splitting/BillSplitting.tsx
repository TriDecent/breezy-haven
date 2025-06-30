import { useSelector } from 'react-redux';
import { Card, type RootState } from '../shared';
import BillSplittingForm from './BillingSplittingForm';

export default function BillSplitting() {
  const selectedFriend = useSelector(
    (state: RootState) => state.ui.selectedFriend
  );
  return selectedFriend ? (
    <Card>
      <h2 className='text-lg font-bold tracking-wider uppercase'>
        Split a bill with {selectedFriend.name}
      </h2>
      <BillSplittingForm friendName={selectedFriend.name}/>
    </Card>
  ) : null;
}
