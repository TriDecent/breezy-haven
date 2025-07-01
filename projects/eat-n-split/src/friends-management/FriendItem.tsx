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
  const { selectedFriend, debtsIOwe, debtsOwedToMe, didTheBillSplitted } =
    useSelector(
      (state: RootState) => ({
        selectedFriend: state.ui.selectedFriend,
        debtsIOwe: state.ui.debtsIOwe,
        debtsOwedToMe: state.ui.debtsOwedToMe,
        didTheBillSplitted: state.ui.didTheBillSplitted,
      }),
      shallowEqual
    );
  const doesThisPersonOweMe = debtsOwedToMe > 0;
  const doesIOweThisPerson = debtsIOwe > 0;

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
          {didTheBillSplitted && friend.id === selectedFriend?.id ? (
            <span
              className={
                doesThisPersonOweMe
                  ? 'text-green-500'
                  : doesIOweThisPerson
                    ? 'text-red-500'
                    : undefined
              }
            >
              {doesThisPersonOweMe
                ? `${friend.name} owes me $${debtsOwedToMe.toString()}`
                : doesIOweThisPerson
                  ? `I owe ${friend.name} ${debtsIOwe.toString()}`
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
