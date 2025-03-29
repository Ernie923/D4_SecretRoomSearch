import ReactLoading from "react-loading";
import { useEffect, useState } from "react";
import axios from "axios";
import IndexGamesCard from "../layout/IndexGamesCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const area = [
    "台北市",
    "基隆市",
    "新竹市",
    "彰化縣",
    "嘉義市",
    "高雄市",
    "宜蘭縣",
    "台東縣",
    "新北市",
    "桃園市",
    "台中市",
    "南投縣",
    "台南市",
    "屏東縣",
    "花蓮縣",
    "澎湖金門馬祖",
];

const memberNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Index() {
    const [isAllscreenLoading, setIsAllscreenLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const [gameProperty, setGameProperty] = useState([]);
    const [gameDifficulty, setGameDifficulty] = useState([]);

    // 排序過後的資料
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [newedGames, setNewedGames] = useState([]);

    // 新增搜尋關鍵字 state
    const [searchKeyword, setSearchKeyword] = useState("");

    const getGamesData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/gamesData`);
            setProduct(res.data);

            // 過濾有效的遊戲
            const upGames = res.data.filter((game) => game.game_isStock === true);

            // 根據分數排序
            const recommendedGames = [...upGames].sort(
                (a, b) => b.game_score - a.game_score
            );
            setRecommendedGames(recommendedGames);

            // 根據日期排序
            const newGames = [...upGames].sort(
                (a, b) => new Date(b.game_start_date) - new Date(a.game_start_date)
            );
            setNewedGames(newGames);
        } catch (error) {
            console.error("獲取遊戲資料失敗:", error);
            // 統一錯誤處理
        }
    };

    const getProperty = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/propertys_fixed_Data`);
            setGameProperty(res.data);
        } catch (error) {
            alert(error, "獲取遊戲屬性失敗");
        }
    };

    const getDifficulty = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/difficultys_fixed_Data`);
            setGameDifficulty(res.data);
        } catch (error) {
            alert(error, "獲取遊戲屬性失敗");
        }
    };

    useEffect(() => {
        setIsAllscreenLoading(true);
        const fetchData = async () => {
            await Promise.all([getGamesData(), getProperty(), getDifficulty()]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (
            product.length > 0 &&
            gameDifficulty.length > 0 &&
            gameProperty.length > 0
        ) {
            setIsAllscreenLoading(false);
        }
    }, [product, gameProperty, gameDifficulty]);

    const [areaSelect, setAreaSelect] = useState(area[0]);
    const [numSelect, setNumSelect] = useState(1);

    // 處理搜尋功能
    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        queryParams.append("area", areaSelect);
        queryParams.append("num", numSelect);

        if (searchKeyword.trim()) {
            queryParams.append("keyword", searchKeyword.trim());
        }

        window.location.href = `./#/Game_search?${queryParams.toString()}`;
    };

    if (isAllscreenLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    zIndex: 999,
                }}
            >
                <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
            </div>
        );
    }

    return (
        // TODO 標題長方形裝飾
        // TODO 檢查切版架構
        <>
            <div className="container-fluid p-0">
                <div className="row d-flex justify-content-center mx-0">
                    <div className="banner mt-9">
                        <div>
                            <picture>
                                <source
                                    media="(min-width: 992px)"
                                    srcSet="./illustration/Banner-web-up-1.svg"
                                />
                                <img
                                    src="./illustration/Rectangle-25.svg"
                                    alt="banner"
                                    className="rounded mx-auto d-block"
                                />
                            </picture>
                        </div>
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className="bg-primary-95 rounded-6 select col-10 col-lg-6 p-6 p-lg-12">
                                <div className="d-grid gap-6">
                                    <div className="d-flex justify-content-between row">
                                        <div className="col-6">
                                            <label htmlFor="area" className="form-label fs-Caption">
                                                地點
                                            </label>
                                            <select
                                                className="form-select fs-Body-1 bg-white"
                                                aria-label="Default select example"
                                                id="area"
                                                value={areaSelect}
                                                onChange={(e) => setAreaSelect(e.target.value)}
                                            >
                                                {area.map((city, index) => (
                                                    <option key={index} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="people" className="form-label fs-Caption">
                                                人數
                                            </label>
                                            <select
                                                className="form-select fs-Body-1 bg-white"
                                                aria-label="Default select example"
                                                id="people"
                                                value={numSelect}
                                                onChange={(e) => setNumSelect(e.target.value)}
                                            >
                                                {memberNum.map((people, index) => (
                                                    <option key={index} value={people}>
                                                        {people}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="search" className="form-label fs-Caption">
                                            搜尋
                                        </label>
                                        <div className="input-group fs-Body-1">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="search"
                                                placeholder="搜尋關鍵字"
                                                aria-describedby="button-addon2"
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                            />
                                            <button
                                                className="btn bg-white"
                                                type="button"
                                                id="button-addon2"
                                                onClick={handleSearch}
                                            >
                                                <i className="bi bi-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bannerBottom">
                            <picture>
                                <source
                                    media="(min-width: 992px)"
                                    srcSet="./illustration/Banner-web-down-1.svg"
                                />
                                <img
                                    src="./illustration/Rectangle-26.svg"
                                    alt="banner2"
                                    className="rounded mx-auto d-block"
                                />
                            </picture>
                        </div>
                    </div>
                    <div className="introduction">
                        <div className="title mb-8 mb-lg-17 d-none d-lg-block">
                            <h3 className="fw-bold fs-lg-h3 fs-h6">
                                想找好玩的密室遊戲，但卻發現資訊分散難找
                            </h3>
                        </div>
                        <div className="title mb-8 mb-lg-17 d-block d-lg-none text-center">
                            <h3 className="fw-bold fs-lg-h3 fs-h6">想找好玩的密室遊戲，</h3>
                            <h3 className="fw-bold fs-lg-h3 fs-h6">但卻發現資訊分散難找</h3>
                        </div>
                        <div className="information">
                            <ul className="d-flex flex-column flex-lg-row gap-8 gap-lg-6">
                                <li className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="p-3 p-lg-6">
                                        <div className="text-center">
                                            <img
                                                src="./illustration/man-looking-into-distance-1.svg"
                                                alt="information"
                                                className="px-lg-20 py-3 pt-lg-6 pb-lg-8"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h6 className="fw-bold fs-Body-1 fs-lg-h6">
                                                我是密室新手
                                            </h6>
                                            <h6 className="fw-bold fs-Body-1 fs-lg-h6">
                                                想嘗試卻不知如何開始
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="p-3 p-lg-6">
                                        <div className="text-center">
                                            <img
                                                src="./illustration/woman-with-a-book-1.svg"
                                                alt="information"
                                                className="px-lg-20 py-3 pt-lg-6 pb-lg-8"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h6 className="fw-bold fs-Body-1 fs-lg-h6">
                                                不確定附近有哪些
                                            </h6>
                                            <h6 className="fw-bold fs-Body-1 fs-lg-h6">
                                                密室逃脫遊戲可以體驗
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="p-3 p-lg-6">
                                        <div className="text-center">
                                            <img
                                                src="./illustration/man-raising-hand-1.svg"
                                                alt="information"
                                                className="px-lg-20 py-3 pt-lg-6 pb-lg-8"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h6 className="fw-bold fs-Body-1 fs-lg-h6">
                                                想找人一起玩密室遊戲
                                            </h6>
                                            <h6 className="fw-bold fs-Body-1 fs-lg-h6">
                                                但不知道該如何尋找隊友
                                            </h6>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="help d-flex flex-column align-items-center row py-20">
                        <div className="mb-16 mb-lg-20">
                            <h3 className="fw-bold fs-lg-h3 fs-h6 text-center">
                                密室搜搜能幫助你
                            </h3>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="d-grid gap-16 col-lg-6">
                                <div className="d-flex justify-content-lg-between flex-column flex-lg-row align-items-center d-grid gap-6">
                                    <div className="my-lg-12 d-grid gap-3 gap-lg-6 gameText text-center text-lg-start">
                                        <h5 className="text-primary-20 fw-bold">
                                            快速找到喜歡的密室遊戲
                                        </h5>
                                        <p className="text-Body-1 lh-lg">
                                            搜尋全台各地的密室遊戲。不論是恐怖繁悚、科幻冒險還是古典懸疑，都能幫助你找到最符合你興趣的挑戰。詳細的遊戲介紹、圖片，讓你在參加前就能了解遊戲的風格和難度，為你打造前所未有的解謎體驗！
                                        </p>
                                    </div>
                                    <div className="ratio ratio-16x9 gameImg">
                                        <img
                                            src="./image/marek-szturc.png"
                                            alt="game"
                                            className="rounded-16 w-100 img-fluid"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-lg-between flex-column-reverse flex-lg-row align-items-center d-grid gap-6">
                                    <div className="ratio ratio-16x9 gameImg">
                                        <img
                                            src="./image/vlad-hilitanu.png"
                                            alt="game"
                                            className="rounded-16 w-100 img-fluid"
                                        />
                                    </div>
                                    <div className="my-lg-12 d-grid gap-3 gap-lg-6 gameText text-center text-lg-start">
                                        <h5 className="text-primary-20 fw-bold">
                                            與其他玩家組隊遊玩
                                        </h5>
                                        <p className="text-Body-1 lh-lg">
                                            結識來自全台密室愛好者，與他們組隊挑戰各種密室遊戲。無論是第一次體驗還是經驗豐富的老手，都能找到合適的隊友，一同享受團隊合作帶來的無限樂趣與成就感！
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-lg-between flex-column flex-lg-row align-items-center d-grid gap-6">
                                    <div className="my-lg-12 d-grid gap-3 gap-lg-6 gameText text-center text-lg-start">
                                        <h5 className="text-primary-20 fw-bold">觀看玩家評價</h5>
                                        <p className="text-Body-1 lh-lg">
                                            瀏覽玩家提供的詳細評價和建議，了解各個密室遊戲的特色、難度和可玩性。不僅能看到評分和評論，還能看到玩家們的遊戲過程分享，確保每一次都能帶來愉快的遊戲體驗！
                                        </p>
                                    </div>
                                    <div className="ratio ratio-16x9 gameImg">
                                        <img
                                            src="./image/andrew-neel.png"
                                            alt="game"
                                            className="rounded-16 w-100 img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-nature-20 d-flex justify-content-center row w-100 mx-0">
                        <div className="py-16 py-lg-23 px-3 px-lg-0 d-flex flex-column justify-content-between align-items-center">
                            <div className="d-none d-lg-block mb-20">
                                <h3 className="fw-bold fs-h6 fs-lg-h3 text-white">
                                    從驚悚到奇幻，12 種冒險領域讓你選擇！
                                </h3>
                            </div>
                            <div className="text-center d-block d-lg-none mb-20">
                                <h3 className="fw-bold fs-h6 fs-lg-h3 text-white">
                                    從驚悚到奇幻，
                                </h3>
                                <h3 className="fw-bold fs-h6 fs-lg-h3 text-white">
                                    12 種冒險領域讓你選擇！
                                </h3>
                            </div>
                            <div className="d-flex justify-content-center flex-column-reverse flex-lg-row align-items-center">
                                <div className="mx-5 me-lg-25">
                                    <img
                                        src="./illustration/Friends-celebrating-the-New-Year-1.svg"
                                        alt="Friends"
                                    />
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="row ">
                                        {gameDifficulty.map((diff) => (
                                            <div className="col-lg-4 col-6" key={diff.difficulty_id}>
                                                <a
                                                    href={`./#/Game_search?difficulty=${diff.difficulty_id}`}
                                                    className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4"
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {diff.difficulty_icon_text}
                                                    </span>
                                                    <p className="fs-lg-h6">{diff.difficulty_name}</p>
                                                </a>
                                            </div>
                                        ))}
                                        {gameProperty.slice(0, 9).map((property) => (
                                            <div
                                                className="col-lg-4 col-6"
                                                key={property.property_id}
                                            >
                                                <a
                                                    href={`./#/Game_search?property=${property.property_id}`}
                                                    className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4"
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {property.property_icon_text}
                                                    </span>
                                                    <p className="fs-lg-h6">{property.property_name}</p>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-nature-95 row d-flex justify-content-center w-100 mx-0">
                        <div className="col-12 col-lg-11">
                            <div className="pt-10 pt-lg-20 mb-12">
                                <h3 className="fw-bold fs-lg-h3 fs-h6 text-center">本月推薦</h3>
                            </div>
                            <div>
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={24}
                                    navigation={true}
                                    breakpoints={{
                                        768: {
                                            slidesPerView: 2,
                                            spaceBetween: 24,
                                        },
                                        992: {
                                            slidesPerView: 4,
                                            spaceBetween: 24,
                                        },
                                    }}
                                    autoplay={{
                                        delay: 5000,
                                        disableOnInteraction: false,
                                    }}
                                    modules={[Navigation, Autoplay]}
                                    className="mySwiper"
                                >
                                    {
                                        recommendedGames.slice(0, 10).map((game) => (
                                            <SwiperSlide key={game.game_id}>
                                                <IndexGamesCard game={game} />
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </div>
                    <div className="bg-nature-95 row d-flex justify-content-center w-100 mx-0">
                        <div className="col-12 col-lg-11">
                            <div className="pt-10 pt-lg-20 mb-12">
                                <h3 className="fw-bold fs-lg-h3 fs-h6 text-center">近期新作</h3>
                            </div>
                            <div>
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={24}
                                    navigation={true}
                                    breakpoints={{
                                        768: {
                                            slidesPerView: 2,
                                            spaceBetween: 24,
                                        },
                                        992: {
                                            slidesPerView: 4,
                                            spaceBetween: 24,
                                        },
                                    }}
                                    autoplay={{
                                        delay: 5000,
                                        disableOnInteraction: false,
                                    }}
                                    modules={[Navigation, Autoplay]}
                                    className="mySwiper"
                                >
                                    {
                                        newedGames.slice(0, 10).map((game) => (
                                            <SwiperSlide key={game.game_id}>
                                                <IndexGamesCard game={game} key={game.game_id} />
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Index;
