import axios from "axios";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
const baseApi = import.meta.env.VITE_BASE_URL;
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { RiPlayListAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import Toast from "../layout/Toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pushMessage } from "../redux/slices/toastSlice";
import PropTypes from "prop-types";


const emptyGames = {
    "store_id": 0,
    "game_name": "",
    "game_address": "",
    "game_tel": "",
    "game_time": 0,
    "property": [],
    "game_minNum_Players": 0,
    "game_maxNum_Players": 0,
    "game_dif_tag": "",
    "game_main_tag1": 0,
    "game_main_tag2": 0,
    "game_score": 5,
    "game_img": "",
    "game_isLimited": "",
    "game_start_date": null,
    "game_end_date": null,
    "game_info": "",
    "game_remark": "",
    "game_score_num": 0,
    "game_isStock": false,
    "game_website": ""
};

const emptyPrices = {
    game_id: 0,
    price_is_difference: "",  // 是否平假日不同 ('0' 相同, '1' 不同)
    price_people: "",         // 計價方式 ('/場', '/人', 'x-x人')

    // 場次收費
    single_price: "",
    weekday_price: "",
    weekend_price: "",

    // 人頭計價
    unit_person_price: "",
    unit_weekday_price: "",
    unit_weekend_price: "",

    // 人數區間計價
    prices: {
        unit: [{ min: "", max: "", price_mix: "" }],
        weekday: [{ min: "", max: "", price_mix: "" }],
        weekend: [{ min: "", max: "", price_mix: "" }]
    }
};

function AddGames() {
    // 基本資料
    const { game_id } = useParams(); // 用於呈現資料時
    const { user } = useSelector((state) => state.userInfo); // 取出user資料來帶出相關的store的資料
    const user_id = user.user_id; //取出user_id
    const [isSend, setIsSend] = useState(false);
    const [addOrEdit, setAddOrEdit] = useState("add");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // 換頁
    const dispatch = useDispatch();
    // 欄位基本資料
    const [difficultys, setDifficultys] = useState([]); //取出全部的難度資料
    const [propertys, setPropertys] = useState([]); // 取出全部的種類資料
    const [store, setStore] = useState({}); // 取出店家的資訊

    // 表單
    const [gameFormData, setGameFormData] = useState(emptyGames);
    const [newGame, setNewGame] = useState({});
    const [priceFormData, setPriceFormData] = useState(emptyPrices);
    const [isLoading, setIsLoading] = useState(true);

    const { register, handleSubmit, formState: { errors, dirtyFields }, setError, setValue, reset, control, trigger, clearErrors, watch, getValues, } = useForm({
        defaultValues: {
            gameFormData,
            priceFormData
        }
    });

    // 人數區間，不分平假日
    const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
        control,
        name: "priceFormData.prices.unit",
    });

    //人數區間，平日
    const { fields: weekdayFields, append: appendWeekday, remove: removeWeekday } = useFieldArray({
        control,
        name: "priceFormData.prices.weekday",
    });

    // 人數區間，假日
    const { fields: weekendFields, append: appendWeekend, remove: removeWeekend } = useFieldArray({
        control,
        name: "priceFormData.prices.weekend",
    });

    // 修改種類欄位的 onChange，除了更新 state，也呼叫 setValue 更新 react-hook-form 的值
    const handlEInputChange = (e) => {
        const { value } = e.target;
        const valueAsNumber = Number(value); // 將 value 轉換為數字

        // 更新選擇的項目
        const updatedProperties = gameFormData.property.includes(valueAsNumber)
            ? gameFormData.property.filter((item) => item !== valueAsNumber) // 如果已經選擇，就移除
            : [...gameFormData.property, valueAsNumber]; // 如果沒選擇，就加入

        // 更新 state
        setGameFormData((prev) => ({
            ...prev,
            property: updatedProperties,
        }));
        // 同步更新 react-hook-form 的值
        setValue("gameFormData.property", updatedProperties, { shouldValidate: true });

        // 根據種類規則，至少選擇兩個種類才算正確
        if (updatedProperties.length < 2) {
            setError("gameFormData.property", {
                type: "manual",
                message: "請選兩個種類"
            });
        } else {
            clearErrors("gameFormData.property");
        }
    };

    // 使用 forwardRef 包裝 CustomDateInput > 自定義日期樣式
    const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
        <div className="d-flex align-items-center position-relative">
            <input
                type="text"
                value={value}
                onClick={onClick}
                readOnly
                className="form-control pe-6 w-100"
                placeholder="YY/MM/DD" // 設置占位符
                ref={ref} // 傳遞 ref 給 input
            />
            <MdOutlineCalendarMonth
                className="position-absolute"
                onClick={onClick}
                size={20}
                color="black"
                style={{
                    right: "10px",
                    cursor: "pointer"
                }}
            />
        </div>
    ));

    CustomDateInput.propTypes = {
        value: PropTypes.string.isRequired, // 確保 value 是字串
        onClick: PropTypes.func.isRequired, // 確保 onClick 是函式
    };

    CustomDateInput.displayName = "CustomDateInput"; // 修正 display name 錯誤

    // 格式化日期
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // `getMonth()` 返回 0-11，所以需要加1
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // 回傳格式：yyyy-MM-dd
    };

    // 處理日期
    const handleDateChange = (date, field) => {
        const formattedDate = formatDate(date);
        setGameFormData(prev => ({
            ...prev,
            [field]: formattedDate
        }));
        setValue(`gameFormData.${field}`, formattedDate, { shouldValidate: true }); // 更新 useForm 的值
    };

    // 驗證日期的函式
    const isDateValid = () => {
        const isLimited = watch("gameFormData.game_isLimited");
        if (isLimited === null) {
            setError("gameFormData.game_end_date", {
                type: "manual",
                message: "尚未選擇開放模式"
            });
            return false;
        }
        else if (isLimited === '1') {
            if (!gameFormData.game_start_date && !gameFormData.game_end_date) {
                setError("gameFormData.game_end_date", {
                    type: "manual",
                    message: "請輸入完整開放日期"
                });
                return false;
            }
            else if (gameFormData.game_start_date && !gameFormData.game_end_date) {
                setError("gameFormData.game_end_date", {
                    type: "manual",
                    message: "請輸入結束日期"
                });
                return false;
            }
            else if (!gameFormData.game_start_date && gameFormData.game_end_date) {
                setError("gameFormData.game_end_date", {
                    type: "manual",
                    message: "請輸入開始日期"
                });
                return false;
            }
            else if (gameFormData.game_start_date && gameFormData.game_end_date) {
                if (new Date(gameFormData.game_end_date) < new Date(gameFormData.game_start_date)) {
                    setError("gameFormData.game_end_date", {
                        type: "manual",
                        message: "結束日期不可早於開放日期"
                    });
                    return false;
                }
                clearErrors("gameFormData.game_end_date");
            }
        }
        else if (isLimited === '0') {
            if (!gameFormData.game_start_date) {
                setError("gameFormData.game_end_date", {
                    type: "manual",
                    message: "請輸入開放日期"
                });
                return false;
            }
            else if (gameFormData.game_start_date && !gameFormData.game_end_date) {
                clearErrors("gameFormData.game_end_date");
            }
            else if (gameFormData.game_start_date && gameFormData.game_end_date) {
                if (new Date(gameFormData.game_end_date) < new Date(gameFormData.game_start_date)) {
                    setError("gameFormData.game_end_date", {
                        type: "manual",
                        message: "結束日期不可早於開放日期"
                    });
                    return false;
                }
                clearErrors("gameFormData.game_end_date");
            }
        }
        return true;
    };

    // 使用 useRef 儲存初始的日期與種類
    const initialValuesRef = useRef({
        game_start_date: gameFormData.game_start_date,
        game_end_date: gameFormData.game_end_date,
        property: gameFormData.property, // 假設這是一個陣列
    });

    // 表單驗證
    const onSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        setIsSend(true);
        const results = await trigger();
        // 驗證「種類」欄位（非 React Hook Form 驗證）
        const isPropertyValid = gameFormData.property.length >= 2;
        if (!isPropertyValid) {
            setError("gameFormData.property", {
                type: "manual",
                message: "請選擇至少兩個種類",
            });
        } else {
            clearErrors("property");
        }

        const isDateOk = isDateValid();

        // 綜合驗證結果
        const isFormValid = results && isPropertyValid && isDateOk;

        if (!isFormValid) {
            return;
        }

        // 表單驗證通過，提交資料
        handleSubmit((data) => {
            priceInput(data);
        })();
    };

    // 處理價格表的資料
    const priceInput = (data) => {
        const { priceFormData } = data;
        const finalRecords = [];
        const gameId = 1; // 先設為1 再拿新增後的ID
        let priceCount = 1;
        if (priceFormData.price_people === "/場") {
            if (priceFormData.price_is_difference === "1") {
                // 平假日不同 → 兩筆資料
                finalRecords.push({
                    game_id: gameId,
                    price_is_difference: 1,
                    price_count: priceCount++,
                    price_day_type: "weekday",
                    price_mix: Number(priceFormData.weekday_price),
                    price_people: "/場"
                });
                finalRecords.push({
                    game_id: gameId,
                    price_is_difference: 1,
                    price_count: priceCount++,
                    price_day_type: "weekend",
                    price_mix: Number(priceFormData.weekend_price),
                    price_people: "/場"
                });
            } else {
                // 平假日相同 → 一筆資料
                finalRecords.push({
                    game_id: gameId,
                    price_is_difference: 0,
                    price_count: priceCount++,
                    price_day_type: "",
                    price_mix: Number(priceFormData.single_price),
                    price_people: "/場"
                });
            }
        }
        else if (priceFormData.price_people === "/人") {
            if (priceFormData.price_is_difference === "1") {
                // 平假日不同 → 兩筆資料
                finalRecords.push({
                    game_id: gameId,
                    price_is_difference: 1,
                    price_count: priceCount++,
                    price_day_type: "weekday",
                    price_mix: Number(priceFormData.unit_weekday_price),
                    price_people: "/人"
                });
                finalRecords.push({
                    game_id: gameId,
                    price_is_difference: 1,
                    price_count: priceCount++,
                    price_day_type: "weekend",
                    price_mix: Number(priceFormData.unit_weekend_price),
                    price_people: "/人"
                });
            } else {
                // 平假日相同 → 一筆資料
                finalRecords.push({
                    game_id: gameId,
                    price_is_difference: 0,
                    price_count: priceCount++,
                    price_day_type: "",
                    price_mix: Number(priceFormData.unit_person_price),
                    price_people: "/人"
                });
            }
        }
        else if (priceFormData.price_people === "x-x人") {
            // 平假日不同 → 兩筆資料
            if (priceFormData.price_is_difference === "1") {
                // 平日
                priceFormData.prices.weekday.forEach((item) => {
                    // 組合區間字串（最終存入 price_people 欄位）
                    const range = `${item.min}-${item.max}人`;
                    finalRecords.push({
                        game_id: gameId,
                        price_is_difference: 1,
                        price_count: priceCount++,
                        price_day_type: "weekday",
                        price_mix: Number(item.price_mix),
                        price_people: range
                    });
                });
                // 假日
                priceFormData.prices.weekend.forEach((item) => {
                    // 組合區間字串（最終存入 price_people 欄位）
                    const range = `${item.min}-${item.max}人`;
                    finalRecords.push({
                        game_id: gameId,
                        price_is_difference: 1,
                        price_count: priceCount++,
                        price_day_type: "weekend",
                        price_mix: Number(item.price_mix),
                        price_people: range
                    });
                });

            } else {
                // 平假日相同 → 一筆資料
                priceFormData.prices.unit.forEach((item) => {
                    // 組合區間字串（最終存入 price_people 欄位）
                    const range = `${item.min}-${item.max}人`;
                    finalRecords.push({
                        game_id: gameId,
                        price_is_difference: 1,
                        price_count: priceCount++,
                        price_day_type: "",
                        price_mix: Number(item.price_mix),
                        price_people: range
                    });
                });
            }
        }

        const { gameFormData } = data;

        const newGame = {
            ...gameFormData,
            store_id: store.store_id,
            game_dif_tag: Number(gameFormData.game_dif_tag),
            game_main_tag1: gameFormData.property?.[0] || 0,
            game_main_tag2: gameFormData.property?.[1] || 0,
            game_img: [gameFormData.game_img],
            game_maxNum_Players: Number(gameFormData.game_maxNum_Players),
            game_minNum_Players: Number(gameFormData.game_minNum_Players),
            game_time: Number(gameFormData.game_time),

        };

        CompareData(newGame, finalRecords)
    };

    // 判斷編輯或新增並處理相關資料
    const CompareData = async (games, prices) => {
        let changedGamesData = {};
        if (addOrEdit === 'edit') {
            // 手動比對日期
            const currentStartDate = games.game_start_date;
            const currentEndDate = games.game_end_date;
            const initialStartDate = initialValuesRef.current.game_start_date;
            const initialEndDate = initialValuesRef.current.game_end_date;
            const isDateDirty = currentStartDate !== initialStartDate || currentEndDate !== initialEndDate;

            // 手動比對種類（假設種類儲存在 games.property）
            const currentProperty = games.property; // 例如一個陣列
            const initialProperty = initialValuesRef.current.property;
            const isPropertyDirty = JSON.stringify(currentProperty) !== JSON.stringify(initialProperty);

            if (Object.keys(dirtyFields).length > 0 || isDateDirty || isPropertyDirty) {
                if ((dirtyFields.gameFormData && Object.keys(dirtyFields.gameFormData).length > 0) || isDateDirty || isPropertyDirty) {
                    Object.keys(dirtyFields.gameFormData || {}).forEach((key) => {
                        changedGamesData[key] = games[key];
                    });

                    if (isDateDirty) {
                        changedGamesData.game_start_date = games.game_start_date;
                        changedGamesData.game_end_date = games.game_end_date;
                    }
                    if (isPropertyDirty) {
                        changedGamesData.game_main_tag1 = games.property[0];
                        changedGamesData.game_main_tag2 = games.property[1];
                    }
                    updateGames(changedGamesData)
                }

                if (dirtyFields.priceFormData && Object.keys(dirtyFields.priceFormData).length > 0) {
                    await deldetePrice();
                    for (const price of prices) {
                        let addGameID = {
                            ...price,
                            game_id: Number(game_id)
                        };
                        updatePrices(addGameID);
                    }
                    dispatch(pushMessage({
                        text: "更新價格資訊成功",
                        status: 'success'
                    }));
                    setIsLoading(false);
                }
            } else {
                dispatch(pushMessage({
                    text: "沒有資料更動!",
                    status: 'error'
                }));
            }
            delete games.property;
        }
        else if (addOrEdit === 'add') {
            delete games.property;
            addGamePrice(games, prices)
        }

    };

    //新增遊戲、價格資料 - axios
    const addGamePrice = async (games, prices) => {
        // 先新增遊戲取得ID
        let game_id = 0;
        try {
            const res = await axios.post(`${baseApi}/gamesData`, games);
            game_id = res.data.data.game_id;
        } catch (error) {
            dispatch(pushMessage({
                text: error,
                status: 'error'
            }));
            return; // 若遊戲新增失敗，直接返回
        }

        for (const price of prices) {
            let addGameID = {
                ...price,
                game_id: game_id
            };
            try {
                await axios.post(`${baseApi}/pricesData`, addGameID);
            } catch (error) {
                dispatch(pushMessage({
                    text: error,
                    status: 'error'
                }));
            }
        }
        dispatch(pushMessage({
            text: "新增成功，回到列表頁",
            status: 'success'
        }));
        setIsLoading(false);
        setTimeout(() => {
            navigate(`/Store_profile/${user_id}/myGames`);
        }, 3000);

    };

    //編輯遊戲資料 - axios
    const updateGames = async (updateGame) => {
        try {
            await axios.patch(`${baseApi}/gamesData/${game_id}`, updateGame);
            dispatch(pushMessage({
                text: "編輯遊戲資訊成功",
                status: 'success'
            }));
            setIsLoading(false);
        } catch (error) {
            dispatch(pushMessage({
                text: error,
                status: 'error'
            }));
        }
    };

    // 刪除遊戲的價格表全資料
    const deldetePrice = async () => {
        let idArray = [];
        try {
            const res = await axios.get(`${baseApi}/gamesData/${game_id}/pricesData`);
            idArray = res.data.map(item => item.price_id);
        } catch (error) {
            console.error(error);
        }
        for (const price_id of idArray) {
            try {
                await axios.delete(`${baseApi}/pricesData/${price_id}`);
            } catch (error) {
                dispatch(pushMessage({
                    text: error,
                    status: 'error'
                }));
            }
        }

    };

    //編輯價格資料 - axios
    const updatePrices = async (updatePrice) => {
        try {
            await axios.post(`${baseApi}/pricesData`, updatePrice);
        } catch (error) {
            dispatch(pushMessage({
                text: error,
                status: 'error'
            }));
        }
    };

    // 取到遊戲相關資料
    const getStoreGameInfo = async () => {
        const store_id = store.store_id;
        try {
            const res = await axios.get(`${baseApi}/storesData/${store_id}/gamesData`);
            const allGamesInfo = res.data.find(item => Number(game_id) === Number(item.game_id));
            if (allGamesInfo === undefined) {
                setErrorMessage("這個遊戲ID非您的資料");
                return;
            }
            setStore(prev => ({
                ...prev,
                "store_name": allGamesInfo.store_name
            }));
            setNewGame(prev => ({
                ...prev,
                games: {
                    "store_id": allGamesInfo.store_id,
                    "game_name": allGamesInfo.game_name,
                    "game_address": allGamesInfo.game_address,
                    "game_tel": allGamesInfo.game_tel,
                    "game_time": allGamesInfo.game_time,
                    "property": [allGamesInfo.game_main_tag1, allGamesInfo.game_main_tag2],
                    "game_minNum_Players": allGamesInfo.game_minNum_Players,
                    "game_maxNum_Players": allGamesInfo.game_maxNum_Players,
                    "game_dif_tag": String(allGamesInfo.game_dif_tag),
                    "game_score": allGamesInfo.game_score,
                    "game_img": allGamesInfo.game_img,
                    "game_isLimited": String(allGamesInfo.game_isLimited),
                    "game_start_date": String(allGamesInfo.game_start_date),
                    "game_end_date": allGamesInfo.game_end_date,
                    "game_info": allGamesInfo.game_info,
                    "game_remark": allGamesInfo.game_remark,
                    "game_score_num": allGamesInfo.game_score_num,
                    "game_isStock": allGamesInfo.game_isStock,
                    "game_website": allGamesInfo.game_website
                }
            }));
            getStoreGamePriceInfo();
        } catch (error) {
            console.error(error);
        }
    }

    // 取到遊戲價格表相關資料
    const getStoreGamePriceInfo = async () => {
        try {
            const res = await axios.get(`${baseApi}/gamesData/${game_id}/pricesData`);
            const allPricesInfo = res.data;
            handleGetPrices(allPricesInfo);

        } catch (error) {
            console.error(error);
        }
    }

    // 取出的價格表轉換為表單格式
    const handleGetPrices = (data) => {
        const deepCopy = {
            ...emptyPrices,
            prices: {
                unit: [...emptyPrices.prices.unit.map(obj => ({ ...obj }))],
                weekday: [...emptyPrices.prices.weekday.map(obj => ({ ...obj }))],
                weekend: [...emptyPrices.prices.weekend.map(obj => ({ ...obj }))]
            }
        };
        const gamePrices = data.reduce((acc, item) => {
            if (acc.game_id !== 0) { //確認game_id是否有被取出
                acc.game_id = item.game_id;
            }
            if (!acc.price_is_difference) { // 確認平假日相符是否被取出
                acc.price_is_difference = String(item.price_is_difference);
            }
            if (!acc.price_people) { // 確認收費方式
                if (item.price_people === '/場' || item.price_people === '/人') {
                    acc.price_people = item.price_people;
                }
                else {
                    acc.price_people = 'x-x人';
                    if (acc.price_is_difference === "0") {
                        acc.prices.unit.pop();
                    }
                    else if (acc.price_is_difference === "1") {
                        acc.prices.weekday.pop();
                        acc.prices.weekend.pop();
                    }
                }
            }

            // 處理 場次的 價格
            if (item.price_people === '/場' && item.price_is_difference === 1) {
                item.price_day_type === "weekday" && (acc.weekday_price = item.price_mix);
                item.price_day_type === "weekend" && (acc.weekend_price = item.price_mix);
            }
            else if (item.price_people === '/場' && item.price_is_difference === 0) {
                acc.single_price = item.price_mix;
            }

            // 處理 人頭計價
            if (item.price_people === '/人' && item.price_is_difference === 1) {
                item.price_day_type === "weekday" && (acc.unit_weekday_price = item.price_mix);
                item.price_day_type === "weekend" && (acc.unit_weekend_price = item.price_mix);
            }
            else if (item.price_people === '/人' && item.price_is_difference === 0) {
                acc.unit_person_price = item.price_mix;
            }

            const priceObj = {
                min: item.price_people.includes('-') ? item.price_people.split("-")[0] || "" : item.price_people.replace(/\D/g, "") || "",
                max: item.price_people.includes('-') ? (item.price_people.split("-")[1] || "").replace(/\D/g, "") : item.price_people.replace(/\D/g, "") || "",
                price_mix: item.price_mix
            };

            // 處理人數區間
            if ((item.price_people !== '/人' && item.price_people !== '/場') && item.price_is_difference === 1) {
                item.price_day_type === "weekday"
                    ? acc.prices.weekday.push(priceObj)
                    : item.price_day_type === "weekend" && acc.prices.weekend.push(priceObj);
            }
            else if ((item.price_people !== '/人' && item.price_people !== '/場') && item.price_is_difference === 0) {
                acc.prices.unit.push(priceObj);
            }

            return acc;
        }, { ...deepCopy });

        setNewGame((prev) => ({
            ...prev,
            prices: gamePrices,
        }));
    };

    useEffect(() => {
        if (Object.keys(newGame).length > 0 && newGame.prices !== undefined) {
            initialValuesRef.current = {
                game_start_date: newGame.games.game_start_date,
                game_end_date: newGame.games.game_end_date,
                property: newGame.games.property,
            };
            reset({
                gameFormData: newGame.games,
                priceFormData: newGame.prices
            });
            setGameFormData(newGame.games);
            setPriceFormData(newGame.prices);
        }
    }, [newGame]);

    // 確保送出後的錯誤訊息可以跟著選擇的內容作判斷
    useEffect(() => {
        if (isSend) {
            isDateValid();
        }
    }, [gameFormData?.game_end_date, gameFormData?.game_start_date, watch("gameFormData?.game_isLimited")])

    // 確保換ID時，有重新載入
    useEffect(() => {
        if (game_id === "AddGames" && !isLoading) {
            setErrorMessage("");
            setAddOrEdit("add");
            setNewGame({
                games: emptyGames,
                prices: emptyPrices
            });
        }
        else if (!isLoading) {
            setErrorMessage("");
            setAddOrEdit("edit");
            getStoreGameInfo();
        }
    }, [game_id, isLoading]);

    const getBaseInfo = async () => {
        try {
            // 同時發送三個 axios 請求
            const [difficultysRes, propertysRes, storeRes] = await Promise.all([
                axios.get(`${baseApi}/difficultys_fixed_Data`),
                axios.get(`${baseApi}/propertys_fixed_Data`),
                axios.get(`${baseApi}/usersData/${user_id}/storesData`),
            ]);
            setDifficultys(difficultysRes.data);
            setPropertys(propertysRes.data);
            setStore(storeRes.data[0]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0); // 回到頁面頂部
        getBaseInfo();
    }, []);

    // 確保基本資料載入完成
    useEffect(() => {
        if (Object.keys(propertys).length > 0 && Object.keys(difficultys).length > 0 && Object.keys(store).length > 0) {
            setIsLoading(false);
        }
    }, [propertys, difficultys, store]);

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center flex-column"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    zIndex: 999,
                }}
            >
                <p>
                    載入/更新中...
                    <br />
                </p>
                <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
            </div>
        );
    }

    return (
        <>
            <div className="bg-secondary-99">
                <div className="container-lg">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10 m-0 p-0">
                            <div className="my-lg-10 my-0 border border-nature-90 border-1 bg-white p-0 rounded-2 ">
                                {
                                    errorMessage === '這個遊戲ID非您的資料' ? (
                                        <div className="bg-secondary-95 py-3 px-6 rounded-top-3 fw-bold fs-h6 text-secondary-50 text-center">
                                            {errorMessage}
                                            <p>
                                                <Link to={`/Store_profile/${user_id}/myGames`} className="btn bg-nature-60 text-white mt-3">返回列表</Link>
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => onSubmit(e)}>
                                            {/* 店家資訊 */}
                                            <div className="store mb-6">
                                                <p className="bg-secondary-95 py-3 px-6 rounded-top-3 fw-bold fs-h6 text-secondary-50 mb-6">
                                                    店家資訊
                                                </p>
                                                <div className="px-6">
                                                    <div className="border border-1 border-nature-90 rounded-3 p-6">
                                                        {/* 店家名稱 */}
                                                        <div className="row">
                                                            <label htmlFor="store_name" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">店家名稱</label>
                                                            <div className="col-sm-10">
                                                                <input
                                                                    type="text"
                                                                    className={`form-control border-black `}
                                                                    id="store_name"
                                                                    name="store_name"
                                                                    value={store?.store_name || ""}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 遊戲資訊 */}
                                            <div className="game mb-6">
                                                <p className="bg-secondary-95 py-3 px-6 rounded-top-3 fw-bold fs-h6 text-secondary-50 mb-6">
                                                    密室資訊
                                                </p>
                                                <div className="px-6">
                                                    {/* 基本資訊 */}
                                                    <div className="border border-1 border-nature-90 rounded-3 mb-4">
                                                        <p className="bg-secondary-99 py-3 px-6 fw-bold fs-h6 rounded-top-3">
                                                            基本資訊
                                                        </p>
                                                        <div className="p-6">
                                                            {/* 密室名稱 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_name" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">密室名稱</label>
                                                                <div className="col-sm-10">
                                                                    <input
                                                                        defaultValue={gameFormData?.game_name}
                                                                        {...register("gameFormData.game_name", {
                                                                            required: "遊戲名稱是必填的",
                                                                            onChange: async () => {
                                                                                await trigger("gameFormData.game_name");
                                                                            }
                                                                        })}
                                                                        type="text"
                                                                        className={`form-control border-black`}
                                                                        id="game_name"
                                                                        name="gameFormData.game_name"
                                                                        placeholder="密室的名稱"
                                                                    />
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_name ? errors?.gameFormData?.game_name.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 密室地址 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_address" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">密室地址</label>
                                                                <div className="col-sm-10">
                                                                    <input
                                                                        defaultValue={gameFormData?.game_address}
                                                                        {...register("gameFormData.game_address", {
                                                                            required: "密室地址是必填的",
                                                                            onChange: async () => {
                                                                                await trigger("gameFormData.game_address");
                                                                            }
                                                                        })}
                                                                        type="text"
                                                                        className={`form-control border-black `}
                                                                        id="game_address"
                                                                        name="gameFormData.game_address"
                                                                        placeholder="密室的地址"
                                                                    />
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_address ? errors?.gameFormData?.game_address.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 聯絡電話 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_tel" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">聯絡電話</label>
                                                                <div className="col-sm-10">
                                                                    <input
                                                                        defaultValue={gameFormData?.game_tel}
                                                                        {...register("gameFormData.game_tel", {
                                                                            required: "聯絡電話是必填的",
                                                                            // pattern: {
                                                                            //     value: /^(0[2-8]-\d{7,8}|09\d{8})$/,
                                                                            //     message: "市話格式為02-12345678手機格式為0912456789"
                                                                            // },
                                                                            onChange: async () => {
                                                                                await trigger("gameFormData.game_tel");
                                                                            }
                                                                        })}
                                                                        type="text"
                                                                        className={`form-control border-black `}
                                                                        id="game_tel"
                                                                        name="gameFormData.game_tel"
                                                                        placeholder="密室的聯絡電話"
                                                                    />
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_tel ? errors?.gameFormData?.game_tel.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 解謎時間 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_time" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">
                                                                    解謎時間
                                                                    <span className="text-nature-50 fs-Caption">
                                                                        <br />
                                                                        請包含前後解說時間
                                                                    </span>
                                                                </label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            defaultValue={gameFormData?.game_time}
                                                                            {...register("gameFormData.game_time", {
                                                                                required: "解謎時間是必填的",
                                                                                validate: value => Number(value) > 0 || "解謎時間必須大於0",
                                                                                onChange: async () => {
                                                                                    await trigger("gameFormData.game_time");
                                                                                }
                                                                            })}
                                                                            type="number"
                                                                            className={`form-control border-black w-25`}
                                                                            id="game_time"
                                                                            name="gameFormData.game_time"
                                                                            placeholder="請包含前後解說時間"
                                                                        />
                                                                        <p className="w-75 ms-2">分鐘</p>
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_time ? errors?.gameFormData?.game_time.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 遊玩人數  */}
                                                            <div className="row mb-5">
                                                                <label htmlFor="game_minNum_Players" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">
                                                                    遊玩人數
                                                                </label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            defaultValue={gameFormData?.game_minNum_Players}
                                                                            {...register("gameFormData.game_minNum_Players", {
                                                                                required: "遊玩最低人數是必填的",
                                                                                validate: value => Number(value) > 0 || "最低人數必須大於0",
                                                                                onChange: async () => {
                                                                                    await trigger("gameFormData.game_minNum_Players");
                                                                                    await trigger("gameFormData.game_maxNum_Players"); // 當最小值改變時，重新驗證最大值
                                                                                }
                                                                            })}
                                                                            type="number"
                                                                            className="form-control border-black w-25"
                                                                            id="game_minNum_Players"
                                                                            name="gameFormData.game_minNum_Players"
                                                                            placeholder="0"
                                                                        />
                                                                        <p className="mx-2">至</p>
                                                                        <input
                                                                            defaultValue={gameFormData?.game_maxNum_Players}
                                                                            {...register("gameFormData.game_maxNum_Players", {
                                                                                required: "遊玩最高人數是必填的",
                                                                                validate: value => {
                                                                                    if (Number(value) <= 0) {
                                                                                        return "最高人數必須大於0";
                                                                                    }
                                                                                    const min = Number(getValues("gameFormData.game_minNum_Players"));
                                                                                    if (Number(value) < min) {
                                                                                        return "最高人數不能低於最低人數";
                                                                                    }
                                                                                    return true;
                                                                                },
                                                                                onChange: async () => {
                                                                                    await trigger("gameFormData.game_maxNum_Players");
                                                                                }
                                                                            })}
                                                                            type="number"
                                                                            className="form-control border-black w-25"
                                                                            id="game_maxNum_Players"
                                                                            name="gameFormData.game_maxNum_Players"
                                                                            placeholder="10"
                                                                        />
                                                                        <p className="mx-2">人</p>
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_minNum_Players && errors?.gameFormData?.game_maxNum_Players ? (
                                                                            <p className="m-0">
                                                                                {errors.gameFormData.game_minNum_Players.message}、{errors.gameFormData.game_maxNum_Players.message}
                                                                            </p>
                                                                        ) : errors?.gameFormData?.game_minNum_Players ? (
                                                                            <p className="m-0">{errors.gameFormData.game_minNum_Players.message}</p>
                                                                        ) : errors?.gameFormData?.game_maxNum_Players ? (
                                                                            <p className="m-0">{errors.gameFormData.game_maxNum_Players.message}</p>
                                                                        ) : (
                                                                            <p className="m-0 invisible">占位</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/*密室介紹*/}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_info" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">密室介紹</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex align-items-center">
                                                                        <textarea
                                                                            defaultValue={gameFormData?.game_info.trim()}
                                                                            {...register("gameFormData.game_info", {
                                                                                required: "密室介紹是必填的",
                                                                                onChange: async () => {
                                                                                    await trigger("gameFormData.game_info");
                                                                                }
                                                                            })}
                                                                            type="text"
                                                                            className={`form-control border-black`}
                                                                            id="game_info"
                                                                            name="gameFormData.game_info"
                                                                            placeholder="請填入密室的背景設定"
                                                                        />
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_info ? errors?.gameFormData?.game_info.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 密室官方網址 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_website" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">密室官方網址</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            defaultValue={gameFormData?.game_website}
                                                                            {...register("gameFormData.game_website", {
                                                                                required: "密室官方網址是必填的",
                                                                                pattern: {
                                                                                    value: /^(https?:\/\/)[^\s]+$/i,
                                                                                    message: "請輸入正確的網址格式（例如：https://example.com）"
                                                                                },
                                                                                onChange: async () => {
                                                                                    await trigger("gameFormData.game_website");
                                                                                }
                                                                            })}
                                                                            type="text"
                                                                            className={`form-control border-black `}
                                                                            id="game_website"
                                                                            name="gameFormData.game_website"
                                                                            placeholder="請填入密室本身的介紹網址"
                                                                        />
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_website ? errors?.gameFormData?.game_website.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 備註 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_remark" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">備註</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex align-items-center">
                                                                        <input
                                                                            defaultValue={gameFormData?.game_remark}
                                                                            {...register("gameFormData.game_remark", {
                                                                                onChange: async () => {
                                                                                    await trigger("gameFormData.game_remark");
                                                                                }
                                                                            })}
                                                                            type="text"
                                                                            className={`form-control border-black `}
                                                                            id="game_remark"
                                                                            name="gameFormData.game_remark"
                                                                            placeholder="若有價格或者是密室本身有額外訊息需提供給審核者，請寫在此處"
                                                                        />
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_remark ? errors?.gameFormData?.game_remark.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 密室圖片 */}
                                                            <div className="row ">
                                                                <label htmlFor="game_img" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">密室圖片</label>
                                                                <div className="col-sm-10">
                                                                    <input
                                                                        defaultValue={gameFormData?.game_img}
                                                                        {...register("gameFormData.game_img", {
                                                                            required: "密室主視圖必填的",
                                                                            pattern: {
                                                                                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
                                                                                message: "請輸入正確的圖片 URL（例如：https://example.com/image.jpg）"
                                                                            },
                                                                            onChange: () => {
                                                                                trigger("gameFormData.game_img");
                                                                            }
                                                                        })}
                                                                        type="text"
                                                                        className="form-control border-black"
                                                                        id="game_img"
                                                                        name="gameFormData.game_img"
                                                                        placeholder="請輸入圖片 URL"
                                                                    />
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_img ? errors?.gameFormData?.game_img.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* 主題分類 */}
                                                    <div className="border border-1 border-nature-90 rounded-3 mb-4">
                                                        <p className="bg-secondary-99 py-3 px-6 fw-bold fs-h6 rounded-top-3">
                                                            主題分類
                                                        </p>
                                                        <div className="p-6">
                                                            {/* 難度 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_dif_tag" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">難度</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex flex-wrap">
                                                                        {difficultys.map((difficulty) => (
                                                                            <div
                                                                                className="form-check mb-4 me-6 mb-sm-0"
                                                                                key={difficulty.difficulty_id}
                                                                            >
                                                                                <input
                                                                                    {...register("gameFormData.game_dif_tag", {
                                                                                        required: "難度是必選的",
                                                                                        onChange: async () => {
                                                                                            await trigger("gameFormData.game_dif_tag");
                                                                                        }
                                                                                    })}
                                                                                    className="form-check-input"
                                                                                    type="radio"
                                                                                    name="gameFormData.game_dif_tag"
                                                                                    id={`difficulty_${difficulty.difficulty_id}`}
                                                                                    value={difficulty.difficulty_id}
                                                                                />
                                                                                <label
                                                                                    className="form-check-label text-nowrap"
                                                                                    htmlFor={`difficulty_${difficulty.difficulty_id}`}
                                                                                >
                                                                                    {difficulty.difficulty_name}
                                                                                </label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_dif_tag ? errors?.gameFormData?.game_dif_tag.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 種類 */}
                                                            <div className="row">
                                                                <label htmlFor="game_main_tag1" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">
                                                                    種類
                                                                    <span className="text-nature-50 fs-Caption">
                                                                        <br />
                                                                        請選擇二種
                                                                    </span>
                                                                </label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex flex-wrap">
                                                                        {propertys.map((property) => (
                                                                            <div
                                                                                className="form-check  me-6"
                                                                                key={property.property_id}
                                                                            >
                                                                                <input
                                                                                    onChange={(e) => handlEInputChange(e)}
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    value={property.property_id}
                                                                                    id={property.property_id}
                                                                                    name="property"
                                                                                    checked={gameFormData?.property.includes(Number(property.property_id))}
                                                                                    disabled={gameFormData?.property.length >= 2 && !gameFormData?.property.includes(Number(property.property_id))}
                                                                                />
                                                                                <label
                                                                                    className="form-check-label text-nowrap"
                                                                                    htmlFor={property.property_id}
                                                                                >
                                                                                    {property.property_name}
                                                                                </label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.property ? errors?.gameFormData?.property.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* 開放時間 */}
                                                    <div className="border border-1 border-nature-90 rounded-3 mb-4">
                                                        <p className="bg-secondary-99 py-3 px-6 fw-bold fs-h6 rounded-top-3">
                                                            開放時間
                                                        </p>
                                                        <div className="p-6">
                                                            {/* 開放模式 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="game_isLimited" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">開放模式</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex">
                                                                        <div
                                                                            className="form-check me-6"
                                                                        >
                                                                            <input
                                                                                {...register("gameFormData.game_isLimited", {
                                                                                    required: "開放模式必填的",
                                                                                    onChange: async () => {

                                                                                        await trigger("gameFormData.game_isLimited");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="gameFormData.game_isLimited"
                                                                                value="0"
                                                                                id="game_isLimited_0"
                                                                            />
                                                                            <label
                                                                                className="form-check-label text-nowrap"
                                                                                htmlFor="game_isLimited_0"
                                                                            >
                                                                                常駐主題
                                                                            </label>

                                                                        </div>
                                                                        <div
                                                                            className="form-check me-6"
                                                                        >
                                                                            <input
                                                                                {...register("gameFormData.game_isLimited", {
                                                                                    required: "開放模式必填的",
                                                                                    onChange: async () => {

                                                                                        await trigger("gameFormData.game_isLimited");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="gameFormData.game_isLimited"
                                                                                value="1"
                                                                                id="game_isLimited_1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label text-nowrap"
                                                                                htmlFor="game_isLimited_1"
                                                                            >
                                                                                期間限定
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_isLimited ? errors?.gameFormData?.game_isLimited.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <label htmlFor="property" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">開放日期</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex align-items-center">
                                                                        <DatePicker
                                                                            selected={gameFormData?.game_start_date} // 初始設置為 null
                                                                            dateFormat="yyyy/MM/dd" // 設定日期格式為 YY/MM/DD
                                                                            required
                                                                            name="game_start_date"
                                                                            onChange={(e) => handleDateChange(e, "game_start_date")}
                                                                            customInput={<CustomDateInput />}
                                                                        />
                                                                        <p className=" mx-2">至</p>
                                                                        <DatePicker
                                                                            selected={gameFormData?.game_end_date} // 初始設置為 null
                                                                            dateFormat="yyyy/MM/dd" // 設定日期格式為 YY/MM/DD
                                                                            required
                                                                            name="game_end_date"
                                                                            onChange={(e) => handleDateChange(e, "game_end_date")}
                                                                            customInput={<CustomDateInput />}
                                                                        />
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.gameFormData?.game_end_date ? errors.gameFormData.game_end_date.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* 收費 */}
                                                    <div className="border border-1 border-nature-90 rounded-3">
                                                        <p className="bg-secondary-99 py-3 px-6 fw-bold fs-h6 rounded-top-3">
                                                            收費
                                                        </p>
                                                        <div className="p-6">
                                                            {/* 收費規定 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="difficulty" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">
                                                                    收費規定
                                                                    <span className="text-nature-50 fs-Caption">
                                                                        <br />
                                                                        平假日是否相同
                                                                    </span>
                                                                </label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex">
                                                                        {/* priceFormData.price_is_difference = 1 平假日不同 */}
                                                                        <div className="form-check me-6" >
                                                                            <input
                                                                                {...register("priceFormData.price_is_difference", {
                                                                                    required: "平假日是否相符必填",
                                                                                    onChange: async () => {
                                                                                        await trigger("priceFormData.price_is_difference");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceFormData.price_is_difference"
                                                                                id="price_is_difference_1"
                                                                                value="1"
                                                                            />
                                                                            <label className="form-check-label text-nowrap" htmlFor="price_is_difference_1">不同</label>
                                                                        </div>
                                                                        {/* priceFormData.price_is_difference = 0 平假日相同 */}
                                                                        <div className="form-check me-6" >
                                                                            <input
                                                                                {...register("priceFormData.price_is_difference", {
                                                                                    required: "平假日是否相符必填",
                                                                                    onChange: async () => {
                                                                                        await trigger("priceFormData.price_is_difference");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceFormData.price_is_difference"
                                                                                id="price_is_difference_0"
                                                                                value="0"
                                                                            />
                                                                            <label className="form-check-label text-nowrap" htmlFor="price_is_difference_0">相同</label>
                                                                        </div>
                                                                    </div>
                                                                    {/* 錯誤訊息 */}
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.priceFormData?.price_is_difference ? errors.priceFormData.price_is_difference.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 收費方式 */}
                                                            <div className="row mb-3">
                                                                <label htmlFor="price_people" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">收費方式</label>
                                                                <div className="col-sm-10">
                                                                    <div className="d-flex flex-wrap">
                                                                        <div className="form-check me-6">
                                                                            <input
                                                                                {...register("priceFormData.price_people", {
                                                                                    required: "收費方式必選",
                                                                                    onChange: async () => {
                                                                                        await trigger("priceFormData.price_people");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceFormData.price_people"
                                                                                value="/場"
                                                                                id="price_people_場"
                                                                            />
                                                                            <label className="form-check-label text-nowrap" htmlFor="price_people_場">依場次為計價</label>
                                                                        </div>
                                                                        <div className="form-check me-6">
                                                                            <input
                                                                                {...register("priceFormData.price_people", {
                                                                                    required: "收費方式必選",
                                                                                    onChange: async () => {
                                                                                        await trigger("priceFormData.price_people");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceFormData.price_people"
                                                                                value="/人"
                                                                                id="price_people_人"
                                                                            />
                                                                            <label
                                                                                className="form-check-label text-nowrap"
                                                                                htmlFor="price_people_人"
                                                                            >
                                                                                依人頭為計價
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check me-6">
                                                                            <input
                                                                                {...register("priceFormData.price_people", {
                                                                                    required: "收費方式必選",
                                                                                    onChange: async () => {
                                                                                        await trigger("priceFormData.price_people");
                                                                                    }
                                                                                })}
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceFormData.price_people"
                                                                                value="x-x人"
                                                                                id="price_people_人區"
                                                                            />
                                                                            <label
                                                                                className="form-check-label text-nowrap"
                                                                                htmlFor="price_people_人區"
                                                                            >
                                                                                依人數區間為計價
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                        {errors?.priceFormData?.price_people ? errors.priceFormData.price_people.message : "　"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 已場次為計價 - 平假日相符 */}
                                                            {
                                                                watch("priceFormData.price_is_difference") === '0' && watch("priceFormData.price_people") === '/場' && (
                                                                    <div className="row mb-8">
                                                                        <label htmlFor="single_price" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">場次收費</label>
                                                                        <div className="col-sm-10">
                                                                            <div className="d-flex align-items-center">
                                                                                <input
                                                                                    {...register("priceFormData.single_price", {
                                                                                        required: "場次收費金額必填",
                                                                                        onChange: async () => {
                                                                                            await trigger("priceFormData.single_price");
                                                                                        }
                                                                                    })}
                                                                                    type="text"
                                                                                    className={`form-control border-black  `}
                                                                                    id="single_price"
                                                                                    name="priceFormData.single_price"
                                                                                    placeholder="請輸入場次的金額"
                                                                                />
                                                                                <span className="ms-1 me-3">
                                                                                    元
                                                                                </span>
                                                                            </div>
                                                                            <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                                {errors?.priceFormData?.single_price ? errors.priceFormData.single_price.message : "　"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            {/* 已場次為計價 - 平假日不同 */}
                                                            {
                                                                watch("priceFormData.price_is_difference") === '1' && watch("priceFormData.price_people") === '/場' && (
                                                                    <div className="row mb-8">
                                                                        <label htmlFor="single_price" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">場次收費</label>
                                                                        <div className="col-sm-10">
                                                                            <div className="d-flex flex-column w-100">
                                                                                <div className="d-flex align-items-center">
                                                                                    <label
                                                                                        htmlFor="weekday_price"
                                                                                        className="fs-Body-1 mb-0 text-nowrap me-3">
                                                                                        平日場次收費
                                                                                    </label>
                                                                                    <input
                                                                                        {...register("priceFormData.weekday_price", {
                                                                                            required: "平日收費金額必填",
                                                                                            onChange: async () => {
                                                                                                await trigger("priceFormData.weekday_price");
                                                                                            }
                                                                                        })}
                                                                                        type="text"
                                                                                        className={`form-control border-black  `}
                                                                                        id="weekday_price"
                                                                                        name="priceFormData.weekday_price"
                                                                                        placeholder="請輸入平日場次的金額"
                                                                                    />
                                                                                    <span className="ms-1 me-3">
                                                                                        元
                                                                                    </span>
                                                                                </div>
                                                                                <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                                    {errors?.priceFormData?.weekday_price ? errors.priceFormData.weekday_price.message : "　"}
                                                                                </div>
                                                                                <div className="d-flex align-items-center mt-3">
                                                                                    <label
                                                                                        htmlFor="weekend_price"
                                                                                        className="fs-Body-1 mb-0 text-nowrap me-3">
                                                                                        假日場次收費
                                                                                    </label>
                                                                                    <input
                                                                                        {...register("priceFormData.weekend_price", {
                                                                                            required: "假日收費金額必填",
                                                                                            onChange: async () => {
                                                                                                await trigger("priceFormData.weekend_price");
                                                                                            }
                                                                                        })}
                                                                                        type="text"
                                                                                        className={`form-control border-black  `}
                                                                                        id="weekend_price"
                                                                                        name="priceFormData.weekend_price"
                                                                                        placeholder="請輸入假日場次的金額"
                                                                                    />
                                                                                    <span className="ms-1 me-3">
                                                                                        元
                                                                                    </span>
                                                                                </div>
                                                                                <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                                    {errors?.priceFormData?.weekend_price ? errors.priceFormData.weekend_price.message : "　"}
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            {/* 以單人 - 平假日相符 */}
                                                            {
                                                                watch("priceFormData.price_is_difference") === '0' && watch("priceFormData.price_people") === '/人' && (
                                                                    <div className="row mb-8">
                                                                        <label htmlFor="unit_person_price" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">
                                                                            人頭收費
                                                                        </label>
                                                                        <div className="col-sm-10">
                                                                            <div className="d-flex align-items-center">
                                                                                <input
                                                                                    {...register("priceFormData.unit_person_price", {
                                                                                        required: "單人收費金額必填",
                                                                                        onChange: async () => {
                                                                                            await trigger("priceFormData.unit_person_price");
                                                                                        }
                                                                                    })}
                                                                                    type="text"
                                                                                    className={`form-control border-black  `}
                                                                                    id="unit_person_price"
                                                                                    name="priceFormData.unit_person_price"
                                                                                    placeholder="請輸入 金額 /人的金額"
                                                                                />
                                                                                <span className="ms-1 me-3 text-nowrap">
                                                                                    /人 元
                                                                                </span>
                                                                            </div>
                                                                            <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                                {errors?.priceFormData?.unit_person_price ? errors.priceFormData.unit_person_price.message : "　"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            {/* 以單人 - 平假日不同 */}
                                                            {
                                                                watch("priceFormData.price_is_difference") === '1' && watch("priceFormData.price_people") === '/人' && (
                                                                    <div className="row mb-8">
                                                                        <label htmlFor="unit_person_price" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">
                                                                            人頭收費
                                                                        </label>
                                                                        <div className="col-sm-10">
                                                                            <div className="d-flex flex-column w-100">
                                                                                <div className="d-flex align-items-center">
                                                                                    <label
                                                                                        htmlFor="unit_weekday_price"
                                                                                        className="fs-Body-1 mb-0 text-nowrap me-3">
                                                                                        平日單人收費
                                                                                    </label>
                                                                                    <input
                                                                                        {...register("priceFormData.unit_weekday_price", {
                                                                                            required: "平日收費金額必填",
                                                                                            onChange: async () => {
                                                                                                await trigger("priceFormData.unit_weekday_price");
                                                                                            }
                                                                                        })}
                                                                                        type="text"
                                                                                        className={`form-control border-black  `}
                                                                                        id="unit_weekday_price"
                                                                                        name="priceFormData.unit_weekday_price"
                                                                                        placeholder="請輸入平日單人的金額"
                                                                                    />
                                                                                    <span className="ms-1 me-3">
                                                                                        元
                                                                                    </span>
                                                                                </div>
                                                                                <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                                    {errors?.priceFormData?.unit_weekday_price ? errors.priceFormData.unit_weekday_price.message : "　"}
                                                                                </div>
                                                                                <div className="d-flex align-items-center mt-3">
                                                                                    <label
                                                                                        htmlFor="unit_weekend_price"
                                                                                        className="fs-Body-1 mb-0 text-nowrap me-3">
                                                                                        假日單人收費
                                                                                    </label>
                                                                                    <input
                                                                                        {...register("priceFormData.unit_weekend_price", {
                                                                                            required: "假日收費金額必填",
                                                                                            onChange: async () => {
                                                                                                await trigger("priceFormData.unit_weekend_price");
                                                                                            }
                                                                                        })}
                                                                                        type="text"
                                                                                        className={`form-control border-black  `}
                                                                                        id="unit_weekend_price"
                                                                                        name="priceFormData.unit_weekend_price"
                                                                                        placeholder="請輸入假日單人的金額"
                                                                                    />
                                                                                    <span className="ms-1 me-3">
                                                                                        元
                                                                                    </span>
                                                                                </div>
                                                                                <div className="error-message text-danger mt-1 fs-caption lh-1">
                                                                                    {errors?.priceFormData?.unit_weekend_price ? errors.priceFormData.unit_weekend_price.message : "　"}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            {/* 以人數區間 -平假日相同 */}
                                                            {
                                                                watch("priceFormData.price_is_difference") === '0' && watch("priceFormData.price_people") === 'x-x人' && (
                                                                    <div className="row mb-8">
                                                                        <label htmlFor="" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">人數區間收費
                                                                            <span className="text-nature-50 fs-Caption">
                                                                                <br />
                                                                                例如
                                                                                <br />
                                                                                4-6人500/人元
                                                                                <br />
                                                                                3人600/人元
                                                                            </span>
                                                                        </label>
                                                                        <div className="col-sm-10">
                                                                            {unitFields.map((item, index) => (
                                                                                <div key={item.id}>
                                                                                    <div className="d-flex align-items-center col-12 col-sm-8">
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="起始人數"
                                                                                            className="form-control border-black w-25"
                                                                                            {...register(`priceFormData.prices.unit.${index}.min`, {
                                                                                                required: "請輸入開始人數",
                                                                                                onChange: async () => {
                                                                                                    await trigger(`priceFormData.prices.unit.${index}.min`);
                                                                                                    await trigger(`priceFormData.prices.unit.${index}.group`);
                                                                                                }
                                                                                            })}
                                                                                        />
                                                                                        <p className="mx-2">至</p>
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="結束人數"
                                                                                            className="form-control border-black w-25"
                                                                                            {...register(`priceFormData.prices.unit.${index}.max`, {
                                                                                                required: "請輸入結束人數",
                                                                                                onChange: async () => {
                                                                                                    await trigger(`priceFormData.prices.unit.${index}.max`);
                                                                                                    await trigger(`priceFormData.prices.unit.${index}.group`);
                                                                                                }
                                                                                            })}
                                                                                        />
                                                                                        <p className="mx-2">人</p>
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="單人價格"
                                                                                            className="form-control border-black w-25"
                                                                                            {...register(`priceFormData.prices.unit.${index}.price_mix`, {
                                                                                                required: "請輸入單人價格",
                                                                                                onChange: async () => {
                                                                                                    await trigger(`priceFormData.prices.unit.${index}.price_mix`);
                                                                                                    await trigger(`priceFormData.prices.unit.${index}.group`);
                                                                                                }
                                                                                            })}
                                                                                        />
                                                                                        <span className="mx-2">元</span>
                                                                                        <button type="button" onClick={() => removeUnit(index)} className="btn bg-secondary-99">
                                                                                            –
                                                                                        </button>
                                                                                    </div>
                                                                                    {/* 利用隱藏欄位做整組驗證 */}
                                                                                    <input
                                                                                        type="hidden"
                                                                                        {...register(`priceFormData.prices.unit.${index}.group`, {
                                                                                            validate: async () => {
                                                                                                await trigger(`priceFormData.prices.unit.${index}.min`);
                                                                                                await trigger(`priceFormData.prices.unit.${index}.max`);
                                                                                                await trigger(`priceFormData.prices.unit.${index}.price_mix`);

                                                                                                const min = Number(getValues(`priceFormData.prices.unit.${index}.min`)) || 0;
                                                                                                const max = Number(getValues(`priceFormData.prices.unit.${index}.max`)) || 0;
                                                                                                const price = Number(getValues(`priceFormData.prices.unit.${index}.price_mix`)) || 0;

                                                                                                if (min === 0 || max === 0 || price === 0) {
                                                                                                    return "欄位皆為必填且不可為 0";
                                                                                                }
                                                                                                if (max < min) {
                                                                                                    return "結束人數必須大於或等於起始人數";
                                                                                                }
                                                                                                if (index > 0) {
                                                                                                    const previousMax = Number(getValues(`priceFormData.prices.unit.${index - 1}.max`));
                                                                                                    if (min <= previousMax) {
                                                                                                        return "起始人數必須大於上一組的結束人數";
                                                                                                    }
                                                                                                }
                                                                                                return true;
                                                                                            }
                                                                                        })}
                                                                                    />
                                                                                    <div className="error-message text-danger my-1 fs-caption lh-1">
                                                                                        {errors?.priceFormData?.prices?.unit?.[index]?.group ? errors.priceFormData.prices.unit[index].group.message : "　"}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            {/* 新增項目 */}
                                                                            <div className="mt-1">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn bg-nature-60 p-2 text-white d-flex align-items-center"
                                                                                    onClick={() => appendUnit({ min: "", max: "", price_mix: "" })}
                                                                                >
                                                                                    <RiPlayListAddLine size={16} className="me-2" />
                                                                                    新增項目
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            {/* 以人數區間 -平假日不同 */}
                                                            {
                                                                watch("priceFormData.price_is_difference") === '1' && watch("priceFormData.price_people") === 'x-x人' && (
                                                                    <div className="row mb-8">
                                                                        <label htmlFor="difficulty" className="col-sm-2 fs-Body-2 fw-bold fs-sm-Body-1 mb-2 mb-sm-0">人數區間收費
                                                                            <span className="text-nature-50 fs-Caption">
                                                                                <br />
                                                                                每人數區間的單人價格
                                                                            </span>
                                                                        </label>
                                                                        <div className="col-sm-10">
                                                                            {/* 平日 */}
                                                                            <div className="d-flex flex-column">
                                                                                <label className="fs-Body-1 mb-2 fw-bold text-nowrap">
                                                                                    平日收費
                                                                                </label>
                                                                                {/* 一組 */}
                                                                                {weekdayFields.map((item, index) => (
                                                                                    <div key={item.id}>
                                                                                        <div className="d-flex align-items-center col-12 col-sm-8">
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="起始人數"
                                                                                                className="form-control border-black w-25"
                                                                                                {...register(`priceFormData.prices.weekday.${index}.min`, {
                                                                                                    required: "請輸入開始人數",
                                                                                                    onChange: async () => {
                                                                                                        await trigger(`priceFormData.prices.weekday.${index}.min`);
                                                                                                        await trigger(`priceFormData.prices.weekday.${index}.group`);
                                                                                                    }
                                                                                                })}
                                                                                            />
                                                                                            <p className="mx-2">至</p>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="結束人數"
                                                                                                className="form-control border-black w-25"
                                                                                                {...register(`priceFormData.prices.weekday.${index}.max`, {
                                                                                                    required: "請輸入結束人數",
                                                                                                    onChange: async () => {
                                                                                                        await trigger(`priceFormData.prices.weekday.${index}.max`);
                                                                                                        await trigger(`priceFormData.prices.weekday.${index}.group`);
                                                                                                    }
                                                                                                })}
                                                                                            />
                                                                                            <p className="mx-2">人</p>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="單人價格"
                                                                                                className="form-control border-black w-25"
                                                                                                {...register(`priceFormData.prices.weekday.${index}.price_mix`, {
                                                                                                    required: "請輸入單人價格",
                                                                                                    onChange: async () => {
                                                                                                        await trigger(`priceFormData.prices.weekday.${index}.price_mix`);
                                                                                                        await trigger(`priceFormData.prices.weekday.${index}.group`);
                                                                                                    }
                                                                                                })}
                                                                                            />
                                                                                            <span className="mx-2">元</span>
                                                                                            <button type="button" onClick={() => removeWeekday(index)} className="btn bg-secondary-99">
                                                                                                –
                                                                                            </button>
                                                                                        </div>
                                                                                        {/* 利用隱藏欄位做整組驗證 */}
                                                                                        <input
                                                                                            type="hidden"
                                                                                            {...register(`priceFormData.prices.weekday.${index}.group`, {
                                                                                                validate: async () => {
                                                                                                    await trigger(`priceFormData.prices.weekday.${index}.min`);
                                                                                                    await trigger(`priceFormData.prices.weekday.${index}.max`);
                                                                                                    await trigger(`priceFormData.prices.weekday.${index}.price_mix`);

                                                                                                    const min = Number(getValues(`priceFormData.prices.weekday.${index}.min`)) || 0;
                                                                                                    const max = Number(getValues(`priceFormData.prices.weekday.${index}.max`)) || 0;
                                                                                                    const price = Number(getValues(`priceFormData.prices.weekday.${index}.price_mix`)) || 0;

                                                                                                    if (min === 0 || max === 0 || price === 0) {
                                                                                                        return "欄位皆為必填且不可為 0";
                                                                                                    }
                                                                                                    if (max < min) {
                                                                                                        return "結束人數必須大於或等於起始人數";
                                                                                                    }
                                                                                                    if (index > 0) {
                                                                                                        const previousMax = Number(getValues(`priceFormData.prices.weekday.${index - 1}.max`));
                                                                                                        if (min <= previousMax) {
                                                                                                            return "起始人數必須大於上一組的結束人數";
                                                                                                        }
                                                                                                    }
                                                                                                    return true;
                                                                                                }
                                                                                            })}
                                                                                        />
                                                                                        <div className="error-message text-danger my-1 fs-caption lh-1">
                                                                                            {errors?.priceFormData?.prices?.weekday?.[index]?.group ? errors.priceFormData.prices.weekday[index].group.message : "　"}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                                {/* 最後項目 */}
                                                                                <div className=" ">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn bg-nature-60 p-2 text-white d-flex align-items-center"
                                                                                        onClick={() => appendWeekday({ min: "", max: "", price_mix: "" })}>
                                                                                        <RiPlayListAddLine size={16} className="me-2" />新增項目
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            {/* 假日 */}
                                                                            <div className="d-flex flex-column mt-3">
                                                                                <label className="fs-Body-1 mb-2 fw-bold text-nowrap">
                                                                                    假日收費
                                                                                </label>
                                                                                {/* 一組 */}
                                                                                {weekendFields.map((item, index) => (
                                                                                    <div key={item.id}>
                                                                                        <div className="d-flex align-items-center col-12 col-sm-8">
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="起始人數"
                                                                                                className="form-control border-black w-25"
                                                                                                {...register(`priceFormData.prices.weekend.${index}.min`, {
                                                                                                    required: "請輸入開始人數",
                                                                                                    onChange: async () => {
                                                                                                        await trigger(`priceFormData.prices.weekend.${index}.min`);
                                                                                                        await trigger(`priceFormData.prices.weekend.${index}.group`);
                                                                                                    }
                                                                                                })}
                                                                                            />
                                                                                            <p className="mx-2">至</p>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="結束人數"
                                                                                                className="form-control border-black w-25"
                                                                                                {...register(`priceFormData.prices.weekend.${index}.max`, {
                                                                                                    required: "請輸入結束人數",
                                                                                                    onChange: async () => {
                                                                                                        await trigger(`priceFormData.prices.weekend.${index}.max`);
                                                                                                        await trigger(`priceFormData.prices.weekend.${index}.group`);
                                                                                                    }
                                                                                                })}
                                                                                            />
                                                                                            <p className="mx-2">人</p>
                                                                                            <input
                                                                                                type="number"
                                                                                                placeholder="單人價格"
                                                                                                className="form-control border-black w-25"
                                                                                                {...register(`priceFormData.prices.weekend.${index}.price_mix`, {
                                                                                                    required: "請輸入單人價格",
                                                                                                    onChange: async () => {
                                                                                                        await trigger(`priceFormData.prices.weekend.${index}.price_mix`);
                                                                                                        await trigger(`priceFormData.prices.weekend.${index}.group`);
                                                                                                    }
                                                                                                })}
                                                                                            />
                                                                                            <span className="mx-2">元</span>
                                                                                            <button type="button" onClick={() => removeWeekend(index)} className="btn bg-secondary-99">
                                                                                                –
                                                                                            </button>
                                                                                        </div>
                                                                                        {/* 利用隱藏欄位做整組驗證 */}
                                                                                        <input
                                                                                            type="hidden"
                                                                                            {...register(`priceFormData.prices.weekend.${index}.group`, {
                                                                                                validate: async () => {
                                                                                                    await trigger(`priceFormData.prices.weekend.${index}.min`);
                                                                                                    await trigger(`priceFormData.prices.weekend.${index}.max`);
                                                                                                    await trigger(`priceFormData.prices.weekend.${index}.price_mix`);

                                                                                                    const min = Number(getValues(`priceFormData.prices.weekend.${index}.min`)) || 0;
                                                                                                    const max = Number(getValues(`priceFormData.prices.weekend.${index}.max`)) || 0;
                                                                                                    const price = Number(getValues(`priceFormData.prices.weekend.${index}.price_mix`)) || 0;

                                                                                                    if (min === 0 || max === 0 || price === 0) {
                                                                                                        return "欄位皆為必填且不可為 0";
                                                                                                    }
                                                                                                    if (max < min) {
                                                                                                        return "結束人數必須大於或等於起始人數";
                                                                                                    }
                                                                                                    if (index > 0) {
                                                                                                        const previousMax = Number(getValues(`priceFormData.prices.weekend.${index - 1}.max`));
                                                                                                        if (min <= previousMax) {
                                                                                                            return "起始人數必須大於上一組的結束人數";
                                                                                                        }
                                                                                                    }
                                                                                                    return true;
                                                                                                }
                                                                                            })}
                                                                                        />
                                                                                        <div className="error-message text-danger my-1 fs-caption lh-1">
                                                                                            {errors?.priceFormData?.prices?.weekend?.[index]?.group ? errors.priceFormData.prices.weekend?.[index].group.message : "　"}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                                {/* 新增項目 */}
                                                                                <div className=" ">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn bg-nature-60 p-2 text-white d-flex align-items-center"
                                                                                        onClick={() => appendWeekend({ min: "", max: "", price_mix: "" })}>
                                                                                        <RiPlayListAddLine size={16} className="me-2" />新增項目
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 fw-bold fs-h6 border-top border-nature-90  ">
                                                <div className="d-flex justify-content-end">
                                                    <Link to={`/Store_profile/${user_id}/myGames`} className="btn bg-nature-60 text-white me-3">返回列表</Link>
                                                    <button className="btn bg-secondary-60 text-white ">送出審核</button>
                                                </div>
                                            </div>
                                        </form>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <Toast />
        </>

    )

}

export default AddGames;