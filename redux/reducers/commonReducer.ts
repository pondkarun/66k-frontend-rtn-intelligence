const INIT_STATE = {
  collapsed: false,
  action: ''
}

type CommonT = { type: string; payload: any }

const commonReducer = (state = INIT_STATE, action: CommonT) => {
  switch (action.type) {
    case 'IS_COLLAPSED':
      return {
        ...state,
        collapsed: action.payload,
      }

    case 'ACTION_TYPE':
      return {
        ...state,
        action: action.payload,
      }

    default:
      return {
        ...state,
      }
  }
}

export default commonReducer
