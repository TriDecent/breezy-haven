import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit/react';
import { v4 } from 'uuid';

export interface Friend {
  readonly id: string;
  readonly name: string;
  readonly imgSrc: string;
}

type FriendInput = Omit<Friend, 'id'>;

const key = 'friend';

const friendSlice = createSlice({
  name: 'friend',
  initialState: getFriendsFromStorage(key) ?? [],
  reducers: {
    addFriend: (state, action: PayloadAction<FriendInput>) => {
      state.push({ id: v4(), ...action.payload });
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.filter(friend => friend.id !== action.payload);
    },
  },
});

function getFriendsFromStorage(key: string): readonly Friend[] | null {
  const jsonFriends = localStorage.getItem(key);
  if (!jsonFriends) return null;

  return JSON.parse(jsonFriends) as readonly Friend[];
}

export default friendSlice;
