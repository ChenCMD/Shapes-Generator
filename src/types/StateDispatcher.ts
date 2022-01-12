import type { Dispatch, SetStateAction } from 'react';

export type StateDispatcher<S> = Dispatch<SetStateAction<S>>;