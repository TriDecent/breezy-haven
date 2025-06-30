import { useDispatch, useSelector } from 'react-redux';
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
  const selectedFriend = useSelector(
    (state: RootState) => state.ui.selectedFriend
  );
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
          {/* <span className='text-red-500'>Clare owes you $999</span> */}
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
