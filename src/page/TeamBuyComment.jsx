import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GroupCard from "../layout/GroupCard";
import Toast from "../layout/Toast";
import { pushMessage } from "../redux/slices/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function TeamBuyComment() {
    const [group, setGroup] = useState(null);
    const [games, setGames] = useState(null);
    const [users, setUsers] = useState([]);
    const [price, setPrice] = useState(null);
    const [groupsList, setGroupsList] = useState([]);

    const { group_id } = useParams();

    const { user, user_token } = useSelector((state) => state.userInfo);

    const dispatch = useDispatch();

    // 初始載入群組資料
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/groupsData/${group_id}`);
                setGroup(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGroup();
    }, [group_id]);

    // 取得所有群組資料，作為推薦來源
    useEffect(() => {
        const fetchGroupsList = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/groupsData`);
                setGroupsList(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGroupsList();
    }, []);

    const changeGroup = async () => {
        // 檢查是否登入
        if (!user || !user_token) {
            dispatch(
                pushMessage({
                    text: "請先登入",
                    status: "failed",
                })
            );
            return;
        }

        // 如果群組資料還沒抓到就不做任何操作
        if (!group) {
            dispatch(
                pushMessage({
                    text: "群組資料讀取中，請稍後再試",
                    status: "success",
                })
            );
            return;
        }

        // 檢查群組中是否已存在該 user_id
        if (
            group.group_participants &&
            group.group_participants.map(String).includes(String(user.user_id))
        ) {
            dispatch(
                pushMessage({
                    text: "您已加入此團!",
                    status: "failed",
                })
            );
            return;
        }

        // 若未重複，則將 user.user_id 加入群組 participants 陣列中
        try {
            const newParticipants =
                group.group_participants && Array.isArray(group.group_participants)
                    ? [...group.group_participants, user.user_id]
                    : [user.user_id];

            await axios.patch(`${BASE_URL}/groupsData/${group_id}`, {
                group_participants: newParticipants,
            });

            await getGroup();
            dispatch(
                pushMessage({
                    text: "報名完成",
                    status: "success",
                })
            );
        } catch (error) {
            console.error(error);
            dispatch(
                pushMessage({
                    text: "報名失敗，請稍後再試",
                    status: "failed",
                })
            );
        }
    };

    const getGroup = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/groupsData/${group_id}`);
            setGroup(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getGames = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/gamesData`);
            setGames(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getUsers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/usersData`);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getPriceData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/pricesData`);
            setPrice(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGames();
        getUsers();
        getPriceData();
    }, [group_id]);

    // 資料尚未載入時，顯示 Loading
    if (!group) return <div>Loading...</div>;
    if (!games?.length) return <div>Loading games data...</div>;
    if (!price) return <div>Loading...</div>;

    const gameInfo = games.find((game) => game.game_id === group.game_id);
    const userInfo = users.find((user) => user.user_id === group.user_id);
    const priceInfo = price.filter((price) => price.game_id === group.game_id);

    return (
        <>
            <div className="bg-nature-95">
                <div className="container-fluid container-lg">
                    <div className="row d-flex justify-content-center">
                        <div className="col-xl-10 mt-9 mb-20">
                            <div className="mb-6">
                                <h2 className="fs-h5 fs-lg-h2 fw-bold">
                                    {`${group.group_active_date}`}
                                    {group.game_address?.slice(0, 3)}
                                    {`${group.game_name}`}
                                </h2>
                            </div>
                            <div>
                                <div className="border-nature-90 border-top border-right border-left">
                                    <picture className="ratio ratio-16x9">
                                        <source
                                            media="(min-width: 992px)"
                                            alt="banner"
                                            src={gameInfo?.game_img[0]}
                                            className="rounded-4"
                                        />
                                        <img
                                            src={gameInfo?.game_img[0]}
                                            alt="banner"
                                            className="w-100 img-fluid rounded-top"
                                            style={{
                                                objectFit: "cover",
                                            }}
                                        />
                                    </picture>
                                </div>
                                <div className="border border-nature-90 rounded-2 rounded-lg-4 px-4 px-lg-6 bg-white">
                                    <div className="d-flex mt-4 mb-5 mx-lg-6 mx-4">
                                        <img
                                            src={
                                                userInfo?.user_sex === "男"
                                                    ? "./icon/man.png"
                                                    : userInfo?.user_sex === "女"
                                                        ? "./icon/woman.png"
                                                        : "./icon/user.png"
                                            }
                                            alt={userInfo?.user_name}
                                            className="rounded-circle me-3"
                                            style={{
                                                width: "10%",
                                                objectFit: "cover",
                                                aspectRatio: "1/1",
                                            }}
                                        />
                                        <p className="col-6 my-1 text-primary-black fs-Body-1 fw-bold lh-base">
                                            {userInfo?.user_name}
                                        </p>
                                    </div>
                                    <div className="container py-5">
                                        <div className="row gy-4">
                                            <div className="col-12 col-lg-4">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    密室名稱
                                                </p>
                                                <p>{group.game_name}</p>
                                            </div>
                                            <div className="col-12 col-lg-4">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    揪團截止日期
                                                </p>
                                                <p>{group.group_end_at}</p>
                                            </div>
                                            <div className="col-12 col-lg-4">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    活動日期
                                                </p>
                                                <p>{group.group_active_date}</p>
                                            </div>
                                        </div>
                                        <div className="row gy-4">
                                            <div className="col-12">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    密室地址
                                                </p>
                                                <p>{group.game_address}</p>
                                            </div>
                                        </div>
                                        <div className="row gy-4">
                                            <div className="col-6 col-lg-2">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    需求人數
                                                </p>
                                                <p>{group.group_member}人</p>
                                            </div>
                                            <div className="col-6 col-lg-10">
                                                <p className="text-primary-50 fs-Body-2 mb-2">價格</p>
                                                <ul>
                                                    {priceInfo.length === 2 ? (
                                                        // 當有兩筆價格資料，顯示平日與假日
                                                        <li className="fs-Body-2">
                                                            {(() => {
                                                                const weekdayPrice = priceInfo.find(
                                                                    (item) => item.price_day_type === "weekday"
                                                                );
                                                                const weekendPrice = priceInfo.find(
                                                                    (item) => item.price_day_type === "weekend"
                                                                );
                                                                return (
                                                                    <>
                                                                        {weekdayPrice && (
                                                                            <span>
                                                                                平日 {weekdayPrice.price_people}：$
                                                                                {weekdayPrice.price_mix}
                                                                            </span>
                                                                        )}
                                                                        <br />
                                                                        {weekendPrice && (
                                                                            <span>
                                                                                假日 {weekendPrice.price_people}：$
                                                                                {weekendPrice.price_mix}
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                );
                                                            })()}
                                                        </li>
                                                    ) : (
                                                        // 當只有一筆資料時，直接顯示價格，不顯示 price_day_type 文字
                                                        priceInfo.map((item) => (
                                                            <li key={item.price_id} className="fs-Body-2">
                                                                {item.price_people}：${item.price_mix}
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="row gy-4">
                                            <div className="col-6 col-lg-2">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    是否歡迎新手
                                                </p>
                                                <p>{group.group_noob ? "是" : "否"}</p>
                                            </div>
                                            <div className="col-6 col-lg-10">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    聯絡方式
                                                </p>
                                                <p>{group.group_channel}</p>
                                            </div>
                                        </div>
                                        <div className="row gy-4">
                                            <div className="col-12">
                                                <p className="text-primary-50 fs-Body-2 mb-2">
                                                    揪團理念
                                                </p>
                                                <p>{group.group_philosophy}</p>
                                            </div>
                                        </div>
                                        <div className="row gy-4">
                                            <div className="col-12">
                                                <p className="text-primary-50 fs-Body-2 mb-2">報名者</p>
                                                <p>
                                                    {group.group_participants &&
                                                        group.group_participants.length > 0
                                                        ? group.group_participants.map((userId, index) => {
                                                            const participant = users.find(
                                                                (u) => u.user_id === userId
                                                            );
                                                            return (
                                                                <span key={userId}>
                                                                    {participant
                                                                        ? participant.user_name
                                                                        : userId}
                                                                    {index !==
                                                                        group.group_participants.length - 1 &&
                                                                        ", "}
                                                                </span>
                                                            );
                                                        })
                                                        : "尚無參與者"}
                                                </p>
                                                <p className="text-primary-50 fs-Body-2">
                                                    共{group.group_participants.length}人加入此揪團
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-4">
                                        <div className="tags d-flex flex-wrap fs-Body-2 gap-2 mt-3 ">
                                            <span className=" bg-nature-95 px-1 py-1 rounded-3  text-nowrap">
                                                {gameInfo?.game_dif_tagname}
                                            </span>
                                            <span className=" bg-nature-95 px-1 py-1 rounded-3 text-nowrap">
                                                {gameInfo?.game_main_tag1name}
                                            </span>
                                            <span className=" bg-nature-95 px-1 py-1 rounded-3  text-nowrap">
                                                {gameInfo?.game_main_tag2name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="m-4 my-lg-5">
                                        {!user || !user_token ? (
                                            <span
                                                className="d-inline-block"
                                                tabIndex="0"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="right"
                                                title="請先登入"
                                            >
                                                <div className="d-grid gap-2 col-12 mx-auto d-lg-block">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary-60 text-white"
                                                        onClick={changeGroup}
                                                        disabled={!user || !user_token}
                                                    >
                                                        我要參加
                                                    </button>
                                                </div>
                                            </span>
                                        ) : (
                                            <div className="d-grid gap-2 col-12 mx-auto d-lg-block">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary-60 text-white"
                                                    onClick={changeGroup}
                                                    disabled={!user || !user_token}
                                                >
                                                    我要參加
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="row m-0 mt-7 mt-lg-6">
                                <div className="title-container w-100 d-flex justify-content-center align-items-center">
                                    <h3 className="text-center mb-12 recommendation-title fw-bold fs-lg-h3 fs-h6">
                                        相關推薦
                                    </h3>
                                </div>
                                {(() => {
                                    // 取得當前群組對應的遊戲資訊
                                    const currentGameInfo = games.find(
                                        (g) => g.game_id === group.game_id
                                    );
                                    if (!currentGameInfo) return null; // 如果當前群組遊戲資訊不存在，就不顯示推薦

                                    // 檢查是否超過活動日期
                                    const activeDate = new Date(group.group_active_date);
                                    const now = new Date();
                                    if (now > activeDate) return null; // 如果目前時間超過活動日期，就不顯示推薦

                                    // 過濾推薦：排除當前群組，並比對 tag（從 games 陣列中取得各推薦群組的遊戲資訊）
                                    const recommendedGroups = groupsList
                                        .filter((item) => {
                                            // 排除當前群組
                                            if (String(item.group_id) === String(group_id))
                                                return false;

                                            // 檢查推薦群組自己的 group_active_date 是否已過（假設 item.group_active_date 存在且格式正確）
                                            const itemActiveDate = new Date(item.group_active_date);
                                            if (new Date() > itemActiveDate) return false;

                                            const groupGame = games.find(
                                                (g) => g.game_id === item.game_id
                                            );
                                            if (!groupGame) return false;

                                            const matchDiff =
                                                groupGame.game_dif_tagname &&
                                                currentGameInfo.game_dif_tagname &&
                                                groupGame.game_dif_tagname ===
                                                currentGameInfo.game_dif_tagname;
                                            const matchMain1 =
                                                groupGame.game_main_tag1name &&
                                                currentGameInfo.game_main_tag1name &&
                                                groupGame.game_main_tag1name ===
                                                currentGameInfo.game_main_tag1name;
                                            const matchMain2 =
                                                groupGame.game_main_tag2name &&
                                                currentGameInfo.game_main_tag2name &&
                                                groupGame.game_main_tag2name ===
                                                currentGameInfo.game_main_tag2name;

                                            return matchDiff || matchMain1 || matchMain2;
                                        })
                                        .slice(0, 4);

                                    return recommendedGroups.map((item) => {
                                        // 取得推薦群組的遊戲與使用者資訊
                                        const groupGame = games.find(
                                            (g) => g.game_id === item.game_id
                                        );
                                        return (
                                            <GroupCard
                                                key={item.group_id}
                                                game={groupGame}
                                                group={item}
                                                user={item.user || {}}
                                            />
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast />
        </>
    );
}
export default TeamBuyComment;
