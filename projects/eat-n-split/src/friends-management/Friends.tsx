import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, PrimaryButton, type RootState } from '../shared';
import AddingFriendForm from './AddingFriendForm';
import FriendItem from './FriendItem';

export default function Friends() {
  const friends = useSelector((state: RootState) => state.friend);
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  return (
    <>
      {friends.length === 0 && !isAddingFriend ? (
        <NoFriendState
          toggleAddFriendForm={() => {
            setIsAddingFriend(true);
          }}
        />
      ) : null}
      {isAddingFriend ? (
        <AddingFriendForm
          toggleAddFriendForm={() => {
            setIsAddingFriend(true);
          }}
        />
      ) : null}
      {friends.length > 0
        ? friends.map((friend, index) => (
            <FriendItem friend={friend} shouldApplyColor={isOdd(index)} />
          ))
        : null}
    </>
  );
}

function isOdd(number: number) {
  return number % 2 !== 0;
}

function NoFriendState({
  toggleAddFriendForm,
}: {
  toggleAddFriendForm: () => void;
}) {
  return (
    <Card>
      <article className='flex flex-col items-center gap-4'>
        <p className='flex flex-col items-center'>
          <span>
            f Look like you have{' '}
            <span className='font-semibold tracking-wider text-red-500 text-shadow-lg text-shadow-red-300'>
              no friends
            </span>
          </span>{' '}
          <span className='animate-bounce font-bold text-amber-600'>
            (┬┬﹏┬┬)
          </span>
        </p>
        <PrimaryButton onClick={toggleAddFriendForm}>Add friend</PrimaryButton>
      </article>
    </Card>
  );
}
