import {
  MODAL_OPEN,
  MODAL_CLOSE
} from './types';

const initialState = {
  modalOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MODAL_OPEN:
      return {
        ...state,
        modalOpen: true
      };
    case MODAL_CLOSE:
      return {
        ...state,
        modalOpen: false
      };
  }

  return state;
}