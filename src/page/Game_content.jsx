import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { MdLock } from "react-icons/md";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 定義公共路徑常量
const ICON_PATH = "./icon/";

function Game_content() {
    const { gameID } = useParams();
    const [game, setGame] = useState(null);
    const [price, setPrice] = useState(null);
    const [comments, setComments] = useState({});
    const [isSpoileredshow, setIsSpoileredShow] = useState({});

    // 推薦遊戲 (目前先以 ID 前後的遊戲代替)
    // TODO 實作推薦遊戲
    const [preGame, setPreGame] = useState(null);
    const [nextGame, setNextGame] = useState(null);

    // 整合 API 請求函數
    const fetchGameData = async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/gamesData/${id}`);
            return res.data;
        } catch (error) {
            console.error(`無法獲取遊戲 ID ${id} 的資料`, error);
            return null;
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0); // 回到頁面頂部

        // 獲取主遊戲資料
        const loadMainGameData = async () => {
            const gameData = await fetchGameData(gameID);
            if (gameData) setGame(gameData);

            try {
                // 同時發送三個 axios 請求
                const [priceRes, commentRes, userRes] = await Promise.all([
                    axios.get(`${BASE_URL}/gamesData/${gameID}/pricesData`),
                    axios.get(`${BASE_URL}/gamesData/${gameID}/commentsData`),
                    axios.get(`${BASE_URL}/usersData`),
                ]);
                // axios 的回應資料在 res.data 中
                const priceData = priceRes.data;
                const commentData = commentRes.data;
                const userData = userRes.data;

                if (typeof commentData[0] === 'string') {
                    setComments({});
                }
                else if (typeof commentData[0] === 'object') {
                    const userMap = userData.reduce((acc, user) => {
                        acc[user.user_id] = user;
                        return acc;
                    }, {});

                    const commentUser = commentData.map((comment) => ({
                        comment,
                        user: userMap[comment.user_id], // 利用 group.user_id 取得對應的使用者資料
                    }));
                    setComments(commentUser);
                }
                setPrice(priceData);

            } catch (error) {
                console.error(error);
                throw error;
            }

        };

        // 獲取推薦遊戲
        const loadRecommendedGames = async () => {
            const prevGame = await fetchGameData(Number(gameID) - 1);
            if (prevGame) setPreGame(prevGame);

            const nextGame = await fetchGameData(Number(gameID) + 1);
            if (nextGame) setNextGame(nextGame);
        };

        loadMainGameData();
        loadRecommendedGames();
    }, [gameID]);


    const toggleSpoiler = (commentId) => {
        setIsSpoileredShow((prev) => ({
            ...prev,
            [commentId]: !prev[commentId] // 切換當前評論的顯示狀態
        }));
    };

    // 處理星星數
    const renderStars = (starCount, totalStars = 5) => {
        const stars = [];
        // 顯示填滿的星星
        for (let i = 0; i < starCount; i++) {
            stars.push(<TiStarFullOutline color="black" key={`filled-${i}`} />);
        }
        if (stars.length === 5) {
            return stars
        }
        else {
            // 顯示空星
            for (let i = starCount; i < totalStars; i++) {
                stars.push(<TiStarOutline color="black" key={`empty-${i}`} />);
            }
        }
        return stars
    }

    if (!game) return <div>載入中...</div>; // TODO 換成 loading 畫面

    return (
        <main className="game_content position-relative">
            <div className="info container py-6 py-lg-10">
                <picture>
                    {/* TODO 圖片 RWD 替代方案 */}
                    <source
                        media="(min-width: 992px)"
                    // srcSet="/assets/images/julia-kadel.png"
                    />
                    <img
                        className="w-100 rounded"
                        src={game.game_img[0]}
                        alt="banner"
                        style={{ maxHeight: "432px", objectFit: "cover" }}
                    // TODO 圖片裁切與對齊問題
                    />
                </picture>
                <div className="my-6 my-lg-10">
                    <h1 className="fs-h5 fs-lg-Display2 fw-bold mb-4">
                        {game.game_name}
                    </h1>
                    <div className="mb-4 d-flex align-items-center">
                        <img className="me-1" src="./icon/star.png" alt="star" />
                        <p className="fs-Body-2 d-inline border-end border-nature-80 mb-0 me-2 pe-3">
                            {game.game_score}
                        </p>
                        <p className="fs-Body-2 mb-0 d-inline">
                            {game.game_score_num} 人評論
                        </p>
                    </div>
                    <ul className="d-flex gap-2">
                        {/* TODO 每個 tag 要有獨立的 icon */}
                        <li className="bg-nature-95 text-black px-2 py-1 d-flex align-items-center rounded-pill">
                            <span className="material-symbols-outlined me-1">child_care</span>
                            <p className="fs-Body-2 mb-0">{game.game_dif_tagname}</p>
                        </li>
                        <li className="bg-nature-95 text-black px-2 py-1 d-flex align-items-center rounded-pill">
                            <span className="material-symbols-outlined me-1">factory</span>
                            <p className="fs-Body-2 mb-0">{game.game_main_tag1name}</p>
                        </li>
                        <li className="bg-nature-95 text-black px-2 py-1 d-flex align-items-center rounded-pill">
                            <span className="material-symbols-outlined me-1">
                                editor_choice
                            </span>
                            <p className="fs-Body-2 mb-0">{game.game_main_tag2name}</p>
                        </li>
                    </ul>
                </div>
                <div className="row row-cols-1 row-cols-lg-2 gx-6 gy-3">
                    <div className="col">
                        <div className="border border-nature-70 rounded-4 p-4">
                            <h6 className="fs-h6 fw-bold text-primary-20 mb-3">基本資訊</h6>
                            <ul>
                                <li className="mb-2 d-flex align-items-center">
                                    <img
                                        src={`${ICON_PATH}person.png`}
                                        alt="person"
                                        className="me-3"
                                        style={{ width: "16px" }}
                                    />
                                    <p className="fs-Body-2 mb-0 text-break">
                                        {game.game_minNum_Players} ~ {game.game_maxNum_Players}人
                                    </p>
                                </li>
                                <li className="mb-2 d-flex align-items-center">
                                    <img
                                        src={`${ICON_PATH}time.png`}
                                        alt="time"
                                        className="me-3"
                                    />
                                    <p className="fs-Body-2 mb-0 text-break">
                                        {game.game_time} 分鐘
                                    </p>
                                </li>
                                <li className="mb-2 d-flex align-items-center">
                                    <img
                                        src={`${ICON_PATH}address.png`}
                                        alt="address"
                                        className="me-3"
                                    />
                                    <p className="fs-Body-2 mb-0 text-break">
                                        {game.game_address}
                                    </p>
                                </li>
                                <li className="mb-2 d-flex align-items-center">
                                    <img
                                        src={`${ICON_PATH}link.png`}
                                        alt="link"
                                        className="me-3"
                                    />
                                    <a
                                        href={game.game_website}
                                        target="_blank"
                                        className="fs-Body-2 mb-0 text-break"
                                    >
                                        {game.game_website}
                                    </a>
                                </li>
                                <li className="mb-2 d-flex align-items-center">
                                    <img
                                        src={`${ICON_PATH}phone.png`}
                                        alt="phone"
                                        className="me-3"
                                    />
                                    <a
                                        className="fs-Body-2 mb-0 text-break"
                                        href={`tel:+886${game.game_tel}`}
                                    >
                                        {game.game_tel}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col">
                        <div className="border border-nature-70 rounded-4 p-4">
                            <h6 className="fs-h6 fw-bold text-primary-20 mb-3">參考價格</h6>
                            <ul className="d-flex flex-column gap-2">
                                {price?.map((item) => {
                                    return (
                                        <li key={item.price_id} className="fs-Body-2">
                                            {item.price_day_type === "weekday" ? "平日" : "假日"}
                                            {item.price_people}：${item.price_mix}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="discribe bg-nature-20">
                <div className="container py-10 py-lg-16 d-flex flex-column align-items-center align-items-lg-start">
                    <div className="title position-relative d-flex flex-column align-items-center align-items-lg-start">
                        <h2 className="text fs-h6 fs-lg-h3 text-primary-95 fw-bold mb-6">
                            遊戲介紹
                        </h2>
                        <div className="rectangle bg-nature-30 rounded position-absolute"></div>
                    </div>
                    <p className="d-lg-none text-white text-center mb-11">
                        {/* TODO 平板以下文字 */}
                        {game.game_info}
                    </p>
                    <p
                        className="d-none d-lg-block fs-h6 text-white text-start mb-20"
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {game.game_info}
                    </p>
                    <div className="comment container px-0">
                        <ul className="row row-cols-1 row-cols-md-2 row-cols-lg-3 d-flex justify-content-center">
                            {
                                Object.keys(comments).length > 0 && comments.map((comment) => {
                                    const { comment_id, coment_content, comment_isSpoilered, commet_played_time, coment_star } = comment.comment;
                                    const { user_sex, user_name } = comment.user;
                                    const isSpoilered = isSpoileredshow[comment_id] ?? true; // 預設隱藏
                                    return (
                                        <li className="comment-item mb-6" key={comment_id}>
                                            <div className="user px-4 mb-2 d-flex align-items-center">
                                                <img
                                                    className="image me-3 object-fit-cover rounded-circle"
                                                    src={user_sex === '男' ? './icon/man.png' : user_sex === '女' ? './icon/woman.png' : './icon/user.png'}
                                                    alt=""
                                                />
                                                <p className="name text-white fw-bold">{user_name}</p>
                                            </div>
                                            <div className="triangle mx-6"></div>
                                            <div className="content bg-nature-95 rounded-4 p-3 p-lg-5">
                                                <div className="mb-3 d-flex justify-content-between align-items-start">
                                                    <div className="d-flex flex-column align-items-start">
                                                        <p className="date">{commet_played_time}</p>
                                                        <ul className="d-flex gap-2">
                                                            {renderStars(coment_star)}
                                                        </ul>
                                                    </div>
                                                    <p className="tag rounded bg-primary-90 px-2 py-1">
                                                        {comment_isSpoilered ? "有劇透" : "無劇透"}
                                                    </p>
                                                </div>
                                                <p
                                                    className="fs-Body-2"
                                                    style={{ cursor: comment_isSpoilered ? "pointer" : "default" }}
                                                    onClick={() => comment_isSpoilered && toggleSpoiler(comment_id)}
                                                >
                                                    {comment_isSpoilered && isSpoilered ? (<div className="d-flex align-items-center gap-1"><MdLock size={20} />顯示劇透內容</div>) : coment_content}
                                                </p>
                                            </div>
                                        </li>
                                    )

                                })
                            }
                            {/* 新增評論按鈕 */}
                            <li className="comment-item">
                                <Link
                                    to={`/Game_comment/new/${game.game_id}`}
                                    className="add-comment d-flex flex-column justify-content-center align-items-center rounded-4 border-primary-80 text-primary-80"
                                    style={{
                                        backgroundColor: "#676664",
                                        height: "200px",
                                        marginTop: "68px",
                                        borderStyle: "dashed",
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined mb-1"
                                        style={{
                                            fontSize: "2rem",
                                        }}
                                    >
                                        add_circle
                                    </span>
                                    <p className="">
                                        {Object.keys(comments).length === 0 ? '成為第一位評論的人吧！' : '分享你的想法'}

                                    </p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="join_group">
                <div className="container py-10 py-lg-12 d-flex align-items-center justify-content-center position-relative">
                    <div className="text me-lg-21 me-4">
                        <p className="fs-lg-h3 fs-h6 text-nature-30 fw-bold">
                            點擊右側的「揪團去」
                        </p>
                        <p className="fs-lg-h3 fs-h6 text-nature-30 fw-bold position-absolute z-2">
                            一起找人解謎吧！
                        </p>
                        <div className="rectangle bg-secondary-80 rounded position-absolute z-1"></div>
                    </div>
                    <Link
                        to="/TeamBuy"
                        state={{ gameId: game.game_id, gameName: game.game_name }}
                    >
                        <picture>
                            <source
                                media="(min-width: 992px)"
                                srcSet="./illustration/CTA-lg.png"
                            />
                            <img src="./illustration/CTA.png" alt="CTA-lg" />
                        </picture>
                    </Link>
                </div>
            </div>

            <div className="others py-10">
                <div className="title position-relative d-flex flex-column align-items-center">
                    <h2 className="text fs-h6 fs-lg-h3 fw-bold mb-7 mb-lg-12">
                        您可能喜歡的遊戲
                    </h2>
                    <div className="rectangle bg-primary-80 rounded position-absolute"></div>
                </div>
                <div className="container">
                    {preGame && nextGame && (
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false, // 用戶互動後仍繼續自動播放
                            }}
                            modules={[Pagination, Navigation, Autoplay]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <Link to={`/Game_content/${preGame.game_id}`}>
                                    <img
                                        className="image w-100 rounded-3 rounded-lg-8"
                                        src={preGame.game_img[0]}
                                        alt={preGame.game_name}
                                    />
                                </Link>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Link to={`/Game_content/${nextGame.game_id}`}>
                                    <img
                                        className="image w-100 rounded-3 rounded-lg-8"
                                        src={nextGame.game_img[0]}
                                        alt={nextGame.game_name}
                                    />
                                </Link>
                            </SwiperSlide>
                        </Swiper>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Game_content;
