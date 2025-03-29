export const initialState = {
    order: "order_price",
    game_name: "",
    area: [],
    game_people: "",
    difficulty: [],
    property: [],
};

export const ACTIONS = {
    SET_FIELD: "SET_FIELD",
    TOGGLE_ARRAY_FIELD: "TOGGLE_ARRAY_FIELD",
    RESET: "RESET",
};

export const searchReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_FIELD:
            return {
                ...state,
                [action.field]: action.value,
            };
        case ACTIONS.TOGGLE_ARRAY_FIELD: {
            // 切換陣列欄位中的值（添加或刪除）
            // 宣告變數須加上大括號
            const fieldArray = state[action.field];
            const value = action.value;
            const exists = fieldArray.includes(value);

            return {
                ...state,
                [action.field]: exists
                    ? fieldArray.filter((item) => item !== value)
                    : [...fieldArray, value],
            };
        }
        case ACTIONS.RESET:
            return initialState;
        default:
            return state;
    }
};
