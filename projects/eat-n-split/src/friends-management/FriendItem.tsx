import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  friendActions,
  PrimaryButton,
  uiActions,
  type FriendType,
  type RootState,
} from '../shared';

export default function FriendItem({
  friend,
  shouldApplyColor,
}: {
  friend: FriendType;
  shouldApplyColor: boolean;
}) {
  const {
    selectedFriend,
    debtIOweThisFriend,
    debtThisFriendOwedToMe,
    hasThisFriendDebtApproved,
  } = useSelector(
    (state: RootState) => ({
      selectedFriend: state.ui.selectedFriend,
      debtIOweThisFriend: state.ui.debtsIOwe.find(
        debt => debt.personId === friend.id
      ),
      debtThisFriendOwedToMe: state.ui.debtsOwedToMe.find(
        debt => debt.personId === friend.id
      ),
      hasThisFriendDebtApproved:
        state.ui.debtsIOwe.find(debt => debt.personId === friend.id)
          ?.hasTheDebtBeenApproved ??
        state.ui.debtsOwedToMe.find(debt => debt.personId === friend.id)
          ?.hasTheDebtBeenApproved ??
        false,
    }),
    shallowEqual
  );
  const doesThisFriendOweMe =
    (debtThisFriendOwedToMe?.amount ?? 0) > 0 &&
    debtThisFriendOwedToMe?.hasTheDebtBeenApproved;
  const doIOweThisFriend =
    (debtIOweThisFriend?.amount ?? 0) > 0 &&
    debtIOweThisFriend?.hasTheDebtBeenApproved;

  const isThisSelectedFriend = selectedFriend?.id === friend.id;
  const dispatch = useDispatch();

  return (
    <article
      className={`flex items-center justify-between rounded-lg p-2 ${shouldApplyColor ? 'bg-amber-100/70' : ''}`}
    >
      <div className='flex items-center'>
        <img
          src={friend.imgSrc}
          alt='a person avatar'
          loading='lazy'
          className='w-16 rounded-full object-center'
        />
        <p className='ml-2 flex flex-col'>
          <span className='text-lg font-bold tracking-wide'>{friend.name}</span>
          {hasThisFriendDebtApproved && (doesThisFriendOweMe || doIOweThisFriend) ? (
            <span
              className={
                doesThisFriendOweMe
                  ? 'text-green-500'
                  : doIOweThisFriend
                    ? 'text-red-500'
                    : undefined
              }
            >
              {doesThisFriendOweMe
                ? `${friend.name} owes me $${debtThisFriendOwedToMe.amount.toString()}`
                : doIOweThisFriend
                  ? `I owe ${friend.name} $${debtIOweThisFriend.amount.toString()}`
                  : 'You two split the bill evenly'}
            </span>
          ) : null}
        </p>
      </div>
      <PrimaryButton
        onClick={() => {
          if (isThisSelectedFriend) {
            dispatch(uiActions.setSelectedFriend(null));
            dispatch(friendActions.removeFriend(friend.id));
            return;
          }
          dispatch(uiActions.setSelectedFriend(friend));
        }}
      >
        {!isThisSelectedFriend ? 'Select' : 'Close'}
      </PrimaryButton>
    </article>
  );
}
