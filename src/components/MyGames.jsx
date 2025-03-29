import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { userStoreContext } from "../page/StoreProfile";

const baseApi = import.meta.env.VITE_BASE_URL;

const MyGames = () => {
    // 共用的資料 - useContext
    const { store } = useContext(userStoreContext);
    const store_id = store.store_id;

    // 此元件使用 
    const [upGames, setUpGames] = useState([]);
    const [dowmGames, setDownGames] = useState([]);
    const [isHaveUpgames, setIsHaveUpGames] = useState(true);
    const [isDownUpgames, setIsDownUpGames] = useState(true);
    const [isAuthStore, setIsAuthStore] = useState(false);
    const [activeTab, setActiveTab] = useState("upGames");
    const [errorMessage, setErrorMessage] = useState("");

    const getAllGames = async () => {
        if (store.store_isAuth !== 'pass') {
            setIsAuthStore(false);
        }
        else if (store.store_isAuth === 'pass') {
            setIsAuthStore(true);
        }
        let upG = [];
        let downG = [];
        try {
            const res = await axios.get(`${baseApi}/storesData/${store_id}/gamesData`);
            res.data.map((data) => {
                if (data.game_isStock) {
                    upG.push(data);
                }
                else {
                    downG.push(data);
                }
            })
        } catch (error) {
            setErrorMessage(error);
        }
        if (upG.length === 0) {
            setIsHaveUpGames(false);
        }
        else {
            setUpGames(upG);
        }

        if (downG.length === 0) {
            setIsDownUpGames(false);
        }
        else {
            setDownGames(downG);
        }
    };

    useEffect(() => {
        getAllGames();
    }, []);

    return (

        <>
            {/* 電腦版 */}
            <div className="col-12 m-0 pt-10 px-0 d-none d-lg-block ">
                <div className="border-nature-90 border rounded-2">
                    <div className="ParticipatingGroupTitle bg-secondary-95 px-6 py-5 text-secondary-50 fw-bold fs-h6" >
                        已上架
                    </div>
                    <div className="p-6 bg-white">
                        <table className="table">
                            <thead className="table-light px-3" >
                                <tr className="ParticipatingGroupThead ">
                                    <th scope="col" className="text-secondary-40 ps-6 py-3 pe-0">密室名稱</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">密室地點</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">開幕日期</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">最低價格</th>
                                    <th scope="col" className="text-secondary-40 pe-6 py-3 ps-0">人數上限</th>
                                    <th scope="col" className="text-secondary-40 pe-6 py-3 ps-0"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    errorMessage && (
                                        <tr>
                                            <td colSpan={6} className="text-center fs-h6">
                                                <p>
                                                    {errorMessage}
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                }
                                {
                                    isAuthStore === false && (
                                        <tr>
                                            <td colSpan={6} className="text-center fs-h6">
                                                <p>
                                                    尚未驗證成功，請先驗證
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                }
                                {isAuthStore && isHaveUpgames && upGames.length > 0 && (
                                    <>
                                        {
                                            upGames.map((game) => (
                                                <tr key={game.game_id} className="ParticipatingGroupThead">
                                                    <td className="ps-5 py-2 pe-0">{game.game_name}</td>
                                                    <td className="py-2 px-0">{game.game_address}</td>
                                                    <td className="py-2 px-0">{game.game_start_date}</td>
                                                    <td className="py-2 px-0">{game.game_min_price}元起</td>
                                                    <td className="py-2 px-0">{game.game_maxNum_Players}人</td>
                                                    <td className="pe-5 py-2 ps-0">
                                                        <Link to={`/Game_content/${game.game_id}`} className="text-black">
                                                            查看詳情 <IoIosArrowForward color="black" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        <tr>
                                            <td colSpan={6} className="text-center fs-h6">
                                                <p>
                                                    <Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>
                                                </p>
                                            </td>
                                        </tr>
                                    </>
                                )
                                }
                                {isAuthStore && upGames.length == 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center fs-h6">
                                            <p>
                                                沒有發布任何遊戲
                                                <br />
                                                <Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>
                                                提供給使用者吧!
                                            </p>
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border-nature-90 border rounded-2 my-10">
                    <div className="ParticipatingGroupTitle bg-secondary-95 px-6 py-5 text-secondary-50 fw-bold fs-h6" >
                        等待上架
                    </div>
                    <div className="p-6 bg-white">
                        <table className="table">
                            <thead className="table-light px-3" >
                                <tr className="ParticipatingGroupThead ">
                                    <th scope="col" className="text-secondary-40 ps-6 py-3 pe-0">密室名稱</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">密室地點</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">開幕日期</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">最低價格</th>
                                    <th scope="col" className="text-secondary-40 pe-6 py-3 ps-0">人數上限</th>
                                    <th scope="col" className="text-secondary-40 pe-6 py-3 ps-0"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isAuthStore === false && (
                                        <tr>
                                            <td colSpan={6} className="text-center fs-h6">
                                                <p>
                                                    尚未驗證成功，請先驗證
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                }
                                {isAuthStore && isDownUpgames && dowmGames.length > 0 &&
                                    <>
                                        {
                                            (dowmGames.map((game) => (
                                                <tr key={game.game_id} className="ParticipatingGroupThead">
                                                    <td className="ps-5 py-2 pe-0">{game.game_name}</td>
                                                    <td className="py-2 px-0">{game.game_address}</td>
                                                    <td className="py-2 px-0">{game.game_start_date}</td>
                                                    <td className="py-2 px-0">{game.game_min_price}</td>
                                                    <td className="py-2 px-0">{game.game_maxNum_Players}人</td>
                                                    <td className="pe-5 py-2 ps-0">
                                                        <Link to={`/AddGames/${game.game_id}`} className="text-black">
                                                            編輯表單 <IoIosArrowForward color="black" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )))
                                        }
                                        <tr>
                                            <td colSpan={6} className="text-center fs-h6">
                                                <p>
                                                    <Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>
                                                </p>
                                            </td>
                                        </tr>
                                    </>

                                }

                                {isAuthStore && dowmGames.length == 0 &&
                                    (
                                        <tr>
                                            <td colSpan={6} className="text-center fs-h6">
                                                <p>
                                                    未有任何密室審核中，
                                                    <br />
                                                    <Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>
                                                    提供給使用者吧！
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* 手機板 */}
            <div className="m-0 d-block d-lg-none">
                <div className="d-flex m-0 pt-5 ps-3 pb-3" >
                    <button
                        className={`commentButton btn border-1 border-secondary-50 me-3  fw-bold rounded-16 ${activeTab === 'upGames' ? 'bg-secondary-50 text-secondary-99' : 'text-secondary-50'}`}
                        onClick={() => setActiveTab("upGames")}
                    >
                        已上架
                    </button>
                    <button
                        className={`commentButton btn border-1 border-secondary-50 rounded-16 fw-bold ${activeTab === 'downGames' ? 'bg-secondary-50 text-secondary-99' : 'text-secondary-50'}`}
                        onClick={() => setActiveTab("downGames")}
                    >
                        等待上架
                    </button>
                </div>
                {activeTab === 'upGames' &&
                    (<div className="">
                        <div className="ParticipatingGroupTitle bg-secondary-95 px-4 py-5 text-secondary-50 fw-bold fs-h6" >
                            已上架
                        </div>
                        <div className=" ">
                            {
                                isAuthStore === false && (
                                    <>
                                        <dl>
                                            <dt className="text-center fs-h6 bg-white">
                                                尚未驗證成功，請先驗證
                                            </dt>
                                        </dl>
                                    </>
                                )
                            }
                            {isAuthStore && isHaveUpgames && upGames.length > 0 &&
                                (
                                    <>
                                        <div className="text-center bg-white my-2">
                                            < Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>

                                        </div>
                                        {
                                            upGames.map((game) => (
                                                <dl className="mb-4 bg-white p-4" key={game.game_id}>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">密室名稱</dt>
                                                    <dd>{game.game_name}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">密室地點</dt>
                                                    <dd>{game.game_address}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">開幕日期</dt>
                                                    <dd>{game.game_start_date}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">最低價格</dt>
                                                    <dd>{game.game_min_price}元起</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">人數上限</dt>
                                                    <dd className="mb-3">{game.game_maxNum_Players}人</dd>
                                                    <dd className="py-1 m-0">
                                                        <Link to={`/Game_content/${game.game_id}`} className="text-black">
                                                            查看詳情 <IoIosArrowForward color="black" />
                                                        </Link>
                                                    </dd>
                                                </dl>
                                            ))
                                        }
                                    </>
                                )
                            }
                            {
                                isAuthStore && upGames.length == 0 && (
                                    <>
                                        <dl>
                                            <dt className="text-center fs-h6 bg-white">
                                                <p>
                                                    未有任何密室審核中，
                                                    <br />
                                                    <Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>
                                                    提供給使用者吧！
                                                </p>

                                            </dt>
                                        </dl>
                                    </>
                                )
                            }
                        </div>
                    </div>)
                }

                {activeTab === 'downGames' &&
                    (<div className="">
                        <div className="ParticipatingGroupTitle bg-secondary-95 px-4 py-5 text-secondary-50 fw-bold fs-h6" >
                            等待上架
                        </div>
                        <div className=" ">
                            {
                                isAuthStore === false && (
                                    <>
                                        <dl>
                                            <dt className="text-center fs-h6 bg-white">
                                                尚未驗證成功，請先驗證
                                            </dt>
                                        </dl>
                                    </>
                                )
                            }
                            {isAuthStore && isDownUpgames && dowmGames.length > 0 &&
                                (
                                    <>
                                        <div className="text-center bg-white my-2">
                                            < Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>

                                        </div>
                                        {
                                            dowmGames.map((game) => (
                                                <dl className="mb-4 bg-white p-4" key={game.game_id}>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">密室名稱</dt>
                                                    <dd>{game.game_name}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">密室地點</dt>
                                                    <dd>{game.game_address}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">開幕日期</dt>
                                                    <dd>{game.game_start_date}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">最低價格</dt>
                                                    <dd>{game.game_min_price}元起</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">人數上限</dt>
                                                    <dd className="mb-3">{game.game_maxNum_Players}人</dd>
                                                    <dd>
                                                        <Link to={`/AddGames/${game.game_id}`} className="text-black">
                                                            編輯表單 <IoIosArrowForward color="black" />
                                                        </Link>
                                                    </dd>
                                                </dl>
                                            ))
                                        }
                                    </>
                                )
                            }
                            {
                                isAuthStore && dowmGames.length == 0 && (
                                    <>
                                        <dl>
                                            <dt className="text-center fs-h6 bg-white">
                                                <p>
                                                    未有任何密室審核中，
                                                    <br />
                                                    <Link className="d-inline text-nowrap" to='/AddGames'>新增密室資訊</Link>
                                                    提供給使用者吧！
                                                </p>

                                            </dt>
                                        </dl>
                                    </>
                                )
                            }
                        </div>
                    </div>)
                }

            </div >

        </>
    )
};

export default MyGames;