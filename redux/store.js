// store.js
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'; // Import Provider từ react-redux
import commentReducer from '../redux/reducers/reducer';

const store = configureStore({
  reducer: {
    comments: commentReducer,  // Đảm bảo reducer của bạn được cấu hình đúng
  },
});

export const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
