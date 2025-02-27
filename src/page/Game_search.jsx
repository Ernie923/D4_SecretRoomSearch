import { useEffect, useRef, useState } from "react";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import axios from "axios";
import CommendedGamesCard from "../layout/CommendedGamesCard";

const baseApi = import.meta.env.VITE_BASE_URL;

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

const formData = {
    order: 'order_price',
    game_name: '',
    area: [],
    game_people: '',
    difficulty: [],
    property: [],
};

function Game_search() {
    // 原先的資料
    const [games, setGames] = useState([]);
    const [difficultys, setDifficultys] = useState([]);
    const [propertys, setPropertys] = useState([]);
    const [maxPeople, setMaxPeople] = useState(0);
    const [search, setSearch] = useState(formData);
    // 是否要顯示全部資料
    const [isAllRecommendDisplay, setIsAllRecommendDisplay] = useState(false);
    const [isAllRecentlyDisplay, setIsAllRecentlyDisplay] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    // 排序過後的資料
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [newedGames, setNewedGames] = useState([]);
    const [searchGames, setSearchGames] = useState([]);

    // axios拿到全部遊戲資料
    const getGames = async () => {
        try {
            const res = await axios.get(`${baseApi}/gamesData`);
            setGames(res.data);

            const recommendedGames = [...res.data].sort((a, b) => b.game_score - a.game_score);
            setRecommendedGames(recommendedGames);

            const newGames = [...res.data].sort((a, b) =>
                new Date(b.game_start_date) - new Date(a.game_start_date)
            );
            setNewedGames(newGames);
            setMaxPeople(Math.max(...res.data.map(p => p.game_maxNum_Players)));

        } catch (error) {
            console.error(error);
        }
    };

    // axios拿到全部標籤資料
    const getPropertys = async () => {
        try {
            const res = await axios.get(`${baseApi}/propertys_fixed_Data`);
            setPropertys(res.data);
        } catch (error) {
            console.error(error);

        }
    }

    // axios拿到全部難度資料
    const getDifficultys = async () => {
        try {
            const res = await axios.get(`${baseApi}/difficultys_fixed_Data`);
            setDifficultys(res.data);
        } catch (error) {
            console.error(error);

        }
    }

    // 查看更多推薦
    const handleSeeRecommendMore = () => {
        if (isAllRecommendDisplay) {
            setIsAllRecommendDisplay(false);
        }
        else {
            setIsAllRecommendDisplay(true);
        }
        window.scrollTo(0, 0); // 滾動到頁面頂部
    };

    // 查看更多新作
    const handleSeeRecentlyMore = () => {
        if (isAllRecentlyDisplay) {
            setIsAllRecentlyDisplay(false);
        }
        else {
            setIsAllRecentlyDisplay(true);
        }
        window.scrollTo(0, 0); // 滾動到頁面頂部
    };

    const handleReset = () => {
        setSearch(formData);
        console.log("Before setIsSearch:", isSearch);
        setIsSearch(false);
        console.log("After setIsSearch:", isSearch);
    };



    // 監聽表單輸入況狀
    const handlEInputChange = (e) => {
        const { value, name } = e.target;
        if (name == 'area' || name == 'difficulty' || name == "property") {
            setSearch(prev => ({
                ...prev,
                [name]: prev[name].includes(value)
                    ? prev[name].filter(item => item !== value) // 如果已經選擇，就移除
                    : [...prev[name], value] // 如果沒選擇，就加入
            }));
        }
        else {
            setSearch({
                ...search,
                [name]: value
            });
        }
    };

    // 處理篩選後的結果呈現
    const handleSerach = async (e) => {
        e.preventDefault(); // 可用此方式將預設行為取消掉，讓使用者可以直接按enter就可進入，不限制只透過按鈕點選
        console.log("Before handleSerach setIsSearch:", isSearch);
        setIsSearch(true);
        console.log("After handleSerach setIsSearch:", isSearch);
        // 篩選資料
        const filteredGames = games.filter(game => {
            // 遊戲名稱
            const matchesGameName = search.game_name === "" ? true : game.game_name.includes(search.game_name);

            // 地區篩選（使用OR條件）
            const matchesArea = search.area.length === 0 ? true : search.area.some(area => game.game_address.startsWith(area));

            // 遊玩人數篩選
            const matchesGamePeople = search.game_people === "" ? true :
                (game.game_minNum_Players <= parseInt(search.game_people, 10) && game.game_maxNum_Players >= parseInt(search.game_people, 10));

            // 難度篩選（使用OR條件）
            const matchesDifficulty = search.difficulty.length === 0 ? true : search.difficulty.includes(String(game.game_dif_tag));

            // 屬性篩選（使用OR條件）
            const matchesProperty = search.property.length === 0 ? true :
                search.property.some(property => String(game.game_main_tag1).includes(property) || String(game.game_main_tag2).includes(property));

            // 綜合判斷，使用AND邏輯
            return matchesGameName && matchesArea && matchesGamePeople && matchesDifficulty && matchesProperty;

        })

        // 排序資料
        setSearchGames(
            filteredGames.sort((a, b) => {
                if (search.order === 'order_price') {
                    // 價格排序（由大到小）
                    return b.game_min_price - a.game_min_price;
                }
                else if (search.order === 'order_popularity') {
                    return b.game_score_num - a.game_score_num;
                }

                return 0; // 如果沒有匹配的排序條件，返回原順序
            })
        )
    };

    useEffect(() => {
        getGames();
        getPropertys();
        getDifficultys();
    }, []);

    return (
        <>
            <Header />
            <main>
                <div className="banner">
                    <div className="banner-title d-none">
                        <h1 className="">找密室</h1>
                    </div>
                    <picture>
                        <source media="(min-width: 992px)" srcSet="src/images/illustration/Banner.png" />
                        <img src="src/images/illustration/Banner-2.svg" alt="banner" className="w-100" />
                    </picture >
                </div>
                <div className="my-md-10 my-sm-0">
                    <div className="container-lg">
                        <div className="row d-flex flex-column flex-md-row g-0">
                            {/* <!-- 表單部分 --> */}
                            <div className="col-md-3 pe-lg-6 pe-md-3 ">
                                <form className="p-4 bg-white" onSubmit={(e) => handleSerach(e)}>
                                    <div className="order">
                                        <p className="h5 pb-3  fw-bold">
                                            排序條件
                                        </p>
                                        <div className="mb-6">
                                            <div className="form-check form-check-inline ">
                                                <input onChange={handlEInputChange} className="form-check-input" defaultChecked={true} type="radio" name="order" id="order_price" value="order_price" />
                                                <label className="form-check-label" htmlFor="order_price">價格(由高到低)</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input onChange={handlEInputChange} className="form-check-input" type="radio" name="order" id="order_popularity" value="order_popularity" />
                                                <label className="form-check-label" htmlFor="order_popularity">人氣</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search">
                                        <p className="h5 pb-3  fw-bold">
                                            遊戲名稱
                                        </p>
                                        <div className="search-all-group mb-6">
                                            <label htmlFor="" className="pb-1">搜尋</label>
                                            <div className=" input-group search-group border  rounded-1  border-primary-black">
                                                <input onChange={handlEInputChange} type="text" className="form-control border-0 search-input"
                                                    placeholder="搜尋關鍵字" aria-label="Search" name="game_name" />
                                                <span className="input-group-text search-input border-0">
                                                    <a href=""><i className="bi bi-search"></i></a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- 地區、人數 --> */}
                                    <div className="d-flex  w-100  ">
                                        <div className="row w-100 row1 flex-md-column">
                                            <div className="col-6 col-md-12 col1 ">
                                                <div className="area">
                                                    <p className="h5 pb-4  fw-bold">
                                                        遊戲地區
                                                    </p>
                                                    {/* <!-- 手機板下拉式選單 --> */}
                                                    <select
                                                        onChange={handlEInputChange}
                                                        className="form-select d-md-none mb-md-6 mb-3 border  rounded-1  border-primary-black"
                                                        aria-label="Default select example"
                                                        name="area">
                                                        <option defaultValue>請選擇遊玩地區</option>
                                                        {area.map((item, index) => (
                                                            <option key={index} value={item.area_name}>{item.area_name}</option>
                                                        ))}
                                                    </select>
                                                    {/* <!-- 電腦版checkbox --> */}
                                                    <div className="row m-0 mb-6 d-none d-md-flex">
                                                        <div className="col-md-6 mx-0 p-0 w-auto">
                                                            {area.slice(0, area.length / 2).map((item, index) => (
                                                                <div key={index} className="form-check mb-4 me-6">
                                                                    <input onChange={handlEInputChange} className="form-check-input" type="checkbox"
                                                                        value={item.area_name} id={item.area_value} name="area" />
                                                                    <label className="form-check-label text-nowrap" htmlFor={item.area_value}>
                                                                        {item.area_name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="col-md-6 m-0 p-0">
                                                            {area.slice(area.length / 2).map((item, index) => (
                                                                <div className="form-check mb-4 " key={index}>
                                                                    <input onChange={handlEInputChange} className="form-check-input" type="checkbox"
                                                                        value={item.area_name} id={item.area_value} name="area" />
                                                                    <label className="form-check-label text-nowrap" htmlFor={item.area_value}>
                                                                        {item.area_name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-12 col1 ">
                                                <div className="people">
                                                    <p className="h5 pb-4  fw-bold">
                                                        遊玩人數
                                                    </p>
                                                    <select
                                                        onChange={handlEInputChange}
                                                        className="form-select mb-md-6 mb-3 border  rounded-1  border-primary-black"
                                                        aria-label="Default select example" name="game_people">
                                                        <option defaultValue>請選擇遊玩人數</option>
                                                        {Array.from({ length: Number(maxPeople) }).map((_, index) => (
                                                            <option key={index} value={index + 1}>
                                                                {index + 1}人
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- 難度、主題 --> */}
                                    <div className="d-flex  w-100  ">
                                        <div className="row w-100 row1 flex-md-column">
                                            <div className="col-6 col-md-12 col1 ">
                                                <div className="difficulty">
                                                    <p className="h5 pb-4  fw-bold">
                                                        難度
                                                    </p>
                                                    {/* <!-- 手機板下拉式選單 --> */}
                                                    <select
                                                        onChange={handlEInputChange}
                                                        className="form-select d-md-none mb-md-6 mb-3 border  rounded-1  border-primary-black"
                                                        aria-label="Default select example" name="difficulty">
                                                        <option defaultValue>請選擇難度</option>
                                                        {difficultys.map((difficulty) => (
                                                            <option key={difficulty.difficulty_id} value={difficulty.difficulty_id}>{difficulty.difficulty_name}</option>
                                                        ))}
                                                    </select>


                                                    {/* <!-- 電腦版核取方塊 --> */}
                                                    <div className="row m-0 mb-6 d-none d-md-flex">
                                                        <div className="col-md-6 mx-0 p-0 w-auto">
                                                            {difficultys.slice(0, Math.round(difficultys.length / 2)).map((difficulty) => (
                                                                <div className="form-check mb-4 me-6" key={difficulty.difficulty_id}>
                                                                    <input onChange={handlEInputChange} className="form-check-input" type="checkbox"
                                                                        value={difficulty.difficulty_id} id={difficulty.difficulty_id} name="difficulty" />
                                                                    <label className="form-check-label text-nowrap"
                                                                        htmlFor={difficulty.difficulty_id}>
                                                                        {difficulty.difficulty_name}
                                                                    </label>
                                                                </div>
                                                            ))}

                                                        </div>
                                                        <div className="col-md-6 m-0 p-0">
                                                            {difficultys.slice(Math.round(difficultys.length / 2)).map((difficulty) => (
                                                                <div className="form-check mb-4 " key={difficulty.difficulty_id}>
                                                                    <input onChange={handlEInputChange} className="form-check-input" type="checkbox"
                                                                        value={difficulty.difficulty_id} id={difficulty.difficulty_id} name="difficulty" />
                                                                    <label className="form-check-label text-nowrap"
                                                                        htmlFor={difficulty.difficulty_id}>
                                                                        {difficulty.difficulty_name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-12 col1 ">
                                                <div className="topic">
                                                    <p className="h5 pb-4  fw-bold">
                                                        主題
                                                    </p>
                                                    {/* <!-- 手機板下拉式選單 --> */}
                                                    <select
                                                        onChange={handlEInputChange}
                                                        className="form-select d-md-none mb-md-6 mb-3 border  rounded-1  border-primary-black"
                                                        aria-label="Default select example" name="property">
                                                        <option defaultValue>請選擇主題類別</option>
                                                        {propertys.map((property) => (
                                                            <option key={property.property_id} value={property.property_id}>{property.property_name}</option>

                                                        ))}
                                                    </select>

                                                    {/* <!-- 電腦版核取方塊 --> */}
                                                    <div className="row m-0 mb-6 d-none d-md-flex">
                                                        <div className="col-md-6 mx-0 p-0 w-auto">
                                                            {propertys.slice(0, propertys.length / 2).map((property) => (
                                                                <div className="form-check mb-4 me-6" key={property.property_id}>
                                                                    <input onChange={handlEInputChange} className="form-check-input" type="checkbox"
                                                                        value={property.property_id} id={property.property_name} name="property" />
                                                                    <label className="form-check-label text-nowrap"
                                                                        htmlFor={property.property_name}>
                                                                        {property.property_name}
                                                                    </label>
                                                                </div>
                                                            ))}

                                                        </div>
                                                        <div className="col-md-6 m-0 p-0">
                                                            {propertys.slice(propertys.length / 2).map((property) => (
                                                                <div className="form-check mb-4 " key={property.property_id}>
                                                                    <input onChange={handlEInputChange} className="form-check-input" type="checkbox"
                                                                        value={property.property_id} id={property.property_name} name="property" />
                                                                    <label className="form-check-label text-nowrap"
                                                                        htmlFor={property.property_name}>
                                                                        {property.property_name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button
                                            className="btn btn-secondary-60 link-white rounded-2 w-100">搜尋</button>
                                    </div>

                                </form>
                                <div className=" px-4">
                                    <button onClick={handleReset}
                                        className="btn w-100 reset_button border-0 text-primary-black fw-bold text-sm-center text-end">重置
                                    </button>
                                </div>
                            </div>
                            {/* <!-- 遊戲卡片 --> */}
                            <div className="col-md-9 p-0">
                                {isSearch ?
                                    (
                                        < div className="search my-5 my-md-10 " >
                                            <div className="title-container w-100  d-flex justify-content-center align-items-center">
                                                <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                                                    依據您的搜尋/排序結果如下
                                                </h3>
                                            </div>
                                            <div className="row m-0">
                                                <div className="row m-0">
                                                    {searchGames.map((game) => (<CommendedGamesCard game={game} />))
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    )
                                    :
                                    (
                                        <>
                                            {(!isAllRecentlyDisplay) && (
                                                <div className="recommend " >
                                                    <div className="title-container w-100 d-flex justify-content-center align-items-center">
                                                        <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                                                            本月推薦
                                                        </h3>
                                                    </div>
                                                    <div className="row m-0" >
                                                        {isAllRecommendDisplay ? recommendedGames.map((game) => (
                                                            < CommendedGamesCard game={game} key={game.game_id} />
                                                        )) :
                                                            recommendedGames.slice(0, 8).map((game) => (
                                                                < CommendedGamesCard game={game} key={game.game_id} />
                                                            ))
                                                        }
                                                        <button
                                                            className={`btn btn-primary ${isAllRecommendDisplay ? 'd-none' : ''}`}
                                                            onClick={() => handleSeeRecommendMore()}
                                                        >
                                                            查看更多推薦
                                                        </button>
                                                        <button
                                                            className={`btn btn-primary ${isAllRecommendDisplay ? '' : 'd-none'}`}
                                                            onClick={() => handleSeeRecommendMore()}
                                                        >
                                                            顯示較少，返回查看新作
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                            }
                                            {!isAllRecommendDisplay && (
                                                < div className="recently my-5 my-md-10 " >
                                                    <div className="title-container w-100  d-flex justify-content-center align-items-center">
                                                        <h3 className="text-center mb-12 recommendation-title fw-bold fs-sm-h3 fs-h6">
                                                            近期新作
                                                        </h3>
                                                    </div>
                                                    <div className="row m-0">
                                                        <div className="row m-0">
                                                            {isAllRecentlyDisplay ?
                                                                newedGames.map((game) => (
                                                                    < CommendedGamesCard game={game} key={game.game_id} />
                                                                ))
                                                                :
                                                                newedGames.slice(0, 8).map((game) => (
                                                                    < CommendedGamesCard game={game} key={game.game_id} />
                                                                ))
                                                            }
                                                            <button
                                                                className={`btn btn-primary  ${isAllRecentlyDisplay ? 'd-none' : ''}`}
                                                                onClick={() => handleSeeRecentlyMore()}
                                                            >
                                                                查看更多新作
                                                            </button>
                                                            <button
                                                                className={`btn btn-primary  ${isAllRecentlyDisplay ? '' : 'd-none'}`}
                                                                onClick={() => handleSeeRecentlyMore()}
                                                            >
                                                                顯示較少，返回查看推薦
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div >
            </main >
            <Footer />
        </>
    )
};

export default Game_search;