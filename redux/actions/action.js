// actions.js
import { ADD_COMMENT, EDIT_COMMENT, DELETE_COMMENT, SET_COMMENTS } from './actionTypes';

// Action để thêm comment
export const addComment = (comment) => ({
  type: ADD_COMMENT,
  payload: comment,
});

// Action để chỉnh sửa comment
export const editComment = (comment) => ({
  type: EDIT_COMMENT,
  payload: comment,
});

// Action để xoá comment
export const deleteComment = (id) => ({
  type: DELETE_COMMENT,
  payload: id,
});

// Action để set comments từ API
export const setComments = (comments) => ({
  type: SET_COMMENTS,
  payload: comments,
});
