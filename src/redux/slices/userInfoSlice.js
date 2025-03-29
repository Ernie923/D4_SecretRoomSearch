import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseApi = import.meta.env.VITE_BASE_URL;

const initialState = {
    user_token: localStorage.getItem("user_token") || null,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    isLoading: false,
    resErrMessage: null,
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        logOut: (state) => {
            localStorage.removeItem("user_token");
            localStorage.removeItem("user");
            state.user_token = null;
            state.user = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfoAsyncThunk.pending, (state) => {
                state.isLoading = true;
                state.resErrMessage = '';
            })
            .addCase(getUserInfoAsyncThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user_token = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(getUserInfoAsyncThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.resErrMessage = action.payload;
            });
    },

});

// createAsyncThunk(自定義名稱(通常:'slice中的Name/function 名稱), 非同步函式(值, 參數))

// 登入驗證存localstorge跟state
export const getUserInfoAsyncThunk = createAsyncThunk(
    'userInfo/getUserInfoAsyncThunk',
    // params 中包含 dispatch 等方法
    async (account, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${baseApi}/login`, account);
            const { accessToken, user } = res.data;

            localStorage.setItem("user_token", accessToken);
            localStorage.setItem("user", JSON.stringify(user));

            return { accessToken, user };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const { logOut, updateUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;