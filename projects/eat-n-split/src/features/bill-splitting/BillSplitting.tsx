import { useSelector } from 'react-redux';
import { Card, type RootState } from '../../shared';
import BillSplittingForm from './form/BillingSplittingForm';

export default function BillSplitting() {
  const selectedFriend = useSelector(
    (state: RootState) => state.ui.selectedFriend
  );
  const didTheBillOfTheSelectedFriendSplitted = useSelector(
    (state: RootState) =>
      state.ui.debtsIOwe.find(debt => debt.personId === selectedFriend?.id)
        ?.hasTheDebtBeenApproved ??
      state.ui.debtsOwedToMe.find(debt => debt.personId === selectedFriend?.id)
        ?.hasTheDebtBeenApproved ??
      false
  );
  return selectedFriend ? (
    <Card>
      <h2 className='text-lg font-bold tracking-wider uppercase'>
        Split a bill with {selectedFriend.name}
      </h2>
      <BillSplittingForm
        friendId={selectedFriend.id}
        friendName={selectedFriend.name}
        didTheBillSplitted={didTheBillOfTheSelectedFriendSplitted}
      />
    </Card>
  ) : null;
}
