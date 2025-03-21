import ReactLoading from 'react-loading';
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import 'swiper/swiper-bundle.css';
import styled from 'styled-components';

const BASE_URL = 'https://new-json.onrender.com/';

const area = ["台北市", "基隆市", "新竹市", "彰化縣", "嘉義市", "高雄市", "宜蘭縣", "台東縣", "新北市", "桃園市", "台中市", "南投縣", "台南市", "屏東縣", "花蓮縣", "澎湖金門馬祖"];

const memberNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Index() {
    const [isAllscreenLoading, setIsAllscreenLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const [gameProperty, setGameProperty] = useState([]);
    const [gameDifficulty, setGameDifficulty] = useState([]);
    const getProduct = async () => {
        try {
            const res = await axios.get(`${BASE_URL}gamesData`);
            setProduct(res.data);
        } catch (error) {
            alert('獲取產品失敗');
            console.log(`${BASE_URL}gamesData`, error.message);
        }
    }

    const getProperty = async () => {
        try {
            const res = await axios.get(`${BASE_URL}propertys_fixed_Data`);
            setGameProperty(res.data);
        } catch (error) {
            alert('獲取遊戲屬性失敗');
        }
    }

    const getDifficulty = async () => {
        try {
            const res = await axios.get(`${BASE_URL}difficultys_fixed_Data`);
            setGameDifficulty(res.data);
        } catch (error) {
            alert('獲取遊戲屬性失敗');
        }
    }


    useEffect(() => {
        setIsAllscreenLoading(true);
        const fetchData = async () => {
            await Promise.all([getProduct(), getProperty(), getDifficulty()]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        //console.log(product);
        //console.log(gameProperty);
        //console.log(gameDifficulty);
        if (product.length > 0 && gameDifficulty.length > 0 && gameProperty.length > 0) {

            setIsAllscreenLoading(false);
        }

    }, [product, gameProperty, gameDifficulty]);

    const [areaSelect, setAreaSelect] = useState(area[0]);
    const [numSelect, setNumSelect] = useState(1);

    //hover狀態處理
    const [isHover, setIsHover] = useState(null);

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
        )
    }
    return (
        <>
            <div className="container d-flex flex-column align-items-center">
                <div
                    style={{
                        width: '100%',
                        height: '408px',
                        backgroundImage: `url(${'./illustration/Banner_web_up_1.png'})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain'
                    }}
                    className="justify-content-center"
                >
                </div>
                <div className="col-lg-6 col-12 bg-primary-95 rounded-6 justify-content-center">
                    <div className="p-12">
                        <div className="d-flex gap-3">
                            <div className="w-50">
                                <label htmlFor="" className="form-label">地點</label>
                                <div className="input-group bg-white">
                                    <button className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">{areaSelect}</button>
                                    <ul className="dropdown-menu">
                                        {area.map((area) => (
                                            <li key={area}><span className="dropdown-item" href="#" onClick={() => setAreaSelect(area)}>{area}</span></li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                            <div className="w-50">
                                <label htmlFor="" className="form-label">人數</label>
                                <div className="input-group bg-white">
                                    <button className="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">{numSelect}</button>
                                    <ul className="dropdown-menu">
                                        {memberNum.map((num) => (
                                            <li key={num}><span className="dropdown-item" href="#" onClick={() => setNumSelect(num)}>{num}</span></li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div className="w-100 mb-5">
                            <label htmlFor="" className="form-label">搜尋</label>
                            <input type="text" className="form-control " placeholder="搜尋關鍵字" />
                        </div>
                        <a href={`./#/Game_search?area=${areaSelect}&num=${numSelect}`} className="btn btn-primary w-100">搜尋</a>
                    </div>
                </div>
                <div
                    style={{
                        width: '100%',
                        height: '392px',
                        backgroundImage: `url(${'./illustration/Banner-web-down-1.png'})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain'
                    }}

                >
                </div>
            </div>

            <div className="py-20">
                <div className="container">
                    <div className="title-container position-relative w-100 d-flex justify-content-center align-items-center">
                        <h2 className="mb-20 text-center fs-h3 fw-bold recommendation-title">
                            密室搜搜能幫助你
                        </h2>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-8">
                            <div className="d-flex flex-lg-row-reverse align-items-center flex-column justify-content-between text-center mb-12">
                                <div className="">
                                    <img src="./image/marek-szturc.png" alt="..." className="rounded-16" style={{ height: '294px', width: '416px' }} />
                                </div>
                                <div className="">
                                    <h3 className="fs-h5 mb-6 text-primary-20">快速找到喜歡的密室遊戲</h3>
                                    <p style={{ width: '306px' }}>搜尋全台各地的密室遊戲。不論是恐怖繁悚、科幻冒險還是古典懸疑，都能幫助你找到最符合你興趣的挑戰。詳細的遊戲介紹、圖片，讓你在參加前就能了解遊戲的風格和難度，為你打造前所未有的解謎體驗！</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-column flex-lg-row text-center mb-12">
                                <div className="">
                                    <img src="./image/vlad-hilitanu.png" alt="..." className="rounded-16" style={{ height: '294px', width: '424px' }} />
                                </div>
                                <div className="">
                                    <h3 className="fs-h5 mb-6 text-primary-20">快速找到喜歡的密室遊戲</h3>
                                    <p style={{ width: '306px' }}>結識來自全台密室愛好者，與他們組隊挑戰各種密室遊戲。無論是第一次體驗還是經驗豐富的老手，都能找到合適的隊友，一同享受團隊合作帶來的無限樂趣與成就感！</p>
                                </div>
                            </div>
                            <div className="d-flex flex-lg-row-reverse flex-column justify-content-between align-items-center text-center">
                                <div className="">
                                    <img src="./image/andrew-neel.png" alt="..." className="rounded-16" style={{ height: '294px', width: '416px' }} />
                                </div>
                                <div className="">
                                    <h3 className="fs-h5 mb-6 text-primary-20">觀看玩家評價</h3>
                                    <p style={{ width: '306px' }}>瀏覽玩家提供的詳細評價和建議，了解各個密室遊戲的特色、難度和可玩性。不僅能看到評分和評論，還能看到玩家們的遊戲過程分享，確保每一次都能帶來愉快的遊戲體驗！</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-nature-20 py-20">
                <div className="container">
                    <h2 className="text-white text-align-center d-flex justify-content-center mb-20">從驚悚到奇幻，12 種冒險領域讓你選擇！</h2>
                    <div className="row justify-content-center flex-column-reverse flex-lg-row align-items-center">
                        <div className="col-lg-3 col-sm-12">
                            <img src="./illustration/Friends-celebrating-the-New-Year-1.png" alt="" />
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <div className="row">
                                {gameDifficulty.map((diff) => (
                                    <div className="col-lg-4 col-6" key={diff.difficulty_id}>
                                        <a href={`/#/Game_search?difficulty=${diff.difficulty_id}`} className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
                                            <span className="material-symbols-outlined">{diff.difficulty_icon_text}</span>
                                            <p className="fs-lg-h6">{diff.difficulty_name}</p>
                                        </a>
                                    </div>
                                ))}

                                {gameProperty.slice(0, 9).map((property) => (
                                    <div className="col-lg-4 col-6" key={property.property_id}>
                                        <a href={`/#/Game_search?property=${property.property_id}`} className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
                                            <span className="material-symbols-outlined">{property.property_icon_text}</span>
                                            <p className="fs-lg-h6">{property.property_name}</p>
                                        </a>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="py-20 bg-nature-95">
                <div className="title-container position-relative w-100 d-flex justify-content-center align-items-center" style={{zIndex:'1'}}>
                    <h2 className="mb-20 text-center fs-h3 fw-bold recommendation-title">
                        本月推薦
                    </h2>
                </div>
                {product.length > 0 && (
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        navigation={{
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            }
                        }
                        breakpoints={{
                            0:{
                                slidesPerView: 1,
                            },
                            576:{
                                slidesPerView: 2,
                            },
                            1280:{
                                slidesPerView: 4,
                            },
                        }}

                    >
                        {/* 輪播 */}
                        {product.map((game) => (
                            <SwiperSlide key={game.game_id}>
                                <a href={`./#/Game_content/${game.game_id}`} style={{ color: 'inherit' }}>
                                    <div className={`d-flex flex-column rounded-10 p-5 ${`${isHover === game.game_id ? "bg-nature-80" : "bg-nature-99"}`}`} onMouseEnter={() => setIsHover(game.game_id)} onMouseLeave={() => setIsHover(false)}>
                                        <img src={game.game_img[0]} alt={game.game_name} className="rounded-7 mb-3 object-fit-cover" style={{ width: '100%', height: '150px' }} />
                                        <h3 className="card-title fw-bold fs-h6">{game.game_name}</h3>
                                        <p className="fs-Body-1 mb-3 text-nature-40">{game.game_address.slice(0, 3)}</p>
                                        <div className="d-flex mb-2" style={{ gap: '8px' }}>
                                            <div className="d-flex align-items-center pe-3" style={{ borderRight: '1px solid #CCC5C2', gap: '4px' }}>
                                                <img src="./icon/star.png" alt="" style={{ width: '16px', height: '16px' }} />
                                                <p>{game.game_score}</p>
                                            </div>
                                            <div className="d-flex">
                                                <span>{game.game_score_num}</span>
                                                <p>人評論</p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3" style={{ gap: '8px' }}>
                                            <div className="d-flex align-items-center pe-3" style={{ borderRight: '1px solid #CCC5C2', gap: '6px' }}>
                                                <img src="./icon/person.png" alt="" style={{ width: '16px', height: '16px' }} />
                                                <p>{game.game_minNum_Players}-{game.game_maxNum_Players}人</p>
                                            </div>
                                            <div className="d-flex">
                                                <span className="material-symbols-outlined">attach_money</span>
                                                <p>每人</p>
                                                <span>{game.game_min_price}元起</span>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2" style={{ gap: '8px' }}>
                                            <div className="d-flex bg-nature-95 rounded-4 py-1 px-3" style={{ gap: '4px' }}>
                                                <span className="material-symbols-outlined">{gameDifficulty.map((diff) => {
                                                    if (diff.difficulty_name === game.game_dif_tagname) { return diff.difficulty_icon_text }
                                                })}</span>
                                                <p className="fs-Body-2">{game.game_dif_tagname}</p>
                                            </div>
                                            <div className="d-flex bg-nature-95 rounded-4 py-1 px-3" style={{ gap: '4px' }}>
                                                <span className="material-symbols-outlined">{gameProperty.map((property) => {
                                                    if (property.property_name === game.game_main_tag1name) { return property.property_icon_text }
                                                })}</span>
                                                <p className="fs-Body-2">{game.game_main_tag1name}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex bg-nature-95 rounded-4 py-1 px-3 align-self-start" style={{ gap: '4px' }}>
                                            <span className="material-symbols-outlined">{gameProperty.map((property) => {
                                                if (property.property_name === game.game_main_tag2name) { return property.property_icon_text }
                                            })}</span>
                                            <p className="fs-Body-2">{game.game_main_tag2name}</p>
                                        </div>
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}

                        {/* <div className="swiper-pagination"></div> */}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                    </Swiper>
                )}

            </div>

            <div className="py-20 bg-nature-95">
                <div className="title-container position-relative w-100 d-flex justify-content-center align-items-center" style={{zIndex:'1'}}>
                    <h2 className="mb-20 text-center fs-h3 fw-bold recommendation-title">
                        近期新作
                    </h2>
                </div>
                {product.length > 0 && (
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        // slidesPerView={1}
                        spaceBetween={24}
                        navigation={{
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            }
                        }
                        breakpoints={{
                            0:{
                                slidesPerView: 1,
                            },
                            576:{
                                slidesPerView: 2,
                            },
                            1280:{
                                slidesPerView: 4,
                            },
                        }}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                    >
                        {/* 輪播 */}
                        {product.map((game) => (
                            <SwiperSlide key={game.game_id}>
                                <a href={`./#/Game_content/${game.game_id}`} style={{ color: 'inherit' }}>
                                    <div className={`d-flex flex-column rounded-10 p-5 ${`${isHover === game.game_id ? "bg-nature-80" : "bg-nature-99"}`}`} onMouseEnter={() => setIsHover(game.game_id)} onMouseLeave={() => setIsHover(false)}>
                                        <img src={game.game_img[0]} alt={game.game_name} className="rounded-7 mb-3 object-fit-cover" style={{ width: '100%', height: '150px' }} />
                                        <h3 className="card-title fw-bold fs-h6">{game.game_name}</h3>
                                        <p className="fs-Body-1 mb-3 text-nature-40">{game.game_address.slice(0, 3)}</p>
                                        <div className="d-flex mb-2" style={{ gap: '8px' }}>
                                            <div className="d-flex align-items-center pe-3" style={{ borderRight: '1px solid #CCC5C2', gap: '4px' }}>
                                                <img src="./icon/star.png" alt="" style={{ width: '16px', height: '16px' }} />
                                                <p>{game.game_score}</p>
                                            </div>
                                            <div className="d-flex">
                                                <span>{game.game_score_num}</span>
                                                <p>人評論</p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3" style={{ gap: '8px' }}>
                                            <div className="d-flex align-items-center pe-3" style={{ borderRight: '1px solid #CCC5C2', gap: '6px' }}>
                                                <img src="./icon/person.png" alt="" style={{ width: '16px', height: '16px' }} />
                                                <p>{game.game_minNum_Players}-{game.game_maxNum_Players}人</p>
                                            </div>
                                            <div className="d-flex">
                                                <span className="material-symbols-outlined">attach_money</span>
                                                <p>每人</p>
                                                <span>{game.game_min_price}元起</span>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2" style={{ gap: '8px' }}>
                                            <div className="d-flex bg-nature-95 rounded-4 py-1 px-3" style={{ gap: '4px' }}>
                                                <span className="material-symbols-outlined">{gameDifficulty.map((diff) => {
                                                    if (diff.difficulty_name === game.game_dif_tagname) { return diff.difficulty_icon_text }
                                                })}</span>
                                                <p className="fs-Body-2">{game.game_dif_tagname}</p>
                                            </div>
                                            <div className="d-flex bg-nature-95 rounded-4 py-1 px-3" style={{ gap: '4px' }}>
                                                <span className="material-symbols-outlined">{gameProperty.map((property) => {
                                                    if (property.property_name === game.game_main_tag1name) { return property.property_icon_text }
                                                })}</span>
                                                <p className="fs-Body-2">{game.game_main_tag1name}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex bg-nature-95 rounded-4 py-1 px-3 align-self-start" style={{ gap: '4px' }}>
                                            <span className="material-symbols-outlined">{gameProperty.map((property) => {
                                                if (property.property_name === game.game_main_tag2name) { return property.property_icon_text }
                                            })}</span>
                                            <p className="fs-Body-2">{game.game_main_tag2name}</p>
                                        </div>
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}

                        {/* <div className="swiper-pagination"></div> */}
                        <div className="swiper-button-next"></div>
                        <div className="swiper-button-prev"></div>
                    </Swiper>
                )}

            </div>


        </>
    );
}
export default Index;
