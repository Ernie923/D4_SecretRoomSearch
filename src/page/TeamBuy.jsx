import { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchForm from "../components/TeamBuy/SearchForm";
import SearchResults from "../components/TeamBuy/SearchResults";
import RecommendedGroups from "../components/TeamBuy/RecommendedGroups";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorAlert from "../components/UI/ErrorAlert";
import {
    searchReducer,
    initialState,
    ACTIONS,
} from "../reducers/searchReducer";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const area = [
    { area_name: "台北市", area_value: "taipei" },
    { area_name: "基隆市", area_value: "keelung" },
    { area_name: "新竹市", area_value: "hsinchu" },
    { area_name: "彰化縣", area_value: "changhua" },
    { area_name: "嘉義市", area_value: "chiayi" },
    { area_name: "高雄市", area_value: "kaohsiung" },
    { area_name: "宜蘭縣", area_value: "yilan" },
    { area_name: "台東縣", area_value: "taidong" },
    { area_name: "新北市", area_value: "newtaipei" },
    { area_name: "桃園市", area_value: "taoyuan" },
    { area_name: "台中市", area_value: "taichung" },
    { area_name: "南投縣", area_value: "nantou" },
    { area_name: "台南市", area_value: "tainan" },
    { area_name: "屏東縣", area_value: "pingtung" },
    { area_name: "花蓮縣", area_value: "hualien" },
    { area_name: "澎湖金門馬祖", area_value: "PenghuKinmenMatsu" },
];

function TeamBuy() {
    // 取得從遊戲介紹傳遞的資料
    const location = useLocation();
    const gameData = location.state;

    // 使用 useReducer 管理搜尋表單狀態
    const [search, dispatch] = useReducer(searchReducer, initialState);

    // 原先的資料
    const [difficultys, setDifficultys] = useState([]);
    const [propertys, setPropertys] = useState([]);
    const [maxPeople, setMaxPeople] = useState(0);
    const [group, setGroup] = useState([]);

    // 是否要顯示全部資料
    const [isAllRecommendDisplay, setIsAllRecommendDisplay] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isHaveResultGames, setIsHaveResultGames] = useState(false);

    // 排序過後的資料
    const [searchGames, setSearchGames] = useState([]);

    // 載入和錯誤狀態
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 建立一個 ref 指向搜尋區塊
    const firstSectionRef = useRef(null);

    // axios拿到全部遊戲資料
    const getGames = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/gamesData`);
            setMaxPeople(Math.max(...res.data.map((p) => p.game_maxNum_Players)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // axios拿到全部標籤資料
    const getPropertys = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/propertys_fixed_Data`);
            setPropertys(res.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // axios拿到全部難度資料
    const getDifficultys = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/difficultys_fixed_Data`);
            setDifficultys(res.data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // 查看更多推薦
    const handleSeeRecommendMore = useCallback(() => {

        setIsAllRecommendDisplay((prev) => !prev);
        window.scrollTo(0, 0); // 滾動到頁面頂部
    }, []);

    const handleReset = useCallback(() => {
        dispatch({ type: ACTIONS.RESET });
        setIsSearch(false);
        if (firstSectionRef.current) {
            window.scrollTo({
                top: firstSectionRef.current.offsetTop - 120,
                behavior: "smooth",
            });
        }
    }, []);

    // 監聽表單輸入況狀
    const handleInputChange = (e) => {
        const { value, name } = e.target;
        if (name === "area" || name === "difficulty" || name === "property") {
            dispatch({
                type: ACTIONS.TOGGLE_ARRAY_FIELD,
                field: name,
                value: value,
            });
        } else {
            dispatch({
                type: ACTIONS.SET_FIELD,
                field: name,
                value: value,
            });
        }
    };

    // 處理篩選後的結果呈現
    const handleSearch = useCallback(
        async (e) => {
            e.preventDefault();
            setIsSearch(true);
            const filteredGames = group.filter(({ group, game }) => {
                // 遊戲名稱
                const matchesGameName =
                    search.game_name === ""
                        ? true
                        : group.game_name.includes(search.game_name);

                // 地區篩選（使用OR條件）
                const matchesArea =
                    search.area.length === 0
                        ? true
                        : search.area.some((area) => group.game_address.startsWith(area));

                // 遊玩人數篩選
                const matchesGamePeople =
                    search.game_people === ""
                        ? true
                        : group.group_member.includes(search.game_people);

                // 難度篩選（使用OR條件）
                const matchesDifficulty =
                    search.difficulty.length === 0
                        ? true
                        : search.difficulty.includes(String(game.game_dif_tag));

                // 屬性篩選（使用OR條件）
                const matchesProperty =
                    search.property.length === 0
                        ? true
                        : search.property.some(
                            (property) =>
                                String(game.game_main_tag1).includes(property) ||
                                String(game.game_main_tag2).includes(property)
                        );

                // 綜合判斷，使用AND邏輯
                return (
                    matchesGameName &&
                    matchesArea &&
                    matchesGamePeople &&
                    matchesDifficulty &&
                    matchesProperty
                );
            });

            setIsHaveResultGames(filteredGames.length > 0);

            // 排序資料
            setSearchGames(
                filteredGames.sort((a, b) => {
                    if (search.order === "order_price") {
                        // 價格排序（由大到小）
                        return b.game_min_price - a.game_min_price;
                    } else if (search.order === "order_popularity") {
                        return b.game_score_num - a.game_score_num;
                    }

                    return 0; // 如果沒有匹配的排序條件，返回原順序
                })
            );

            // 搜尋完成後，利用 ref 捲動到搜尋區塊
            if (firstSectionRef.current) {
                window.scrollTo({
                    top: firstSectionRef.current.offsetTop - 120,
                    behavior: "smooth",
                });
            }
        },
        [search, group]
    );

    //根據共同的 ID關聯
    const fetchGroupGames = async () => {
        try {
            // 同時發送三個 axios 請求
            const [groupRes, userRes, gameRes] = await Promise.all([
                axios.get(`${BASE_URL}/groupsData`),
                axios.get(`${BASE_URL}/usersData`),
                axios.get(`${BASE_URL}/gamesData`),
            ]);
            // axios 的回應資料在 res.data 中
            const groupData = groupRes.data;
            const userData = userRes.data;
            const gameData = gameRes.data;

            let count = 0;
            const groupActive = groupData.reduce((acc, group) => {
                if (new Date(group.group_active_date) >= new Date()) {
                    acc[count] = group;
                    count++;
                }
                return acc;
            }, []);

            // 建立 game 與 user 的映射表，以便依據 ID 快速查找
            const gameMap = gameData.reduce((acc, game) => {
                acc[game.game_id] = game;
                return acc;
            }, {});

            const userMap = userData.reduce((acc, user) => {
                acc[user.user_id] = user;
                return acc;
            }, {});

            // 將三個 API 的資料依據 game 中的 group_id 與 user_id 合併成一個物件
            const groupGames = groupActive.map((group) => ({
                group,
                game: gameMap[group.game_id], // 利用 group.game_id 取得對應的群組資料
                user: userMap[group.user_id], // 利用 group.user_id 取得對應的使用者資料
            }));

            setGroup(groupGames);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    // 重試資料載入
    const handleRetry = useCallback(async () => {
        setError(null);
        fetchAllData();
    }, []);

    // 所有資料載入函數
    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 使用 Promise.all 同時發起請求以提高效率
            await Promise.all([
                getGames(),
                getPropertys(),
                getDifficultys(),
                fetchGroupGames(),
            ]);
            setIsLoading(false);
        } catch (error) {
            console.error("資料載入失敗", error);
            setError(error.message || "資料載入失敗，請重試");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();

        // 檢查是否有從 Game_content 頁面傳遞的遊戲資料
        if (gameData && gameData.gameName) {
            dispatch({
                type: ACTIONS.SET_FIELD,
                field: "game_name",
                value: gameData.gameName,
            });
        }
    }, []);

    // 處理自動搜尋
    useEffect(() => {
        if (gameData && gameData.gameName && group.length > 0) {
            const simulatedEvent = {
                preventDefault: () => { },
            };
            handleSearch(simulatedEvent);
        }
    }, [group, gameData, handleSearch]);

    return (
        <>
            <div className="banner">
                <picture>
                    <source
                        media="(min-width: 992px)"
                        srcSet="./illustration/CTA-lg.png"
                    />
                    <img
                        src="./illustration/CTA.png"
                        alt="banner"
                        className="rounded mx-auto d-block"
                    />
                </picture>
            </div>
            <div className="my-md-10 my-sm-0">
                <div className="container-lg">
                    <div className="row">
                        <div className="col">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title text-center">揪團專區</h5>
                                    <ol className="card-text list-group list-group-numbered">
                                        <li className="list-group-item">
                                            發起揪團請至密室介紹頁點選揪團去開啟揪團吧
                                        </li>
                                        <li className="list-group-item">
                                            請勿發表與密室逃脫無關之內容
                                        </li>
                                        <li className="list-group-item">禁止一切交易買賣行為</li>
                                        <li className="list-group-item">請勿暴雷</li>
                                        <li className="list-group-item">
                                            禁止相同或類似之內容重複張貼洗版
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <ErrorAlert message={error} onRetry={handleRetry} />}

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="row d-flex flex-column flex-md-row g-0">
                            {/* 表單部分 */}
                            <SearchForm
                                search={search}
                                handleInputChange={handleInputChange}
                                handleSearch={handleSearch}
                                handleReset={handleReset}
                                area={area}
                                difficultys={difficultys}
                                propertys={propertys}
                                maxPeople={maxPeople}
                            />

                            {/* 遊戲卡片 */}
                            <div className="col-md-9 p-0" ref={firstSectionRef}>
                                {isSearch ? (
                                    <SearchResults
                                        searchGames={searchGames}
                                        isHaveResultGames={isHaveResultGames}
                                        group={group}
                                    />
                                ) : (
                                    <>
                                        {
                                            <RecommendedGroups
                                                group={group}
                                                isAllRecommendDisplay={isAllRecommendDisplay}
                                                handleSeeRecommendMore={handleSeeRecommendMore}
                                            />
                                        }
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default TeamBuy;
