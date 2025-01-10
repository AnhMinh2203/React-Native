// Action types (Tách ra thành một file riêng hoặc để nguyên ở đây)
const SET_COMMENTS = 'SET_COMMENTS';
const ADD_COMMENT = 'ADD_COMMENT';
const EDIT_COMMENT = 'EDIT_COMMENT';
const DELETE_COMMENT = 'DELETE_COMMENT';

// Reducer ban đầu
const initialState = {
  comments: [],
};

// Action creators (Chúng ta vẫn giữ nguyên các action creators)
export const setComments = (comments) => ({
  type: SET_COMMENTS,
  payload: comments,
});

export const addComment = (comment) => ({
  type: ADD_COMMENT,
  payload: comment,
});

export const editComment = (comment) => ({
  type: EDIT_COMMENT,
  payload: comment,
});

export const deleteComment = (id) => ({
  type: DELETE_COMMENT,
  payload: id,
});

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_COMMENTS:
      // Cập nhật toàn bộ danh sách bình luận
      return { ...state, comments: action.payload };

    case ADD_COMMENT:
      // Thêm bình luận mới vào danh sách
      return { ...state, comments: [...state.comments, action.payload] };

    case EDIT_COMMENT:
      // Cập nhật bình luận đã có
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };

    case DELETE_COMMENT:
      // Xóa bình luận theo id
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload),
      };

    default:
      return state;
  }
}
