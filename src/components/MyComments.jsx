import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../page/UserProfile";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
const baseApi = import.meta.env.VITE_BASE_URL;

const MyComments = () => {
    // 共用的資料 - useContext
    const { user } = useContext(userContext); //共用的user資料
    const user_id = user.user_id;

    // 此元件使用 
    const [allCommentsGames, setAllCommentsGames] = useState([]);
    const [delOneCommentID, setDelOneCommentID] = useState([]);
    const [isHaveComment, setIsHaveComment] = useState(true);

    // modal
    const detailCommentRef = useRef(null);
    const delCommentModalRef = useRef(null);
    const [commentModalData, setCommentModalData] = useState({});

    const getAllComments = async () => {
        let newComments = [];
        let new2Comments = [];
        try {
            const res = await axios.get(`${baseApi}/usersData/${user_id}/commentsData`);
            // 使用 for...of 來處理每一個 comment
            if (typeof res.data[0] === 'string') {
                setIsHaveComment(false);
            }
            else if (typeof res.data[0] === 'object') {
                for (newComments of res.data) {
                    try {
                        const gameRes = await axios.get(`${baseApi}/gamesData/${newComments.game_id}`);
                        newComments["game_name"] = gameRes.data.game_name;
                        newComments["game_dif_tagname"] = gameRes.data.game_dif_tagname;
                        newComments["game_main_tag1name"] = gameRes.data.game_main_tag1name;
                        newComments["game_main_tag2name"] = gameRes.data.game_main_tag2name;
                        new2Comments.push(newComments);
                    } catch (error) {
                        console.error("Error fetching game data:", error);
                    }
                }
            }

        } catch (error) {
            console.error(error);
        }
        setAllCommentsGames(new2Comments);
    };

    // 處理星星數
    const renderStars = (starCount, totalStars = 5) => {
        const stars = [];

        // 顯示填滿的星星
        for (let i = 0; i < starCount; i++) {
            stars.push(<TiStarFullOutline key={`filled-${i}`} />);
        }
        if (stars.length === 5) {
            return stars
        }
        else {
            // 顯示空星
            for (let i = starCount; i < totalStars; i++) {
                stars.push(<TiStarOutline key={`empty-${i}`} />);
            }
        }
        return stars;
    };

    // 處理評論文字的顯示
    const MyComponent = (omeomment, maxLength) => {
        const content = JSON.stringify(omeomment).length > maxLength
            ? omeomment.slice(0, maxLength) + "..."
            : omeomment;
        return content
    };

    //刪除某則評論
    const delOneComment = async () => {
        try {
            await axios.delete(`${baseApi}/commentsData/${delOneCommentID}`);
            getAllComments();
            handleDelComment();
            handledetailComment();
        } catch (error) {
            console.error(error);
        }
    };

    // 顯示Modal - 詳細
    const opendetailComment = (comment) => {
        setCommentModalData(comment);
        const modalInstance = Modal.getInstance(detailCommentRef.current);
        modalInstance.show();
    };

    // 隱藏Modal - 詳細
    const handledetailComment = () => {
        const modalInstance = Modal.getInstance(detailCommentRef.current);
        modalInstance.hide();
    };

    // 顯示Modal - 刪除
    const openDelComment = (comment, status) => {
        if (status === 'desktop') {
            setDelOneCommentID(comment);
        }
        else {
            setCommentModalData(comment);
            setDelOneCommentID(comment.comment_id);
        }
        const modalInstance = Modal.getInstance(delCommentModalRef.current);
        modalInstance.show();
    };

    // 隱藏Modal - 刪除
    const handleDelComment = () => {
        const modalInstance = Modal.getInstance(delCommentModalRef.current);
        modalInstance.hide();
    };

    useEffect(() => {
        new Modal(detailCommentRef.current);
        new Modal(delCommentModalRef.current);
    }, []);

    useEffect(() => {
        getAllComments();
    }, []);

    return (
        <>
            {/* 主畫面 - 電腦版 */}
            <div className="col-12 m-0  px-0 d-none d-lg-block">
                <div className="border-nature-90 border rounded-2 my-10">
                    <div className="ParticipatingGroupTitle bg-secondary-95 px-6 py-5 text-secondary-50 fw-bold fs-h6" >
                        我的評論
                    </div>
                    <div className="p-6 bg-white">
                        <table className="table">
                            <thead className="table-light px-3" >
                                <tr className="ParticipatingGroupThead ">
                                    <th scope="col" className="text-secondary-40 ps-6 py-3 pe-0">遊玩日期</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">密室名稱</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">整體評價</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">通關狀態</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">難度</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">主題特色</th>
                                    <th scope="col" className="text-secondary-40 py-3 px-0">體驗心得</th>
                                    <th scope="col" className="text-secondary-40 pe-6 py-3 ps-0"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isHaveComment ?
                                    allCommentsGames.map((omeomment) => (
                                        <tr key={omeomment.comment_id} className="ParticipatingGroupThead">
                                            <td className="ps-5 py-2 pe-0">{omeomment.commet_played_time}</td>
                                            <td className="py-2 px-0">{omeomment.game_name}</td>
                                            <td className="py-2 px-0">{renderStars(omeomment.coment_star)}</td>
                                            <td className="py-2 px-0">{omeomment.comment_isPass ? '通關' : '未通關'}</td>
                                            <td className="py-2 px-0">{omeomment.game_dif_tagname}</td>
                                            <td className="py-2 px-0">{omeomment.game_main_tag1name}、{omeomment.game_main_tag2name}</td>
                                            <td className="py-2 px-0">{MyComponent(omeomment.coment_content, 10)}</td>
                                            <td className="pe-5 py-2 ps-0">
                                                <button onClick={() => opendetailComment(omeomment)} className="text-black border-0 fs-Body-1 btn btn-white p-0 commentButton m-0 ">
                                                    查看詳情 <IoIosArrowForward color="black" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (<>
                                        <tr>
                                            <td colSpan={8} className="text-center fs-h6">未留下任何評論，<br />
                                                歡迎到密室頁面分享你的心得讓更多人參考！</td>
                                        </tr>
                                    </>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >

            <div className="d-block d-lg-none m-0">
                <div className="">
                    <div className="ParticipatingGroupTitle bg-secondary-95 px-4 py-5 text-secondary-50 fw-bold fs-h6" >
                        我的評論
                    </div>
                    <div className="">
                        <div className=" ">
                            {isHaveComment ?
                                (<>
                                    {
                                        allCommentsGames.map((omeomment) => (
                                            <div className="mb-4 bg-white" key={omeomment.comment_id}>
                                                <dl className=" p-3 m-0 ">
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">遊玩日期</dt>
                                                    <dd>{omeomment.commet_played_time}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">密室名稱</dt>
                                                    <dd>{omeomment.game_name}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">整體評價</dt>
                                                    <dd>{renderStars(omeomment.coment_star)}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">通關狀態</dt>
                                                    <dd>{omeomment.comment_isPass ? '通關' : '未通關'}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">難度</dt>
                                                    <dd>{omeomment.game_dif_tagname}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">主題特色</dt>
                                                    <dd>{omeomment.game_main_tag1name}、{omeomment.game_main_tag2name}</dd>
                                                    <dt className="fs-Caption fw-bold text-nature-50 mb-1">體驗心得</dt>
                                                    <dd className="m-0">
                                                        <pre className="fs-Body-1 text-black m-0">{omeomment.coment_content}</pre>
                                                    </dd>
                                                </dl>
                                                <div className="d-flex px-3 py-6 flex-column gap-2">
                                                    <button className="btn bg-nature-60 text-white"
                                                        onClick={() => openDelComment(omeomment)}>
                                                        刪除</button>
                                                    <Link
                                                        type="button"
                                                        className="btn bg-secondary-60 text-white"
                                                        to={`/Game_comment/edit/${omeomment.comment_id}`}
                                                    >
                                                        編輯
                                                    </Link>
                                                </div>
                                            </div>

                                        ))
                                    }

                                </>
                                )
                                :
                                (
                                    <>
                                        <dl>
                                            <dt className="text-center fs-h6 bg-white" >
                                                <p>
                                                    未留下任何評論，<br />
                                                    歡迎到密室頁面分享你的心得讓更多人參考！
                                                </p>
                                            </dt>
                                        </dl>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >

            {/* 評論詳細頁面 */}
            < div
                ref={detailCommentRef}
                className="modal fade m-0"
                id="detailComment "
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }
                }
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-secondary-95 flex-column align-items-start">
                            <h4 className="modal-title fw-bold mb-2">{commentModalData.game_name}</h4>
                        </div>
                        <div className="modal-body px-6 py-3">
                            <div className="star mb-4">
                                <span className="mb-2">整體評價</span>
                                <p className="text-black">{renderStars(commentModalData.coment_star)}</p>
                            </div>
                            <div className="dif mb-4">
                                <span className="mb-2 fs-Body-2 fw-bold text-nature-50">難度</span>
                                <p className="text-black">{commentModalData.game_dif_tagname}</p>
                            </div>
                            <div className="features mb-4">
                                <span className=" fw-bold text-nature-50">主題特色</span>
                                <div className="tags d-flex flex-wrap mt-2 gap">
                                    <span className=" bg-nature-95 px-2 py-1 rounded-3  text-nowrap me-2">
                                        {commentModalData.game_main_tag1name}
                                    </span>
                                    <span className=" bg-nature-95 px-2 py-1 rounded-3  text-nowrap">
                                        {commentModalData.game_main_tag2name}
                                    </span>
                                </div>
                            </div>
                            <div className="pass mb-4">
                                <span className="mb-2 fs-Body-2 fw-bold text-nature-50">通關狀態</span>
                                <p className="text-black">{commentModalData.comment_isPass ? '通關' : '未通關'}</p>
                            </div>
                            <div className="date mb-4">
                                <span className="mb-2 fs-Body-2 fw-bold text-nature-50">遊玩日期</span>
                                <p className="text-black">{commentModalData.commet_played_time}</p>
                            </div>
                            <div className="isSpoilered mb-4">
                                <span className="mb-2 fs-Body-2 fw-bold text-nature-50">是否劇透</span>
                                <p className="text-black">{commentModalData.comment_isSpoilered ? '有劇透' : '無劇透'}</p>
                            </div>
                            <div className="conten">
                                <span className="mb-2 fs-Body-2 fw-bold text-nature-50">體驗心得</span>
                                <pre className="fs-Body-1 text-black">{commentModalData.coment_content}</pre>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="btn_2 d-flex  text-center ">
                                <button type="button" className="btn bg-nature-60 text-white me-6"
                                    onClick={() => openDelComment(commentModalData.comment_id, "desktop")}>
                                    刪除
                                </button>
                                <Link
                                    type="button"
                                    className="btn bg-secondary-60 text-white"
                                    to={`/Game_comment/edit/${commentModalData.comment_id}`}
                                    onClick={handledetailComment}>
                                    編輯
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* 刪除確認 */}
            < div
                ref={delCommentModalRef}
                className="modal fade"
                id="delCommentModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">刪除此則評論</h1>
                            <button
                                onClick={handleDelComment}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            你是否要刪除
                            <span className="text-danger fw-bold"> {commentModalData.game_name} </span>
                            此則遊戲的評論內容
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={handleDelComment}
                                type="button"
                                className="btn btn-secondary"
                            >
                                取消
                            </button>
                            <button onClick={delOneComment} type="button" className="btn btn-danger">
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            </div >

        </>

    )
};

export default MyComments;