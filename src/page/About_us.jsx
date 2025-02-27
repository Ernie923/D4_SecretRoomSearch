import { useEffect, useState } from "react";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import axios from "axios";

const baseApi = import.meta.env.VITE_BASE_URL;

function About_us() {
    const [austore, setAustore] = useState([]);
    const [isHaveStore, setIsHaveStore] = useState(false);

    const getAuthorizedStore = async () => {
        try {
            const res = await axios.get(`${baseApi}/authorizedStore`);
            if (res.data.length > 0) {
                setAustore(res.data);
                setIsHaveStore(true);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getAuthorizedStore();
    }, []);

    return (
        <>
            <Header />
            <main>
                <div className="container">
                    <div className="col mb-1" id="about-us">
                        <div className="card border-0">
                            <h5 className="card-header">關於密室搜搜</h5>
                            <div className="card-body">
                                <p className="card-text">
                                    我們是來自六角學院專題班的學生，因為熱愛密室逃脫遊戲，決定創立這個網站，匯集台灣各地的密室逃脫資訊。
                                    <br />
                                    我們希望透過這個平台，讓大家能更方便地搜尋與了解不同類型的遊戲場地。
                                    <br />
                                    本網站內容與圖片均已獲得以下工作室的授權，僅供學術與作品集展示，無任何商業用途。
                                </p>
                                <ul className="list-group list-group-numbered">
                                    {isHaveStore ? austore.map((store) => (
                                        <li key={store.austore_id} className="list-group-item border-0">{store.austore_name}</li>
                                    )) : '尚無工作室授權'}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-1" id="terms-of-service">
                        <div className="card border-0">
                            <h5 className="card-header">服務條款</h5>
                            <div className="card-body">
                                <p className="card-text">
                                    歡迎使用本網站！本網站由六角學院專題班學生團隊建立，旨在提供台灣地區的密室逃脫遊戲場地資訊。本網站的使用受以下條款的約束，請在使用前仔細閱讀。
                                </p>
                                <ul className="list-group list-group-numbered">
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">非商業用途</div>
                                            本網站的所有內容僅供學術用途與作品集展示，無任何商業目的。本網站不對密室逃脫店家的營運或遊戲內容進行任何承諾或擔保。
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">授權內容</div>
                                            本網站所使用的圖片及文字資料均已獲得相關工作室的授權使用，請勿擅自複製或用於其他用途。
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">使用者行為</div>
                                            使用者在本網站上的行為應遵守相關法律法規，不得進行任何有害於網站或其他使用者的行為。
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">免責聲明</div>
                                            我們會盡力確保網站內容的準確性，但不保證其完全正確或即時更新。對於因使用本網站內容所產生的任何損害或損失，本網站不承擔任何責任。
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">隱私政策</div>
                                            我們尊重使用者的隱私，所有由您提供的個人資料將僅用於網站功能的基本需求，不會用於其他用途。
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">修改與終止</div>
                                            我們保留隨時修改或終止網站內容和服務的權利，無需事先通知。
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col mb-1" id="privacy-policy">
                        <div className="card border-0">
                            <h5 className="card-header">隱私權政策</h5>
                            <div className="card-body">
                                <p className="card-text">
                                    我們重視您的隱私，並承諾保護您在使用本網站時提供的個人資料。本網站僅收集必要的個人資訊（如姓名或電子郵件），用於回應您的需求或提供留言功能。您的資料不會被分享給任何第三方，除非獲得您的同意或符合法律規定。
                                    <br />
                                    我們的網站可能包含第三方連結，這些網站的隱私政策不受我們的控制，請務必查看相關政策。
                                    我們保留隨時修改本隱私權政策的權利，更新後的內容將即時生效。
                                    <br />
                                    如有問題，請聯繫我們：C108193246@nkust.edu.tw。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default About_us;