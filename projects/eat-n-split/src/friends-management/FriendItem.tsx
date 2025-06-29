import { PrimaryButton, type FriendType } from '../shared';

export default function FriendItem({
  friend,
  shouldApplyColor,
}: {
  friend: FriendType;
  shouldApplyColor: boolean;
}) {
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
      <PrimaryButton>Select</PrimaryButton>
    </article>
  );
}
