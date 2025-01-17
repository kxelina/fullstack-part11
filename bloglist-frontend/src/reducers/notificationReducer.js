import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  type: ''
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    Set_notification(state, action) {
      const { message, type } = action.payload
      return { message, type }
    },
    Clear_notification() {
      return { message: '', type: '' }
    }
  }
})

export const { Set_notification, Clear_notification } = notificationSlice.actions
export const setNotification = (message, type, time) => {
  return dispatch => {
    dispatch(Set_notification({ message, type }))
    setTimeout(() =>
      dispatch(Clear_notification()), time*1000
    )
  }
}
export default notificationSlice.reducer