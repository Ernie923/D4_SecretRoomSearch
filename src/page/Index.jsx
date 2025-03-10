
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";


import 'swiper/swiper-bundle.css';

const BASE_URL = 'https://new-json.onrender.com/';

function Index() {
	const [product, setProduct] = useState([]);
	const [gameProperty, setGameProperty] = useState([]);

	useEffect(() => {
		const getProduct = async () => {
			try {
				const res = await axios.get(`${BASE_URL}gamesData`);
				setProduct(res.data);
			} catch (error) {
					alert('獲取產品失敗');
					console.log(`${BASE_URL}gamesData`, error.message);
			}
		}
		getProduct();
	}, [])

	useEffect(() => {
		const getProperty = async () => {
			try {
				const res = await axios.get(`${BASE_URL}propertys_fixed_Data`);
				setGameProperty(res.data);
			} catch (error) {
				alert('獲取遊戲屬性失敗');
				console.log(`${BASE_URL}propertys_fixed_Data`, error.message);
			}
		}
		getProperty();
	}, [])

	const area = [
		"台北", "新北", "桃園", "新竹", "苗栗", "台中",
		"彰化", "雲林", "嘉義", "台南", "高雄", "屏東"
	];
	const memberNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const [areaSelect, setAreaSelect] = useState(area[0]);
	const [numSelect, setNumSelect] = useState(1);

	return (
		<>
			<div
				style={{
					width: '100%',
					height: '800px',
					backgroundImage: `url(${'./illustration/Banner_web_up_1.png'}), url(${'./illustration/Banner-web-down-1.png'})`,
					backgroundRepeat: 'no-repeat, no-repeat',
					backgroundPosition: 'top center, bottom center',
					backgroundSize: 'contain, contain'
				}}
				className="row justify-content-center align-items-center vh-100 mt-20"
			>
				<div className="col-6 bg-primary-95 rounded-6">
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
						<div className="w-100">
							<label htmlFor="" className="form-label">搜尋</label>
							<input type="text" className="form-control " placeholder="搜尋關鍵字" />
						</div>
					</div>
				</div>
			</div>

			<div class="container">
        <h2 class="mb-20 text-center fs-h3 fw-bold">密室搜搜能幫助你</h2>
				<div class="row justify-content-center">
					<div class="col-8">
						<div class="d-flex flex-row-reverse align-items-center justify-content-between mb-12">
								<div class="">
									<img src="/assets/images/marek-szturc.png" alt="..." class="rounded-16" style={{height:'294px', width:'416px'}}  />
								</div>
								<div class="">
									<h3 class="fs-h5 mb-6">快速找到喜歡的密室遊戲</h3>
									<p style={{width:'306px'}}>搜尋全台各地的密室遊戲。不論是恐怖繁悚、科幻冒險還是古典懸疑，都能幫助你找到最符合你興趣的挑戰。詳細的遊戲介紹、圖片，讓你在參加前就能了解遊戲的風格和難度，為你打造前所未有的解謎體驗！</p>
								</div>
						</div>
						<div class="d-flex align-items-center justify-content-between mb-12">
							<div class="">
								<img src="/assets/images/vlad-hilitanu.png" alt="..." class="rounded-16" style={{height:'204px', width:'424px'}} />
							</div>
							<div class="">
								<h3 class="fs-h5 mb-6">快速找到喜歡的密室遊戲</h3>
								<p style={{width:'306px'}}>結識來自全台密室愛好者，與他們組隊挑戰各種密室遊戲。無論是第一次體驗還是經驗豐富的老手，都能找到合適的隊友，一同享受團隊合作帶來的無限樂趣與成就感！</p>
							</div>
						</div>
						<div class="d-flex flex-row-reverse justify-content-between align-items-center">
								<div class="">
									<img src="/assets/images/andrew-neel.png" alt="..." class="rounded-16" style={{height:'294px', width:'416px'}} />
								</div>
								<div class="">
										<h3 class="fs-h5 mb-6">觀看玩家評價</h3>
										<p style={{width:'306px'}}>瀏覽玩家提供的詳細評價和建議，了解各個密室遊戲的特色、難度和可玩性。不僅能看到評分和評論，還能看到玩家們的遊戲過程分享，確保每一次都能帶來愉快的遊戲體驗！</p>
								</div>
						</div>
					</div>
				</div>        
      </div>

			<div className="bg-nature-20 py-20 mb-20">
				<div className="container">
						<h2 className="text-white text-align-center d-flex justify-content-center mb-20">從驚悚到奇幻，12 種冒險領域讓你選擇！</h2>
						<div className="row justify-content-center flex-column-reverse flex-lg-row align-items-center">
							<div className="col-lg-3 col-sm-12">
								<img src="./illustration/Friends-celebrating-the-New-Year-1.png" alt="" />
							</div>
							<div className="col-lg-6 col-sm-12">
								<div className="row">
									<div className="col-lg-4 col-6">
										<div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
											<span className="material-symbols-outlined">child_care</span>
											<p className="fs-lg-h6">新手入門</p>
										</div>
										</div>
										<div className="col-lg-4 col-6">
											<div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
												<span className="material-symbols-outlined">editor_choice</span>
												<p className="fs-lg-h6">中度玩家</p>
											</div>
										</div>
										<div className="col-lg-4 col-6">
											<div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
													<span className="material-symbols-outlined">award_star</span>
													<p className="fs-lg-h6">重度解謎</p>
											</div>
										</div>
										{gameProperty.slice(0, 9).map((property) => (
											<div className="col-lg-4 col-6" key={property.property_id}>
												<div className="btn btn-nature-30 text-nature-99 py-6 px-8 mb-7 d-flex align-items-center justify-content-center rounded-4">
													<span className="material-symbols-outlined">editor_choice</span>
													<p className="fs-lg-h6">{property.property_name}</p>
												</div>
											</div>
										))}

								</div>
							</div>
						</div>

				</div>
			</div>

			<div className="bg-nature-95 py-20">
				<Swiper
						modules={[Navigation, Autoplay]}
						slidesPerView={4}
						spaceBetween={24}
						navigation={{
							nextEl: ".swiper-button-next",
							prevEl: ".swiper-button-prev",
						}
						}
						loop={true}
						autoplay={{ delay: 3000, disableOnInteraction: false }}
				>
						{/* 輪播 */}
						{product.map((game) => (
							<SwiperSlide key={game.game_id}>
								<div class="d-flex flex-column bg-white rounded-10 p-5">
									<img src={game.game_img[0]} alt={game.game_name} class="rounded-7 mb-3 object-fit-cover" style={{width:'100%', height:'150px'}}/>
									<h3 class="card-title fw-bold fs-h6">{game.game_name}</h3>
									<p class="fs-Body-1 mb-3 text-nature-40">{game.game_address.slice(0,3)}</p>
									<div class="d-flex mb-2" style={{gap:'8px'}}>
										<div class="d-flex align-items-center pe-3" style={{borderRight:'1px solid #CCC5C2', gap:'4px'}}>
											<img src="./icon/star.png" alt="" style={{width:'16px', height:'16px'}} />
											<p>{game.game_score}</p>
										</div>
										<div class="d-flex">
											<span>{game.game_score_num}</span>
											<p>人評論</p>
										</div>
									</div>
									<div class="d-flex mb-3" style={{gap:'8px'}}>
										<div class="d-flex align-items-center pe-3" style={{borderRight:'1px solid #CCC5C2', gap:'6px'}}>
											<img src="./icon/person.png" alt="" style={{width:'16px', height:'16px'}} />
											<p>{game.game_minNum_Players}-{game.game_maxNum_Players}人</p>
										</div>
										<div class="d-flex">
											<span class="material-symbols-outlined">attach_money</span>
											<p>每人</p>
											<span>{game.game_min_price}元起</span>
										</div>
									</div>
									<div class="d-flex mb-2" style={{gap:'8px'}}>
										<div class="d-flex bg-nature-95 rounded-4 py-1 px-3" style={{gap:'4px'}}>
											<span class="material-symbols-outlined">child_care</span>
											<p class="fs-Body-2">新手入門</p>
										</div>
										<div class="d-flex bg-nature-95 rounded-4 py-1 px-3" style={{gap:'4px'}}>
											<span class="material-symbols-outlined">factory</span>
											<p class="fs-Body-2">場景逼真</p>
										</div>
									</div>
									<div class="d-flex bg-nature-95 rounded-4 py-1 px-3 align-self-start" style={{gap:'4px'}}>
										<span class="material-symbols-outlined">factory</span>
										<p class="fs-Body-2">場景逼真</p>
									</div>
								</div>
							</SwiperSlide>
						))}

						{/* <div className="swiper-pagination"></div> */}
						<div className="swiper-button-next"></div>
						<div className="swiper-button-prev"></div>
				</Swiper>
			</div>

		</>
	);
}
export default Index;