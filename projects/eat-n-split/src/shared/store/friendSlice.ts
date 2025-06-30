import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit/react';
import { v4 } from 'uuid';
import { z } from 'zod';

export const friendSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  imgSrc: z.string().url({ message: 'URL is not valid' }),
});
export type Friend = Readonly<{ id: string } & z.infer<typeof friendSchema>>;

type FriendInput = Omit<Friend, 'id'>;

const key = 'friend';

const friendSlice = createSlice({
  name: 'friend',
  initialState: getFriendsFromStorage(key) ?? [],
  reducers: {
    addFriend: (state, action: PayloadAction<FriendInput>) => {
      state.push({ id: v4(), ...action.payload });
      saveFriendsToStorage(key, state);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.filter(friend => friend.id !== action.payload);
      saveFriendsToStorage(key, state);
    },
  },
});

function saveFriendsToStorage(key: string, friends: readonly Friend[]): void {
  localStorage.setItem(key, JSON.stringify(friends));
}

function getFriendsFromStorage(key: string): readonly Friend[] | null {
  const jsonFriends = localStorage.getItem(key);
  if (!jsonFriends) return null;

  return JSON.parse(jsonFriends) as readonly Friend[];
}

export const friendActions = friendSlice.actions;
export default friendSlice;
